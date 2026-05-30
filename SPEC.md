# Neko Platform - Technical Specification

## Overview
Neko is a comprehensive web platform that enables brands to create custom product advertising videos featuring AI-powered cat mascots through PixVerse integration, with full e-commerce functionality and community engagement features.

## Architecture

### Tech Stack
- **Frontend**: React 18, Vite, React Router DOM 6
- **Styling**: Tailwind CSS 3.3
- **Icons**: Lucide React
- **Backend**: Node.js, Express.js
- **Database**: Supabase (PostgreSQL)
- **Payments**: Stripe
- **Video Platform**: PixVerse AI
- **Deployment**: Vercel (frontend), Railway/Render (backend)

### Directory Structure
```
Neko/
├── src/                    # React frontend
│   ├── components/        # Reusable components
│   ├── pages/             # Page components
│   ├── App.jsx            # Main app component
│   ├── main.jsx           # Entry point
│   └── index.css          # Global styles
├── server/                # Express backend
│   ├── index.js           # Server entry point
│   └── package.json       # Backend dependencies
├── supabase/
│   └── migrations/        # Database migrations
├── docs/                  # Documentation
├── public/                # Static assets
├── package.json           # Frontend dependencies
├── vite.config.js         # Vite configuration
├── tailwind.config.js     # Tailwind configuration
└── README.md              # Project documentation
```

## Features Specification

### 1. Landing Page (Home)
**Route**: `/`

**Components**:
- Hero section with cat mascot branding
- Feature highlights (6 features)
- Statistics section (4 metrics)
- Sample video showcase (3 cards)
- How it works section (4 steps)
- CTA section

**Functionality**:
- Responsive design (mobile-first)
- Smooth scroll navigation
- Video thumbnail cards with hover effects
- Call-to-action buttons linking to onboarding

### 2. Brand Onboarding
**Route**: `/onboarding`

**Multi-Step Form**:
1. **Brand Info**
   - Brand name (required)
   - Brand description (optional)
   - Contact email (required)

2. **Product Details**
   - Product name (required)
   - Product category (dropdown, required)
   - Product description (required)
   - Product images (file upload, optional)

3. **Mascot Style**
   - 4 style options (playful, professional, cute, adventure)
   - Visual selection cards

4. **Storyline Template**
   - 4 template options (lifestyle, testimonial, tutorial, brand story)
   - Description for each

**Functionality**:
- Step indicator with progress
- Form validation
- State persistence across steps
- Navigate between steps
- Submit to backend API

### 3. Pricing Page
**Route**: `/pricing`

**Components**:
- 3 pricing cards (Basic, Professional, Enterprise)
- Feature comparison lists
- FAQ section
- Custom solution CTA

**Pricing Structure**:
| Plan | Price | Videos | Quality | Revisions |
|------|-------|--------|---------|-----------|
| Basic | $49 | 1 | HD (1080p) | 2 |
| Professional | $149 | 3 | 4K | 5 |
| Enterprise | $499 | Unlimited | 4K | Unlimited |

**Functionality**:
- Popular plan highlighting
- "Most Popular" badge for Professional
- Link to checkout with plan ID
- Responsive grid layout

### 4. Video Gallery
**Route**: `/gallery`

**Components**:
- Search bar
- Category filter dropdown
- Sort options (popular, recent, discussed)
- Video grid (6 cards)
- Related videos sidebar

**Video Card**:
- Thumbnail image
- Play button overlay
- Category badge
- Title and brand
- View/like/comment counts
- Like, comment, share buttons

**Functionality**:
- Filter by category
- Search by title/brand
- Sort by engagement metrics
- Like/unlike toggle
- Show/hide comments
- Social sharing (Twitter, Facebook, Instagram)
- Copy link to clipboard

**Comments Section**:
- Comment list with user info
- Like/reply actions
- Comment input form
- Post comment button

### 5. Client Dashboard
**Route**: `/dashboard`

**Components**:
- Navigation sidebar
- Stats overview (4 cards)
- Recent activity feed
- Recent orders list
- My videos grid
- Order history
- Analytics placeholder
- Account settings

**Stats Cards**:
- Total Views (with trend indicator)
- Total Likes
- Active Orders
- Avg. Engagement

**Dashboard Tabs**:
1. Overview (default)
2. My Videos
3. Orders
4. Analytics
5. Settings

**Functionality**:
- Sidebar navigation
- Tab switching
- View orders
- Access videos
- Edit settings
- Contact support

### 6. Video Preview
**Route**: `/preview/:videoId`

**Components**:
- Video player area
- Video metadata
- Like/share/download buttons
- Comments section
- Related videos sidebar
- Share modal

**Video Player**:
- Play button overlay
- Duration display
- View/like/share counts
- Link to PixVerse for full playback

**Functionality**:
- Video playback simulation
- Like/unlike toggle
- Share modal (4 options)
- Download button
- Comment submission
- Related videos navigation
- Back to gallery link

