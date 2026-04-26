import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";

import { GoogleGenAI } from "@google/genai";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Gemini on the server
let genAI: GoogleGenAI | null = null;
function getGenAI() {
  if (!genAI) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not set in environment variables");
    }
    genAI = new GoogleGenAI({ apiKey });
  }
  return genAI;
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

  // Gemini Proxy: Chat Assistant
  app.post("/api/ai/chat", async (req, res) => {
    try {
      const { query } = req.body;
      const ai = getGenAI();
      
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: query,
        config: {
          systemInstruction: `
            Vous êtes l'assistant Wallnut. Vous aidez les clients et professionnels à comprendre le portage immobilier.
            Règles de Wallnut :
            - 3 Offres : Premium (80%), Équilibre (70%), Prudente (60%).
            - Durée max : 24 mois.
            - Mécanisme : Complément de prix lors de la sortie.
            Soyez professionnel, précis et chaleureux.
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
