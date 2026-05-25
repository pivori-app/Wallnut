-- Fichier: module_intelligent_schema.sql
-- Description: Schéma de la base de données (Supabase) pour le Module Intelligent Wallnut
-- Date: 2026-05-24

-- 1. Extension requise pour les UUIDs et le chiffrement (si pas déjà installée)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Table: Documents
-- Stocke les métadonnées des documents uploadés. Les données sensibles sont chiffrées.
CREATE TABLE IF NOT EXISTS public.documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL, -- Doit référencer public.users(id) si la table existe
  encrypted_metadata TEXT, -- Chiffré AES-256 (via pgcrypto)
  drive_file_id VARCHAR(255),
  internal_storage_path VARCHAR(255),
  mime_type VARCHAR(50) NOT NULL,
  version INTEGER DEFAULT 1,
  expiration_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Table: Agrafes
-- Une "agrafe" est un ensemble logique de documents (ex: "Dossier Locataire", "Pièces Vente")
CREATE TABLE IF NOT EXISTS public.agrafes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id UUID NOT NULL,
  template_type VARCHAR(100) NOT NULL,
  status VARCHAR(20) DEFAULT 'INCOMPLETE',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Table de jointure: Agrafe_Documents
CREATE TABLE IF NOT EXISTS public.agrafe_documents (
  agrafe_id UUID REFERENCES public.agrafes(id) ON DELETE CASCADE,
  document_id UUID REFERENCES public.documents(id) ON DELETE CASCADE,
  PRIMARY KEY (agrafe_id, document_id)
);

-- 5. Table: Access Logs
-- Garantit l'auditabilité des accès (RGPD). Les IP sont hashées.
CREATE TABLE IF NOT EXISTS public.access_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID,
  document_id UUID REFERENCES public.documents(id) ON DELETE SET NULL,
  action_type VARCHAR(50) NOT NULL, -- ex: 'UPLOAD', 'VIEW_SECURE_LINK'
  ip_hash VARCHAR(255) NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Indexes pour la performance
CREATE INDEX IF NOT EXISTS idx_documents_user_id ON public.documents(user_id);
CREATE INDEX IF NOT EXISTS idx_agrafes_owner_id ON public.agrafes(owner_id);
CREATE INDEX IF NOT EXISTS idx_access_logs_document_id ON public.access_logs(document_id);

-- 7. Politiques de sécurité (Row-Level Security)
-- Activer RLS pour s'assurer que chaque utilisateur ne voit que ses documents
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agrafes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agrafe_documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own documents"
  ON public.documents FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own documents"
  ON public.documents FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own agrafes"
  ON public.agrafes FOR SELECT
  USING (auth.uid() = owner_id);

CREATE POLICY "Users can insert their own agrafes"
  ON public.agrafes FOR INSERT
  WITH CHECK (auth.uid() = owner_id);

-- Fin du modèle de base de données.