### 7. Checkout
**Route**: `/checkout/:planId`

**Components**:
- Payment information form
- Billing address form
- Order summary sidebar
- Terms checkbox
- Submit button

**Payment Form**:
- Name on card (required)
- Card number (required, formatted)
- Expiry date (required, MM/YY format)
- CVV (required)

**Billing Address**:
- Street address (required)
- City (required)
- ZIP code (required)
- Country (dropdown)

**Order Summary**:
- Plan name and icon
- Feature list with checkmarks
- Price breakdown
- Secure payment badge

**Functionality**:
- Card number formatting
- Expiry date formatting
- Form validation
- Stripe checkout session creation
- Error handling
- Loading state

### 8. Order Confirmation
**Route**: `/order-confirmation/:orderId`

**Components**:
- Success message
- Order details card
- What's next section
- Order includes grid
- Need help section
- Continue buttons

**Order Details**:
- Order ID
- Status badge (Processing)
- Order date
- Estimated delivery
- Email
- Amount

**Functionality**:
- Display order information
- Show order status
- Next steps explanation
- Link to dashboard
- Contact support option

## Backend API Specification

### Payment Endpoints

#### POST /api/payments/create-checkout-session
Creates a Stripe checkout session for payment processing.

**Request Body**:
```json
{
  "planId": "professional",
  "plan": "Professional",
  "amount": 149,
  "customerInfo": {
    "nameOnCard": "John Doe",
    "email": "john@example.com",
    "billingAddress": "123 Main St",
    "city": "San Francisco",
    "zipCode": "94102",
    "country": "United States"
  }
}
```

**Response**:
```json
{
  "success": true,
  "sessionId": "cs_test_xxx",
  "orderId": "ORD-123456"
}
```

### Order Endpoints

#### POST /api/orders/create-preview
Creates a preview order before payment.

**Request Body**:
```json
{
  "brandName": "Glow Naturals",
  "brandDescription": "Premium skincare",
  "contactEmail": "contact@glow.com",
  "productName": "Vitamin C Serum",
  "productCategory": "beauty",
  "productDescription": "Brightening serum",
  "mascotStyle": "playful",
  "storyTemplate": "lifestyle"
}
```

**Response**:
```json
{
  "success": true,
  "orderId": "ORD-123456",
  "message": "Preview order created"
}
```

#### GET /api/orders/:orderId
Retrieves order details.

**Response**:
```json
{
  "success": true,
  "order": {
    "id": "ORD-123456",
    "brandName": "Glow Naturals",
    "status": "pending",
    "plan": "Professional",
    "amount": 149
  }
}
```

### Video Endpoints

#### POST /api/videos/generate
Initiates video generation via PixVerse.

**Request Body**:
```json
{
  "productId": "prod-123",
  "mascotStyle": "playful",
  "storyTemplate": "lifestyle"
}
```

**Response**:
```json
{
  "success": true,
  "videoId": "VID-123456",
  "message": "Video generation started"
}
```

#### GET /api/gallery
Retrieves videos for gallery display.

**Query Parameters**:
- `category`: Filter by category
- `search`: Search by title/brand
- `sort`: Sort order (popular, recent, discussed)

**Response**:
```json
{
  "success": true,
  "videos": [
    {
      "id": "vid-001",
      "title": "Glow Naturals Serum",
      "brand": "Glow Naturals",
      "category": "Beauty",
      "views": 12453,
      "likes": 892,
      "comments": 45
    }
  ]
}
```

#### POST /api/videos/:videoId/like
Likes a video (increments like count).

**Response**:
```json
{
  "success": true,
  "likes": 893
}
```

### Comment Endpoints

#### POST /api/comments
Adds a comment to a video.

**Request Body**:
```json
{
  "videoId": "vid-001",
  "userId": "user-123",
  "text": "Great video!"
}
```

**Response**:
```json
{
  "success": true,
  "comment": {
    "id": "comment-123",
    "videoId": "vid-001",
    "userId": "user-123",
    "text": "Great video!",
    "createdAt": "2024-01-20T10:00:00Z"
  }
}
```

#### GET /api/comments/:videoId
Retrieves comments for a video.

**Response**:
```json
{
  "success": true,
  "comments": [
    {
      "id": "comment-123",
      "userId": "user-123",
      "userName": "John Doe",
      "text": "Great video!",
      "likes": 5,
      "createdAt": "2024-01-20T10:00:00Z"
    }
  ]
}
```

## Database Schema

### Tables

#### brands
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PRIMARY KEY |
| brand_name | TEXT | NOT NULL |
| brand_description | TEXT | |
| contact_email | TEXT | UNIQUE, NOT NULL |
| created_at | TIMESTAMPTZ | DEFAULT NOW() |
| updated_at | TIMESTAMPTZ | DEFAULT NOW() |

