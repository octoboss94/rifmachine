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

export default function LandingPage({ settings }: { settings: Settings }) {
  const [formData, setFormData] = useState({ name: "", phone: "", email: "", product_type: "", message: "" });
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

    document.querySelectorAll("a, button, .service-card, .hamburger").forEach(el => {
      el.addEventListener("mouseenter", addHover);
      el.addEventListener("mouseleave", removeHover);
    });

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 60);
    };
    window.addEventListener("scroll", handleScroll);

    // HERO ANIMATIONS
    const tl = gsap.timeline({ delay: 0.3 });
    tl.to(".hero-slash", { x: 0, duration: 1.2, ease: "power3.out" })
      .to(".hero-eyebrow", { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" }, "-=0.6")
      .to(".hero-title .line-inner", {
        y: 0,
        duration: 0.9,
        stagger: 0.12,
        ease: "power3.out"
      }, "-=0.4")
      .to(".hero-subtitle", { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" }, "-=0.3")
      .to(".hero-buttons", { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" }, "-=0.3")
      .to("#scrollHint", { opacity: 1, duration: 0.6 }, "-=0.1");

    // STATS COUNTER
    const statItems = document.querySelectorAll(".stat-item");
    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          gsap.to(".stat-item", { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: "power2.out" });
          document.querySelectorAll(".stat-number").forEach(el => {
            const htmlEl = el as HTMLElement;
            const target = +(htmlEl.dataset.target || 0);
            const plus = target >= 500 || target === 1200;
            let current = 0;
            const step = Math.ceil(target / 60);
            const timer = setInterval(() => {
              current = Math.min(current + step, target);
              htmlEl.textContent = (plus ? "+" : "") + current;
              if (current >= target) clearInterval(timer);
            }, 30);
          });
          statsObserver.disconnect();
        }
      });
    }, { threshold: 0.5 });
    if (statItems[0]) statsObserver.observe(statItems[0]);

    // SERVICE CARDS SCROLL
    gsap.utils.toArray(".service-card").forEach((card: unknown, i) => {
      const el = card as HTMLElement;
      gsap.to(el, {
        opacity: 1, y: 0, duration: 0.7,
        ease: "power2.out",
        delay: i * 0.1,
        scrollTrigger: { trigger: el, start: "top 85%" }
      });
    });

    // REVEAL ELEMENTS
    gsap.utils.toArray(".reveal").forEach((elem: unknown) => {
      const el = elem as HTMLElement;
      gsap.to(el, {
        opacity: 1, y: 0, duration: 0.9,
        ease: "power2.out",
        scrollTrigger: { trigger: el, start: "top 80%" }
      });
    });

    // FEATURE ITEMS
    gsap.utils.toArray(".feature-item").forEach((elem: unknown, i) => {
      const el = elem as HTMLElement;
      gsap.to(el, {
        opacity: 1, x: 0, duration: 0.6,
        ease: "power2.out",
        delay: i * 0.12,
        scrollTrigger: { trigger: el, start: "top 85%" }
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

  const submitForm = async () => {
    if (!formData.name || !formData.phone) return;

    const formContent = document.getElementById("formContent");
    const formSuccess = document.getElementById("formSuccess");
    if (formContent) {
      formContent.style.opacity = "0";
      formContent.style.transform = "scale(0.97)";
    }

    try {
      const res = await fetch("/api/submit-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      if (!res.ok) throw new Error("Failed to submit");
    } catch(err) {
      console.error(err);
    }

    setTimeout(() => {
      if (formContent) formContent.style.display = "none";
      if (formSuccess) {
        formSuccess.style.display = "block";
        formSuccess.style.animation = "successPop 0.5s ease";
      }
    }, 300);
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
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
      ` }} />

      <div className="cursor" id="cursor"></div>
      <div className="cursor-ring" id="cursorRing"></div>

      {/* MOBILE NAV */}
      <div className={`mobile-nav ${isMobileNavOpen ? 'open' : ''}`}>
        <Link href="/" onClick={closeMobileNav}>Accueil</Link>
        <Link href="/apropos" onClick={closeMobileNav}>À Propos</Link>
        <a href="#services" onClick={closeMobileNav}>Services</a>
        <a href="#contact" onClick={closeMobileNav}>Contact</a>
        <Link href="/admin/dashboard" onClick={closeMobileNav} className="text-[#E8420A] mt-4 uppercase tracking-widest text-sm">Espace Admin</Link>
        <a href="#contact" className="btn-primary mt-4" onClick={closeMobileNav} style={{fontFamily:"DM Sans,sans-serif",fontSize:"0.8rem",clipPath:"none"}}>Devis Gratuit</a>
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
          <li><a href="/#services">Produits</a></li>
          <li><a href="/#contact">Contact</a></li>
          <li><Link href="/admin/dashboard" className="text-white/40 hover:text-[#E8420A] ml-4 text-xs font-bold uppercase tracking-wider">Espace Admin</Link></li>
          <li><a href="/#contact" className="nav-cta">Devis Gratuit</a></li>
        </ul>
        <div className="hamburger" onClick={toggleMobileNav}>
          <span></span><span></span><span></span>
        </div>
      </nav>

      <section id="hero">
        <div className="hero-bg">
          <Image 
            src="/images/hero_bg.png" 
            alt="Rif Machine Industrial Background" 
            fill 
            sizes="100vw"
            quality={90}
            priority
            style={{ objectFit: 'cover', opacity: 0.35 }} 
          />
        </div>
        <div className="hero-slash"></div>
        <div className="hero-slash-border"></div>
        <div className="hero-triangle tri1">
          <svg viewBox="0 0 300 300" fill="none"><polygon points="150,0 300,300 0,300" fill="rgba(232,66,10,1)"/></svg>
        </div>
        <div className="hero-triangle tri2">
          <svg viewBox="0 0 120 120" fill="none"><polygon points="60,0 120,120 0,120" fill="white"/></svg>
        </div>
        <div className="hero-content">
          <div className="hero-eyebrow">
            <span className="eyebrow-line"></span>
            <span>{settings.address.split(',')[1] || 'Casablanca'}, Maroc · Depuis 2009</span>
          </div>
          <h1 className="hero-title">
            <span className="line"><span className="line-inner">Votre Partenaire</span></span>
            <span className="line"><span className="line-inner orange">de Confiance</span></span>
            <span className="line"><span className="line-inner">en Construction</span></span>
          </h1>
          <p className="hero-subtitle">
            Matériaux de qualité industrielle, stock disponible immédiatement et livraison rapide à {settings.address.split(',')[1] || 'Casablanca'} et ses environs.
          </p>
          <div className="hero-buttons">
            <a href="#contact" className="btn-primary">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 5l7 7-7 7"/></svg>
              Demander un Devis
            </a>
            <a href="#services" className="btn-secondary">Voir nos Produits</a>
          </div>
        </div>
        <div className="hero-scroll-hint" id="scrollHint">
          <div className="scroll-line"></div>
          <span className="scroll-hint-text">Défiler</span>
        </div>
      </section>

      <section id="stats">
        <div className="stats-grid">
          {[
            { n: 500, l: "Clients Satisfaits" },
            { n: 15, l: "Ans d'Expérience" },
            { n: 1200, l: "Références Produits" },
            { n: 48, l: "Heures Livraison Max" }
          ].map((s, i) => (
            <div key={i} className="stat-item">
              <span className="stat-number" data-target={s.n}>0</span>
              <span className="stat-label">{s.l}</span>
            </div>
          ))}
        </div>
      </section>

      <section id="services" className="pt-32 pb-16">
        <div className="section-header reveal mb-20 text-center flex flex-col items-center">
          <div className="section-eyebrow">Le Catalogue</div>
          <h2 className="section-title">Matériaux d&apos;<span>Exception</span></h2>
          <p className="max-w-3xl text-black/60 mt-6 text-xl">Notre gigantesque capacité de stockage de 50 000 m² à Casablanca nous permet de vous fournir instantanément les matériaux les plus rares et les plus demandés du marché industriel.</p>
        </div>

        <div className="product-showcase flex flex-col gap-y-32 mb-32">
          {[
            { id: '01', key: 'prod_ciment', t: "Ciment & Béton Industriel", sub: "La Fondation de l'Excellence", d: "Nous distribuons du ciment Portland CPJ 45 et CPJ 35, idéal pour les grands ouvrages d'art et la maçonnerie générale. Nos centrales partenaires garantissent un béton prêt à l'emploi (BPE) d'une homogénéité absolue, contrôlé en permanence par des laboratoires indépendants." },
            { id: '02', key: 'prod_acier', t: "Fer à Béton & Armatures", sub: "Une Résistance Inébranlable", d: "Notre division Acier stocke des milliers de tonnes d'armatures Haute Adhérence (HA), de treillis soudés de forte section et de profilés métalliques lourds. Conçus pour résister aux contraintes sismiques, nos bétons armés constituent l'ossature des plus grandes tours de la ville." },
            { id: '03', key: 'prod_carrelage', t: "Carrelage & Revêtements", sub: "L'Esthétique sans Compromis", d: "Importateurs directs des plus grandes marques européennes, nous vous offrons un catalogue premium de carrelages grand format, de marbres reconstitués et de faïences murales. Nos revêtements industriels supportent le trafic lourd (chariots, machines) sans la moindre fissure." },
            { id: '04', key: 'prod_machines', t: "Outillage & Machines Lourdes", sub: "La Force de Déploiement", d: "Équipez vos chantiers avec le matériel le plus fiable du marché. De la simple bétonnière tractée aux imposants complexes d'échafaudages tubulaires, en passant par nos treuils de levage haute sécurité. La productivité de vos équipes est notre priorité." },
            { id: '05', key: 'prod_etancheite', t: "Matériel d'Étanchéité", sub: "Une Isolation Parfaite", d: "Protégez vos bâtiments contre les intempéries et les chocs thermiques. Nous proposons des membranes bitumineuses SBS/APP élastomères, des isolants thermiques Polyuréthane (PUR) et des mousses acoustiques de classe mondiale. Un confort garanti à vie." },
            { id: '06', key: 'prod_protection', t: "Équipement de Protection (EPI)", sub: "La Sécurité Avant Tout", d: "Vos ouvriers méritent ce qu'il y a de meilleur. Nous fournissons des gammes complètes d'Équipements de Protection Individuelle: casques antichocs ventilés, harnais de maintien, gants anti-coupure et chaussures de sécurité conformes aux normes marocaines NM et européennes." }
          ].map((s, i) => (
            <div key={i} className={`flex flex-col lg:flex-row gap-16 items-center px-[5%] product-row ${i % 2 !== 0 ? 'lg:flex-row-reverse' : ''}`}>
              <div className="w-full lg:w-1/2 h-[500px] md:h-[600px] relative overflow-hidden [clip-path:polygon(0_0,100%_0,100%_90%,90%_100%,0_100%)] reveal scale-95 shadow-2xl">
                <Image 
                  src={`/images/${s.key}.png`}
                  alt={s.t}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  quality={90}
                  className="object-cover transform transition-transform duration-1000 hover:scale-110 filter saturate-150 contrast-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none"></div>
                <div className="absolute bottom-6 left-8 text-white font-['Bebas_Neue'] text-5xl opacity-40 select-none tracking-widest">{s.id}</div>
              </div>
              <div className="w-full lg:w-1/2 space-y-6 reveal">
                <div className="text-[#E8420A] tracking-wider uppercase text-sm font-bold">{s.sub}</div>
                <h3 className="font-['Bebas_Neue'] text-5xl md:text-6xl text-[var(--dark)] uppercase leading-none tracking-wide">{s.t}</h3>
                <p className="text-xl text-black/60 leading-relaxed max-w-lg pb-4">{s.d}</p>
                <Link href="#contact" className="inline-flex items-center gap-3 border-b-2 border-[#E8420A] text-[var(--dark)] hover:text-[#E8420A] font-bold uppercase tracking-wider pb-1 transition-colors group">
                  Demander un devis 
                  <span className="transform group-hover:translate-x-2 transition-transform">→</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* PROCESSUS SECTION */}
      <section id="processus" className="bg-[#0e0e0e] py-32 px-[5%] relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-5 pointer-events-none bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#E8420A] via-transparent to-transparent"></div>
        
        <div className="text-center max-w-4xl mx-auto mb-20 reveal">
          <div className="text-[#E8420A] tracking-wider uppercase text-sm font-bold mb-4">La Logistique Rif Machine</div>
          <h2 className="font-['Bebas_Neue'] text-5xl md:text-7xl text-white tracking-wide">Livraison en <span className="text-[#E8420A]">48 Heures</span></h2>
          <p className="text-white/60 text-lg mt-6 max-w-2xl mx-auto">Un processus fluide, de la commande à la livraison sur votre chantier, assuré par notre redoutable flotte de camions poids lourds.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10 max-w-6xl mx-auto">
          {[
            { n: '1', t: "Analyse des Besoins", d: "Notre équipe chiffre avec exactitude les quantitatifs nécessaires à partir de vos plans de construction, pour éliminer toute perte." },
            { n: '2', t: "Préparation Centrale", d: "Vos matériaux sont conditionnés et palettisés depuis nos entrepôts massifs de la zone industrielle de Casablanca." },
            { n: '3', t: "Déploiement In Situ", d: "Livraison par notre propre flotte de camions grues. Aucun retard toléré. Vos équipes travaillent sans interruption." }
          ].map((p, i) => (
            <div key={i} className="reveal bg-[#161616] border border-white/5 p-12 hover:border-[#E8420A]/30 transition-colors group relative overflow-hidden [clip-path:polygon(0_0,100%_0,100%_90%,90%_100%,0_100%)]">
              <div className="absolute -bottom-10 -right-10 text-9xl font-['Bebas_Neue'] text-white/[0.03] group-hover:text-[#E8420A]/10 transition-colors">{p.n}</div>
              <div className="w-12 h-1 bg-[#E8420A] mb-8 group-hover:w-20 transition-all duration-500"></div>
              <h4 className="text-2xl font-bold text-white mb-4 tracking-wide">{p.t}</h4>
              <p className="text-white/50 leading-relaxed">{p.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="contact">
        <div className="contact-inner">
          <div className="contact-info reveal">
            <div className="section-eyebrow">Contact</div>
            <h2 className="section-title">Parlons de votre <span>projet</span></h2>
            <p>Que vous soyez entrepreneur, architecte ou particulier, notre équipe est là pour vous accompagner.</p>
            <div className="contact-details">
              <div className="contact-detail-item">
                <div className="contact-detail-text">
                  <span>Téléphone</span>
                  <p>{settings.phone}</p>
                </div>
              </div>
              <div className="contact-detail-item">
                <div className="contact-detail-text">
                  <span>Email</span>
                  <p>{settings.email}</p>
                </div>
              </div>
              <div className="contact-detail-item">
                <div className="contact-detail-text">
                  <span>Adresse</span>
                  <p>{settings.address}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="form-card reveal">
            <div id="formContent">
              <h3 className="form-title">Demander un Devis</h3>
              <p className="form-subtitle">Réponse garantie sous 24 heures ouvrées</p>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Nom Complet *</label>
                  <input type="text" className="form-input" placeholder="Mohammed Alami" 
                    onChange={e => setFormData({...formData, name: e.target.value})} />
                </div>
                <div className="form-group">
                  <label className="form-label">Téléphone *</label>
                  <input type="tel" className="form-input" placeholder="+212 6XX XXX XXX" 
                    onChange={e => setFormData({...formData, phone: e.target.value})} />
                </div>
              </div>
              <button className="btn-submit" onClick={submitForm}>
                Envoyer ma Demande →
              </button>
            </div>
            <div className="form-success" id="formSuccess" style={{display:'none'}}>
              <h3>Merci !</h3>
              <p>Votre demande a été envoyée avec succès.</p>
            </div>
          </div>
        </div>
      </section>

      <footer>
        <div className="footer-top">
          <div className="footer-brand">
            <div className="brand-name">Rif <span>Machine</span></div>
            <p>Votre partenaire de confiance pour tous vos projets de construction à Casablanca.</p>
            <div className="social-links">
               {settings.facebook_url && <a href={settings.facebook_url} className="social-link">FB</a>}
               {settings.instagram_url && <a href={settings.instagram_url} className="social-link">IG</a>}
               {settings.whatsapp && <a href={`https://wa.me/${settings.whatsapp.replace(/\D/g, '')}`} className="social-link">WA</a>}
            </div>
          </div>
        </div>
        <div className="footer-bottom flex justify-between items-center">
          <p>© 2026 <span>Rif Machine s.a.r.l</span> — Tous droits réservés.</p>
          <Link href="/admin/dashboard" className="text-white/20 hover:text-orange-500 transition-colors" title="Espace Administrateur">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
          </Link>
        </div>
      </footer>
    </>
  );
}
