# DOCUMENT D'ARCHITECTURE ET SPÉCIFICATIONS : MODULE INTELLIGENT WALLNUT

## 1. Résumé Exécutif
L'application Wallnut intègre un nouveau **Module Intelligent de Gestion Documentaire** sécurisé pour les professionnels (agents, notaires) et les particuliers. Ce module automatise la classification, l'assemblage (agrafes numériques), et le rappel des documents sensibles (DPE, pièces d'identité) tout en garantissant un niveau de sécurité gouvernemental. Le système est conçu sur une architecture "Privacy-by-Design" avec fallback de stockage chiffré permettant d'opérer même si l'utilisateur refuse la connexion à Google Drive. 

## 2. Architecture Détaillée

**Schéma Conceptuel :**
```text
[ Frontend React (Vite) ]  <-- TLS 1.3 -->  [ API Node.js (Express) ] 
       |                                          |
       ├─ UI / UX 3D Glassmorph                   ├─ Middleware Auth / JWT
       ├─ Composant Scanner / Drag&Drop           ├─ Chiffrement AES-256 (KMS)
       └─ OAuth Client (Google)                   ├─ Worker OCR (Vision API / Gemini)
                                                  |
[ Base de Données PostgreSQL ] <------------------┤
 (Supabase)                                       ├─ S3/GCS (Stockage Fallback)
 - Tables relationnelles chiffrées                └─ Cloud Scheduler (Cron Rappels)
 - Row-Level Security (RLS)
 - Logs d'audit
```

**Composants Cloud :**
- **Compute :** Google Cloud Run (Auto-scaling, facturation à l'usage).
- **Base de données :** Supabase (PostgreSQL) avec `pgcrypto` pour le chiffrement des métadonnées au repos.
- **Workers Asynchrones :** Cloud Tasks pour l'extraction OCR sans bloquer la requête HTTP.
- **Stockage Interne :** Google Cloud Storage (Bucket privé chiffré par KMS).

## 3. Implémentation par Fonctionnalité

### 3.1 Classification Automatique et Fallback
Le document uploadé est analysé par Vision API.
```javascript
// Extrait Node.js : Classification & Fallback
async function processDocumentUpload(file, userId, useGoogleDrive) {
  let docType = await detectDocumentType(file.buffer); // OCR & Regex
  
  if (useGoogleDrive) {
    try {
      return await uploadToGoogleDrive(file.buffer, docType, userId);
    } catch (e) {
      if (e.message.includes('Quota')) handleQuotaError(userId);
      // Fallback on error
      return await uploadToInternalEncryptedStorage(file.buffer, userId);
    }
  } else {
    // Mode Fallback Forcé
    return await uploadToInternalEncryptedStorage(file.buffer, userId);
  }
}
```

### 3.2 L'Agrafe Numérique (Assemblage Sécurisé)
Un objet logique liant plusieurs références de fichiers existants, sans dupliquer les fichiers.
Génération d'un JWT expirant pour encadrer l'accès.
```javascript
// Extrait de génération de lien expirant
import jwt from 'jsonwebtoken';
function generateSecureLink(agrafeId, recipientEmail) {
  const token = jwt.sign(
    { agrafeId, recipientEmail },
    process.env.APP_SECRET_KEY, // Géré via KMS
    { expiresIn: '7d' } 
  );
  return `https://wallnut.app/secure-access?token=${token}`;
}
```

### 3.3 Moteur de Rappels 
Extraction de date par OCR.
Script via Google Cloud Scheduler appelant une route protégée `/api/cron/reminders` tous les jours à 08:00 UTC.

## 4. Modèle de Base de Données

```sql
-- PostgreSQL via Supabase
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  encrypted_metadata TEXT, -- Chiffré AES-256 (PGRST / Pgcrypto)
  drive_file_id VARCHAR(255),
  internal_storage_path VARCHAR(255),
  mime_type VARCHAR(50),
  version INTEGER DEFAULT 1,
  expiration_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE agrafes (
  id UUID PRIMARY KEY,
  owner_id UUID REFERENCES users(id),
  template_type VARCHAR(100), -- ex: 'Dossier Locataire'
  status VARCHAR(20) -- 'COMPLETE', 'INCOMPLETE'
);

CREATE TABLE agrafe_documents (
  agrafe_id UUID REFERENCES agrafes(id),
  document_id UUID REFERENCES documents(id)
);

CREATE TABLE access_logs (
  id UUID PRIMARY KEY,
  user_id UUID,
  document_id UUID,
  action_type VARCHAR(50), -- 'VIEW_SECURE_LINK', 'UPLOAD'
  ip_hash VARCHAR(255),
  timestamp TIMESTAMP DEFAULT NOW()
);
```

## 5. Sécurité & Conformité (RGPD)
- **Chiffrement au repos (AES-256) :** Activation sur le stockage Cloud et les colonnes `encrypted_metadata` via KMS.
- **Liens Sécurisés (Anti Data-Leak) :** Les liens générés exigent une validation d'identité (OTP ou Google Auth du récipiendaire) et utilisent des tokens JWT (Expiration 7 jours).
- **Droit à l'oubli :** Endpoint `/api/users/me/gdpr-delete` déclenchant une destruction récursive des UUIDs en base, purge des buckets GCS, et révocation des tokens Google Drive.
- **Logs immuables :** Table `access_logs` avec hash des adresses IP garantissant l'auditabilité sans conserver de PII (Personally Identifiable Information) brutes.

## 6. UX / Ergonomie
- **Upload :** Zone de Drag & Drop Glassmorph, barre de chargement animée fluide, indication lumineuse de succès.
- **Aperçu OCR :** Une notification Toast ("DPE Détecté") permet à l'utilisateur de cliquer sur "✓ Valider" ou "✕ Modifier" sans casser son flux.
- **Fallback UI :** Si le Cloud Drive de l'utilisateur est inactif, une jauge de stockage interne (0-500Mo) apparaît discrètement dans la Sidebar locale.

## 7. Feuille de Route (10 Semaines)
- **Sprint 1 (S1-S2) :** Setup infrastructure Supabase RLS, Base de données, Auth Google OAuth.
- **Sprint 2 (S3-S4) :** Intégration Drive API v3, Stockage Fallback Interne (GCS/S3), Chiffrement AES.
- **Sprint 3 (S5-S6) :** Moteur OCR (Vision API), Logique d'extraction des dates d'expiration.
- **Sprint 4 (S7-S8) :** Logique d'agrafes numériques, génération de tokens JWT, envois emails sécurisés.
- **Sprint 5 (S9-S10) :** Moteur de rappels (Cloud Scheduler), Tests de charge, Audit de sécurité final.

## 8. Estimation des Coûts (Pour 10 000 MAU)

| Ressource | Technologie | Coût estimé mensuel | Seuil Gratuit (Free Tier) |
| :--- | :--- | :--- | :--- |
| **Compute** | Google Cloud Run | ~15-25$ | 2M requêtes/mois |
| **Base de Données**| Supabase Pro | 25$ | 500MB DB |
| **OCR** | Google Vision API | ~30$ (env 20k pages) | 1000 pages / mois |
| **Stockage (Fallback)**| Cloud Storage (GCS) | ~10$ | 5GB |
| **Emails** | SendGrid / SMTP | ~15$ | 100 emails / jour |
| **TOTAL** | | **~95$ / mois** | |

*Mode dégradé OCR (Mitigation des coûts) : Au-delà de 20 000 requêtes, bascule temporaire sur une sélection manuelle par l'utilisateur.*

## 9. Risques & Mitigation
1. **Épuisement Quota OCR (Cost Attack)** : *Mitigation* - Limiter l'appel OCR à 10 documents / heure / utilisateur. Bascule manuelle au-delà.
2. **Révocation du Token Drive par Google** : *Mitigation* - Catch des erreurs `401 Unauthorized` et rétrogradation automatique sur le fallback interne.
3. **Fuite de documents via Lien Partagé** : *Mitigation* - Les liens ne pointent jamais vers un PDF direct, mais vers une page Web demandant une preuve d'identité (OTP email) avant de servir le fichier binaire limité.
4. **Saturation Stockage Interne (500Mo)** : *Mitigation* - Refus logiciel avec popup incitant à connecter Google Drive ou supprimer les anciennes agrafes.
5. **Erreur d'extraction de Date d'expiration** : *Mitigation* - L'IA n'applique pas la date aveuglément ; elle pré-remplit un champ que l'utilisateur valide visuellement.

## 10. Références API
- **Google Drive API v3** : https://developers.google.com/drive/api/reference/rest/v3 (Vérifié: Mai 2024 -> Utiliser `allowFileDiscovery: false`)
- **Google Vision API** : https://cloud.google.com/vision/docs/pdf (Vérifié: Mai 2024 -> Endpoint `annotateFiles`)
- **Supabase pgCrypto** : https://supabase.com/docs/guides/database/extensions/pgcrypto
- **React OAuth Google** : https://github.com/MomenSherif/react-oauth (Mise à jour standard)

---
*Fin du rapport d'architecture de l'expert.*
