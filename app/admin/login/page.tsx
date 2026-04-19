"use client";

import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError("Email ou mot de passe incorrect");
      setLoading(false);
    } else {
      router.push('/admin/dashboard');
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0e0e0e] font-sans">
      <div className="bg-[#1e1e1e] p-8 rounded-lg border border-white/10 w-full max-w-md shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-[#E8420A]"></div>
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white uppercase tracking-wider mb-2 font-['Bebas_Neue']">Rif <span className="text-[#E8420A]">Machine</span></h1>
          <p className="text-white/40 text-sm uppercase tracking-widest">Espace Administrateur</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          {error && <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-sm p-3 rounded">{error}</div>}
          
          <div>
            <label className="block text-xs font-medium text-white/50 uppercase tracking-wider mb-2">Email</label>
            <input
              type="email"
              required
              className="w-full bg-white/5 border border-white/10 text-white p-3 rounded focus:border-[#E8420A] focus:outline-none focus:ring-1 focus:ring-[#E8420A] transition-all"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-white/50 uppercase tracking-wider mb-2">Mot de passe</label>
            <input
              type="password"
              required
              className="w-full bg-white/5 border border-white/10 text-white p-3 rounded focus:border-[#E8420A] focus:outline-none focus:ring-1 focus:ring-[#E8420A] transition-all"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#E8420A] text-white font-bold uppercase tracking-wider p-3 rounded hover:bg-[#FF5522] transition-colors disabled:opacity-50"
            style={{ clipPath: 'polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)' }}
          >
            {loading ? 'Connexion en cours...' : 'Connexion'}
          </button>
        </form>
      </div>
    </div>
  );
}
