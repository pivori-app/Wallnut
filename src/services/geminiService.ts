export async function analyzeRealEstateDocument(base64Data: string, mimeType: string) {
  const response = await fetch('/api/ai/analyze-document', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ base64Data, mimeType })
  });
  const data = await response.json();
  if (data.error) throw new Error(data.error);
  return data.text;
}

export async function getInvestmentAssistantResponse(messages: { role: string, content: string }[]) {
  const response = await fetch('/api/ai/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages })
  });
  const data = await response.json();
  if (data.error) throw new Error(data.error);
  return data.text;
}
