CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Create brands table
CREATE TABLE brands (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_name TEXT NOT NULL,
  brand_description TEXT,
  contact_email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create orders table
CREATE TABLE orders (
  id TEXT PRIMARY KEY,
  brand_id UUID REFERENCES brands(id),
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
  stripe_session_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create videos table
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
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create comments table
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  video_id TEXT REFERENCES videos(id) ON DELETE CASCADE,
  user_id TEXT,
  user_name TEXT NOT NULL,
  text TEXT NOT NULL,
  likes INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create likes table to prevent duplicate likes
CREATE TABLE likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  video_id TEXT REFERENCES videos(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(video_id, user_id)
);

-- Create indexes for better query performance
CREATE INDEX idx_orders_brand_id ON orders(brand_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX idx_videos_order_id ON videos(order_id);
CREATE INDEX idx_videos_category ON videos(category);
CREATE INDEX idx_videos_created_at ON videos(created_at DESC);
CREATE INDEX idx_comments_video_id ON comments(video_id);
CREATE INDEX idx_likes_video_id ON likes(video_id);
CREATE INDEX idx_likes_user_id ON likes(user_id);

-- Enable Row Level Security (RLS)
ALTER TABLE brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;

-- RLS Policies for brands (public read, authenticated write)
CREATE POLICY "Public brands are viewable by everyone" ON brands
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert brands" ON brands
  FOR INSERT WITH CHECK (true);

-- RLS Policies for orders (users can only see their own orders)
CREATE POLICY "Users can view their own orders" ON orders
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create orders" ON orders
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update their own orders" ON orders
  FOR UPDATE USING (true);

-- RLS Policies for videos (public read, authenticated write)
CREATE POLICY "Public videos are viewable by everyone" ON videos
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert videos" ON videos
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Authenticated users can update videos" ON videos
  FOR UPDATE USING (true);

-- RLS Policies for comments (public read, authenticated write)
CREATE POLICY "Public comments are viewable by everyone" ON comments
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert comments" ON comments
  FOR INSERT WITH CHECK (true);

-- RLS Policies for likes (public read, authenticated write)
CREATE POLICY "Public likes are viewable by everyone" ON likes
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert likes" ON likes
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can delete their own likes" ON likes
  FOR DELETE USING (true);

-- Keep aggregate like counts in sync when the likes table changes
CREATE OR REPLACE FUNCTION update_video_like_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE videos SET likes = likes + 1 WHERE id = NEW.video_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE videos SET likes = GREATEST(likes - 1, 0) WHERE id = OLD.video_id;
  END IF;

  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic like count updates
CREATE TRIGGER on_like_change
  AFTER INSERT OR DELETE ON likes
  FOR EACH ROW
  EXECUTE FUNCTION update_video_like_count();

-- Create function to update video comment count
CREATE OR REPLACE FUNCTION update_video_comment_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE videos SET comments = comments + 1 WHERE id = NEW.video_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE videos SET comments = comments - 1 WHERE id = OLD.video_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for comment count
CREATE TRIGGER on_comment_change
  AFTER INSERT OR DELETE ON comments
  FOR EACH ROW
  EXECUTE FUNCTION update_video_comment_count();

-- Insert sample data for demo
INSERT INTO brands (id, brand_name, brand_description, contact_email) VALUES
  ('11111111-1111-1111-1111-111111111111', 'Glow Naturals', 'Premium organic skincare products', 'contact@glow-naturals.com'),
  ('22222222-2222-2222-2222-222222222222', 'PowerUp Tech', 'Innovative charging solutions', 'hello@poweruptech.com'),
  ('33333333-3333-3333-3333-333333333333', 'Crunch Co.', 'Artisan snack brand', 'info@crunchco.com');

INSERT INTO videos (id, title, brand, category, pixverse_url, thumbnail_url, duration, views, likes, shares, comments, status) VALUES
  ('vid-001', 'Glow Naturals Serum', 'Glow Naturals', 'Beauty', 'https://app.pixverse.ai/video/abc123', 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&h=400&fit=crop', 38, 12453, 892, 234, 45, 'completed'),
  ('vid-002', 'PowerUp Charger Pro', 'PowerUp Tech', 'Electronics', 'https://app.pixverse.ai/video/def456', 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=600&h=400&fit=crop', 36, 9876, 654, 189, 32, 'completed'),
  ('vid-003', 'Crunch Co. Artisan Snacks', 'Crunch Co.', 'Food & Beverage', 'https://app.pixverse.ai/video/ghi789', 'https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=600&h=400&fit=crop', 40, 15234, 1203, 312, 67, 'completed'),
  ('vid-004', 'EcoWear Summer Collection', 'EcoWear', 'Fashion', 'https://app.pixverse.ai/video/jkl012', 'https://images.unsplash.com/photo-1558171813-4c088753af8f?w=600&h=400&fit=crop', 35, 8765, 534, 156, 28, 'completed'),
  ('vid-005', 'CozyHome Candle Collection', 'CozyHome', 'Home & Living', 'https://app.pixverse.ai/video/mno345', 'https://images.unsplash.com/photo-1603006905003-be475563bc59?w=600&h=400&fit=crop', 42, 11234, 876, 245, 41, 'completed'),
  ('vid-006', 'VitaBoost Daily Vitamins', 'VitaHealth', 'Health & Wellness', 'https://app.pixverse.ai/video/pqr678', 'https://images.unsplash.com/photo-1550572017-edd951aa8f72?w=600&h=400&fit=crop', 37, 7654, 432, 123, 23, 'completed');

INSERT INTO comments (video_id, user_name, text, likes) VALUES
  ('vid-001', 'BeautyEnthusiast', 'Love how natural the integration looks!', 24),
  ('vid-001', 'MarketingPro', 'Great brand storytelling', 18),
  ('vid-001', 'CreativeDir', 'The cat mascot is so charming!', 31),
  ('vid-001', 'BrandManager', 'Perfect for Instagram Reels', 15),
  ('vid-002', 'TechReviewer', 'Amazing product showcase!', 22),
  ('vid-002', 'GadgetLover', 'The cat using the charger is adorable', 28),
  ('vid-003', 'FoodieBlogger', 'Made me so hungry!', 35),
  ('vid-003', 'SnackLover', 'Need to try these snacks now', 19);
