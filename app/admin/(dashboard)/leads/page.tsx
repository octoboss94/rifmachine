import { createClient } from '@/lib/supabase/server';
import { 
  Search, 
  Filter, 
  MoreVertical, 
  Eye,
  Mail,
  PhoneCall,
  Calendar
} from 'lucide-react';
import Link from 'next/link';

export default async function LeadsPage({
  searchParams,
}: {
  searchParams: { status?: string; q?: string };
}) {
  const supabase = createClient();
  
  let query = supabase.from('leads').select('*').order('created_at', { ascending: false });

  if (searchParams.status) {
    query = query.eq('status', searchParams.status);
  }

  const { data: leads } = await query;

  const statuses = [
    { label: 'Tous', value: '' },
    { label: 'Nouveau', value: 'nouveau' },
    { label: 'Contacté', value: 'contacté' },
    { label: 'Devis envoyé', value: 'devis_envoyé' },
    { label: 'Converti', value: 'converti' },
    { label: 'Archivé', value: 'archivé' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold font-['Bebas_Neue'] tracking-wide">Gestion des Demandes</h2>
          <p className="text-white/50 text-sm">Consultez et gérez vos leads entrants.</p>
        </div>
        
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 md:pb-0">
          {statuses.map((s) => (
            <Link
              key={s.label}
              href={`/admin/leads${s.value ? `?status=${s.value}` : ''}`}
              className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${
                (searchParams.status || '') === s.value
                  ? 'bg-[#E8420A] text-white'
                  : 'bg-white/5 text-white/40 hover:bg-white/10'
              }`}
            >
              {s.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-4 items-center bg-[#1e1e1e] p-4 rounded-lg border border-white/10">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" size={18} />
          <input 
            type="text" 
            placeholder="Rechercher par nom, email ou téléphone..." 
            className="w-full bg-[#0e0e0e] border border-white/10 rounded-md py-2 pl-10 pr-4 text-sm focus:border-[#E8420A] outline-none transition-colors"
          />
        </div>
        <button className="flex items-center space-x-2 px-4 py-2 bg-white/5 rounded-md text-sm hover:bg-white/10 transition-colors w-full md:w-auto justify-center">
          <Filter size={16} />
          <span>Filtres avancés</span>
        </button>
      </div>

      {/* Leads Table */}
      <div className="bg-[#1e1e1e] border border-white/10 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#0e0e0e] border-b border-white/10 text-white/40 uppercase text-[10px] tracking-widest font-bold">
              <tr>
                <th className="px-6 py-4">Client</th>
                <th className="px-6 py-4">Produit</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Statut</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {leads?.map((lead) => (
                <tr key={lead.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-white mb-0.5">{lead.name}</span>
                      <div className="flex items-center space-x-3 text-[11px] text-white/40">
                        <span className="flex items-center"><PhoneCall size={10} className="mr-1" /> {lead.phone}</span>
                        {lead.email && <span className="flex items-center"><Mail size={10} className="mr-1" /> {lead.email}</span>}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-white/80">{lead.product_type || 'Non spécifié'}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center text-white/40">
                      <Calendar size={12} className="mr-2" />
                      {new Date(lead.created_at).toLocaleDateString('fr-FR')}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={lead.status} />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <Link 
                        href={`/admin/leads/${lead.id}`}
                        className="p-2 hover:bg-[#E8420A]/10 hover:text-[#E8420A] rounded transition-colors text-white/40"
                      >
                        <Eye size={18} />
                      </Link>
                      <button className="p-2 hover:bg-white/10 rounded transition-colors text-white/40">
                        <MoreVertical size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {leads?.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-white/20 italic">
                    Aucune demande trouvée.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    nouveau: 'bg-[#E8420A]/10 text-[#E8420A]',
    contacté: 'bg-blue-500/10 text-blue-400',
    devis_envoyé: 'bg-purple-500/10 text-purple-400',
    converti: 'bg-green-500/10 text-green-400',
    archivé: 'bg-white/10 text-white/40',
  };

  return (
    <span className={`px-2 py-1 rounded text-[10px] uppercase font-bold tracking-wider ${styles[status] || styles.nouveau}`}>
      {status.replace('_', ' ')}
    </span>
  );
}
