import { supabase } from '../lib/supabase';

async function getAuthHeaders() {
  const { data: { session } } = await supabase.auth.getSession();
  return {
    'Content-Type': 'application/json',
    ...(session ? { 'Authorization': `Bearer ${session.access_token}` } : {})
  };
}

export async function analyzeRealEstateDocument(base64Data: string, mimeType: string) {
  const headers = await getAuthHeaders();
  const response = await fetch('/api/ai/analyze-document', {
    method: 'POST',
    headers,
    body: JSON.stringify({ base64Data, mimeType })
  });
  const data = await response.json();
  if (data.error) throw new Error(data.error);
  return data.text;
}

export async function getInvestmentAssistantResponse(messages: { role: string, content: string }[]) {
  const headers = await getAuthHeaders();
  const response = await fetch('/api/ai/chat', {
    method: 'POST',
    headers,
    body: JSON.stringify({ messages })
  });
  const data = await response.json();
  if (data.error) throw new Error(data.error);
  return data.text;
}

