import { createClient } from '@/lib/supabase/server';
import { updateSiteSettings } from '@/app/admin/actions';
import { 
  Save, 
  MapPin, 
  Phone, 
  Mail, 
  MessageSquare,
  Globe
} from 'lucide-react';

export default async function SettingsPage() {
  const supabase = createClient();
  const { data: settings } = await supabase.from('settings').select('*').eq('id', 1).single();

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h2 className="text-3xl font-bold font-['Bebas_Neue'] tracking-wide">Paramètres du Site</h2>
        <p className="text-white/50 text-sm">Gérez les informations de contact et les liens sociaux de votre site.</p>
      </div>

      <form action={updateSiteSettings} className="space-y-6">
        {/* Contact Information */}
        <section className="bg-[#1e1e1e] border border-white/10 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-white/10 bg-white/5">
            <h3 className="text-sm font-bold uppercase tracking-widest flex items-center">
              <Phone size={16} className="mr-2 text-[#E8420A]" />
              Coordonnées de Contact
            </h3>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-white/40 uppercase tracking-wider">Téléphone Principal</label>
              <input 
                name="phone"
                type="text" 
                defaultValue={settings?.phone || ''}
                className="w-full bg-[#0e0e0e] border border-white/10 rounded-md py-2.5 px-4 text-sm focus:border-[#E8420A] outline-none transition-colors"
                placeholder="+212 5XX XXX XXX"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-white/40 uppercase tracking-wider">WhatsApp</label>
              <input 
                name="whatsapp"
                type="text" 
                defaultValue={settings?.whatsapp || ''}
                className="w-full bg-[#0e0e0e] border border-white/10 rounded-md py-2.5 px-4 text-sm focus:border-[#E8420A] outline-none transition-colors"
                placeholder="+212 6XX XXX XXX"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-white/40 uppercase tracking-wider">Email de Contact</label>
              <input 
                name="email"
                type="email" 
                defaultValue={settings?.email || ''}
                className="w-full bg-[#0e0e0e] border border-white/10 rounded-md py-2.5 px-4 text-sm focus:border-[#E8420A] outline-none transition-colors"
                placeholder="contact@rifmachine.ma"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-white/40 uppercase tracking-wider">Adresse</label>
              <textarea 
                name="address"
                defaultValue={settings?.address || ''}
                className="w-full bg-[#0e0e0e] border border-white/10 rounded-md py-2.5 px-4 text-sm focus:border-[#E8420A] outline-none transition-colors h-24"
                placeholder="Zone Industrielle, Casablanca"
              />
            </div>
          </div>
        </section>

        {/* Social Links */}
        <section className="bg-[#1e1e1e] border border-white/10 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-white/10 bg-white/5">
            <h3 className="text-sm font-bold uppercase tracking-widest flex items-center">
              <Globe size={16} className="mr-2 text-[#E8420A]" />
              Réseaux Sociaux
            </h3>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-white/40 uppercase tracking-wider flex items-center">
                Facebook URL
              </label>
              <input 
                name="facebook_url"
                type="url" 
                defaultValue={settings?.facebook_url || ''}
                className="w-full bg-[#0e0e0e] border border-white/10 rounded-md py-2.5 px-4 text-sm focus:border-[#E8420A] outline-none transition-colors"
                placeholder="https://facebook.com/rifmachine"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-white/40 uppercase tracking-wider flex items-center">
                Instagram URL
              </label>
              <input 
                name="instagram_url"
                type="url" 
                defaultValue={settings?.instagram_url || ''}
                className="w-full bg-[#0e0e0e] border border-white/10 rounded-md py-2.5 px-4 text-sm focus:border-[#E8420A] outline-none transition-colors"
                placeholder="https://instagram.com/rifmachine"
              />
            </div>
          </div>
        </section>

        <div className="flex justify-end">
          <button 
            type="submit"
            className="bg-[#E8420A] text-white px-8 py-3 rounded font-bold uppercase text-xs tracking-widest flex items-center space-x-2 hover:bg-[#FF5522] transition-colors"
          >
            <Save size={18} />
            <span>Enregistrer les modifications</span>
          </button>
        </div>
      </form>
    </div>
  );
}
