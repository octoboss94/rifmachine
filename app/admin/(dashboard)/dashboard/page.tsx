import { createClient } from '@/lib/supabase/server';
import { 
  TrendingUp, 
  Users, 
  MessageSquare, 
  Clock,
  ArrowUpRight,
  Plus
} from 'lucide-react';
import { LeadChart } from '@/app/components/LeadChart';
import Link from 'next/link';

export default async function DashboardPage() {
  const supabase = createClient();

  // Get stats
  const { data: leads } = await supabase.from('leads').select('*').order('created_at', { ascending: false });
  const totalLeads = leads?.length || 0;
  const newLeads = leads?.filter(l => l.status === 'nouveau').length || 0;
  const convertedLeads = leads?.filter(l => l.status === 'converti').length || 0;
  const conversionRate = totalLeads > 0 ? ((convertedLeads / totalLeads) * 100).toFixed(1) : 0;

  // Recent leads
  const recentLeads = leads?.slice(0, 5) || [];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold font-['Bebas_Neue'] tracking-wide">Tableau de bord</h2>
          <p className="text-white/50 text-sm">Aperçu des performances et des demandes récentes.</p>
        </div>
        <button className="bg-[#E8420A] text-white px-4 py-2 rounded font-bold uppercase text-xs tracking-widest flex items-center space-x-2">
          <Plus size={16} />
          <span>Nouveau Lead</span>
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Demandes" 
          value={totalLeads.toString()} 
          icon={<MessageSquare className="text-blue-500" />} 
          trend="+12%"
        />
        <StatCard 
          title="Nouveaux Leads" 
          value={newLeads.toString()} 
          icon={<Clock className="text-orange-500" />} 
          trend="Réponse rapide"
        />
        <StatCard 
          title="Clients Convertis" 
          value={convertedLeads.toString()} 
          icon={<Users className="text-green-500" />} 
          trend="+5%"
        />
        <StatCard 
          title="Taux de Conversion" 
          value={`${conversionRate}%`} 
          icon={<TrendingUp className="text-purple-500" />} 
          trend="Stable"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chart */}
        <div className="lg:col-span-2 bg-[#1e1e1e] border border-white/10 rounded-xl p-6">
          <h3 className="text-lg font-bold mb-6 flex items-center justify-between">
            Flux de demandes (7 derniers jours)
            <span className="text-xs font-normal text-white/40 uppercase tracking-widest">Temps réel</span>
          </h3>
          <div className="h-[300px] w-full">
            {/* We will implement the chart component locally */}
            <LeadChart data={leads || []} />
          </div>
        </div>

        {/* Recent Leads */}
        <div className="bg-[#1e1e1e] border border-white/10 rounded-xl p-6">
          <h3 className="text-lg font-bold mb-6">Demandes Récentes</h3>
          <div className="space-y-4">
            {recentLeads.map((lead) => (
              <div key={lead.id} className="flex items-center justify-between p-3 rounded bg-white/5 hover:bg-white/10 transition-colors cursor-pointer border border-transparent hover:border-[#E8420A]/20">
                <div>
                  <p className="font-bold text-sm">{lead.name}</p>
                  <p className="text-xs text-white/40">{lead.product_type || 'Général'}</p>
                </div>
                <div className="text-right">
                  <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded ${
                    lead.status === 'nouveau' ? 'bg-[#E8420A]/20 text-[#E8420A]' : 'bg-white/10 text-white/60'
                  }`}>
                    {lead.status}
                  </span>
                  <p className="text-[9px] text-white/20 mt-1">
                    {new Date(lead.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
            {recentLeads.length === 0 && (
              <p className="text-center text-white/20 py-8 italic">Aucune demande reçue</p>
            )}
          </div>
          <Link href="/admin/leads" className="block w-full text-center py-3 mt-6 text-xs font-bold uppercase tracking-widest text-white/40 hover:text-[#E8420A] transition-colors">
            Voir tout
          </Link>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, trend }: { title: string, value: string, icon: React.ReactNode, trend: string }) {
  return (
    <div className="bg-[#1e1e1e] border border-white/10 rounded-xl p-6 group hover:border-[#E8420A]/50 transition-all">
      <div className="flex items-center justify-between mb-4">
        <div className="p-3 bg-white/5 rounded-lg group-hover:bg-[#E8420A]/10 transition-colors">
          {icon}
        </div>
        <span className="text-[10px] font-bold text-green-500 bg-green-500/10 px-2 py-1 rounded">
          {trend}
        </span>
      </div>
      <p className="text-white/40 text-xs uppercase tracking-widest font-medium mb-1">{title}</p>
      <div className="flex items-center justify-between">
        <h4 className="text-2xl font-bold">{value}</h4>
        <ArrowUpRight size={16} className="text-white/10 group-hover:text-[#E8420A] transition-colors" />
      </div>
    </div>
  );
}
