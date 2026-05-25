import { supabase } from '../lib/supabase';

// Helper pour extraire le Token
async function getAuthHeaders() {
  const { data: { session } } = await supabase.auth.getSession();
  return {
    'Content-Type': 'application/json',
    ...(session ? { 'Authorization': `Bearer ${session.access_token}` } : {})
  };
}

/**
 * Uploads a document for smart classification and secure storage.
 */
export async function uploadToSmartVault(file: File, useGoogleDrive: boolean = false) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      try {
        const base64Data = (reader.result as string).split(',')[1];
        const mimeType = file.type;

        const headers = await getAuthHeaders();
        const response = await fetch('/api/documents/upload', {
          method: 'POST',
          headers,
          body: JSON.stringify({ base64Data, mimeType, useGoogleDrive })
        });

        if (!response.ok) {
          throw new Error('Erreur réseau lors de la classification du document.');
        }

        const data = await response.json();
        resolve(data);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = error => reject(error);
  });
}

/**
 * Creates a digital secure "Agrafe" (Agrafe Numérique).
 */
export async function createAgrafe(documentIds: string[], templateType: string, recipientEmail: string) {
  const headers = await getAuthHeaders();
  const response = await fetch('/api/agrafes/create', {
    method: 'POST',
    headers,
    body: JSON.stringify({ documentIds, templateType, recipientEmail })
  });

  if (!response.ok) {
    throw new Error('Impossible de générer l\'agrafe numérique.');
  }

  const data = await response.json();
  return data;
}
