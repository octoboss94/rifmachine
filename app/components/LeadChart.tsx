"use client";

import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { format, subDays, isSameDay } from 'date-fns';
import { fr } from 'date-fns/locale';

interface Lead {
  created_at: string;
}

export function LeadChart({ data }: { data: Lead[] }) {
  // Process data for the last 7 days
  const chartData = Array.from({ length: 7 }).map((_, i) => {
    const date = subDays(new Date(), 6 - i);
    const count = data.filter(lead => isSameDay(new Date(lead.created_at), date)).length;
    return {
      name: format(date, 'EEE', { locale: fr }),
      leads: count,
    };
  });

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={chartData}>
        <defs>
          <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#E8420A" stopOpacity={0.3}/>
            <stop offset="95%" stopColor="#E8420A" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
        <XAxis 
          dataKey="name" 
          axisLine={false} 
          tickLine={false} 
          tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 12 }} 
          dy={10}
        />
        <YAxis 
          axisLine={false} 
          tickLine={false} 
          tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 12 }} 
        />
        <Tooltip 
          contentStyle={{ backgroundColor: '#1e1e1e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
          itemStyle={{ color: '#E8420A' }}
        />
        <Area 
          type="monotone" 
          dataKey="leads" 
          stroke="#E8420A" 
          strokeWidth={3}
          fillOpacity={1} 
          fill="url(#colorLeads)" 
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
