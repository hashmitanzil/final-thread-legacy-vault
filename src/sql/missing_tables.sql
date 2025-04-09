
-- Create time capsules table
CREATE TABLE IF NOT EXISTS public.time_capsules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL, -- 'message' or 'file'
  content TEXT, -- For messages
  storage_path TEXT, -- For files
  lock_until TIMESTAMP WITH TIME ZONE NOT NULL,
  is_locked BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create end-of-life instructions table
CREATE TABLE IF NOT EXISTS public.eol_instructions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  funeral_notes TEXT,
  organ_donation BOOLEAN DEFAULT false,
  final_message TEXT NOT NULL,
  access_level TEXT NOT NULL DEFAULT 'private', -- 'private', 'contacts', or 'public'
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create export logs table
CREATE TABLE IF NOT EXISTS public.export_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  type TEXT NOT NULL, -- 'zip' or 'pdf'
  download_url TEXT,
  requested_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,
  status TEXT NOT NULL DEFAULT 'pending' -- 'pending', 'completed', or 'failed'
);

-- Enable Row Level Security
ALTER TABLE public.time_capsules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.eol_instructions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.export_logs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for time_capsules
CREATE POLICY "Users can view their own time capsules"
  ON public.time_capsules
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own time capsules"
  ON public.time_capsules
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own time capsules"
  ON public.time_capsules
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own time capsules"
  ON public.time_capsules
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create RLS policies for eol_instructions
CREATE POLICY "Users can view their own EOL instructions"
  ON public.eol_instructions
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own EOL instructions"
  ON public.eol_instructions
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own EOL instructions"
  ON public.eol_instructions
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own EOL instructions"
  ON public.eol_instructions
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create RLS policies for export_logs
CREATE POLICY "Users can view their own export logs"
  ON public.export_logs
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own export logs"
  ON public.export_logs
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own export logs"
  ON public.export_logs
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own export logs"
  ON public.export_logs
  FOR DELETE
  USING (auth.uid() = user_id);
