
-- Create app_users table for name + PIN login
CREATE TABLE public.app_users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  pin_code TEXT NOT NULL CHECK (length(pin_code) = 6 AND pin_code ~ '^\d{6}$'),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.app_users ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (register)
CREATE POLICY "Anyone can register" ON public.app_users
  FOR INSERT WITH CHECK (true);

-- Allow reading users for login
CREATE POLICY "Anyone can read users for login" ON public.app_users
  FOR SELECT USING (true);
