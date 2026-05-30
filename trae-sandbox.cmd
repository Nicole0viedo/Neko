@echo off
setlocal
if "%~1"=="" exit /b 0
powershell -NoProfile -Command %*
exit /b %ERRORLEVEL%
