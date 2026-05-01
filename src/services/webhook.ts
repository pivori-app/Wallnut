export const triggerWebhook = async (eventName: string, payload: any) => {
  // @ts-ignore
  const webhookUrl = import.meta.env.VITE_N8N_WEBHOOK_URL;
  
  if (!webhookUrl) {
    console.warn(`[N8N] Webhook URL not configured. Event '${eventName}' caught locally.`);
    return;
  }

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        event: eventName,
        timestamp: new Date().toISOString(),
        data: payload,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    console.log(`[N8N] Successfully triggered event: ${eventName}`);
  } catch (error) {
    console.error(`[N8N] Failed to trigger webhook for event: ${eventName}`, error);
  }
};
