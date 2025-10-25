-- Supabase Database Schema for Recipe App

-- Create profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    full_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create recipes table
CREATE TABLE IF NOT EXISTS public.recipes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    ingredients TEXT[] NOT NULL DEFAULT '{}',
    instructions TEXT[] NOT NULL DEFAULT '{}',
    image_url TEXT,
    prep_time INTEGER DEFAULT 30,
    difficulty TEXT DEFAULT 'Easy',
    tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create favorites table
CREATE TABLE IF NOT EXISTS public.favorites (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    recipe_id UUID REFERENCES public.recipes(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, recipe_id)
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

-- Profiles policies
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;

CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Recipes policies
DROP POLICY IF EXISTS "Anyone can view recipes" ON public.recipes;
DROP POLICY IF EXISTS "Users can insert own recipes" ON public.recipes;
DROP POLICY IF EXISTS "Users can update own recipes" ON public.recipes;
DROP POLICY IF EXISTS "Users can delete own recipes" ON public.recipes;

CREATE POLICY "Anyone can view recipes" ON public.recipes FOR SELECT USING (true);
CREATE POLICY "Users can insert own recipes" ON public.recipes FOR INSERT WITH CHECK (
  auth.uid() = user_id OR 
  user_id = '00000000-0000-0000-0000-000000000001'
);
CREATE POLICY "Users can update own recipes" ON public.recipes FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own recipes" ON public.recipes FOR DELETE USING (auth.uid() = user_id);

-- Favorites policies
DROP POLICY IF EXISTS "Users can view own favorites" ON public.favorites;
DROP POLICY IF EXISTS "Users can insert own favorites" ON public.favorites;
DROP POLICY IF EXISTS "Users can delete own favorites" ON public.favorites;

CREATE POLICY "Users can view own favorites" ON public.favorites FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own favorites" ON public.favorites FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own favorites" ON public.favorites FOR DELETE USING (auth.uid() = user_id);

-- Create storage bucket for recipe images
INSERT INTO storage.buckets (id, name, public) VALUES ('recipe-images', 'recipe-images', true) ON CONFLICT (id) DO NOTHING;

-- Storage policies for recipe images
DROP POLICY IF EXISTS "Anyone can view recipe images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload recipe images" ON storage.objects;
DROP POLICY IF EXISTS "Users can update own recipe images" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own recipe images" ON storage.objects;

CREATE POLICY "Anyone can view recipe images" ON storage.objects FOR SELECT USING (bucket_id = 'recipe-images');
CREATE POLICY "Authenticated users can upload recipe images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'recipe-images' AND auth.role() = 'authenticated');
CREATE POLICY "Users can update own recipe images" ON storage.objects FOR UPDATE USING (bucket_id = 'recipe-images' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users can delete own recipe images" ON storage.objects FOR DELETE USING (bucket_id = 'recipe-images' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Function to automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, avatar_url)
    VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'avatar_url');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
DROP TRIGGER IF EXISTS handle_updated_at_profiles ON public.profiles;
DROP TRIGGER IF EXISTS handle_updated_at_recipes ON public.recipes;

CREATE TRIGGER handle_updated_at_profiles
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_updated_at_recipes
    BEFORE UPDATE ON public.recipes
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Insert predefined recipes (these will be added to a demo user)
-- First, ensure we have a demo user profile
-- Get or create demo user ID
DO $$
DECLARE
    demo_user_id UUID;
BEGIN
    -- Try to get existing demo user
    SELECT id INTO demo_user_id FROM auth.users WHERE email = 'demo@recipo.com';
    
    -- If no demo user exists, create one
    IF demo_user_id IS NULL THEN
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
        ) RETURNING id INTO demo_user_id;
    END IF;
    
    -- Ensure profile exists
    INSERT INTO public.profiles (
        id,
        full_name,
        created_at,
        updated_at
    ) VALUES (
        demo_user_id,
        'Demo Chef',
        NOW(),
        NOW()
    ) ON CONFLICT (id) DO NOTHING;
END $$;

-- Insert predefined recipes (only if they don't exist)
INSERT INTO public.recipes (
    id,
    user_id,
    title,
    description,
    ingredients,
    instructions,
    image_url,
    prep_time,
    difficulty,
    tags,
    created_at,
    updated_at
) 
SELECT 
    gen_random_uuid(),
    (SELECT id FROM auth.users WHERE email = 'demo@recipo.com'),
    'Classic Margherita Pizza',
    'A traditional Italian pizza with fresh tomatoes, mozzarella, and basil. Simple yet delicious!',
    ARRAY[
        '1 pizza dough (store-bought or homemade)',
        '1/2 cup tomato sauce',
        '8 oz fresh mozzarella cheese',
        'Fresh basil leaves',
        '2 tbsp olive oil',
        'Salt and pepper to taste'
    ],
    ARRAY[
        'Preheat oven to 475°F (245°C)',
        'Roll out pizza dough on a floured surface',
        'Spread tomato sauce evenly over the dough',
        'Tear mozzarella into pieces and distribute over sauce',
        'Drizzle with olive oil and season with salt and pepper',
        'Bake for 12-15 minutes until crust is golden',
        'Remove from oven and top with fresh basil leaves',
        'Slice and serve immediately'
    ],
    'https://images.pexels.com/photos/1146760/pexels-photo-1146760.jpeg',
    30,
    'Easy',
    ARRAY['Italian', 'Vegetarian', 'Pizza'],
    NOW(),
    NOW()
WHERE NOT EXISTS (SELECT 1 FROM public.recipes WHERE title = 'Classic Margherita Pizza')

UNION ALL

SELECT 
    gen_random_uuid(),
    (SELECT id FROM auth.users WHERE email = 'demo@recipo.com'),
    'Chicken Tikka Masala',
    'Creamy and flavorful Indian curry with tender chicken pieces in a rich tomato-based sauce.',
    ARRAY[
        '1.5 lbs chicken breast, cut into cubes',
        '1 cup plain yogurt',
        '2 tbsp lemon juice',
        '2 tsp garam masala',
        '1 tsp turmeric',
        '1 tsp cumin',
        '1 large onion, diced',
        '3 cloves garlic, minced',
        '1 inch ginger, grated',
        '1 can crushed tomatoes',
        '1 cup heavy cream',
        '2 tbsp butter',
        'Fresh cilantro for garnish'
    ],
    ARRAY[
        'Marinate chicken in yogurt, lemon juice, and spices for 30 minutes',
        'Heat butter in a large pan over medium heat',
        'Cook marinated chicken until golden brown, set aside',
        'In the same pan, sauté onions until soft',
        'Add garlic and ginger, cook for 1 minute',
        'Add crushed tomatoes and simmer for 10 minutes',
        'Return chicken to pan and add cream',
        'Simmer for 15 minutes until chicken is cooked through',
        'Garnish with fresh cilantro and serve with rice'
    ],
    'https://images.pexels.com/photos/725990/pexels-photo-725990.jpeg',
    45,
    'Medium',
    ARRAY['Indian', 'Curry', 'Chicken'],
    NOW(),
    NOW()
WHERE NOT EXISTS (SELECT 1 FROM public.recipes WHERE title = 'Chicken Tikka Masala');

-- Note: Additional recipes can be added manually or through the app interface
-- The database is now ready for recipe management!
