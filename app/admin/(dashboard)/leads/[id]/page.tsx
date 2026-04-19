import { createClient } from '@/lib/supabase/server';
import { updateLeadStatus, saveLeadNotes, deleteLead } from '@/app/admin/actions';
import { 
  ArrowLeft, 
  User, 
  Phone, 
  Mail, 
  MessageSquare, 
  Calendar,
  Clock,
  Package,
  History,
  Send,
  CheckCircle,
  XCircle,
  ExternalLink,
  Trash2
} from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export default async function LeadDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createClient();
  const { data: lead } = await supabase.from('leads').select('*').eq('id', params.id).single();

  if (!lead) {
    redirect('/admin/leads');
  }

  const statuses = [
    { label: 'Nouveau', value: 'nouveau' },
    { label: 'Contacté', value: 'contacté' },
    { label: 'Devis envoyé', value: 'devis_envoyé' },
    { label: 'Converti', value: 'converti' },
    { label: 'Archivé', value: 'archivé' },
  ];

  return (
    <div className="space-y-6 max-w-5xl">
      <Link 
        href="/admin/leads" 
        className="flex items-center text-white/40 hover:text-white transition-colors text-sm font-bold uppercase tracking-widest group"
      >
        <ArrowLeft size={16} className="mr-2 group-hover:-translate-x-1 transition-transform" />
        Retour aux demandes
      </Link>

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <h2 className="text-4xl font-bold font-['Bebas_Neue'] tracking-wide">{lead.name}</h2>
          <div className="flex items-center space-x-4 mt-2">
            <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider ${
              lead.status === 'nouveau' ? 'bg-[#E8420A]/20 text-[#E8420A]' : 'bg-white/10 text-white/60'
            }`}>
              {lead.status.replace('_', ' ')}
            </span>
            <span className="text-white/20 text-xs flex items-center">
              <Calendar size={12} className="mr-1" />
              Reçu le {new Date(lead.created_at).toLocaleDateString('fr-FR')} à {new Date(lead.created_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <form action={async () => { 'use server'; await updateLeadStatus(lead.id, 'archivé'); }}>
            <button className="px-4 py-2 border border-white/10 rounded font-bold uppercase text-[11px] tracking-widest hover:bg-white/5 transition-colors">
              Archiver
            </button>
          </form>
          <form action={async () => { 'use server'; await updateLeadStatus(lead.id, 'converti'); }}>
            <button className="px-4 py-2 bg-[#E8420A] text-white rounded font-bold uppercase text-[11px] tracking-widest hover:bg-[#FF5522] transition-colors flex items-center">
              <Send size={14} className="mr-2" />
              Marquer comme Converti
            </button>
          </form>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-8">
          <section className="bg-[#1e1e1e] border border-white/10 rounded-xl overflow-hidden p-6 space-y-6">
            <h3 className="text-sm font-bold uppercase tracking-widest text-[#E8420A] border-b border-white/5 pb-4">
              Détails du Lead
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <InfoItem icon={<User />} label="Nom du client" value={lead.name} />
              <InfoItem icon={<Phone />} label="Téléphone" value={lead.phone} hasCopy link={`tel:${lead.phone}`} />
              <InfoItem icon={<Mail />} label="Email" value={lead.email || 'Non renseigné'} hasCopy link={lead.email ? `mailto:${lead.email}` : undefined} />
              <InfoItem icon={<Package />} label="Produit souhaité" value={lead.product_type || 'Général'} />
            </div>

            <div className="space-y-2 mt-8">
              <label className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] flex items-center">
                <MessageSquare size={12} className="mr-2" /> Message du client
              </label>
              <div className="bg-[#0e0e0e] border border-white/5 p-4 rounded-lg text-white/80 text-sm leading-relaxed min-h-[100px]">
                {lead.message || "Aucun message spécifique n'a été laissé."}
              </div>
            </div>
          </section>

          {/* Internal Notes */}
          <section className="bg-[#1e1e1e] border border-white/10 rounded-xl overflow-hidden p-6 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-widest text-white/60">Notes Internes</h3>
            <form action={async (formData) => { 'use server'; await saveLeadNotes(lead.id, formData.get('notes') as string); }}>
              <textarea 
                name="notes"
                className="w-full bg-[#0e0e0e] border border-white/10 rounded-lg p-4 text-sm focus:border-[#E8420A] outline-none transition-colors min-h-[120px]"
                placeholder="Ajouter une note pour le suivi de ce client..."
                defaultValue={lead.internal_notes || ''}
              ></textarea>
              <div className="flex justify-end mt-4">
                <button type="submit" className="bg-white/5 hover:bg-white/10 px-4 py-2 rounded text-xs font-bold uppercase tracking-widest transition-colors">
                  Enregistrer la note
                </button>
              </div>
            </form>
          </section>
        </div>

        {/* Status Path & Quick Actions */}
        <div className="space-y-6">
          <section className="bg-[#1e1e1e] border border-white/10 rounded-xl p-6">
            <h3 className="text-sm font-bold uppercase tracking-widest text-white/60 mb-6">Changer le Statut</h3>
            <div className="space-y-3">
              {statuses.map((status) => (
                <form key={status.value} action={async () => { 'use server'; await updateLeadStatus(lead.id, status.value); }}>
                  <button 
                    type="submit"
                    className={`w-full flex items-center justify-between p-3 rounded text-xs font-bold uppercase tracking-widest transition-all ${
                      lead.status === status.value 
                        ? 'bg-[#E8420A] text-white' 
                        : 'bg-white/5 text-white/30 hover:bg-white/10'
                    }`}
                  >
                    {status.label}
                    {lead.status === status.value && <CheckCircle size={14} />}
                  </button>
                </form>
              ))}
            </div>
          </section>

          <section className="bg-[#1e1e1e] border border-white/10 rounded-xl p-6">
            <h3 className="text-sm font-bold uppercase tracking-widest text-white/60 mb-4">Actions Rapides</h3>
            <div className="grid grid-cols-1 gap-3">
              <a 
                href={`https://wa.me/${lead.phone.replace(/\D/g, '')}`} 
                target="_blank"
                className="flex items-center justify-center space-x-2 py-3 bg-[#25D366]/10 text-[#25D366] rounded text-[10px] font-bold uppercase tracking-widest hover:bg-[#25D366]/20 transition-colors"
              >
                <MessageSquare size={14} />
                <span>Contacter sur WhatsApp</span>
              </a>
              <form action={async () => { 'use server'; await deleteLead(lead.id); }} onSubmit={(e) => { if(!confirm('Supprimer ce lead ?')) e.preventDefault(); }}>
                <button className="w-full flex items-center justify-center space-x-2 py-3 bg-red-500/10 text-red-500 rounded text-[10px] font-bold uppercase tracking-widest hover:bg-red-500/20 transition-colors">
                  <Trash2 size={14} />
                  <span>Supprimer de la base</span>
                </button>
              </form>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function InfoItem({ icon, label, value, hasCopy, link }: { icon: React.ReactNode, label: string, value: string, hasCopy?: boolean, link?: string }) {
  const content = (
    <div className="group">
      <div className="flex items-center text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mb-1.5">
        <span className="mr-2 text-white/20">{icon}</span>
        {label}
      </div>
      <div className={`text-sm font-medium ${link ? 'text-[#E8420A] hover:underline' : 'text-white'}`}>
        {value}
      </div>
    </div>
  );

  if (link) {
    return <a href={link} className="block">{content}</a>;
  }

  return content;
}
