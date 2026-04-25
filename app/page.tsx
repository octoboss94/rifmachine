import { createPublicClient } from '@/lib/supabase/public';
import LandingPage from './components/LandingPage';

export const revalidate = 60; // Revalidate every 60 seconds

export default async function Home() {
  const supabase = createPublicClient();
  
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

  return <LandingPage settings={settings || defaultSettings} />;
}
