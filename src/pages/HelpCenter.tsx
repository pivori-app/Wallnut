import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { PublicHeader } from '../components/PublicHeader';
import { Footer } from '../components/Footer';
import { Search, Book, Shield, Wallet, Scale, LifeBuoy, ArrowRight, ChevronLeft, CheckCircle2 } from 'lucide-react';


export function HelpCenter() {
  const [selectedArticle, setSelectedArticle] = useState<{title: string, category: string, content: React.ReactNode} | null>(null);

  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [selectedArticle]);

  const categories = [
    {
      icon: Wallet,
      title: "Financement & Portage",
      desc: "Tout savoir sur les taux, la LTV et le déblocage des fonds.",
      articles: [
        {
          title: "Comment est calculé le prix de rachat ?",
          content: (
            <div className="space-y-6 text-neutral-dark/80">
              <p>Le prix de rachat est déterminé par deux facteurs principaux : la valeur vénale de votre bien au moment de la transaction initiale et le ratio de financement (Loan-To-Value ou LTV).</p>
              <h3 className="text-xl font-bold text-primary mt-8">1. Expertise indépendante</h3>
              <p>Nous mandatons des experts immobiliers certifiés (RICS ou équivalent) pour déterminer la valeur vénale exacte de votre bien sur le marché actuel.</p>
              <h3 className="text-xl font-bold text-primary mt-8">2. Application de la décote (LTV)</h3>
              <p>Le prix de portage représente généralement entre 60% et 80% de cette valeur vénale. Le prix de rachat final intégrera ce capital initial, augmenté des frais structurés liés au portage (frais d'acquisition, de structuration, et marge de l'investisseur institutionnel).</p>
              <div className="p-4 bg-primary/5 rounded-xl border border-primary/10 mt-6">
                <p className="font-semibold text-primary">Bon à savoir :</p>
                <p className="text-sm mt-2">Vous conservez l'intégralité de la plus-value si vous décidez de revendre le bien sur le marché libre à la place de l'option de rachat direct.</p>
              </div>
            </div>
          )
        },
        {
          title: "Délais de versement des fonds",
          content: (
            <div className="space-y-6 text-neutral-dark/80">
              <p>Notre processus est optimisé pour répondre aux besoins de liquidité immédiate de nos clients, dans le plus strict respect des délais légaux.</p>
              <ul className="space-y-4 my-6">
                <li className="flex gap-4"><CheckCircle2 className="text-secondary shrink-0" /> <div><strong>Évaluation & Offre :</strong> 48h à 72h après réception du dossier complet.</div></li>
                <li className="flex gap-4"><CheckCircle2 className="text-secondary shrink-0" /> <div><strong>Signature promesse :</strong> Sous 7 à 10 jours chez le notaire.</div></li>
                <li className="flex gap-4"><CheckCircle2 className="text-secondary shrink-0" /> <div><strong>Versement :</strong> Les fonds sont versés par le notaire directement sur votre compte bancaire le jour de la signature de l'acte authentique de vente temporelle.</div></li>
              </ul>
              <p>Globalement, l'opération complète prend environ 3 à 5 semaines, contre 3 à 6 mois pour une vente classique.</p>
            </div>
          )
        },
        {
          title: "L'indemnité d'occupation",
          content: (
            <div className="space-y-6 text-neutral-dark/80">
              <p>Durant toute la période du portage, vous conservez la jouissance de votre bien. Vous n'êtes plus propriétaire juridiquement, mais vous devenez "occupant en titre" grâce à une convention d'occupation signée devant notaire.</p>
              <h3 className="text-xl font-bold text-primary mt-8">Comment est-elle fixée ?</h3>
              <p>L'indemnité d'occupation est l'équivalent d'un loyer de marché. Elle est fixée lors de l'étude du dossier et déduite à l'avance du versement initial, ou payée mensuellement (sous réserve de garanties).</p>
              <p>Elle garantit aux investisseurs institutionnels la rentabilité de leur immobilisation de capital, tout en vous assurant le droit absolu de rester chez vous.</p>
            </div>
          )
        }
      ]
    },
    {
      icon: Scale,
      title: "Juridique & Notarial",
      desc: "Comprendre le cadre légal et les garanties offertes.",
      articles: [
        {
          title: "Le rôle du notaire",
          content: (
            <div className="space-y-6 text-neutral-dark/80">
              <p>Le notaire est l'officier public garantissant la sécurité juridique absolue de la transaction. Chez Wallnut, l'intégralité du processus est encadrée par acte authentique.</p>
              <h3 className="text-xl font-bold text-primary mt-8">Ses interventions :</h3>
              <ul className="space-y-4 my-6">
                <li className="flex gap-4"><CheckCircle2 className="text-secondary shrink-0" /> <div>Validation de la capacité vendeurs et investisseurs.</div></li>
                <li className="flex gap-4"><CheckCircle2 className="text-secondary shrink-0" /> <div>Rédaction et signature de la promesse unilatérale de vente et de la convention d'occupation.</div></li>
                <li className="flex gap-4"><CheckCircle2 className="text-secondary shrink-0" /> <div>Sécurisation des flux financiers de la CARPA.</div></li>
              </ul>
              <p>Vous avez le libre choix de votre notaire pour vous assister, en concomitance avec l'étude notariale de l'investisseur institutionnel.</p>
            </div>
          )
        },
        {
          title: "Flexibilité de revente",
          content: (
            <div className="space-y-6 text-neutral-dark/80">
              <p>Le portage structuré vous offre le droit exclusif de piloter la vente de votre bien sur le marché libre. Contrairement à une vente à réméré classique, l'objectif principal est la vente du bien à un tiers au prix du marché pour libérer le solde restant. Vous bénéficiez d'une avance sur trésorerie immédiate, sans être contraint à un rachat.</p>
              <div className="p-6 bg-secondary/10 rounded-2xl border border-secondary/20 mt-6">
                <h4 className="font-bold text-primary mb-2">Sécurité maximale</h4>
                <p>L'investisseur institutionnel a l'interdiction formelle de vendre le bien à son initiative sans votre accord pendant la durée du portage. Vous restez maître du calendrier et de la négociation finale.</p>
              </div>
            </div>
          )
        },
        {
          title: "Sécurité des contrats",
          content: (
            <div className="space-y-6 text-neutral-dark/80">
              <p>Les contrats Wallnut ont été modélisés par des cabinets d'avocats d'affaires de premier plan et des études notariales de la place parisienne.</p>
              <p>Ils protègent les deux parties :</p>
              <ul className="list-disc pl-5 mt-4 space-y-2">
                <li>Le <strong>Vendeur</strong> est protégé contre l'éviction et conserve une flexibilité totale quant au dénouement de l'opération (rachat ou cession sur le libre marché).</li>
                <li>L'<strong>Investisseur Institutionnel</strong> bénéficie de la sécurité de l'actif sous-jacent et du cadre strict de la convention d'occupation.</li>
              </ul>
            </div>
          )
        }
      ]
    },
    {
      icon: Shield,
      title: "Sécurité & Confidentialité",
      desc: "Comment Wallnut protège vos données et votre patrimoine.",
      articles: [
        {
          title: "RGPD et discrétion",
          content: (
            <div className="space-y-6 text-neutral-dark/80">
              <p>Le secret professionnel et la confidentialité sont au cœur de l'écosystème Wallnut.</p>
              <p>Contrairement à une saisie immobilière ou une vente classique, l'opération de portage (avance sur vente) chez Wallnut est traitée avec la plus grande discrétion. Aucun panneau "À Vendre" n'est posé, aucune visite publique non sollicitée n'est organisée.</p>
              <p>Conformément au Règlement Général sur la Protection des Données (RGPD), toutes vos informations patrimoniales, fiscales et personnelles sont chiffrées de bout en bout et hébergées sur des serveurs souverains sécurisés. Elles ne sont partagées qu'aux notaires, experts et investisseurs strictement impliqués dans votre dossier.</p>
            </div>
          )
        },
        {
          title: "Vérification des investisseurs",
          content: (
            <div className="space-y-6 text-neutral-dark/80">
              <p>Wallnut agit en tant que tiers de confiance institutionnel. Nous ne travaillons pas avec un public de particuliers ("peer-to-peer"), mais exclusivement avec des professionnels de l'investissement obligataire et immobilier.</p>
              <h3 className="text-xl font-bold text-primary mt-8">Critères d'agrément Wallnut :</h3>
              <ul className="list-disc pl-5 my-4 space-y-2">
                <li>Fonds d'investissement certifiés (AMF)</li>
                <li>Family Offices justifiant des capitaux d'amorçage préalables (KYC/AML strict)</li>
                <li>Aucune dette ne doit être employée par l'investisseur sur l'opération (100% Equity) pour ne porter aucun risque de saisie sur le porteur.</li>
              </ul>
            </div>
          )
        },
        {
          title: "Coffre-fort numérique",
          content: (
            <div className="space-y-6 text-neutral-dark/80">
              <p>Dès votre inscription, Wallnut met à votre disposition (ainsi qu'à vos conseils professionnels si vous êtes accompagné), un Data Room sécurisé.</p>
              <p>Ce coffre-fort numérique permet le dépôt des titres de propriétés, avis d'imposition, diagnostics techniques, contrats de préts, et permet de centraliser la communication avec les experts, sans risquer de compromissions liées à des échanges d'emails non sécurisés.</p>
            </div>
          )
        }
      ]
    },
    {
      icon: Book,
      title: "Guides Pratiques",
      desc: "Accompagnement pas à pas pour votre dossier.",
      articles: [
        {
          title: "Pièces justificatives requises",
          content: (
            <div className="space-y-6 text-neutral-dark/80">
              <p>Afin de proposer votre dossier au comité d'investissement, voici les pièces obligatoires à réunir dans votre espace sécurisé :</p>
              
              <div className="space-y-6 mt-6">
                <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-sm">
                  <h4 className="font-bold text-primary mb-3">1. Documents Personnels</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Pièce d'identité en cours de validité (recto-verso)</li>
                    <li>Livret de famille et contrat de mariage éventuel</li>
                    <li>Copie des 2 derniers avis d'imposition</li>
                  </ul>
                </div>

                <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-sm">
                  <h4 className="font-bold text-primary mb-3">2. Documents Immobiliers</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Titre de propriété intégral de moins de 10 ans</li>
                    <li>Dernier avis de taxe foncière</li>
                    <li>Dossier de Diagnostic Technique (DDT) récent ou en cours de validité</li>
                    <li>Si copropriété : 3 derniers PV d'AG, carnet d'entretien, relevé de charges</li>
                  </ul>
                </div>

                <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-sm">
                  <h4 className="font-bold text-primary mb-3">3. Situation Financière</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Tableau d'amortissement détaillé pour le prêt lié au bien</li>
                    <li>Décomptes de remboursement anticipé (si fichage FICP, commandement de payer...)</li>
                  </ul>
                </div>
              </div>
            </div>
          )
        },
        {
          title: "Utiliser le simulateur",
          content: (
            <div className="space-y-6 text-neutral-dark/80">
              <p>Le simulateur Wallnut offre une estimation en temps réel des montants finançables au travers d'une opération de portage.</p>
              <ol className="list-decimal pl-5 mt-4 space-y-3">
                <li><strong>Valeur du bien :</strong> Indiquez la valeur estimée. Le moteur retiendra ce montant pour structurer l'enveloppe brute.</li>
                <li><strong>Besoin financier ou dettes actuelles :</strong> Déclarez le capital restant dû, afin de vérifier que la soulte finale soit suffisante pour assainir votre situation.</li>
                <li><strong>L'algorithme</strong> vous indique instantanément l'éligibilité (le besoin ne doit généralement pas dépasser 60% de la valeur) et le versement comptant net immédiat.</li>
              </ol>
            </div>
          )
        },
        {
          title: "Suivre son dossier",
          content: (
            <div className="space-y-6 text-neutral-dark/80">
              <p>Transparence et réactivité. Votre tableau de bord affiche en temps réel :</p>
              <ul className="space-y-4 my-6">
                <li className="flex gap-4"><CheckCircle2 className="text-green-500 shrink-0" /> <div><strong>Étape 1 : Contrôle de conformité</strong> - Vérification des pièces déposées.</div></li>
                <li className="flex gap-4"><CheckCircle2 className="text-amber-500 shrink-0" /> <div><strong>Étape 2 : Comité de validation</strong> - Analyse des experts.</div></li>
                <li className="flex gap-4"><CheckCircle2 className="text-secondary shrink-0" /> <div><strong>Étape 3 : Offre officielle</strong> - Proposition contractuelle ferme de l'investisseur.</div></li>
                <li className="flex gap-4"><CheckCircle2 className="text-primary shrink-0" /> <div><strong>Étape 4 : Acte authentique</strong> - Planification chez les notaires.</div></li>
              </ul>
              <p>Vous êtes notifié par email à chaque avancement, et bénéficiez en permanence d'un interlocuteur dédié (analyste et juriste).</p>
            </div>
          )
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <PublicHeader />
      
      <main className="pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          
          <AnimatePresence mode="wait">
            {!selectedArticle ? (
              <motion.div
                key="help-home"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, y: -20 }}
              >
                {/* Header */}
                <div className="text-center mb-16 space-y-8">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest leading-none">
                    <LifeBuoy size={14} /> Centre d'aide Institutionnel
                  </div>
                  <h1 className="text-4xl lg:text-7xl font-display font-bold text-primary">Comment pouvons-nous <span className="text-secondary">vous aider ?</span></h1>
                  
                  {/* Search Bar */}
                  <div className="max-w-2xl mx-auto relative group">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-primary/30 group-focus-within:text-secondary transition-colors" size={24} />
                    <input 
                      type="text" 
                      placeholder="Rechercher un article, un guide (ex: indemnité, rachat)..."
                      className="w-full pl-16 pr-8 py-6 rounded-[2rem] bg-white border border-black/5 shadow-xl shadow-primary/5 focus:ring-4 focus:ring-secondary/10 outline-none transition-all placeholder:text-primary/20"
                    />
                  </div>
                </div>

                {/* Categories Grid */}
                <div className="grid md:grid-cols-2 gap-8 mb-20">
                  {categories.map((cat, idx) => (
                    <motion.div 
                      key={idx}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="glass p-10 rounded-[3rem] border border-black/5 hover:border-secondary/20 transition-all group"
                    >
                      <div className="flex items-start gap-6">
                        <div className="w-16 h-16 rounded-[1.5rem] bg-primary/5 flex items-center justify-center text-primary group-hover:bg-secondary group-hover:text-white transition-all duration-500">
                          <cat.icon size={32} />
                        </div>
                        <div className="flex-1 space-y-4">
                          <h3 className="text-2xl font-display font-bold text-primary">{cat.title}</h3>
                          <p className="text-neutral-dark/60 leading-relaxed min-h-[48px]">{cat.desc}</p>
                          <ul className="space-y-2 pt-4">
                            {cat.articles.map((art, aIdx) => (
                              <li key={aIdx}>
                                <button 
                                  onClick={() => setSelectedArticle({ title: art.title, category: cat.title, content: art.content })}
                                  className="w-full flex items-center justify-between text-left text-sm font-semibold text-primary/70 hover:text-secondary transition-colors group/link p-3 -mx-3 rounded-xl hover:bg-white"
                                >
                                  {art.title}
                                  <ArrowRight size={16} className="opacity-0 group-hover/link:opacity-100 transition-all -translate-x-2 group-hover/link:translate-x-0" />
                                </button>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Need more help? */}
                <div className="bg-primary rounded-[3rem] p-12 lg:p-20 text-white flex flex-col md:flex-row items-center justify-between gap-12 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/10 blur-[100px] -z-0" />
                  <div className="relative z-10 space-y-4 text-center md:text-left">
                    <h2 className="text-3xl lg:text-5xl font-display font-bold text-white">Toujours des questions ?</h2>
                    <p className="text-white/60 text-lg max-w-lg">Notre équipe d'experts juridiques et financiers est disponible pour vous accompagner personnellement dans l'étude de votre projet.</p>
                  </div>
                  <div className="relative z-10 flex flex-col sm:flex-row gap-4">
                    <Link to="/contact" className="px-10 py-5 rounded-2xl bg-secondary text-white font-bold hover:scale-105 transition-all text-center flex items-center gap-2">
                      <LifeBuoy size={20} />
                      Accompagnement VIP
                    </Link>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="article-view"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="max-w-4xl mx-auto"
              >
                <button 
                  onClick={() => setSelectedArticle(null)}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white border border-slate-200 text-sm font-bold text-primary hover:bg-slate-50 transition-all mb-8 shadow-sm group"
                >
                  <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                  Retour au Centre d'Aide
                </button>
                
                <div className="glass p-10 lg:p-16 rounded-[3rem] border border-black/5 shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-3xl -z-10" />
                  
                  <div className="inline-flex items-center gap-2 text-secondary font-bold text-sm mb-6 uppercase tracking-wider">
                    {selectedArticle.category}
                  </div>
                  
                  <h1 className="text-3xl lg:text-5xl font-display font-bold text-primary mb-10 leading-tight">
                    {selectedArticle.title}
                  </h1>

                  <div className="prose prose-lg prose-slate max-w-none prose-headings:font-display prose-headings:text-primary prose-a:text-secondary hover:prose-a:text-primary transition-colors">
                    {selectedArticle.content}
                  </div>
                </div>

                <div className="mt-12 flex items-center justify-between p-8 bg-white rounded-[2rem] border border-slate-200 shadow-sm">
                  <div className="space-y-1">
                    <p className="font-bold text-primary">Cet article vous a-t-il été utile ?</p>
                    <p className="text-sm text-neutral-dark/60">Notre équipe juridique met à jour le contenu régulièrement.</p>
                  </div>
                  <div className="flex gap-3">
                    <button className="px-6 py-2 rounded-xl border border-slate-200 font-semibold text-primary hover:bg-green-50 hover:text-green-600 hover:border-green-200 transition-all">Oui</button>
                    <button className="px-6 py-2 rounded-xl border border-slate-200 font-semibold text-primary hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all">Non</button>
                  </div>
                </div>

                {/* Related Articles */}
                {selectedArticle && (
                  <div className="mt-16">
                    <h3 className="text-2xl font-display font-bold text-primary mb-6">Dans la même catégorie</h3>
                    <div className="flex overflow-x-auto gap-6 pb-8 snap-x snap-mandatory no-scrollbar">
                      {categories
                        .find(c => c.title === selectedArticle.category)
                        ?.articles.filter(a => a.title !== selectedArticle.title)
                        .map((art, idx) => (
                          <div 
                            key={idx} 
                            onClick={() => setSelectedArticle({ title: art.title, category: selectedArticle.category, content: art.content })}
                            className="min-w-[300px] max-w-[350px] flex-shrink-0 cursor-pointer snap-start"
                          >
                            <div className="glass h-full p-6 rounded-3xl border border-slate-200 hover:border-secondary/30 hover:shadow-xl transition-all group">
                              <h4 className="font-bold text-primary mb-3 group-hover:text-secondary transition-colors">{art.title}</h4>
                              <p className="text-sm text-neutral-dark/60 line-clamp-3">
                                {typeof art.content === 'object' ? 'Découvrez toutes les informations détaillées concernant cette thématique dans notre article complet.' : ''}
                              </p>
                              <div className="mt-6 flex items-center gap-2 text-sm font-bold text-secondary">
                                Lire l'article <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                              </div>
                            </div>
                          </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <Footer />
    </div>
  );
}

