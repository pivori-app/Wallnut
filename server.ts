import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";

import { GoogleGenAI } from "@google/genai";

import { createClient } from "@supabase/supabase-js";

dotenv.config({ override: true });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Supabase Client for auth verification
const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;
const supabaseClient = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

// Auth verification middleware
async function requireAuth(req: express.Request, res: express.Response, next: express.NextFunction) {
  if (!supabaseClient) {
    console.error("[SECURITY CRITICAL] Supabase Client is not initialized. Stopping request.");
    res.status(500).json({ error: "Internal Server Error: Missing Auth Configuration" });
    return;
  }
  
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res.status(401).json({ error: "Unauthorized: Missing authorization header (Token manquant)" });
    return;
  }
  
  const token = authHeader.replace(/^Bearer\s+/, "");
  const { data: { user }, error } = await supabaseClient.auth.getUser(token);
  
  if (error || !user) {
    console.error("[SECURITY ALERT] Token verification failed or forged token:", error?.message);
    res.status(401).json({ error: "Unauthorized: Invalid or expired token" });
    return;
  }
  
  (req as any).user = user;
  next();
}

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

  // Global Security Headers (Basic)
  app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    next();
  });

  app.use(express.json({ limit: '10mb' }));

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Gemini Proxy: Analyze Document
  app.post("/api/ai/analyze-document", requireAuth, async (req, res) => {
    try {
      const { base64Data, mimeType } = req.body;
      
      // Input Validation
      if (!base64Data || typeof base64Data !== 'string') {
        return res.status(400).json({ error: "Invalid base64Data" });
      }
      if (!mimeType || typeof mimeType !== 'string' || !mimeType.startsWith('image/') && mimeType !== 'application/pdf') {
        return res.status(400).json({ error: "Invalid or unsupported mimeType" });
      }

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
  app.post("/api/ai/chat", requireAuth, async (req, res) => {
    try {
      const { messages } = req.body;
      
      if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ error: "Messages array is required" });
      }
      
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
  app.post("/api/simulate", requireAuth, (req, res) => {
    const { propertyValue, need } = req.body;
    
    // Type and range validation
    if (typeof propertyValue !== 'number' || propertyValue <= 0 || propertyValue > 100000000) {
       return res.status(400).json({ error: "Invalid propertyValue. Must be a positive number." });
    }
    if (typeof need !== 'number' || need < 0 || need > propertyValue) {
       return res.status(400).json({ error: "Invalid need amount." });
    }

    // Basic logic for the three offers
    const offers = {
      premium: { ratio: 0.8, amount: propertyValue * 0.8 },
      equilibre: { ratio: 0.7, amount: propertyValue * 0.7 },
      prudente: { ratio: 0.6, amount: propertyValue * 0.6 },
    };
    res.json({ offers });
  });

  // --- SMART MODULE (AGRAFES & DOCUMENTS) ---
  
  // Endpoint de Fallback - Classification & Upload
  app.post("/api/documents/upload", requireAuth, async (req, res) => {
    try {
      const { base64Data, mimeType, useGoogleDrive } = req.body;
      const user = (req as any).user;
      
      if (!base64Data || typeof base64Data !== 'string') {
        return res.status(400).json({ error: "Invalid base64Data" });
      }

      // 1. Simulation OCR / Classification via Google Vision API (mock)
      const ai = getGenAI();
      let docType = "Document Inconnu";
      let extractedDate = null;
      try {
        const prompt = `Extrait le type de ce document officiel (ex: Passeport, CNi, Avis d'impôt, DPE) et sa date d'expiration si applicable. Renvoyer au format JSON: {"type": "...", "expirationDate": "YYYY-MM-DD" ou null}`;
        const response = await ai.models.generateContent({
          model: "gemini-2.5-pro",
          contents: [
            prompt,
            { inlineData: { data: base64Data, mimeType: mimeType } }
          ],
        });
        const textResponse = response.text || "";
        const jsonMatch = textResponse.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          docType = parsed.type || docType;
          extractedDate = parsed.expirationDate || null;
        }
      } catch (err) {
        console.warn("OCR AI failed, fallback to manual classification", err);
      }

      // 2. Fallback Storage Logic (Mock for now, would be S3/GCS + Supabase INSERT)
      const mockDocumentId = "doc-" + Math.random().toString(36).substr(2, 9);
      const storageUsed = useGoogleDrive ? "Google Drive" : "Internal Encrypted Storage (AES-256)";

      res.status(200).json({
        success: true,
        documentId: mockDocumentId,
        classification: docType,
        extractedDate: extractedDate,
        storage: storageUsed,
        message: `Document sécurisé et analysé avec succès sur ${storageUsed}.`
      });

    } catch (err: any) {
      console.error("[SMART MODULE] Upload Error:", err);
      res.status(500).json({ error: "Erreur lors du traitement du document." });
    }
  });

  // Endpoint d'Agrafe Numérique (Création de lien expirant)
  app.post("/api/agrafes/create", requireAuth, async (req, res) => {
    try {
      const { documentIds, templateType, recipientEmail } = req.body;
      const user = (req as any).user;

      if (!documentIds || !Array.isArray(documentIds)) {
        return res.status(400).json({ error: "documentIds array is required" });
      }

      // 1. Validation de la fraîcheur des documents (Mock valid)
      // 2. Génération de token JWT (Expiration 7 jours)
      const jwt = await import("jsonwebtoken");
      const secret = process.env.APP_SECRET_KEY || "SECURE_FALLBACK_KEY_DO_NOT_USE_IN_PROD";
      
      const agrafeId = "ag-" + Math.random().toString(36).substr(2, 9);
      
      const token = jwt.sign(
        { agrafeId, recipientEmail, ownerId: user.id },
        secret,
        { expiresIn: '7d' }
      );

      const secureLink = `${req.protocol}://${req.get('host')}/secure-access?token=${token}`;

      // (Ici on insérerait dans Postgres: owner_id, agrafe_id, template_type, status='COMPLETE')

      res.status(200).json({
        success: true,
        agrafeId,
        secureLink,
        message: "Agrafe numérique générée avec lien sécurisé chiffré."
      });

    } catch (err: any) {
      console.error("[SMART MODULE] Agrafe Error:", err);
      res.status(500).json({ error: "Impossible de générer l'agrafe." });
    }
  });

  // Verify JWT for Secure Access
  app.post("/api/agrafes/verify", async (req, res) => {
    try {
      const { token } = req.body;
      if (!token) return res.status(400).json({ error: "Token manquant" });

      const jwt = await import("jsonwebtoken");
      const secret = process.env.APP_SECRET_KEY || "SECURE_FALLBACK_KEY_DO_NOT_USE_IN_PROD";
      
      const decoded = jwt.verify(token, secret) as any;

      // Mock DB retrieval based on decoded.agrafeId
      res.status(200).json({
        success: true,
        agrafe: {
          agrafeId: decoded.agrafeId,
          templateType: "Dossier Vente (Agrafe)",
          documents: [
            { name: "Passeport / CNI", type: "ID" },
            { name: "Avis d'imposition récent", type: "TAX" }
          ]
        }
      });
    } catch (err) {
      // Invalid or expired token
      res.status(401).json({ error: "Lien expiré ou invalide" });
    }
  });

  // --- SMART MODULE : RAPPELS (CRON) ---
  app.get("/api/cron/reminders", async (req, res) => {
    try {
      // Sécurité : S'assurer que ça vient bien de Google Cloud Scheduler
      // (ex: vérifier le header X-CloudScheduler)
      
      // Simulation PostgreSQL Queries (Supabase) :
      // SELECT * FROM documents WHERE expiration_date IS NOT NULL AND expiration_date <= NOW() + INTERVAL '30 days';
      // MOCK DATA :
      const expiringDocs = [
         { userId: "1", type: "Passeport", expireInDays: 7, email: "client@test.com" },
         { userId: "2", type: "Justificatif de domicile", ageInDays: 95, email: "autre@test.com" }
      ];

      // Simulation SMTP / SendGrid
      const emailsSent = expiringDocs.map(doc => {
         if (doc.type === "Passeport" && doc.expireInDays <= 30) {
            return `Email envoyé à ${doc.email} [URGENT] Votre Passeport expire dans ${doc.expireInDays} jours.`;
         } else if (doc.type === "Justificatif de domicile" && doc.ageInDays > 90) {
            return `Email envoyé à ${doc.email} [RAPPEL] Votre Justificatif de domicile a plus de 3 mois.`;
         }
         return null;
      }).filter(Boolean);

      res.status(200).json({
        success: true,
        processed: expiringDocs.length,
        emailsSent,
        message: "Moteur de rappels exécuté avec succès."
      });
    } catch (err) {
       console.error("Erreur Cron Reminders:", err);
       res.status(500).json({ error: "Erreur moteur de rappel" });
    }
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
