import { DocumentItem } from '../types';

export function useDocumentAI() {
  const validateCapture = async (imageData: string, document: DocumentItem, brightness: number) => {
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Basic quality heuristics (simulated)
    if (brightness < 40) return { ok: false, reason: 'too_dark', message: "L'image est trop sombre. Améliorez l'éclairage." };
    if (brightness > 240) return { ok: false, reason: 'too_bright', message: "L'image est trop lumineuse. Évitez les reflets." };
    
    // Simulate random validation error (10% chance) for realism, but skip it if we want smooth demo
    // if (Math.random() > 0.9) return { ok: false, reason: 'blur', message: "L'image est trop floue." };

    return { 
      ok: true, 
      confidence: 95 + Math.floor(Math.random() * 5), 
      detectedType: document.category 
    };
  };

  return { validateCapture };
}
