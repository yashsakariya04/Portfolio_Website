
ALTER TABLE public.skills ADD COLUMN IF NOT EXISTS tier text NOT NULL DEFAULT 'supporting' CHECK (tier IN ('core','important','supporting'));
ALTER TABLE public.profile ADD COLUMN IF NOT EXISTS current_position text;
ALTER TABLE public.profile ADD COLUMN IF NOT EXISTS current_company text;
