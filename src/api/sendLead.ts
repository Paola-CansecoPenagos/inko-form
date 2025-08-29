import { LeadPayload } from '../types';

export async function sendLead(payload: LeadPayload): Promise<void> {
  const webhookUrl = import.meta.env.VITE_N8N_WEBHOOK_URL;
  
  if (!webhookUrl) {
    throw new Error('VITE_N8N_WEBHOOK_URL no está configurada');
  }

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Error al enviar solicitud: ${error.message}`);
    }
    throw new Error('Error desconocido al enviar solicitud');
  }
}