#### orders
| Column | Type | Constraints |
|--------|------|-------------|
| id | TEXT | PRIMARY KEY |
| brand_id | UUID | REFERENCES brands(id) |
| brand_name | TEXT | NOT NULL |
| brand_description | TEXT | |
| contact_email | TEXT | NOT NULL |
| product_name | TEXT | NOT NULL |
| product_category | TEXT | |
| product_description | TEXT | |
| mascot_style | TEXT | DEFAULT 'playful' |
| story_template | TEXT | DEFAULT 'lifestyle' |
| plan | TEXT | NOT NULL |
| amount | INTEGER | NOT NULL |
| status | TEXT | DEFAULT 'pending' |
| stripe_session_id | TEXT | |
| created_at | TIMESTAMPTZ | DEFAULT NOW() |
| updated_at | TIMESTAMPTZ | DEFAULT NOW() |

#### videos
| Column | Type | Constraints |
|--------|------|-------------|
| id | TEXT | PRIMARY KEY |
| order_id | TEXT | REFERENCES orders(id) |
| title | TEXT | NOT NULL |
| brand | TEXT | NOT NULL |
| category | TEXT | |
| pixverse_url | TEXT | |
| thumbnail_url | TEXT | |
| duration | INTEGER | DEFAULT 35 |
| views | INTEGER | DEFAULT 0 |
| likes | INTEGER | DEFAULT 0 |
| shares | INTEGER | DEFAULT 0 |
| comments | INTEGER | DEFAULT 0 |
| status | TEXT | DEFAULT 'processing' |
| created_at | TIMESTAMPTZ | DEFAULT NOW() |
| updated_at | TIMESTAMPTZ | DEFAULT NOW() |

#### comments
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PRIMARY KEY |
| video_id | TEXT | REFERENCES videos(id) |
| user_id | TEXT | |
| user_name | TEXT | NOT NULL |
| text | TEXT | NOT NULL |
| likes | INTEGER | DEFAULT 0 |
| created_at | TIMESTAMPTZ | DEFAULT NOW() |

#### likes
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PRIMARY KEY |
| video_id | TEXT | REFERENCES videos(id) |
| user_id | TEXT | NOT NULL |
| created_at | TIMESTAMPTZ | DEFAULT NOW() |
| UNIQUE | | (video_id, user_id) |

### Indexes
- `idx_orders_brand_id` ON orders(brand_id)
- `idx_orders_status` ON orders(status)
- `idx_orders_created_at` ON orders(created_at DESC)
- `idx_videos_order_id` ON videos(order_id)
- `idx_videos_category` ON videos(category)
- `idx_videos_created_at` ON videos(created_at DESC)
- `idx_comments_video_id` ON comments(video_id)
- `idx_likes_video_id` ON likes(video_id)
- `idx_likes_user_id` ON likes(user_id)

## Environment Variables

### Frontend (.env)
```env
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=xxx
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_xxx
VITE_API_URL=http://localhost:5000
```

### Backend (.env)
```env
PORT=5000
NODE_ENV=development
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_ANON_KEY=xxx
SUPABASE_SERVICE_ROLE_KEY=xxx
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
CLIENT_URL=http://localhost:3000
```

## Security Considerations

### Frontend
- HTTPS in production
- Environment variables for sensitive data
- Input validation
- XSS prevention

### Backend
- CORS configuration
- Rate limiting
- Input sanitization
- SQL injection prevention
- Webhook signature verification

### Database
- Row Level Security (RLS) enabled
- Prepared statements for queries
- Proper access controls
- Regular backups

## Performance Optimization

### Frontend
- Vite for fast builds
- Code splitting by route
- Lazy loading images
- Optimized CSS
- Compressed assets

### Backend
- Database indexing
- Query optimization
- Connection pooling
- Caching strategies
- Load balancing ready

## Browser Support
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Accessibility
- Semantic HTML
- ARIA labels
- Keyboard navigation
- Focus management
- Color contrast compliance
- Screen reader friendly

## Deployment

### Frontend (Vercel)
```bash
npm run build
vercel deploy
```

### Backend (Railway/Render)
1. Connect GitHub repository
2. Set environment variables
3. Configure build command: `cd server && npm install`
4. Set start command: `cd server && npm start`

### Database (Supabase)
1. Create project at supabase.com
2. Run migrations
3. Configure RLS policies
4. Set up environment variables

## Testing Strategy

### Manual Testing
- [ ] All pages load correctly
- [ ] Navigation works
- [ ] Forms validate
- [ ] Checkout flow completes
- [ ] Social sharing works
- [ ] Mobile responsive

### API Testing
- [ ] All endpoints return expected responses
- [ ] Error handling works
- [ ] Database operations succeed
- [ ] Stripe integration functional

## Future Enhancements

### Phase 2
- Real-time video generation status
- Advanced analytics dashboard
- User authentication (Supabase Auth)
- Email notifications
- Video revision requests
- White-label options

### Phase 3
- Mobile app version
- API access for developers
- Template marketplace
- A/B testing for videos
- Multi-language support

---

**Document Version**: 1.0  
**Last Updated**: 2024  
**Status**: Complete
