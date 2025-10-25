-- Complete Fix for Recipe Creation Issues
-- Run this in your Supabase SQL Editor

-- 1. Ensure demo user exists in auth.users
INSERT INTO auth.users (
    id,
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at,
    raw_user_meta_data
) VALUES (
    '00000000-0000-0000-0000-000000000001',
    'demo@recipo.com',
    crypt('demo123456', gen_salt('bf')),
    NOW(),
    NOW(),
    NOW(),
    '{"full_name": "Demo Chef"}'
) ON CONFLICT (id) DO NOTHING;

-- 2. Ensure demo user profile exists
INSERT INTO public.profiles (
    id,
    full_name,
    created_at,
    updated_at
) VALUES (
    '00000000-0000-0000-0000-000000000001',
    'Demo Chef',
    NOW(),
    NOW()
) ON CONFLICT (id) DO NOTHING;

-- 3. Update RLS policy to allow demo user recipe creation
DROP POLICY IF EXISTS "Users can insert own recipes" ON public.recipes;

CREATE POLICY "Users can insert own recipes" ON public.recipes FOR INSERT WITH CHECK (
  auth.uid() = user_id OR 
  user_id = '00000000-0000-0000-0000-000000000001'
);

-- 4. Verify everything is set up correctly
SELECT 'Demo user in auth.users:' as check_type, id, email FROM auth.users WHERE id = '00000000-0000-0000-0000-000000000001'
UNION ALL
SELECT 'Demo user in profiles:' as check_type, id::text, full_name FROM public.profiles WHERE id = '00000000-0000-0000-0000-000000000001';
