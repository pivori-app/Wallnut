# FICHIER 6 : INSTRUCTIONS DASHBOARD SUPABASE - CONNEXION GOOGLE

Suivez ces étapes EXACTES pour activer Google OAuth (Continuer avec Google) dans votre projet Supabase.

## Partie 1 : Créer les identifiants dans Google Cloud Console (Si pas encore fait)

1. Allez sur **Google Cloud Console** (https://console.cloud.google.com/)
2. Créez un nouveau projet (ou sélectionnez-en un).
3. Dans le menu de gauche, allez dans **APIs & Services** > **Écran de consentement OAuth** (OAuth consent screen).
   - Choisissez **Externe** et cliquez sur "Créer".
   - Remplissez le nom de l'application (ex: Wallnut), votre e-mail de support.
   - Ajoutez le domaine `supabase.co` dans "Domaines autorisés".
   - Sauvegardez et continuez.
4. Dans le menu de gauche, allez dans **Identifiants** (Credentials).
5. Cliquez sur **Créer des identifiants** > **ID client OAuth**.
   - Type d'application : **Application Web**.
   - Nom : Supabase Auth (par exemple).
   - Origines JavaScript autorisées : (Laissez vide pour l'instant ou mettez votre URL de production finale).
   - **URI de redirection autorisés (CRUCIAL)** :
     - Allez dans votre Dashboard Supabase, Settings -> API, et copiez l'URL de votre projet.
     - L'URL de redirection doit être STRICTEMENT : `https://<VOTRE_PROJET_ID>.supabase.co/auth/v1/callback`
   - Cliquez sur **Créer**.
6. Notez précieusement votre **Client ID** et votre **Client Secret**.

---

## Partie 2 : Configurer Supabase

1. Connectez-vous à votre [Dashboard Supabase](https://app.supabase.com/).
2. Allez dans **Authentication** > **Providers** (dans le menu latéral).
3. Cliquez sur **Google** pour ouvrir le panneau de configuration.
4. Cochez **Enable Sign in with Google**.
5. Collez le **Client ID** (obtenu à l'étape 6 de la partie 1) dans le champ "Client ID (for Web)".
6. Collez le **Client Secret** (obtenu à l'étape 6 de la partie 1) dans le champ "Client Secret".
7. Cliquez sur **Save**.

---

## Partie 3 : Configurer l'URL de redirection App (CRUCIAL)

⚠️ Pour que la redirection après la connexion Google fonctionne, Supabase doit savoir où renvoyer l'utilisateur vers votre application React.

1. Allez dans **Authentication** > **URL Configuration**.
2. Dans **Site URL**, ajoutez l'URL de base absolue de votre application en mode développeur ou production. 
   > Par exemple : `https://ais-dev-ut4b4edgylg67x7ixasbgk-320445271791.europe-west2.run.app`
3. Dans la section **Redirect URLs**, cliquez sur **Add URL** et ajoutez le chemin de callback suivant :
   `https://ais-dev-ut4b4edgylg67x7ixasbgk-320445271791.europe-west2.run.app/auth/callback`
4. Ajoutez également les URLs pour votre domaine de production :
   - `https://wallnut-918963682690.europe-west2.run.app/`
   - `https://wallnut-918963682690.europe-west2.run.app/auth/callback`
5. Vérifiez bien que toute URL fournie par `window.location.origin` sur laquelle vous testez l'app se trouve bien configurée dans les Redirect URLs de votre dashboard Supabase.

**Terminé**. Votre bouton "Continuer avec Google" devrait maintenant fonctionner parfaitement.
