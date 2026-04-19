import { createClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const supabase = createClient()
    
    // 1. Insert lead into Supabase
    const { data: lead, error } = await supabase.from('leads').insert([{
      name: body.name,
      phone: body.phone,
      email: body.email || null,
      product_type: body.product_type || null,
      message: body.message || null,
      source: 'website'
    }]).select().single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    // 2. Trigger Admin Notifications (Asynchronous)
    try {
      // EMAIL NOTIFICATION (Example using Resend API)
      if (process.env.RESEND_API_KEY) {
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
          },
          body: JSON.stringify({
            from: 'Rif Machine <notifications@rifmachine.ma>',
            to: process.env.ADMIN_EMAIL || 'contact@rifmachine.ma',
            subject: 'Nouvelle Demande de Devis - Rif Machine',
            html: `
              <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee;">
                <h2 style="color: #E8420A;">Nouvelle Demande de Devis</h2>
                <p><strong>Client:</strong> ${body.name}</p>
                <p><strong>Téléphone:</strong> ${body.phone}</p>
                <p><strong>Produit:</strong> ${body.product_type || 'Général'}</p>
                <p><strong>Message:</strong> ${body.message || 'Aucun message'}</p>
                <hr />
                <a href="${process.env.NEXT_PUBLIC_SITE_URL}/admin/leads/${lead.id}" style="background: #E8420A; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Voir dans l'admin</a>
              </div>
            `
          })
        });
      }

      // WHATSAPP NOTIFICATION (Placeholder for provider like UltraMsg/Twilio)
      if (process.env.WHATSAPP_API_TOKEN) {
        // Example UltraMsg logic
        await fetch(`https://api.ultramsg.com/${process.env.WHATSAPP_INSTANCE_ID}/messages/chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({
            token: process.env.WHATSAPP_API_TOKEN,
            to: process.env.ADMIN_WHATSAPP_PHONE || '',
            body: `🏗️ *Nouveau Lead sur Rif Machine*\n\n👨‍💼 *Client:* ${body.name}\n📞 *Tél:* ${body.phone}\n📦 *Produit:* ${body.product_type || 'Général'}\n💬 *Message:* ${body.message || 'N/A'}`
          })
        });
      }
    } catch (notifErr) {
      console.error('Notification Error:', notifErr);
      // We don't fail the request if notifications fail
    }

    return NextResponse.json({ success: true, lead_id: lead.id })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
