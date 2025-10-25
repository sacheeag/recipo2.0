-- Ensure Demo User Profile Exists
-- This is needed for RLS policies to work correctly

-- First, ensure the demo user exists in auth.users
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

-- Ensure the demo user profile exists in public.profiles
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

-- Verify the demo user exists
SELECT id, email FROM auth.users WHERE id = '00000000-0000-0000-0000-000000000001';
SELECT id, full_name FROM public.profiles WHERE id = '00000000-0000-0000-0000-000000000001';
