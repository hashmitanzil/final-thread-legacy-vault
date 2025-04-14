
-- Create wishes table
CREATE TABLE IF NOT EXISTS public.wishes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.wishes ENABLE ROW LEVEL SECURITY;

-- Create policy that allows users to SELECT their own wishes
CREATE POLICY "Users can view their own wishes" 
  ON public.wishes 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Create policy that allows users to INSERT their own wishes
CREATE POLICY "Users can create their own wishes" 
  ON public.wishes 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Create policy that allows users to UPDATE their own wishes
CREATE POLICY "Users can update their own wishes" 
  ON public.wishes 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Create policy that allows users to DELETE their own wishes
CREATE POLICY "Users can delete their own wishes" 
  ON public.wishes 
  FOR DELETE 
  USING (auth.uid() = user_id);
