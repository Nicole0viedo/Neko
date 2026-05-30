# Neko - Cat Mascot Advertising Platform

A comprehensive web application that enables brands to create custom product advertising videos featuring their unique cat mascots, powered by PixVerse AI technology.

## Overview

Neko is a hackathon project designed for the Marketing/E-commerce track that allows brands to:
- Create custom advertising videos with AI-powered cat mascots
- Upload product information and customize video storylines
- Purchase video generation plans through an integrated e-commerce flow
- Track video performance and engagement metrics
- Share videos across social media platforms
- Engage with a community through comments and likes

## Tech Stack

- **Frontend**: React 18, Vite, React Router DOM
- **Styling**: Tailwind CSS
- **Backend**: Node.js, Express
- **Database**: Supabase (PostgreSQL)
- **Payments**: Stripe
- **Video Generation**: PixVerse AI
- **Icons**: Lucide React

## Features

### Core Features

- [x] **Brand Onboarding Flow**
  - Multi-step form for brand registration
  - Product information submission
  - Mascot style selection
  - Storyline template customization

- [x] **E-Commerce Integration**
  - Tiered pricing plans (Basic, Professional, Enterprise)
  - Secure Stripe checkout
  - Order confirmation and tracking
  - Client dashboard for order management

- [x] **Video Gallery**
  - Category filtering and search
  - Video preview with engagement metrics
  - Social sharing capabilities
  - Community comments and likes

- [x] **Client Dashboard**
  - Order history and status tracking
  - Analytics overview
  - Video management (view, download, edit)
  - Account settings

- [x] **PixVerse Integration**
  - Video embedding throughout the platform
  - Social sharing links to PixVerse
  - Quality badges and information

- [x] **Social Features**
  - Comments and replies
  - Like/unlike functionality
  - Share to Twitter, Facebook, Instagram
  - Copy link functionality

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account
- Stripe account
- PixVerse account (for video generation)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd Neko
```

2. Install frontend dependencies:
```bash
npm install
```

3. Install backend dependencies:
```bash
cd server
npm install
cd ..
```

4. Set up environment variables:
```bash
cp .env.example .env
```

5. Edit `.env` with your credentials:
```env
SUPABASE_URL=your-supabase-url
SUPABASE_ANON_KEY=your-anon-key
STRIPE_SECRET_KEY=sk_test_your_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key
CLIENT_URL=http://localhost:3000
PIXVERSE_API_KEY=your-pixverse-api-key
ANTHROPIC_API_KEY=your-anthropic-api-key
ANTHROPIC_MODEL=claude-3-5-sonnet-latest
```

### Database Setup (Supabase)

1. Create a new Supabase project at https://supabase.com

2. Create the following tables:

```sql
-- Orders table
CREATE TABLE orders (
  id TEXT PRIMARY KEY,
  brand_name TEXT NOT NULL,
  brand_description TEXT,
  contact_email TEXT NOT NULL,
  product_name TEXT NOT NULL,
  product_category TEXT,
  product_description TEXT,
  mascot_style TEXT DEFAULT 'playful',
  story_template TEXT DEFAULT 'lifestyle',
  plan TEXT NOT NULL,
  amount INTEGER NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Videos table
CREATE TABLE videos (
  id TEXT PRIMARY KEY,
  order_id TEXT REFERENCES orders(id),
  title TEXT NOT NULL,
  brand TEXT NOT NULL,
  category TEXT,
  pixverse_url TEXT,
  thumbnail_url TEXT,
  duration INTEGER DEFAULT 35,
  views INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  shares INTEGER DEFAULT 0,
  comments INTEGER DEFAULT 0,
  status TEXT DEFAULT 'processing',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Comments table
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  video_id TEXT REFERENCES videos(id),
  user_id TEXT,
  user_name TEXT,
  text TEXT NOT NULL,
  likes INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Users table
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  brand_name TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Running the Application

1. Start the backend server:
```bash
cd server
npm run dev
```

2. In a new terminal, start the frontend:
```bash
npm run dev
```

3. Open http://localhost:3000 in your browser

## Project Structure

```
Neko/
├── src/
│   ├── components/
│   │   └── Layout.jsx
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Onboarding.jsx
│   │   ├── Pricing.jsx
│   │   ├── Gallery.jsx
│   │   ├── Dashboard.jsx
│   │   ├── VideoPreview.jsx
│   │   ├── Checkout.jsx
│   │   └── OrderConfirmation.jsx
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── server/
│   ├── package.json
│   └── index.js
├── package.json
├── vite.config.js
├── tailwind.config.js
├── .env.example
└── README.md
```

## API Endpoints

### Payments
- `POST /api/payments/create-checkout-session` - Create Stripe checkout session

### Orders
- `POST /api/orders/create-preview` - Create preview order
- `GET /api/orders/:orderId` - Get order details

### Videos
- `POST /api/videos/generate` - Generate new video
- `GET /api/gallery` - Get gallery videos
- `POST /api/videos/:videoId/like` - Like a video

### Comments
- `POST /api/comments` - Add comment
- `GET /api/comments/:videoId` - Get video comments

## PixVerse Integration

This platform integrates with PixVerse for AI-powered video generation. To set up:

1. Create account at https://app.pixverse.ai
2. Get API credentials
3. Add to environment variables
4. Videos will link to PixVerse for playback and download

## Hackathon Requirements Met

### 1. PixVerse Video Integration (40%)
- ✅ All videos generated via PixVerse
- ✅ 35+ second runtime
- ✅ Consistent cat mascot creative direction
- ✅ Native embedding throughout platform

### 2. Website Functionality (30%)
- ✅ Brand onboarding flow
- ✅ E-commerce checkout
- ✅ Client dashboard
- ✅ Public gallery with comments/likes
- ✅ Social sharing features

### 3. TRAE Workflow Optimization (30%)
- ✅ Full-stack development using TRAE IDE
- ✅ Component-based architecture
- ✅ Efficient development workflow
- ✅ Clean, maintainable code

## Deployment

### Frontend (Vercel)
```bash
npm run build
vercel deploy
```

### Backend (Railway/Render)
- Set environment variables
- Deploy from `/server` directory

## Future Enhancements

- [ ] Real-time video generation status
- [ ] Advanced analytics dashboard
- [ ] User authentication system
- [ ] Payment subscription management
- [ ] Video revision request system
- [ ] Email notifications
- [ ] Mobile app version

## Contributing

This is a hackathon project. For production use, consider:
- Adding comprehensive error handling
- Implementing proper authentication
- Adding input validation
- Setting up CI/CD
- Adding comprehensive tests

## License

MIT License - See LICENSE file for details

## Acknowledgments

- PixVerse for AI video generation technology
- Supabase for database infrastructure
- Stripe for payment processing
- TRAE IDE for development workflow

## Contact

For questions about this project:
- Create an issue on GitHub
- Contact the development team

---

**Note**: This is a demonstration project built for a hackathon. Production deployment requires additional security measures, error handling, and compliance with relevant regulations.
