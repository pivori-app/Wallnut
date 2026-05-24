-- ==========================================
-- SCHÉMA SUPABASE IMMOBILIER (GLASSMORPH)
-- ==========================================

-- 1. Table des utilisateurs (Profiles, lié à auth.users)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  role TEXT NOT NULL CHECK (role IN ('particulier', 'courtier', 'notaire', 'institutionnel')),
  first_name TEXT,
  last_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sécurité RLS pour Profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Utilisateurs peuvent lire leur propre profil"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Utilisateurs peuvent mettre à jour leur propre profil"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- 2. Table des Biens (Properties)
CREATE TABLE properties (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_id UUID REFERENCES profiles(id) NOT NULL,
  type TEXT NOT NULL,
  full_address TEXT NOT NULL,
  city TEXT NOT NULL,
  postal_code TEXT NOT NULL,
  surface NUMERIC,
  rooms INTEGER,
  dpe TEXT,
  estimated_value NUMERIC,
  status TEXT DEFAULT 'draft',
  is_complete BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE properties ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Propriétaires peuvent CRUD leurs biens"
  ON properties FOR ALL
  USING (auth.uid() = owner_id);

CREATE POLICY "Les pros peuvent voir les biens validés"
  ON properties FOR SELECT
  USING (
    status IN ('validated', 'under_review') AND 
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() AND profiles.role IN ('courtier', 'notaire', 'institutionnel')
    )
  );

-- 3. Table des Documents Scannés (SmartScanner Pro)
CREATE TABLE documents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  file_url TEXT NOT NULL,
  validation_status TEXT DEFAULT 'pending',
  ai_confidence NUMERIC,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Accès documents pour propriétaires"
  ON documents FOR ALL
  USING (auth.uid() = user_id);

-- ==========================================
-- FONCTIONS ET TRIGGERS
-- ==========================================
-- Trigger pour créer le profile automatiquement à l'inscription
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, role, first_name, last_name)
  VALUES (new.id, COALESCE(new.raw_user_meta_data->>'role', 'particulier'), new.raw_user_meta_data->>'first_name', new.raw_user_meta_data->>'last_name');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
