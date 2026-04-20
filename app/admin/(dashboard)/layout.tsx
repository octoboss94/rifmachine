import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { 
  LayoutDashboard, 
  Users, 
  Settings, 
  LogOut, 
  Menu
} from 'lucide-react';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();
  await supabase.auth.getSession();

  // We rely on middleware for redirection. 
  // If we are on the login page, we don't want to show the sidebar/layout.
  // We can handle this by checking if we're in a 'protected' state.
  return (
    <div className="min-h-screen bg-[#0e0e0e] text-white flex font-sans">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/10 hidden md:flex flex-col">
        <div className="p-6 border-b border-white/10">
          <h1 className="text-2xl font-bold uppercase tracking-wider font-['Bebas_Neue']">
            Rif <span className="text-[#E8420A]">Machine</span>
          </h1>
          <p className="text-[10px] text-white/40 uppercase tracking-[0.2em] mt-1">Console Admin</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <Link href="/admin/dashboard" className="flex items-center space-x-3 p-3 rounded hover:bg-white/5 transition-colors text-white/70 hover:text-white">
            <LayoutDashboard size={20} />
            <span className="text-sm font-medium">Tableau de bord</span>
          </Link>
          <Link href="/admin/leads" className="flex items-center space-x-3 p-3 rounded hover:bg-white/5 transition-colors text-white/70 hover:text-white">
            <Users size={20} />
            <span className="text-sm font-medium">Demandes (Leads)</span>
          </Link>
          <Link href="/admin/settings" className="flex items-center space-x-3 p-3 rounded hover:bg-white/5 transition-colors text-white/70 hover:text-white">
            <Settings size={20} />
            <span className="text-sm font-medium">Paramètres Site</span>
          </Link>
        </nav>

        <div className="p-4 border-t border-white/10">
          <form action="/api/auth/signout" method="post">
            <button className="flex items-center space-x-3 p-3 w-full rounded hover:bg-red-500/10 text-red-400 transition-colors">
              <LogOut size={20} />
              <span className="text-sm font-medium">Déconnexion</span>
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden p-4 border-b border-white/10 flex items-center justify-between">
          <h1 className="text-lg font-bold uppercase tracking-wider font-['Bebas_Neue']">
            Rif <span className="text-[#E8420A]">Admin</span>
          </h1>
          <button className="p-2 hover:bg-white/5 rounded">
            <Menu size={24} />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
