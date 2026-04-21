import { createClient } from '@/lib/supabase/server';
import AboutPage from '../components/AboutPage';

export const metadata = {
  title: 'À Propos | Rif Machine',
  description: 'Découvrez l\'histoire et les valeurs de Rif Machine, votre partenaire de confiance en construction à Casablanca.',
};

export default async function Page() {
  const supabase = createClient();
  
  // Fetch site settings
  const { data: settings } = await supabase
    .from('settings')
    .select('*')
    .eq('id', 1)
    .single();

  const defaultSettings = {
    phone: '+212 5XX XXX XXX',
    email: 'contact@rifmachine.ma',
    address: 'Zone Industrielle, Casablanca, Maroc',
    whatsapp: '+212 6XX XXX XXX',
    facebook_url: '#',
    instagram_url: '#'
  };

  return <AboutPage settings={settings || defaultSettings} />;
}
