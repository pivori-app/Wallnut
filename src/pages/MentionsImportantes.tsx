import React from 'react';
import { PublicHeader } from '../components/PublicHeader';
import { Footer } from '../components/Footer';

export function MentionsImportantes() {
  return (
    <div className="min-h-screen bg-slate-50">
      <PublicHeader />
      
      <main className="pt-32 pb-24">
        <section className="max-w-4xl mx-auto px-4 lg:px-8 space-y-12">
          <div className="text-center space-y-6 mb-16">
            <h1 className="text-app-3xl lg:text-5xl font-display font-bold text-primary">
              Mentions <span className="text-secondary">Importantes</span>
            </h1>
            <p className="text-app-lg text-neutral-dark/60">
              Avertissements et cadre juridique liés à l'offre Wallnut.
            </p>
          </div>

          <div className="bg-white p-8 md:p-12 rounded-3xl border border-slate-200 shadow-sm space-y-8 text-neutral-dark/80 leading-relaxed">
            <div>
              <h2 className="text-xl font-bold text-primary mb-4">1. Information indicative</h2>
              <p>
                Les simulations et offres préliminaires fournies par WALLNUT ont une valeur strictement indicative. Elles ne constituent en aucun cas un engagement d'achat ferme et définitif avant la signature des actes authentiques chez le notaire.
              </p>
            </div>
            
            <div>
              <h2 className="text-xl font-bold text-primary mb-4">2. Pas de crédit</h2>
              <p>
                WALLNUT n'est ni un établissement bancaire, ni un organisme de crédit, ni un intermédiaire en financement participatif. Les opérations proposées (portage immobilier) reposent exclusivement sur des ventes immobilières avec faculté de rachat.
              </p>
            </div>
            
            <div>
              <h2 className="text-xl font-bold text-primary mb-4">3. Sous réserves</h2>
              <p>
                Toute intervention ou accord de principe est systématiquement soumis aux conditions suivantes : accord du comité d'investissement, validation de la valeur métrique du bien par la contre-expertise et conformité juridique de l'actif actée par nos notaires partenaires.
              </p>
            </div>
            
            <div>
              <h2 className="text-xl font-bold text-primary mb-4">4. Acte définitif</h2>
              <p>
                Le transfert de liquidité n'intervient qu'une fois la vente finalisée par acte authentique notarié, selon les procédures et délais légaux incompressibles.
              </p>
            </div>
            
            <div>
              <h2 className="text-xl font-bold text-primary mb-4">5. Complément de prix</h2>
              <p>
                Le complément de prix potentiel reversé lors de la vente du bien à un tiers dépend exclusivement des conditions de marché et du prix obtenu à la revente. Il ne saurait être garanti à 100%.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
