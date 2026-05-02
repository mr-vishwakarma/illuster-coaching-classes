-- Add batch column to profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS batch TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS address TEXT;
