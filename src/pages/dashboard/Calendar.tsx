import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Plus, 
  Video, 
  MapPin, 
  FileWarning, 
  PenTool, 
  Users, 
  Bell, 
  MoreVertical,
  CalendarCheck,
  Building,
  Mail,
  RefreshCw,
  Share2,
  X,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useAuth } from '../../contexts/AuthContext';

// --- Types & Mocks ---
type EventType = 'notary' | 'document' | 'signature' | 'meeting' | 'visit';

interface CalendarEvent {
  id: string;
  type: EventType;
  title: string;
  date: Date;
  time: string;
  property: string;
  attendees: string[];
  status: 'upcoming' | 'completed' | 'cancelled';
  location?: string;
  isSync?: boolean;
}

const EVENT_CONFIG: Record<EventType, { icon: any, color: string, bg: string, label: string }> = {
  notary: { icon: Building, color: 'text-purple-600', bg: 'bg-purple-100 border-purple-200', label: 'RDV Notaire' },
  document: { icon: FileWarning, color: 'text-warning', bg: 'bg-warning/10 border-warning/20', label: 'Pièce Manquante' },
  signature: { icon: PenTool, color: 'text-success', bg: 'bg-success/10 border-success/20', label: 'Signature' },
  meeting: { icon: Users, color: 'text-secondary', bg: 'bg-secondary/10 border-secondary/20', label: 'Point Client' },
  visit: { icon: MapPin, color: 'text-blue-600', bg: 'bg-blue-100 border-blue-200', label: 'Expertise/Visite' },
};

const INITIAL_EVENTS: CalendarEvent[] = [
  {
    id: '1',
    type: 'signature',
    title: 'Signature de la promesse de vente',
    date: new Date(),
    time: '14:30',
    property: '12 Rue des Lilas, Lyon',
    attendees: ['Maitre Dupont (Notaire)', 'Client'],
    status: 'upcoming',
    location: '12 Avenue Notariale, Lyon',
    isSync: true,
  },
  {
    id: '2',
    type: 'document',
    title: 'Relance : DPE manquant',
    date: new Date(new Date().setDate(new Date().getDate() + 1)),
    time: '09:00',
    property: '45 Avenue de la République, Paris',
    attendees: ['Propriétaire'],
    status: 'upcoming',
  },
  {
    id: '3',
    type: 'meeting',
    title: 'Point d\'avancement dossier',
    date: new Date(new Date().setDate(new Date().getDate() + 2)),
    time: '11:15',
    property: 'Bureaux - Part-Dieu',
    attendees: ['Analyste Risque'],
    status: 'upcoming',
    location: 'Google Meet',
    isSync: true,
  }
];

