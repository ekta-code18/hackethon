-- Fix search_path security issue for update_updated_at function
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER
SECURITY INVOKER
SET search_path = public, pg_temp
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;