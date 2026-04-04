-- Create meals table
CREATE TABLE IF NOT EXISTS public.meals (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
    meal_type TEXT NOT NULL CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snack')),
    food_name TEXT NOT NULL,
    calories INTEGER NOT NULL,
    protein INTEGER NOT NULL,
    carbs INTEGER NOT NULL,
    fats INTEGER NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Set up Row Level Security (RLS)
ALTER TABLE public.meals ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own meals"
    ON public.meals FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own meals"
    ON public.meals FOR INSERT
    WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own meals"
    ON public.meals FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own meals"
    ON public.meals FOR DELETE
    USING (auth.uid() = user_id);

-- Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT,
    gender TEXT CHECK (gender IN ('male', 'female')),
    age INTEGER,
    height NUMERIC,
    weight NUMERIC,
    health_goal TEXT CHECK (health_goal IN ('lose_weight', 'maintain_weight', 'gain_weight')),
    additional_goals TEXT[] NOT NULL DEFAULT '{}',
    dietary_preference TEXT CHECK (dietary_preference IN ('none', 'vegetarian', 'vegan', 'pescatarian')),
    dietary_restrictions TEXT[] NOT NULL DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
    ON public.profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS meals_user_id_idx ON public.meals(user_id);
CREATE INDEX IF NOT EXISTS meals_timestamp_idx ON public.meals(timestamp); 
