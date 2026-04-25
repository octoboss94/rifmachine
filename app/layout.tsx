import type { Metadata } from "next";
import "./globals.css";
import WhatsAppButton from "@/app/components/WhatsAppButton";
import { createPublicClient } from "@/lib/supabase/public";

export const metadata: Metadata = {
  title: "Rif Machine | Matériaux de Construction à Casablanca",
  description: "Vente de matériaux de construction en gros et détail à Casablanca. Ciment, fer à béton, carrelage et outillage professionnel.",
};

export const revalidate = 60; // Revalidate layout every 60 seconds

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = createPublicClient();
  const { data: settings } = await supabase.from('settings').select('whatsapp').single();

  return (
    <html lang="fr" className="scroll-smooth">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Bebas_Neue&family=Inter:wght@400;500;700;900&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased bg-[#0e0e0e]">
        {children}
        <WhatsAppButton phone={settings?.whatsapp || "+212600000000"} />
      </body>
    </html>
  );
}
