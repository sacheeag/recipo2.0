## Supabase Schema for Recipo

### Tables

```sql
-- profiles (extends auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    full_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

```sql
-- recipes
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
```

```sql
-- favorites (user -> recipe)
CREATE TABLE IF NOT EXISTS public.favorites (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    recipe_id UUID REFERENCES public.recipes(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, recipe_id)
);
```

### Row Level Security (RLS)

```sql
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
```

```sql
-- profiles policies (idempotent)
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;

CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
```

```sql
-- recipes policies (idempotent)
DROP POLICY IF EXISTS "Anyone can view recipes" ON public.recipes;
DROP POLICY IF EXISTS "Users can insert own recipes" ON public.recipes;
DROP POLICY IF EXISTS "Users can update own recipes" ON public.recipes;
DROP POLICY IF EXISTS "Users can delete own recipes" ON public.recipes;

CREATE POLICY "Anyone can view recipes" ON public.recipes FOR SELECT USING (true);
CREATE POLICY "Users can insert own recipes" ON public.recipes FOR INSERT WITH CHECK (
  auth.uid() = user_id OR 
  user_id = '00000000-0000-0000-0000-000000000001' -- demo user allowance for anon inserts
);
CREATE POLICY "Users can update own recipes" ON public.recipes FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own recipes" ON public.recipes FOR DELETE USING (auth.uid() = user_id);
```

```sql
-- favorites policies (idempotent)
DROP POLICY IF EXISTS "Users can view own favorites" ON public.favorites;
DROP POLICY IF EXISTS "Users can insert own favorites" ON public.favorites;
DROP POLICY IF EXISTS "Users can delete own favorites" ON public.favorites;

CREATE POLICY "Users can view own favorites" ON public.favorites FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own favorites" ON public.favorites FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own favorites" ON public.favorites FOR DELETE USING (auth.uid() = user_id);
```

### Storage

```sql
-- public bucket for recipe images (idempotent)
INSERT INTO storage.buckets (id, name, public)
VALUES ('recipe-images', 'recipe-images', true)
ON CONFLICT (id) DO NOTHING;
```

```sql
-- storage policies (reset + create)
DROP POLICY IF EXISTS "Anyone can view recipe images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload recipe images" ON storage.objects;
DROP POLICY IF EXISTS "Users can update own recipe images" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own recipe images" ON storage.objects;

CREATE POLICY "Anyone can view recipe images" ON storage.objects FOR SELECT USING (bucket_id = 'recipe-images');
CREATE POLICY "Authenticated users can upload recipe images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'recipe-images' AND auth.role() = 'authenticated');
CREATE POLICY "Users can update own recipe images" ON storage.objects FOR UPDATE USING (bucket_id = 'recipe-images' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users can delete own recipe images" ON storage.objects FOR DELETE USING (bucket_id = 'recipe-images' AND auth.uid()::text = (storage.foldername(name))[1]);
```

### Triggers & Functions

```sql
-- create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, avatar_url)
    VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'avatar_url');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

```sql
-- updated_at helper
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS handle_updated_at_profiles ON public.profiles;
DROP TRIGGER IF EXISTS handle_updated_at_recipes ON public.recipes;

CREATE TRIGGER handle_updated_at_profiles
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_updated_at_recipes
    BEFORE UPDATE ON public.recipes
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
```

### Demo User bootstrap (for anonymous recipe creation)

```sql
DO $$
DECLARE
    demo_user_id UUID;
BEGIN
    SELECT id INTO demo_user_id FROM auth.users WHERE email = 'demo@recipo.com';
    IF demo_user_id IS NULL THEN
        INSERT INTO auth.users (
            id, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_user_meta_data
        ) VALUES (
            '00000000-0000-0000-0000-000000000001',
            'demo@recipo.com',
            crypt('demo123456', gen_salt('bf')),
            NOW(), NOW(), NOW(),
            '{"full_name": "Demo Chef"}'
        ) RETURNING id INTO demo_user_id;
    END IF;

    INSERT INTO public.profiles (id, full_name, created_at, updated_at)
    VALUES (demo_user_id, 'Demo Chef', NOW(), NOW())
    ON CONFLICT (id) DO NOTHING;
END $$;
```

### Seed (optional) – add 2 demo recipes idempotently

```sql
INSERT INTO public.recipes (
    id, user_id, title, description, ingredients, instructions, image_url, prep_time, difficulty, tags, created_at, updated_at
)
SELECT gen_random_uuid(),
       (SELECT id FROM auth.users WHERE email = 'demo@recipo.com'),
       'Classic Margherita Pizza',
       'A traditional Italian pizza with fresh tomatoes, mozzarella, and basil. Simple yet delicious!',
       ARRAY['1 pizza dough','1/2 cup tomato sauce','8 oz fresh mozzarella','Fresh basil','2 tbsp olive oil','Salt & pepper'],
       ARRAY['Preheat oven to 475°F','Roll dough','Spread sauce','Add mozzarella','Bake 12-15 min','Top with basil'],
       'https://images.pexels.com/photos/1146760/pexels-photo-1146760.jpeg',
       30,
       'Easy',
       ARRAY['Italian','Vegetarian','Pizza'],
       NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM public.recipes WHERE title = 'Classic Margherita Pizza')
UNION ALL
SELECT gen_random_uuid(),
       (SELECT id FROM auth.users WHERE email = 'demo@recipo.com'),
       'Chicken Tikka Masala',
       'Creamy and flavorful Indian curry with tender chicken pieces in a rich tomato-based sauce.',
       ARRAY['1.5 lbs chicken','1 cup yogurt','2 tbsp lemon juice','spices'],
       ARRAY['Marinate chicken','Sear chicken','Simmer sauce','Add cream','Finish & serve'],
       'https://images.pexels.com/photos/725990/pexels-photo-725990.jpeg',
       45,
       'Medium',
       ARRAY['Indian','Curry','Chicken'],
       NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM public.recipes WHERE title = 'Chicken Tikka Masala');
```

---

- Run the blocks top-to-bottom in the Supabase SQL editor.
- If you already ran it once, it is idempotent (drops/recreates policies, keeps existing tables, and skips duplicates).

