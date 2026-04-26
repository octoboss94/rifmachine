"use client";

import { useEffect, useState } from "react";
import gsap from "gsap";
import Image from "next/image";
import Link from "next/link";

interface Settings {
  phone: string;
  email: string;
  address: string;
  whatsapp: string;
  facebook_url: string;
  instagram_url: string;
}

const PRODUCTS_DATA: Record<string, any> = {
  'prod_ciment': {
    title: "Ciment & Béton Industriel",
    subtitle: "La Fondation de l'Excellence",
    description: "Nous distribuons du ciment Portland CPJ 45 et CPJ 35, idéal pour les grands ouvrages d'art et la maçonnerie générale. Nos centrales partenaires garantissent un béton prêt à l'emploi (BPE) d'une homogénéité absolue, contrôlé en permanence par des laboratoires indépendants.",
    features: [
      "Résistance extrême à la compression",
      "Prise rapide et homogène",
      "Conforme aux normes NM 10.1.004",
      "Livraison en vrac ou en sacs de 50kg"
    ],
    details: "Notre gamme de ciments est spécifiquement sélectionnée pour répondre aux exigences des chantiers les plus complexes. Que ce soit pour des fondations profondes, des dalles industrielles ou des ouvrages d'art, nous fournissons un liant hydraulique de première qualité. Nos partenariats exclusifs avec les plus grandes cimenteries du Maroc nous permettent de garantir un approvisionnement continu, même pour les projets nécessitant des volumes massifs."
  },
  'prod_acier': {
    title: "Fer à Béton & Armatures",
    subtitle: "Une Résistance Inébranlable",
    description: "Notre division Acier stocke des milliers de tonnes d'armatures Haute Adhérence (HA), de treillis soudés de forte section et de profilés métalliques lourds. Conçus pour résister aux contraintes sismiques, nos bétons armés constituent l'ossature des plus grandes tours de la ville.",
    features: [
      "Nuance d'acier FeE500",
      "Diamètres de 6mm à 32mm",
      "Façonnage sur mesure",
      "Certificats de conformité fournis"
    ],
    details: "L'acier est l'épine dorsale de toute construction moderne. Nous offrons une gamme complète d'aciers pour l'armature du béton, garantissant une adhérence parfaite et une résistance optimale aux contraintes de traction. Nos ateliers de façonnage sont équipés de machines numériques de dernière génération, assurant une précision millimétrique pour les cadres, étriers et autres armatures complexes."
  },
  'prod_carrelage': {
    title: "Carrelage & Revêtements",
    subtitle: "L'Esthétique sans Compromis",
    description: "Importateurs directs des plus grandes marques européennes, nous vous offrons un catalogue premium de carrelages grand format, de marbres reconstitués et de faïences murales. Nos revêtements industriels supportent le trafic lourd (chariots, machines) sans la moindre fissure.",
    features: [
      "Grès cérame pleine masse",
      "Formats XXL disponibles",
      "Résistance aux chocs thermiques",
      "Traitements anti-dérapants"
    ],
    details: "Alliez durabilité et esthétique avec notre sélection rigoureuse de revêtements. Nous proposons des solutions adaptées aussi bien aux environnements industriels exigeants qu'aux espaces commerciaux haut de gamme. Nos experts vous conseillent sur le choix des matériaux, des colles et des joints époxy pour garantir un résultat final impeccable et pérenne."
  },
  'prod_machines': {
    title: "Outillage & Machines Lourdes",
    subtitle: "La Force de Déploiement",
    description: "Équipez vos chantiers avec le matériel le plus fiable du marché. De la simple bétonnière tractée aux imposants complexes d'échafaudages tubulaires, en passant par nos treuils de levage haute sécurité. La productivité de vos équipes est notre priorité.",
    features: [
      "Machines de grandes marques",
      "Service après-vente réactif",
      "Disponibilité immédiate",
      "Matériel certifié CE"
    ],
    details: "La performance de vos équipes dépend de la qualité de leur équipement. Nous avons sélectionné les machines et l'outillage les plus robustes pour résister aux conditions extrêmes de vos chantiers. De la préparation du béton au levage de charges lourdes, notre catalogue répond à l'ensemble de vos besoins opérationnels."
  },
  'prod_etancheite': {
    title: "Matériel d'Étanchéité",
    subtitle: "Une Isolation Parfaite",
    description: "Protégez vos bâtiments contre les intempéries et les chocs thermiques. Nous proposons des membranes bitumineuses SBS/APP élastomères, des isolants thermiques Polyuréthane (PUR) et des mousses acoustiques de classe mondiale. Un confort garanti à vie.",
    features: [
      "Membranes SBS/APP",
      "Haute élasticité",
      "Résistance aux UV",
      "Isolation thermique et phonique"
    ],
    details: "Une étanchéité défaillante peut compromettre l'intégrité de l'ensemble d'un ouvrage. C'est pourquoi nous ne distribuons que des produits d'étanchéité ayant prouvé leur efficacité. Nos solutions couvrent les toitures terrasses, les fondations, les bassins et les murs enterrés, assurant une protection totale contre les infiltrations d'eau."
  },
  'prod_protection': {
    title: "Équipement de Protection (EPI)",
    subtitle: "La Sécurité Avant Tout",
    description: "Vos ouvriers méritent ce qu'il y a de meilleur. Nous fournissons des gammes complètes d'Équipements de Protection Individuelle: casques antichocs ventilés, harnais de maintien, gants anti-coupure et chaussures de sécurité conformes aux normes marocaines NM et européennes.",
    features: [
      "Conforme aux normes NM et CE",
      "Confort ergonomique",
      "Matériaux haute résistance",
      "Solutions complètes de la tête aux pieds"
    ],
    details: "La sécurité sur le chantier n'est pas une option. Notre gamme d'EPI est conçue pour offrir une protection maximale tout en préservant le confort et la mobilité de vos ouvriers. Nous travaillons avec des fabricants reconnus pour équiper vos équipes avec du matériel fiable, réduisant ainsi les risques d'accidents du travail."
  }
};

