-- ====================================================================
-- FICHIER 5 : Script SQL Supabase pour Google OAuth et RLS
-- À exécuter dans le SQL Editor de Supabase
-- ====================================================================

-- 1. Autoriser le rôle service_role à insérer des profils depuis des triggers ou webhooks
-- Lors d'une authentification OAuth (Google), le trigger auth.users déclenche la création
CREATE POLICY "Service role can insert profiles" 
ON public.users FOR INSERT 
WITH CHECK (true);

-- 2. Permettre la mise à jour des profils par le service_role 
-- (nouveau pour gérer OAuth s'il modifie public.users via un trigger)
CREATE POLICY "Service role can update profiles" 
ON public.users FOR UPDATE 
USING (true)
WITH CHECK (true);

-- 3. Trigger complet : Créer l'utilisateur public après connexion OAuth ou Inscription
-- Gère à la fois les utilisateurs inscrits par e-mail et par Google OAuth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.users (
    id, 
    email, 
    "displayName", 
    "role", 
    "phoneNumber", 
    "isPro", 
    "professionalData", 
    "createdAt"
  )
  VALUES (
    NEW.id,
    NEW.email,
    -- Utilise raw_meta_data s'il est spécifié (formulaire d'inscription)
    -- Ou utilise le nom Google pour OAuth (full_name)
    COALESCE(NEW.raw_user_meta_data->>'displayName', NEW.raw_app_meta_data->>'providers' ? 'google' THEN NEW.raw_user_meta_data->>'full_name' ELSE ''),
    COALESCE(NEW.raw_user_meta_data->>'role', 'particular'),
    COALESCE(NEW.raw_user_meta_data->>'phoneNumber', ''),
    COALESCE((NEW.raw_user_meta_data->>'isPro')::boolean, false),
    -- Jsonb data : peut être null pour les particuliers
    CASE 
      WHEN NEW.raw_user_meta_data->>'professionalData' IS NOT NULL 
      THEN (NEW.raw_user_meta_data->>'professionalData')::jsonb 
      ELSE NULL 
    END,
    NOW()
  )
  ON CONFLICT (id) DO NOTHING; -- Éviter les conflits si l'utilisateur existe déjà
  
  RETURN NEW;
END;
$$;

-- S'assurer que le trigger est rattaché
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Recharger le schéma pour appliquer les politiques immédiatement
NOTIFY pgrst, 'reload schema';
