'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function updateSiteSettings(formData: FormData) {
  const supabase = createClient();
  
  const updates = {
    phone: formData.get('phone') as string,
    whatsapp: formData.get('whatsapp') as string,
    email: formData.get('email') as string,
    address: formData.get('address') as string,
    facebook_url: formData.get('facebook_url') as string,
    instagram_url: formData.get('instagram_url') as string,
  };

  const { error } = await supabase
    .from('settings')
    .update(updates)
    .eq('id', 1);

  if (error) throw new Error(error.message);
  
  revalidatePath('/admin/settings');
  revalidatePath('/');
  return { success: true };
}

export async function updateLeadStatus(leadId: string, status: string) {
  const supabase = createClient();

  const { error } = await supabase
    .from('leads')
    .update({ status })
    .eq('id', leadId);

  if (error) throw new Error(error.message);

  revalidatePath(`/admin/leads/${leadId}`);
  revalidatePath('/admin/leads');
  revalidatePath('/admin/dashboard');
  return { success: true };
}

export async function saveLeadNotes(leadId: string, notes: string) {
  const supabase = createClient();

  const { error } = await supabase
    .from('leads')
    .update({ internal_notes: notes })
    .eq('id', leadId);

  if (error) throw new Error(error.message);

  revalidatePath(`/admin/leads/${leadId}`);
  return { success: true };
}

export async function deleteLead(leadId: string) {
  const supabase = createClient();

  const { error } = await supabase
    .from('leads')
    .delete()
    .eq('id', leadId);

  if (error) throw new Error(error.message);

  revalidatePath('/admin/leads');
  revalidatePath('/admin/dashboard');
  return { success: true };
}
