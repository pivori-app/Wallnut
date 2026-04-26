import React from 'react';
import { motion } from 'motion/react';
import { PublicHeader } from '../components/PublicHeader';
import { Footer } from '../components/Footer';
import { Shield, Scale, FileText, Lock } from 'lucide-react';

const LegalLayout = ({ children, title, icon: Icon }: { children: React.ReactNode, title: string, icon: any }) => (
  <div className="min-h-screen bg-slate-50">
    <PublicHeader />
    <main className="pt-32 pb-20">
      <div className="max-w-4xl mx-auto px-4">
        <header className="mb-16 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest leading-none">
            <Icon size={14} /> Espaces Légaux
          </div>
          <h1 className="text-4xl lg:text-6xl font-display font-bold text-primary">{title}</h1>
          <p className="text-neutral-dark/40 text-sm italic">Dernière mise à jour : 25 Avril 2026</p>
        </header>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass p-8 md:p-16 rounded-[3rem] border border-black/5 bg-white shadow-xl prose prose-slate max-w-none"
        >
          {children}
        </motion.div>
      </div>
    </main>
    <Footer />
  </div>
);

export function MentionsLegales() {
  return (
    <LegalLayout title="Mentions Légales" icon={FileText}>
      <h2>1. Éditeur du site</h2>
      <p>Le site Wallnut.immo est édité par la société WALLNUT SAS, société par actions simplifiée au capital de 500 000 euros, immatriculée au Registre du Commerce et des Sociétés de Paris sous le numéro 123 456 789.</p>
      <p>Siège social : 12 Rue de la Paix, 75002 Paris, France.</p>
      <p>Directeur de la publication : Équipe Direction Wallnut.</p>

      <h2>2. Hébergement</h2>
      <p>Le site est hébergé par Google Cloud Platform (GCP), dont le siège social est situé à 8 rue de Londres, 75009 Paris.</p>

      <h2>3. Activité réglementée</h2>
      <p>WALLNUT SAS est titulaire de la carte professionnelle de transaction immobilière n° CPI 7501 2026 000 000 délivrée par la CCI de Paris Ile-de-France.</p>
      <p>La société est également enregistrée auprès de l'ORIAS sous le numéro 26000000 en qualité de mandataire d'intermédiaire en opérations de banque et en services de paiement (MIOBSP).</p>

      <h2>4. Propriété intellectuelle</h2>
      <p>L'intégralité du site (structure, textes, graphismes, logiciels, photographies, images, vidéos, sons, logos, marques...) est la propriété exclusive de la société WALLNUT SAS ou de ses partenaires. Toute reproduction, représentation, modification ou exploitation totale ou partielle du site ou de son contenu est interdite sans autorisation préalable.</p>
    </LegalLayout>
  );
}

export function RGPD() {
  return (
    <LegalLayout title="Politique de Confidentialité (RGPD)" icon={Shield}>
      <h2>1. Collecte des données</h2>
      <p>Dans le cadre de l'écosystème immobilier Wallnut, nous collectons des données personnelles nécessaires à l'instruction des dossiers de portage immobilier (identité, situation financière, documents de propriété).</p>

      <h2>2. Finalité du traitement</h2>
      <p>Vos données sont traitées pour :</p>
      <ul>
        <li>L'évaluation de l'éligibilité au portage immobilier.</li>
        <li>La sécurisation des transactions via acte authentique.</li>
        <li>La lutte contre le blanchiment d'argent et le financement du terrorisme (LCB-FT).</li>
        <li>La gestion de la relation client via la messagerie sécurisée.</li>
      </ul>

      <h2>3. Conservation des données</h2>
      <p>Les documents relatifs aux transactions immobilières sont conservés pendant une durée de 10 ans conformément aux obligations légales. Les données de navigation et de contact sont conservées pendant 3 ans à compter du dernier contact.</p>

      <h2>4. Vos droits</h2>
      <p>Conformément au RGPD 2026, vous disposez d'un droit d'accès, de rectification, d'effacement et de portabilité de vos données. Vous pouvez exercer ces droits en contactant : dpo@wallnut.immo.</p>
    </LegalLayout>
  );
}

export function CGU() {
  return (
    <LegalLayout title="CGU & CGV" icon={Scale}>
      <h2>1. Objet des conditions</h2>
      <p>Les présentes Conditions Générales d'Utilisation (CGU) et de Vente (CGV) définissent les modalités de mise à disposition des services de la plateforme Wallnut et les conditions contractuelles du portage immobilier.</p>

      <h2>2. Nature de l'offre</h2>
      <p>Wallnut est une plateforme spécialisée dans l'avance sur vente immobilière. Nous ne sommes en aucun cas un établissement de crédit, une société de réméré ou tout autre organisme rattaché au secteur bancaire ou au financement réglementé. Notre mission est exclusivement de faciliter la mobilisation de liquidités patrimoniales via une structure d'avance sur la valeur de vente de vos actifs.</p>

      <h2>3. Honoraires et Frais</h2>
      <p>Les frais de structuration de dossier sont dus uniquement en cas de succès de l'opération (signature de l'acte authentique). La grille tarifaire est communiquée au client avant toute signature d'un mandat de recherche d'investisseur.</p>

      <h2>4. Faculté de rachat</h2>
      <p>Le contrat de portage garantit au vendeur une faculté de rachat exclusive pour une durée maximale de 24 mois. Les conditions de fixation du prix de rachat sont contractuellement définies lors de la vente initiale.</p>
    </LegalLayout>
  );
}

export function Cookies() {
  return (
    <LegalLayout title="Politique des Cookies" icon={Lock}>
      <h2>1. Qu'est-ce qu'un cookie ?</h2>
      <p>Un cookie est un petit fichier texte stocké sur votre terminal lors de la navigation sur Wallnut.immo.</p>

      <h2>2. Cookies utilisés</h2>
      <ul>
        <li><strong>Cookies techniques :</strong> Indispensables à l'accès sécurisé à votre tableau de bord et au coffre-fort numérique.</li>
        <li><strong>Cookies de mesure d'audience :</strong> Pour optimiser l'ergonomie du simulateur.</li>
        <li><strong>Cookies de session :</strong> Pour maintenir votre connexion lors de la saisie de votre dossier.</li>
      </ul>

      <h2>3. Consentement</h2>
      <p>Conformément aux normes 2026, aucun cookie non technique n'est déposé sans votre consentement exprès via notre bandeau de gestion des préférences.</p>
    </LegalLayout>
  );
}
