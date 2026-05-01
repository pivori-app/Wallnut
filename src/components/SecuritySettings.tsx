import React, { useState } from 'react';
import { Shield, Smartphone, Key, History, CheckCircle2, X, Globe } from 'lucide-react';

export function SecuritySettings({ user }: { user: any }) {
  const [passkeyAdded, setPasskeyAdded] = useState(false);
  const [mfaEnabled, setMfaEnabled] = useState(false);
  const [walletLinked, setWalletLinked] = useState(false);
  const [activeModal, setActiveModal] = useState<string | null>(null);

  const handlePasskeyCreate = async () => {
    try {
      if (!window.PublicKeyCredential) {
        alert("WebAuthn n'est pas supporté par ce navigateur.");
        return;
      }
      
      const publicKeyCredentialCreationOptions: PublicKeyCredentialCreationOptions = {
        challenge: new Uint8Array(32),
        rp: {
          name: "Wallnut",
          id: window.location.hostname
        },
        user: {
          id: new Uint8Array(16),
          name: user?.email || "user@example.com",
          displayName: user?.email || "Utilisateur"
        },
        pubKeyCredParams: [{alg: -7, type: "public-key"}],
        authenticatorSelection: {
          authenticatorAttachment: "platform",
          userVerification: "required"
        },
        timeout: 60000,
        attestation: "direct"
      };

      await navigator.credentials.create({
        publicKey: publicKeyCredentialCreationOptions
      });
      
      setPasskeyAdded(true);
      setActiveModal(null);
    } catch (err) {
      console.error(err);
      alert("Création du Passkey annulée ou échouée.");
    }
  };

  const closeModal = () => setActiveModal(null);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 relative">
        <h2 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
          <Shield className="text-secondary" /> 
          Sécurité Avancée (Architecture CIAM)
        </h2>
        <p className="text-sm text-neutral-dark/70 mb-8 border-l-4 border-secondary pl-3 bg-secondary/5 py-2 rounded-r">
          <strong>Mode Expert 2026 activé.</strong> Ces paramètres appliquent les directives de sécurité : MFA obligatoire, WebAuthn (Passkeys) et validation eIDAS 2.0 (Identity Wallet).
        </p>

        <div className="space-y-6">
          {/* Section Passkeys */}
          <div className="border border-slate-200 rounded-xl p-5">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center text-primary shrink-0">
                  <Key size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-primary flex items-center gap-2">
                    Passkeys (FIDO2 / WebAuthn)
                    {passkeyAdded && <span className="bg-green-100 text-green-700 text-[10px] uppercase font-bold px-2 py-0.5 rounded-full flex items-center gap-1"><CheckCircle2 size={10} /> Actif</span>}
                  </h3>
                  <p className="text-sm text-neutral-dark/70 mt-1 max-w-md">
                    Connectez-vous avec votre empreinte digitale ou la reconnaissance faciale. Résistance cryptographique contre le phishing assisté par IA.
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setActiveModal('passkey')}
                disabled={passkeyAdded}
                className="px-4 py-2 bg-slate-900 text-white text-sm font-semibold rounded-lg hover:bg-slate-800 transition-colors shrink-0 disabled:opacity-50"
              >
                {passkeyAdded ? 'Passkey configuré' : 'Ajouter un Passkey'}
              </button>
            </div>
          </div>

          {/* Section MFA */}
          <div className="border border-slate-200 rounded-xl p-5">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center text-primary shrink-0">
                  <Smartphone size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-primary flex items-center gap-2">
                    Authentification Double Facteur (MFA)
                    {mfaEnabled && <span className="bg-green-100 text-green-700 text-[10px] uppercase font-bold px-2 py-0.5 rounded-full flex items-center gap-1"><CheckCircle2 size={10} /> Actif</span>}
                  </h3>
                  <p className="text-sm text-neutral-dark/70 mt-1 max-w-md">
                    Protégez votre compte avec un code d'application (TOTP) ou une clé matérielle. Requis pour les comptes professionnels (NIS 2).
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setActiveModal('mfa')}
                disabled={mfaEnabled}
                className="px-4 py-2 border border-slate-300 text-primary text-sm font-semibold rounded-lg hover:bg-slate-50 transition-colors shrink-0 disabled:opacity-50"
              >
                {mfaEnabled ? 'Gérer 2FA' : 'Activer 2FA'}
              </button>
            </div>
          </div>

          {/* Section Identity Wallet */}
          <div className="border border-blue-100 bg-blue-50/50 rounded-xl p-5">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                  <Shield size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-blue-900 flex items-center gap-2">
                    European Identity Wallet (EU-DIW)
                    {walletLinked && <span className="bg-green-100 text-green-700 text-[10px] uppercase font-bold px-2 py-0.5 rounded-full flex items-center gap-1"><CheckCircle2 size={10} /> Lié</span>}
                    {!walletLinked && <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-blue-200">Recommandation CIAM</span>}
                  </h3>
                  <p className="text-sm text-blue-800/80 mt-1 max-w-md">
                    Liez votre identité numérique européenne vérifiée eIDAS 2.0. Validation instantanée des droits (SIRET, Carte Pro).
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setActiveModal('wallet')}
                disabled={walletLinked}
                className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors shrink-0 disabled:opacity-50"
              >
                {walletLinked ? 'Wallet Lié' : 'Lier mon Wallet'}
              </button>
            </div>
          </div>

          {/* Section Active Sessions */}
          <div className="border border-slate-200 rounded-xl p-5">
            <div className="flex items-start justify-between">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center text-primary shrink-0">
                  <History size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-primary">Sessions actives</h3>
                  <p className="text-sm text-neutral-dark/70 mt-1 max-w-md">
                    Surveillez où vous êtes connecté(e). Géré avec des tokens à courte durée de vie (DPoP).
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-100 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-primary font-medium">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  Navigateur Chrome - Paris, France (Session courante)
                </div>
                <span className="text-slate-400">Actif maintenant</span>
              </div>
            </div>
          </div>

          {/* Section Feuille de Route 2026 */}
          <div className="border-2 border-secondary/20 bg-gradient-to-br from-secondary/5 to-transparent rounded-xl p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
              <Shield size={120} />
            </div>
            <div className="relative z-10">
              <h3 className="text-lg font-bold text-primary mb-4 flex items-center gap-2">
                <Globe className="text-secondary" size={20} />
                Feuille de Route CIAM 2026
              </h3>
              
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-bold text-primary uppercase tracking-wider mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-secondary"></span> 
                    Court-terme (0-6 mois)
                  </h4>
                  <ul className="space-y-2 text-sm text-neutral-dark/80 ml-4 border-l-2 border-secondary/30 pl-4">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 size={16} className="text-green-600 shrink-0 mt-0.5" />
                      <div><strong>Généralisation WebAuthn & Passkeys :</strong> Déploiement obligatoire pour les pros, optionnel pour les particuliers.</div>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 size={16} className="text-green-600 shrink-0 mt-0.5" />
                      <div><strong>DMARC Strict & BIMI :</strong> Finalisation de la conformité email anti-phishing.</div>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-4 h-4 rounded-full border-2 border-secondary shrink-0 mt-0.5"></div>
                      <div><strong>Score d'Attestation (CAPTCHA v4) :</strong> Remplacement du reCAPTCHA par des preuves de travail cryptographiques côté client.</div>
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-primary uppercase tracking-wider mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-500"></span> 
                    Long-terme (6-18 mois)
                  </h4>
                  <ul className="space-y-2 text-sm text-neutral-dark/80 ml-4 border-l-2 border-blue-500/30 pl-4">
                    <li className="flex items-start gap-2">
                      <div className="w-4 h-4 rounded-full border-2 border-blue-500 shrink-0 mt-0.5"></div>
                      <div><strong>European Identity Wallet (EU-DIW) :</strong> Intégration complète France Identité / eIDAS 2.0 pour la vérification KYC unifiée.</div>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-4 h-4 rounded-full border-2 border-blue-500 shrink-0 mt-0.5"></div>
                      <div><strong>OAuth 2.1 & DPoP :</strong> Mise à jour des protocoles de délégation d'accès (Demonstrating Proof-of-Possession).</div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {activeModal && (
        <div className="fixed inset-0 bg-primary/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-md p-6 relative shadow-2xl">
            <button onClick={closeModal} className="absolute top-4 right-4 text-slate-400 hover:text-primary transition-colors">
              <X size={24} />
            </button>

            {activeModal === 'passkey' && (
              <div className="text-center space-y-6">
                <div className="w-16 h-16 bg-primary/5 text-primary rounded-full flex items-center justify-center mx-auto">
                  <Key size={32} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-primary">Créer un Passkey</h3>
                  <p className="text-sm text-slate-500 mt-2">Votre appareil va vous demander de vous authentifier (empreinte, Face ID ou PIN) pour créer une clé cryptographique.</p>
                </div>
                <button onClick={handlePasskeyCreate} className="w-full py-3 bg-secondary text-white font-bold rounded-xl hover:bg-secondary/90 transition-colors shadow-lg shadow-secondary/20">
                  Continuer
                </button>
              </div>
            )}

            {activeModal === 'mfa' && (
              <div className="text-center space-y-6">
                <div className="w-16 h-16 bg-primary/5 text-primary rounded-full flex items-center justify-center mx-auto">
                  <Smartphone size={32} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-primary">Configuration 2FA</h3>
                  <p className="text-sm text-slate-500 mt-2">Scannez ce QR Code avec votre application d'authentification (Google Authenticator, Authy, etc.)</p>
                </div>
                <div className="w-48 h-48 bg-slate-100 rounded-xl mx-auto flex items-center justify-center border-2 border-dashed border-slate-300">
                  <span className="text-slate-400 font-mono text-sm">[Simulation QR Mock]</span>
                </div>
                <div className="space-y-4">
                  <input type="text" placeholder="Code à 6 chiffres" className="w-full text-center tracking-widest font-mono text-lg py-3 rounded-xl border border-slate-200 outline-none focus:border-secondary" />
                  <button onClick={() => { setMfaEnabled(true); closeModal(); }} className="w-full py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-colors shadow-lg">
                    Valider et Activer
                  </button>
                </div>
              </div>
            )}

            {activeModal === 'wallet' && (
              <div className="text-center space-y-6">
                <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto">
                  <Shield size={32} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-blue-900">European Identity Wallet</h3>
                  <p className="text-sm text-slate-500 mt-2">Présentez votre QR Code fourni par votre application France Identité ou équivalent européen (eIDAS v2).</p>
                </div>
                <div className="bg-blue-50 rounded-xl p-4 border border-blue-100 mb-6">
                   <p className="text-xs text-blue-800 text-left">Les attributs suivants seront demandés : <br/>- Vérification de l'identité (+18 ans)<br/>- Numéro de SIRET professionnel<br/>- Agrément ORIAS ou Carte Pro.</p>
                </div>
                <button onClick={() => { setWalletLinked(true); closeModal(); }} className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20">
                  Simuler la liaison
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

