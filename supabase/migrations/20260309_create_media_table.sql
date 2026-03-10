-- Create media table for WordPress-style media management
CREATE TABLE IF NOT EXISTS public.media (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    filename TEXT NOT NULL,
    path TEXT NOT NULL UNIQUE,
    url TEXT NOT NULL,
    type TEXT,
    size INTEGER,
    width INTEGER,
    height INTEGER,
    user_id UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.media ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Public media are viewable by everyone" ON public.media
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can upload media" ON public.media
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can delete their own media" ON public.media
    FOR DELETE USING (auth.uid() = user_id);

-- Storage bucket (This needs to be created via Supabase Dashboard or API)
-- Assuming the bucket named 'media' exists.