export default function ProductDetailClient({ slug, settings }: { slug: string, settings: Settings }) {
  const [isMobileNavOpen, setMobileNavOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    // CURSOR
    const cursor = document.getElementById("cursor");
    const ring = document.getElementById("cursorRing");
    let mx = 0, my = 0, rx = 0, ry = 0;

    const onMouseMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      if (cursor) {
        cursor.style.left = mx + "px";
        cursor.style.top = my + "px";
      }
    };
    document.addEventListener("mousemove", onMouseMove);

    let animationFrameId: number;
    function animRing() {
      rx += (mx - rx) * 0.12;
      ry += (my - ry) * 0.12;
      if (ring) {
        ring.style.left = rx + "px";
        ring.style.top = ry + "px";
      }
      animationFrameId = requestAnimationFrame(animRing);
    }
    animRing();

    const addHover = () => { cursor?.classList.add("hover"); ring?.classList.add("hover"); };
    const removeHover = () => { cursor?.classList.remove("hover"); ring?.classList.remove("hover"); };

    document.querySelectorAll("a, button, .hamburger").forEach(el => {
      el.addEventListener("mouseenter", addHover);
      el.addEventListener("mouseleave", removeHover);
    });

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 60);
    };
    window.addEventListener("scroll", handleScroll);

    // Initial animations
    gsap.fromTo(".hero-detail-title", 
      { y: 50, opacity: 0 }, 
      { y: 0, opacity: 1, duration: 1, ease: "power3.out", delay: 0.2 }
    );
    gsap.fromTo(".hero-detail-sub", 
      { y: 30, opacity: 0 }, 
      { y: 0, opacity: 1, duration: 1, ease: "power3.out", delay: 0.4 }
    );

    gsap.utils.toArray(".reveal-up").forEach((elem: any, i: number) => {
      gsap.fromTo(elem, 
        { y: 50, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 0.8, ease: "power2.out", delay: i * 0.1, scrollTrigger: { trigger: elem, start: "top 85%" } }
      );
    });

    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const toggleMobileNav = () => setMobileNavOpen(!isMobileNavOpen);
  const closeMobileNav = () => setMobileNavOpen(false);

  const product = PRODUCTS_DATA[slug];

  if (!product) {
    return (
      <div className="min-h-screen bg-[#0e0e0e] flex items-center justify-center">
        <div className="text-white text-center">
          <h1 className="text-6xl font-['Bebas_Neue'] mb-4">Produit Non Trouvé</h1>
          <Link href="/#services" className="text-[#E8420A] underline uppercase tracking-wider">Retour aux produits</Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: \`
        :root {
          --orange: #E8420A;
          --orange-light: #FF5522;
          --black: #0e0e0e;
          --dark: #161616;
          --dark2: #1e1e1e;
          --white: #ffffff;
          --offwhite: #f4f2ee;
          --gray: #888;
          --border: rgba(232,66,10,0.25);
        }
      \` }} />

      <div className="cursor" id="cursor"></div>
      <div className="cursor-ring" id="cursorRing"></div>

      {/* MOBILE NAV */}
      <div className={\`mobile-nav \${isMobileNavOpen ? 'open' : ''}\`}>
        <Link href="/" onClick={closeMobileNav}>Accueil</Link>
        <Link href="/apropos" onClick={closeMobileNav}>À Propos</Link>
        <Link href="/#services" onClick={closeMobileNav}>Services</Link>
        <Link href="/#contact" onClick={closeMobileNav}>Contact</Link>
        <Link href="/admin/dashboard" onClick={closeMobileNav} className="text-[#E8420A] mt-4 uppercase tracking-widest text-sm">Espace Admin</Link>
        <Link href="/#contact" className="btn-primary mt-4" onClick={closeMobileNav} style={{fontFamily:"DM Sans,sans-serif",fontSize:"0.8rem",clipPath:"none"}}>Devis Gratuit</Link>
      </div>

      <nav id="navbar" className={isScrolled ? "scrolled" : ""}>
        <Link href="/" className="nav-logo">
          <div className="nav-logo-icon">
            <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
              <polygon points="30,2 58,50 2,50" fill="#1a1a1a" stroke="none"/>
              <polygon points="30,14 52,50 8,50" fill="#E8420A" stroke="none"/>
              <polygon points="30,2 58,2 44,28" fill="#1a1a1a" stroke="none"/>
              <text x="22" y="22" fontFamily="Arial" fontSize="8" fill="white" fontWeight="bold">R.M</text>
            </svg>
          </div>
          <div className="nav-logo-text">
            <div className="brand">Rif <span>Machine</span> <span style={{color:"rgba(255,255,255,0.6)",fontSize:"1.1rem"}}>s.a.r.l</span></div>
            <div className="sub">{settings.address.split(',')[1] || 'Casablanca'}, Maroc</div>
          </div>
        </Link>
        <ul className="nav-links">
          <li><Link href="/">Accueil</Link></li>
          <li><Link href="/apropos">À Propos</Link></li>
          <li><Link href="/#services">Produits</Link></li>
          <li><Link href="/#contact">Contact</Link></li>
          <li><Link href="/admin/dashboard" className="text-white/40 hover:text-[#E8420A] ml-4 text-xs font-bold uppercase tracking-wider">Espace Admin</Link></li>
          <li><Link href="/#contact" className="nav-cta">Devis Gratuit</Link></li>
        </ul>
        <div className="hamburger" onClick={toggleMobileNav}>
          <span></span><span></span><span></span>
        </div>
      </nav>

      <main className="bg-[#f4f2ee] min-h-screen">
        {/* HERO SECTION FOR PRODUCT */}
        <section className="relative pt-40 pb-32 px-[5%] bg-[#0e0e0e] overflow-hidden">
          <div className="absolute inset-0 opacity-40">
            <Image 
              src={\`/images/\${slug}.png\`} 
              alt={product.title} 
              fill 
              className="object-cover filter grayscale contrast-150"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0e0e0e] via-[#0e0e0e]/80 to-transparent"></div>
          </div>
          
          <div className="relative z-10 max-w-5xl mx-auto text-center">
            <div className="hero-detail-sub text-[#E8420A] tracking-widest uppercase text-sm font-bold mb-4">{product.subtitle}</div>
            <h1 className="hero-detail-title font-['Bebas_Neue'] text-7xl md:text-9xl text-white uppercase tracking-wider">{product.title}</h1>
          </div>
        </section>

        {/* DETAILS SECTION */}
        <section className="py-24 px-[5%]">
          <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-16">
            <div className="lg:w-1/2">
              <div className="sticky top-32">
                <div className="w-full h-[500px] relative overflow-hidden [clip-path:polygon(0_0,100%_0,100%_90%,90%_100%,0_100%)] shadow-2xl reveal-up">
                  <Image 
                    src={\`/images/\${slug}.png\`}
                    alt={product.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 border-[10px] border-[#0e0e0e]/10 pointer-events-none"></div>
                </div>
              </div>
            </div>
            
            <div className="lg:w-1/2 space-y-12">
              <div className="reveal-up space-y-6">
                <h2 className="text-4xl font-['Bebas_Neue'] text-[var(--dark)] uppercase tracking-wide border-l-4 border-[#E8420A] pl-6">Présentation du produit</h2>
                <p className="text-lg text-black/70 leading-relaxed font-medium">{product.description}</p>
                <p className="text-lg text-black/60 leading-relaxed">{product.details}</p>
              </div>

              <div className="reveal-up space-y-6 bg-white p-10 shadow-lg border border-black/5 [clip-path:polygon(0_0,100%_0,100%_90%,90%_100%,0_100%)]">
                <h3 className="text-3xl font-['Bebas_Neue'] text-[var(--dark)] uppercase tracking-wide">Caractéristiques Clés</h3>
                <ul className="space-y-4">
                  {product.features.map((feature: string, idx: number) => (
                    <li key={idx} className="flex items-center gap-4 text-black/70 text-lg">
                      <svg className="w-6 h-6 text-[#E8420A] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="reveal-up pt-8">
                <Link href="/#contact" className="inline-flex items-center justify-center gap-3 bg-[#E8420A] hover:bg-[#FF5522] text-white px-10 py-5 text-lg font-bold uppercase tracking-widest transition-colors w-full md:w-auto shadow-xl hover:shadow-2xl hover:-translate-y-1 transform duration-300">
                  Demander un devis pour ce produit
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer>
        <div className="footer-top">
          <div className="footer-brand">
            <div className="brand-name">Rif <span>Machine</span></div>
            <p>Votre partenaire de confiance pour tous vos projets de construction à Casablanca.</p>
            <div className="social-links">
               {settings.facebook_url && <a href={settings.facebook_url} className="social-link">FB</a>}
               {settings.instagram_url && <a href={settings.instagram_url} className="social-link">IG</a>}
               {settings.whatsapp && <a href={\`https://wa.me/\${settings.whatsapp.replace(/\\D/g, '')}\`} className="social-link">WA</a>}
            </div>
          </div>
        </div>
        <div className="footer-bottom flex justify-between items-center">
          <p>© 2026 <span>Rif Machine s.a.r.l</span> — Tous droits réservés.</p>
        </div>
      </footer>
    </>
  );
}
