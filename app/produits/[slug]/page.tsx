import { createPublicClient } from '@/lib/supabase/public';
import ProductDetailClient from '../../components/ProductDetailClient';

export const revalidate = 60;

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const supabase = createPublicClient();
  
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

  return <ProductDetailClient slug={params.slug} settings={settings || defaultSettings} />;
}
