import net from 'net'
import { spawn } from 'child_process'

function isPortOpen(port) {
  return new Promise((resolve) => {
    const server = net.createServer()
    server.unref()
    server.on('error', () => resolve(false))
    server.listen({ port, host: '0.0.0.0' }, () => {
      server.close(() => resolve(true))
    })
  })
}

async function findAvailablePort(startPort, maxAttempts) {
  for (let i = 0; i < maxAttempts; i += 1) {
    const port = startPort + i
    // eslint-disable-next-line no-await-in-loop
    const ok = await isPortOpen(port)
    if (ok) return port
  }
  throw new Error(`No available port found starting at ${startPort}`)
}

function forwardExit(child, signal) {
  if (!child || child.killed) return
  if (signal) child.kill(signal)
  else child.kill('SIGTERM')
}

const requestedPort = Number.parseInt(process.env.PORT || '', 10)
const basePort = Number.isFinite(requestedPort) ? requestedPort : 5000

const apiPort = await findAvailablePort(basePort, 20)

const commonEnv = {
  ...process.env,
  PORT: String(apiPort),
  VITE_API_PORT: String(apiPort),
}

const server = spawn('node', ['server/index.js'], { env: commonEnv, stdio: 'inherit' })
const client = spawn('npx', ['-y', 'vite'], { env: commonEnv, stdio: 'inherit' })

const shutdown = (code = 0) => {
  forwardExit(server, 'SIGTERM')
  forwardExit(client, 'SIGTERM')
  process.exit(code)
}

server.on('exit', (code) => shutdown(code ?? 0))
client.on('exit', (code) => shutdown(code ?? 0))

process.on('SIGINT', () => shutdown(0))
process.on('SIGTERM', () => shutdown(0))
