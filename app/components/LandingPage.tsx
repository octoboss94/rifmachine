"use client";

import { useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

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
        <a href="#hero" onClick={closeMobileNav}>Accueil</a>
        <a href="#services" onClick={closeMobileNav}>Services</a>
        <a href="#why" onClick={closeMobileNav}>Pourquoi Nous</a>
        <a href="#contact" onClick={closeMobileNav}>Contact</a>
        <a href="#contact" className="btn-primary" onClick={closeMobileNav} style={{fontFamily:"DM Sans,sans-serif",fontSize:"0.8rem",clipPath:"none"}}>Devis Gratuit</a>
      </div>

      <nav id="navbar" className={isScrolled ? "scrolled" : ""}>
        <a href="#hero" className="nav-logo">
          <div className="nav-logo-icon">
            <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
              <polygon points="30,2 58,50 2,50" fill="#1a1a1a" stroke="none"/>
              <polygon points="30,14 52,50 8,50" fill="#E8420A" stroke="none"/>
              <polygon points="30,2 58,2 44,28" fill="#1a1a1a" stroke="none"/>
              <text x="22" y="22" font-family="Arial" font-size="8" fill="white" font-weight="bold">R.M</text>
            </svg>
          </div>
          <div className="nav-logo-text">
            <div className="brand">Rif <span>Machine</span> <span style={{color:"rgba(255,255,255,0.6)",fontSize:"1.1rem"}}>s.a.r.l</span></div>
            <div className="sub">{settings.address.split(',')[1] || 'Casablanca'}, Maroc</div>
          </div>
        </a>
        <ul className="nav-links">
          <li><a href="#hero">Accueil</a></li>
          <li><a href="#services">Produits</a></li>
          <li><a href="#why">Avantages</a></li>
          <li><a href="#contact">Contact</a></li>
          <li><a href="#contact" className="nav-cta">Devis Gratuit</a></li>
        </ul>
        <div className="hamburger" onClick={toggleMobileNav}>
          <span></span><span></span><span></span>
        </div>
      </nav>

      <section id="hero">
        <div className="hero-bg"></div>
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

      <section id="services">
        <div className="section-header reveal">
          <div className="section-eyebrow">Nos Produits</div>
          <h2 className="section-title">Ce que nous <span>proposons</span></h2>
        </div>
        <div className="services-grid">
          {[
            { id: '01', t: "Ciment & Béton", d: "Ciment portland, béton prêt à l'emploi, produits de maçonnerie. Qualité certifiée." },
            { id: '02', t: "Fer à Béton & Acier", d: "Armatures HA, treillis soudés, profilés métalliques. Stock permanent." },
            { id: '03', t: "Carrelage & Revêtements", d: "Large gamme de carrelages sol et mur, faïences, mosaïques." },
            { id: '04', t: "Outillage & Machines", d: "Matériel de chantier professionnel : bétonneuses, perceuses, outils." }
          ].map((s, i) => (
            <div key={i} className="service-card">
              <span className="service-number">{s.id}</span>
              <h3 className="service-title">{s.t}</h3>
              <p className="service-desc">{s.d}</p>
              <a href="#contact" className="service-link">Demander un prix</a>
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
        <div className="footer-bottom">
          <p>© 2026 <span>Rif Machine s.a.r.l</span> — Tous droits réservés.</p>
        </div>
      </footer>
    </>
  );
}