export function Calendar() {
  const { profile } = useAuth();
  const [events, setEvents] = useState<CalendarEvent[]>(INITIAL_EVENTS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'connected'>('idle');

  const handleGoogleSync = () => {
    setSyncStatus('syncing');
    setTimeout(() => {
      setSyncStatus('connected');
    }, 2000);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-display font-bold text-primary">Calendrier & Échéances</h1>
          <p className="text-neutral-dark/60 mt-2 text-lg">Centralisez vos rendez-vous, alertes et échéances notariales.</p>
        </div>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={handleGoogleSync}
            className={cn(
              "px-5 py-3 rounded-xl font-bold flex items-center gap-3 transition-all border",
              syncStatus === 'connected' 
                ? "bg-success/10 text-success border-success/20 cursor-default" 
                : "bg-white/60 text-primary hover:bg-white border-black/10 shadow-sm"
            )}
            disabled={syncStatus !== 'idle'}
          >
            {syncStatus === 'connected' ? (
              <><CheckCircle2 size={20} /> Synchronisé avec Google</>
            ) : syncStatus === 'syncing' ? (
              <><RefreshCw size={20} className="animate-spin" /> Connexion en cours...</>
            ) : (
              <>
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Connecter Google Agenda
              </>
            )}
          </button>

          <button 
            onClick={() => setIsModalOpen(true)}
            className="px-6 py-3 rounded-xl bg-primary text-white font-bold flex items-center gap-2 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
          >
            Nouvelle Alerte <Plus size={20} />
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Calendar View / Agenda */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-2xl font-display font-bold text-primary">À venir</h2>
            <div className="flex gap-2">
              {['Tous', 'Signatures', 'Notaire', 'Alertes'].map(filter => (
                <button key={filter} className="text-xs font-bold px-3 py-1.5 rounded-lg bg-white/40 border border-black/5 hover:bg-white transition-colors text-primary">
                  {filter}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {events.map(event => {
              const config = EVENT_CONFIG[event.type];
              const Icon = config.icon;
              return (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={event.id}
                  className={cn("glass p-6 rounded-[1.5rem] border transition-all hover:shadow-md", config.bg)}
                >
                  <div className="flex flex-col sm:flex-row gap-6">
                    {/* Time Column */}
                    <div className="flex flex-col items-center justify-center shrink-0 min-w-[100px] border-b sm:border-b-0 sm:border-r border-black/10 pb-4 sm:pb-0 sm:pr-6">
                      <span className="text-sm font-bold opacity-60">
                        {event.date.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' })}
                      </span>
                      <span className="text-2xl font-display font-bold text-primary">{event.time}</span>
                      {event.isSync && (
                        <span className="text-[10px] font-bold uppercase tracking-wider text-success mt-2 flex items-center gap-1">
                          <RefreshCw size={10} /> Sync
                        </span>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider mb-2", config.color, "bg-white/60")}>
                            <Icon size={12} /> {config.label}
                          </div>
                          <h3 className="text-lg font-bold text-primary leading-tight">{event.title}</h3>
                        </div>
                        <button className="p-2 hover:bg-black/5 rounded-full transition-colors">
                          <MoreVertical size={20} className="text-primary/40" />
                        </button>
                      </div>

                      <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium text-neutral-dark/80">
                        <div className="flex items-center gap-2">
                          <Building size={16} className="opacity-40" />
                          {event.property}
                        </div>
                        {event.location && (
                          <div className="flex items-center gap-2">
                            <MapPin size={16} className="opacity-40" />
                            {event.location}
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <Users size={16} className="opacity-40" />
                          {event.attendees.join(', ')}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions Footer */}
                  <div className="mt-4 pt-4 border-t border-black/10 flex justify-end gap-3 opacity-0 group-hover:opacity-100 sm:opacity-100 transition-opacity">
                    <button className="px-4 py-2 rounded-xl text-sm font-bold bg-white/60 hover:bg-white text-primary border border-black/5 transition-colors flex items-center gap-2">
                      <RefreshCw size={16} /> Reporter
                    </button>
                    <button className="px-4 py-2 rounded-xl text-sm font-bold bg-white/60 hover:bg-white text-primary border border-black/5 transition-colors flex items-center gap-2">
                      <Share2 size={16} /> Partager
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Sidebar Widgets */}
        <div className="space-y-6">
          <div className="glass p-6 rounded-[2rem] border border-black/5">
            <h3 className="text-lg font-bold text-primary mb-4 flex items-center gap-2">
              <Bell size={20} className="text-secondary" />
              Rappels Automatiques
            </h3>
            <div className="space-y-3">
              <div className="p-4 rounded-xl bg-white/60 border border-black/5 flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center shrink-0">
                  <FileWarning size={16} className="text-secondary" />
                </div>
                <div>
                  <p className="text-sm font-bold text-primary">Relance automatique DPE</p>
                  <p className="text-xs text-neutral-dark/60 mt-0.5">Activé pour "12 Rue des Lilas"</p>
                </div>
                <div className="ml-auto w-10 h-6 bg-secondary/20 rounded-full relative">
                  <div className="w-4 h-4 bg-secondary rounded-full absolute top-1 right-1"></div>
                </div>
              </div>
              
              <div className="p-4 rounded-xl bg-white/60 border border-black/5 flex items-start gap-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 bg-success/10">
                  <Mail size={16} className="text-success" />
                </div>
                <div>
                  <p className="text-sm font-bold text-primary">Confirmation Notaire (J-3)</p>
                  <p className="text-xs text-neutral-dark/60 mt-0.5">Mails de rappel configurés</p>
                </div>
                 <div className="ml-auto w-10 h-6 bg-success/20 rounded-full relative">
                  <div className="w-4 h-4 bg-success rounded-full absolute top-1 right-1"></div>
                </div>
              </div>
            </div>
            <button className="w-full mt-4 py-3 rounded-xl border border-dashed border-primary/20 text-sm font-bold text-primary/60 hover:bg-primary/5 transition-colors flex items-center justify-center gap-2">
              <Plus size={16} /> Ajouter une règle
            </button>
          </div>

           <div className="glass p-6 rounded-[2rem] border border-black/5 bg-gradient-to-b from-primary/5 to-transparent">
             <div className="flex items-center gap-3 mb-2">
               <div className="p-3 bg-white rounded-xl shadow-sm"><CalendarCheck className="text-primary" size={24} /></div>
               <h3 className="font-bold text-primary">Mini-Calendrier</h3>
             </div>
             {/* Simple static representation of a mini-calendar for UI purposes */}
             <div className="mt-4 grid grid-cols-7 gap-1 text-center text-xs font-medium text-neutral-dark/60">
                {['L','M','M','J','V','S','D'].map(d => <div key={d} className="py-2">{d}</div>)}
                {Array.from({length: 31}).map((_, i) => (
                  <div key={i} className={cn("py-2 rounded-lg", i===14 ? "bg-primary text-white font-bold" : i===15 || i===18 ? "bg-secondary/20 text-primary font-bold" : "hover:bg-white/60")}>
                    {i+1}
                  </div>
                ))}
             </div>
           </div>
        </div>
      </div>

      {/* CREATE EVENT MODAL */}
      <AnimatePresence>
        {isModalOpen && <CreateEventModal onClose={() => setIsModalOpen(false)} />}
      </AnimatePresence>
    </div>
  );
}

function CreateEventModal({ onClose }: { onClose: () => void }) {
  const [eventType, setEventType] = useState<EventType>('signature');
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-2xl bg-white rounded-[2rem] shadow-2xl overflow-hidden"
      >
        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-display font-bold text-primary">Programmer un événement</h2>
            <button onClick={onClose} className="p-2 bg-black/5 hover:bg-black/10 rounded-full transition-colors">
              <X size={20} />
            </button>
          </div>

          <div className="space-y-6">
            {/* Type d'événement */}
            <div className="space-y-3">
              <label className="text-sm font-bold text-primary">Type d'alerte / RDV</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                {(Object.keys(EVENT_CONFIG) as EventType[]).map(type => {
                  const config = EVENT_CONFIG[type];
                  const Icon = config.icon;
                  const isSelected = eventType === type;
                  return (
                    <button
                      key={type}
                      onClick={() => setEventType(type)}
                      className={cn(
                        "p-3 rounded-xl flex flex-col items-center justify-center gap-2 text-xs font-bold transition-all border text-center h-24",
                        isSelected ? "bg-primary text-white border-primary shadow-md" : "bg-neutral-50 border-neutral-200 text-neutral-600 hover:border-primary/40"
                      )}
                    >
                      <Icon size={24} className={isSelected ? "text-white" : config.color} />
                      {config.label}
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-bold text-primary">Titre de l'événement</label>
              <input type="text" placeholder="Ex: Signature Compromis..." defaultValue={EVENT_CONFIG[eventType].label} className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all font-medium" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <label className="text-sm font-bold text-primary">Date</label>
                <div className="relative">
                  <CalendarIcon size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <input type="date" className="w-full bg-neutral-50 border border-neutral-200 rounded-xl pl-12 pr-4 py-3 outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all font-medium" />
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-sm font-bold text-primary">Heure</label>
                <div className="relative">
                  <Clock size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <input type="time" className="w-full bg-neutral-50 border border-neutral-200 rounded-xl pl-12 pr-4 py-3 outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all font-medium" />
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-bold text-primary">Bien concerné (Optionnel)</label>
              <div className="relative">
                <Building size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
                <select className="w-full bg-neutral-50 border border-neutral-200 rounded-xl pl-12 pr-4 py-3 outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all font-medium appearance-none">
                  <option value="">Sélectionner une fiche bien...</option>
                  <option value="1">12 Rue des Lilas, Lyon</option>
                  <option value="2">45 Avenue de la République, Paris</option>
                </select>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-bold text-primary">Partager l'événement (Notifications)</label>
              <div className="relative">
                <Mail size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input type="text" placeholder="Adresses emails (séparées par une virgule)..." className="w-full bg-neutral-50 border border-neutral-200 rounded-xl pl-12 pr-4 py-3 outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all font-medium" />
              </div>
            </div>
            
            <label className="flex items-center gap-3 cursor-pointer p-4 rounded-xl bg-blue-50/50 border border-blue-100">
               <input type="checkbox" defaultChecked className="w-5 h-5 rounded border-blue-200 text-blue-600 focus:ring-blue-500" />
               <span className="text-sm font-medium text-blue-900">Synchroniser avec mon calendrier par défaut (Google Workspace)</span>
            </label>

          </div>

          <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-black/5">
            <button onClick={onClose} className="px-6 py-3 rounded-xl font-bold bg-neutral-100 text-neutral-600 hover:bg-neutral-200 transition-all">
              Annuler
            </button>
            <button onClick={onClose} className="px-8 py-3 rounded-xl font-bold bg-primary text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center gap-2">
              <CheckCircle2 size={20} /> Valider l'alerte
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
