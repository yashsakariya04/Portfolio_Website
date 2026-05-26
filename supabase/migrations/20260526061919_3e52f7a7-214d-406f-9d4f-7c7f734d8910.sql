
-- Storage policies for admin write + public read on portfolio buckets
DO $$
DECLARE
  b text;
  buckets text[] := ARRAY['profile-photos','project-thumbnails','project-screenshots','resume','gallery-photos','company-logos'];
BEGIN
  FOREACH b IN ARRAY buckets LOOP
    EXECUTE format($f$
      CREATE POLICY %I ON storage.objects FOR SELECT TO public USING (bucket_id = %L);
    $f$, 'public read ' || b, b);
    EXECUTE format($f$
      CREATE POLICY %I ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = %L AND public.has_role(auth.uid(),'admin'));
    $f$, 'admin insert ' || b, b);
    EXECUTE format($f$
      CREATE POLICY %I ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = %L AND public.has_role(auth.uid(),'admin'));
    $f$, 'admin update ' || b, b);
    EXECUTE format($f$
      CREATE POLICY %I ON storage.objects FOR DELETE TO authenticated USING (bucket_id = %L AND public.has_role(auth.uid(),'admin'));
    $f$, 'admin delete ' || b, b);
  END LOOP;
EXCEPTION WHEN duplicate_object THEN NULL;
END$$;
