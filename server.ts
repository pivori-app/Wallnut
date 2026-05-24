import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";

import { GoogleGenAI } from "@google/genai";

dotenv.config({ override: true });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Gemini on the server
function getGenAI() {
  const apiKey = process.env.GEMINI_API_KEY;
  console.log("getGenAI key:", apiKey ? apiKey.substring(0, 5) + "..." + apiKey.length : "none");
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not set in environment variables");
  }
  return new GoogleGenAI({ apiKey });
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Gemini Proxy: Analyze Document
  app.post("/api/ai/analyze-document", async (req, res) => {
    try {
      const { base64Data, mimeType } = req.body;
      const ai = getGenAI();
      
      const prompt = `
        Vous êtes un expert en analyse documentaire pour le portage immobilier chez Wallnut.
        Analysez ce document et extrayez les informations suivantes AU FORMAT JSON UNIQUEMENT (pas de markdown) :
        {
          "typeDocument": "string",
          "dateValidite": "YYYY-MM-DD",
          "montantDette": number,
          "surfaceHabitable": number,
          "anomalies": ["string"],
          "scoreConfiance": number
        }
      `;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
          { text: prompt },
          {
            inlineData: {
              data: base64Data,
              mimeType: mimeType
            }
          }
        ]
      });
      res.json({ text: response.text });
    } catch (error: any) {
      console.error("Gemini Error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Debug Endpoint
  app.get("/api/ai/debug", (req, res) => {
    res.json({ 
      keyLength: process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.length : 0, 
      keyStart: process.env.GEMINI_API_KEY?.substring(0, 5) 
    });
  });

  // Gemini Proxy: Chat Assistant
  app.post("/api/ai/chat", async (req, res) => {
    try {
      const { messages } = req.body;
      const ai = getGenAI();
      
      // format for gemini API
      let contents = Array.isArray(messages) ? messages.map((m: any) => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }]
      })) : [{ role: 'user', parts: [{ text: messages }] }];

      // Gemini requires the first message to be from the user
      while (contents.length > 0 && contents[0].role === 'model') {
        contents.shift();
      }

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents,
        config: {
          systemInstruction: `
Vous êtes "L'assistant Wallnut", spécialisé dans le portage immobilier institutionnel chez Wallnut.

VOTRE RÔLE PRINCIPAL :
Ne soumettez JAMAIS la solution ni l'offre financière finale par chat. Votre objectif ultime est de GUIDER l'utilisateur vers les bonnes démarches, les bonnes pages et l'inscription sur la plateforme.

CONNAISSANCES DE L'UNIVERS WALLNUT :
- Solution : Liquidité immobilière (portage structuré, visant la revente au meilleur prix sur le marché en cas de non-rachat, très différent du réméré classique).
- Les offres (à titre indicatif) : Premium (financement jusqu'à 80%), Équilibre (70%), Prudente (60%).
- Durée max : 24 mois.
- Avantages de la plateforme : Discrétion totale, analyse en moins de 24h, sécurité notariale parisienne, gestion complète de la transaction.
- Clientèles : Particuliers (besoin urgent de liquidité) ou Professionnels (Agent immobilier, CGP, Notaire, Courtier) qui accompagnent leurs clients pour trouver des solutions financières sans passer par des banques classiques.

DIRECTIVES DE NAVIGATION ET D'ACCOMPAGNEMENT :
1. UTILISATEURS NON INSCRITS :
   - Orientez le visiteur (Particulier) vers : [Simuler mon projet](/dashboard/particulier) ou l'[Inscription](/register).
   - Orientez les experts (Professionnels) vers : [Démarrer l'inscription Pro](/register-selection) ou en savoir plus via les [Solutions Pros](/home).
   - Incitez continuellement à passer par ces formulaires "pour une analyse confidentielle, gratuite, et en moins de 24h par nos experts".

2. UTILISATEURS INSCRITS DANS LEUR DASHBOARD :
   - S'il s'agit de soumettre un projet, guidez vers [Nouveau dossier](/dossiers/new) pour lancer la procédure de "data room".
   - S'il s'agit d'une question sur un dossier en cours, orientez vers la [Messagerie de l'espace client](/messages).
   - Accompagnez les professionnels sur leur suivi de mandats.

3. POSTURE ET TON :
   - Ton: Institutionnel, Elite, Chaleureux, Rassurant et Très Expert. (Esthétique Glassmorphism, 3D futuriste - votre vocabulaire doit refléter cette modernité).
   - Interdiction formelle : Ne donnez jamais d'engagement tarifaire ferme ou de promesse garantie.
   - Ne dites JAMAIS que vous êtes une "IA". Vous êtes "l'expérience accompagnement Wallnut".
   - Utilisez toujours le format Markdown direct pour les liens (ex: [Texte du lien](/le-lien)).
          `,
        }
      });

      res.json({ text: response.text });
    } catch (error: any) {
      console.error("Gemini Error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Example simulation endpoint
  app.post("/api/simulate", (req, res) => {
    const { propertyValue, need } = req.body;
    // Basic logic for the three offers
    const offers = {
      premium: { ratio: 0.8, amount: propertyValue * 0.8 },
      equilibre: { ratio: 0.7, amount: propertyValue * 0.7 },
      prudente: { ratio: 0.6, amount: propertyValue * 0.6 },
    };
    res.json({ offers });
  });

  // Vite integration
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
