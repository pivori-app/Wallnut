import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("⚠️ Supabase n'est pas configuré. Veuillez copier .env.example vers .env et ajouter vos clés.");
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder'
);

export const checkSupabaseConnection = async () => {
  if (!supabaseUrl || !supabaseAnonKey) {
    return { success: false, message: "Variables d'environnement manquantes." };
  }
  
  try {
    // Vérification légère sur la table profiles (ou via une requête RPC si dispo)
    // Ici nous simulons un ping en demandant juste le count
    const { error } = await supabase.from('properties').select('id', { count: 'exact', head: true }).limit(1);
    if (error) {
      console.error("Erreur de connexion Supabase:", error);
      return { success: false, message: error.message };
    }
    return { success: true, message: "Connexion réussie à Supabase !" };
  } catch (err: any) {
    return { success: false, message: err.message || "Erreur de réseau." };
  }
};
