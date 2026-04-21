"use client";

import { useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
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

export default function AboutPage({ settings }: { settings: Settings }) {
  const [isMobileNavOpen, setMobileNavOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

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

    // Initial Animations
    const tl = gsap.timeline({ delay: 0.3 });
    tl.to(".about-title .line-inner", {
        y: 0,
        duration: 0.9,
        stagger: 0.12,
        ease: "power3.out"
      })
      .to(".about-text", { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }, "-=0.5")
      .to(".about-image-container", { opacity: 1, scale: 1, duration: 1.2, ease: "power3.out" }, "-=0.6");

    // REVEAL ELEMENTS
    gsap.utils.toArray(".reveal").forEach((elem: unknown) => {
      const el = elem as HTMLElement;
      gsap.to(el, {
        opacity: 1, y: 0, duration: 0.9,
        ease: "power2.out",
        scrollTrigger: { trigger: el, start: "top 80%" }
      });
    });

    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const toggleMobileNav = () => setMobileNavOpen(!isMobileNavOpen);
  const closeMobileNav = () => setMobileNavOpen(false);

  useEffect(() => {
    if (isMobileNavOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isMobileNavOpen]);

  return (
    <>
      <div className="cursor" id="cursor"></div>
      <div className="cursor-ring" id="cursorRing"></div>

      {/* MOBILE NAV */}
      <div className={`mobile-nav ${isMobileNavOpen ? 'open' : ''}`}>
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

      {/* ABOUT HERO */}
      <section className="pt-32 pb-20 px-[5%] min-h-[70vh] flex flex-col justify-center relative overflow-hidden">
        <div className="max-w-4xl relative z-10">
          <div className="section-eyebrow mb-6">Notre Histoire</div>
          <h1 className="about-title font-['Bebas_Neue'] text-[clamp(3.5rem,8vw,6.5rem)] leading-[0.95] text-white mb-8 overflow-hidden">
            <span className="line block overflow-hidden"><span className="line-inner block transform translate-y-[110%] pb-2">Leaders en</span></span>
            <span className="line block overflow-hidden"><span className="line-inner block transform translate-y-[110%] pb-2 text-[#E8420A]">Distribution de</span></span>
            <span className="line block overflow-hidden"><span className="line-inner block transform translate-y-[110%] pb-2">Matériaux</span></span>
          </h1>
          <p className="about-text opacity-0 transform translate-y-[20px] text-white/60 text-lg md:text-xl font-light leading-relaxed max-w-2xl">
            Depuis 2009, Rif Machine s.a.r.l s&apos;est imposée comme le pilier de l&apos;approvisionnement en matériaux de construction dans la région de Casablanca. Notre engagement : une qualité certifiée et une disponibilité sans faille.
          </p>
        </div>
        
        {/* Decorative Grid Lines */}
        <div className="absolute inset-0 pointer-events-none opacity-20 z-0 bg-[linear-gradient(rgba(232,66,10,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(232,66,10,0.1)_1px,transparent_1px)] bg-[size:80px_80px]"></div>
      </section>

      {/* CORE VALUES & IMAGE SECTION */}
      <section className="px-[5%] pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          <div className="about-image-container relative w-full h-[500px] md:h-[600px] opacity-0 scale-95 origin-center overflow-hidden [clip-path:polygon(0_0,100%_0,100%_90%,90%_100%,0_100%)]">
            <Image 
              src="/images/about_image.png" 
              alt="Rif Machine Warehouse Logistics"
              fill 
              sizes="(max-width: 1024px) 100vw, 50vw"
              quality={95}
              style={{ objectFit: 'cover' }}
              className="filter contrast-110 saturate-150 rounded"
            />
            {/* Overlay border */}
            <div className="absolute inset-0 border-2 border-[#E8420A]/30 pointer-events-none"></div>
          </div>

          <div className="space-y-12">
            <div className="reveal">
              <h3 className="font-['Bebas_Neue'] text-4xl text-white mb-4 tracking-wide">Une Infrastructure <span className="text-[#E8420A]">Solide</span></h3>
              <p className="text-white/50 leading-relaxed font-light">
                Nous avons bâti un réseau logistique puissant, permettant de stocker et de livrer d&apos;énormes quantités de ciment, d&apos;armatures et de machines professionnelles dans des délais records. Notre flotte de transport dessert plus de 500 chantiers majeurs.
              </p>
            </div>
            
            <div className="reveal">
              <h3 className="font-['Bebas_Neue'] text-4xl text-white mb-4 tracking-wide">Qualité <span className="text-[#E8420A]">Certifiée</span></h3>
              <p className="text-white/50 leading-relaxed font-light">
                Chaque livraison de béton ou d&apos;acier est rigoureusement contrôlée. Nous collaborons exclusivement avec les fournisseurs qui respectent les normes les plus strictes de la construction industrielle marocaine.
              </p>
            </div>

            <div className="reveal pt-6 border-t border-white/10">
              <Link href="/#contact" className="btn-primary inline-flex">
                Collaborer avec nous
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#080808] border-t border-white/5 pt-20 pb-8 px-[5%]">
        <div className="footer-top grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 pb-16 border-b border-white/5 mb-8">
          <div className="footer-brand">
            <div className="brand-name font-['Bebas_Neue'] text-3xl tracking-wide text-white mb-2">Rif <span className="text-[#E8420A]">Machine</span></div>
            <p className="text-white/35 text-sm leading-relaxed font-light mb-6">Votre partenaire de confiance pour tous vos projets de construction à Casablanca.</p>
            <div className="social-links flex gap-3">
               {settings.facebook_url && <a href={settings.facebook_url} className="w-10 h-10 border border-white/10 flex items-center justify-center text-white/50 hover:border-[#E8420A] hover:bg-[#E8420A]/10 hover:text-[#E8420A] transition-colors">FB</a>}
               {settings.instagram_url && <a href={settings.instagram_url} className="w-10 h-10 border border-white/10 flex items-center justify-center text-white/50 hover:border-[#E8420A] hover:bg-[#E8420A]/10 hover:text-[#E8420A] transition-colors">IG</a>}
               {settings.whatsapp && <a href={`https://wa.me/${settings.whatsapp.replace(/\D/g, '')}`} className="w-10 h-10 border border-white/10 flex items-center justify-center text-white/50 hover:border-[#E8420A] hover:bg-[#E8420A]/10 hover:text-[#E8420A] transition-colors">WA</a>}
            </div>
          </div>
        </div>
        <div className="footer-bottom flex justify-between items-center text-xs text-white/20">
          <p>© 2026 <span className="text-[#E8420A]">Rif Machine s.a.r.l</span> — Tous droits réservés.</p>
          <Link href="/admin/dashboard" className="hover:text-[#E8420A] transition-colors" title="Espace Administrateur">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
          </Link>
        </div>
      </footer>
    </>
  );
}
