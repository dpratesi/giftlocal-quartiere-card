-- Add preferred_city field to profiles table
ALTER TABLE profiles ADD COLUMN preferred_city TEXT DEFAULT 'Roma';