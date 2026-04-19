"use client";

import { useEffect, useState, FormEvent } from "react";
import Script from "next/script";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function Home() {
  const [formData, setFormData] = useState({ name: "", phone: "", email: "", product_type: "", message: "" });
  const [errors, setErrors] = useState({ name: false, phone: false });
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
      .to(".hero-title .line-inner", { y: 0, duration: 0.9, stagger: 0.12, ease: "power3.out" }, "-=0.4")
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
            const domEl = el as HTMLElement;
            const target = +(domEl.dataset.target || 0);
            const plus = target >= 500 || target === 1200;
            let current = 0;
            const step = Math.ceil(target / 60);
            const timer = setInterval(() => {
              current = Math.min(current + step, target);
              domEl.textContent = (plus ? "+" : "") + current;
              if (current >= target) clearInterval(timer);
            }, 30);
          });
          statsObserver.disconnect();
        }
      });
    }, { threshold: 0.5 });
    if (statItems[0]) statsObserver.observe(statItems[0]);

    // SERVICE CARDS SCROLL
    gsap.utils.toArray(".service-card").forEach((card: any, i) => {
      gsap.to(card, {
        opacity: 1, y: 0, duration: 0.7,
        ease: "power2.out", delay: i * 0.1,
        scrollTrigger: { trigger: card, start: "top 85%" }
      });
    });

    // REVEAL ELEMENTS
    gsap.utils.toArray(".reveal").forEach((el: any) => {
      gsap.to(el, {
        opacity: 1, y: 0, duration: 0.9,
        ease: "power2.out",
        scrollTrigger: { trigger: el, start: "top 80%" }
      });
    });

    // FEATURE ITEMS
    gsap.utils.toArray(".feature-item").forEach((el: any, i) => {
      gsap.to(el, {
        opacity: 1, x: 0, duration: 0.6,
        ease: "power2.out", delay: i * 0.12,
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

  const submitForm = async () => {
    const errorState = { name: !formData.name.trim(), phone: !formData.phone.trim() };
    setErrors(errorState);
    if (errorState.name || errorState.phone) return;

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
      <style dangerouslySetInnerHTML={{ __html: 
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
       }} />


<!-- CURSOR -->
<div className="cursor" id="cursor"></div>
<div className="cursor-ring" id="cursorRing"></div>

<!-- MOBILE NAV -->
<div className="mobile-nav" id="mobileNav">
  <a href="#hero" onClick="closeMobileNav()">Accueil</a>
  <a href="#services" onClick="closeMobileNav()">Services</a>
  <a href="#why" onClick="closeMobileNav()">Pourquoi Nous</a>
  <a href="#contact" onClick="closeMobileNav()">Contact</a>
  <a href="#contact" className="btn-primary" onClick="closeMobileNav()" style="font-family:'DM Sans',sans-serif;font-size:0.8rem;clipPath:none;">Devis Gratuit</a>
</div>

<!-- NAVBAR -->
<nav id="navbar">
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
      <div className="brand">Rif <span>Machine</span> <span style={{ color: "rgba(255,255,255,0.6)", fontSize: "1.1rem" }}>s.a.r.l</span></div>
      <div className="sub">Casablanca, Maroc</div>
    </div>
  </a>
  <ul className="nav-links">
    <li><a href="#hero">Accueil</a></li>
    <li><a href="#services">Produits</a></li>
    <li><a href="#why">Avantages</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#contact" className="nav-cta">Devis Gratuit</a></li>
  </ul>
  <div className="hamburger" id="hamburger" onClick="toggleMobileNav()">
    <span></span><span></span><span></span>
  </div>
</nav>

<!-- HERO -->
<section id="hero">
  <div className="hero-bg"></div>
  <div className="hero-slash"></div>
  <div className="hero-slash-border"></div>

  <!-- Decorative triangles -->
  <div className="hero-triangle tri1">
    <svg viewBox="0 0 300 300" fill="none"><polygon points="150,0 300,300 0,300" fill="rgba(232,66,10,1)"/></svg>
  </div>
  <div className="hero-triangle tri2">
    <svg viewBox="0 0 120 120" fill="none"><polygon points="60,0 120,120 0,120" fill="white"/></svg>
  </div>

  <div className="hero-content">
    <div className="hero-eyebrow">
      <span className="eyebrow-line"></span>
      <span>Casablanca, Maroc · Depuis 2009</span>
    </div>
    <h1 className="hero-title">
      <span className="line"><span className="line-inner">Votre Partenaire</span></span>
      <span className="line"><span className="line-inner orange">de Confiance</span></span>
      <span className="line"><span className="line-inner">en Construction</span></span>
    </h1>
    <p className="hero-subtitle">
      Matériaux de qualité industrielle, stock disponible immédiatement et livraison rapide à Casablanca et ses environs.
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

<!-- STATS -->
<section id="stats">
  <div className="stats-grid">
    <div className="stat-item">
      <span className="stat-number" data-target="500">0</span>
      <span className="stat-label">Clients Satisfaits</span>
    </div>
    <div className="stat-item">
      <span className="stat-number" data-target="15">0</span>
      <span className="stat-label">Ans d'Expérience</span>
    </div>
    <div className="stat-item">
      <span className="stat-number" data-target="1200">0</span>
      <span className="stat-label">Références Produits</span>
    </div>
    <div className="stat-item">
      <span className="stat-number" data-target="48">0</span>
      <span className="stat-label">Heures Livraison Max</span>
    </div>
  </div>
</section>

<!-- SERVICES -->
<section id="services">
  <div className="section-header reveal">
    <div className="section-eyebrow">Nos Produits</div>
    <h2 className="section-title">Ce que nous <span>proposons</span></h2>
  </div>
  <div className="services-grid">
    <div className="service-card">
      <span className="service-number">01</span>
      <div className="service-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="7" width="20" height="15" rx="2"/><path d="M16 7V5a2 2 0 00-4 0v2M8 7V5a2 2 0 014 0"/><path d="M12 12v5M9.5 14.5L12 12l2.5 2.5"/></svg>
      </div>
      <h3 className="service-title">Ciment & Béton</h3>
      <p className="service-desc">Ciment portland, béton prêt à l'emploi, produits de maçonnerie. Qualité certifiée, livraison en vrac ou en sacs.</p>
      <a href="#contact" className="service-link">Demander un prix <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg></a>
    </div>
    <div className="service-card">
      <span className="service-number">02</span>
      <div className="service-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 3h18v4H3zM3 10h18v4H3zM3 17h18v4H3z"/></svg>
      </div>
      <h3 className="service-title">Fer à Béton & Acier</h3>
      <p className="service-desc">Armatures HA, treillis soudés, profilés métalliques. Stock permanent pour chantiers de toutes tailles.</p>
      <a href="#contact" className="service-link">Demander un prix <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg></a>
    </div>
    <div className="service-card">
      <span className="service-number">03</span>
      <div className="service-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="8" height="8" rx="1"/><rect x="13" y="3" width="8" height="8" rx="1"/><rect x="3" y="13" width="8" height="8" rx="1"/><rect x="13" y="13" width="8" height="8" rx="1"/></svg>
      </div>
      <h3 className="service-title">Carrelage & Revêtements</h3>
      <p className="service-desc">Large gamme de carrelages sol et mur, faïences, mosaïques. Des finitions qui allient esthétique et durabilité.</p>
      <a href="#contact" className="service-link">Demander un prix <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg></a>
    </div>
    <div className="service-card">
      <span className="service-number">04</span>
      <div className="service-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/></svg>
      </div>
      <h3 className="service-title">Outillage & Machines</h3>
      <p className="service-desc">Matériel de chantier professionnel : bétonneuses, perceuses, compresseurs, outils manuels et électroportatifs.</p>
      <a href="#contact" className="service-link">Demander un prix <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg></a>
    </div>
  </div>
</section>

<!-- WHY US -->
<section id="why">
  <div className="why-inner">
    <div className="why-left reveal">
      <div className="section-eyebrow">Pourquoi Nous</div>
      <h2 className="section-title">L'excellence <span>à votre</span> service</h2>
      <p>Depuis plus de 15 ans, Rif Machine accompagne les professionnels et particuliers dans leurs projets de construction à Casablanca. Notre engagement : qualité, disponibilité et réactivité.</p>
      <a href="#contact" className="btn-primary">Prendre Rendez-vous</a>
    </div>
    <div className="why-features">
      <div className="feature-item">
        <div className="feature-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
        </div>
        <div className="feature-text">
          <h4>Prix Compétitifs Garantis</h4>
          <p>Tarifs négociés directement avec les fabricants, sans intermédiaires inutiles.</p>
        </div>
      </div>
      <div className="feature-item">
        <div className="feature-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>
        </div>
        <div className="feature-text">
          <h4>Stock Disponible Immédiatement</h4>
          <p>Entrepôt de 2 000 m² à Casablanca. Pas d'attente, livraison sous 48h.</p>
        </div>
      </div>
      <div className="feature-item">
        <div className="feature-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>
        </div>
        <div className="feature-text">
          <h4>Équipe d'Experts Dévoués</h4>
          <p>Conseillers techniques disponibles pour guider chaque projet, des fondations à la finition.</p>
        </div>
      </div>
      <div className="feature-item">
        <div className="feature-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
        </div>
        <div className="feature-text">
          <h4>Service 6j/7 à Casablanca</h4>
          <p>Ouvert du lundi au samedi. Intervention rapide sur tout le Grand Casablanca.</p>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- PROMO BANNER -->
<section id="promo">
  <p className="promo-title">DEVIS GRATUIT SOUS 24H</p>
  <p className="promo-sub">Envoyez-nous votre liste de matériaux — notre équipe vous répond avec le meilleur tarif garanti.</p>
  <a href="#contact" className="btn-promo">Obtenir Mon Devis Maintenant</a>
</section>

<!-- CONTACT / FORM -->
<section id="contact">
  <div className="contact-inner">
    <div className="contact-info reveal">
      <div className="section-eyebrow">Contact</div>
      <h2 className="section-title">Parlons de votre <span>projet</span></h2>
      <p>Que vous soyez entrepreneur, architecte ou particulier, notre équipe est là pour vous accompagner et vous proposer les meilleures solutions.</p>
      <div className="contact-details">
        <div className="contact-detail-item">
          <div className="contact-detail-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.82a19.79 19.79 0 01-3.07-8.67A2 2 0 012.18 1h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 8.14a16 16 0 006 6l1.41-1.41a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>
          </div>
          <div className="contact-detail-text">
            <span>Téléphone</span>
            <p>+212 5XX XXX XXX</p>
          </div>
        </div>
        <div className="contact-detail-item">
          <div className="contact-detail-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
          </div>
          <div className="contact-detail-text">
            <span>Email</span>
            <p>contact@rifmachine.ma</p>
          </div>
        </div>
        <div className="contact-detail-item">
          <div className="contact-detail-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
          </div>
          <div className="contact-detail-text">
            <span>Adresse</span>
            <p>Zone Industrielle, Casablanca, Maroc</p>
          </div>
        </div>
        <div className="contact-detail-item">
          <div className="contact-detail-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
          </div>
          <div className="contact-detail-text">
            <span>Horaires</span>
            <p>Lun – Sam : 8h00 à 18h00</p>
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
            <input type="text" className="form-input" placeholder="Mohammed Alami" id="fname" />
          </div>
          <div className="form-group">
            <label className="form-label">Téléphone *</label>
            <input type="tel" className="form-input" placeholder="+212 6XX XXX XXX" id="fphone" />
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">Email</label>
          <input type="email" className="form-input" placeholder="votre@email.com" id="femail" />
        </div>
        <div className="form-group">
          <label className="form-label">Type de Matériau</label>
          <select className="form-select" id="ftype">
            <option value="" disabled selected>Sélectionner un produit</option>
            <option>Ciment & Béton</option>
            <option>Fer à Béton & Acier</option>
            <option>Carrelage & Revêtements</option>
            <option>Outillage & Machines</option>
            <option>Autre / Plusieurs Produits</option>
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Votre Message</label>
          <textarea className="form-textarea" placeholder="Décrivez votre projet ou listez vos besoins..." id="fmessage"></textarea>
        </div>
        <button className="btn-submit" onClick="submitForm()">
          Envoyer ma Demande →
        </button>
      </div>
      <div className="form-success" id="formSuccess">
        <div className="success-icon">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#E8420A" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
        </div>
        <h3>Merci !</h3>
        <p>Votre demande a été envoyée avec succès. Notre équipe vous contactera dans les <strong style={{ color: "var(--orange)" }}>24 heures</strong> ouvrées.</p>
      </div>
    </div>
  </div>
</section>

<!-- MAP -->
<div id="location">
  <div className="map-overlay"></div>
  <div className="map-badge">
    <div className="map-badge-label">Notre Localisation</div>
    <div className="map-badge-city">Casablanca</div>
    <div className="map-badge-address">Zone Industrielle, Maroc</div>
  </div>
  <iframe
    src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d106376.50693697268!2d-7.589843!3d33.573110!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sfr!2sma!4v1700000000000"
    allowFullScreen loading="lazy" referrerpolicy="no-referrer-when-downgrade">
  </iframe>
</div>

<!-- FOOTER -->
<footer>
  <div className="footer-top">
    <div className="footer-brand">
      <div className="brand-name">Rif <span>Machine</span></div>
      <div className="tagline">Vente des Matériaux de Construction en Générale</div>
      <p>Votre partenaire de confiance pour tous vos projets de construction à Casablanca et dans la région depuis 2009.</p>
      <div className="social-links">
        <a href="#" className="social-link" title="Facebook">
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>
        </a>
        <a href="#" className="social-link" title="WhatsApp">
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.121 1.535 5.849L.057 23.5a.5.5 0 00.619.631l5.796-1.522A11.95 11.95 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.927 0-3.73-.49-5.304-1.35l-.38-.214-3.44.902.917-3.35-.234-.387A9.953 9.953 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/></svg>
        </a>
        <a href="#" className="social-link" title="Instagram">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
        </a>
      </div>
    </div>
    <div className="footer-col">
      <h4>Navigation</h4>
      <ul>
        <li><a href="#hero">Accueil</a></li>
        <li><a href="#services">Nos Produits</a></li>
        <li><a href="#why">Pourquoi Nous</a></li>
        <li><a href="#contact">Contact</a></li>
      </ul>
    </div>
    <div className="footer-col">
      <h4>Produits</h4>
      <ul>
        <li><a href="#services">Ciment & Béton</a></li>
        <li><a href="#services">Fer à Béton</a></li>
        <li><a href="#services">Carrelage</a></li>
        <li><a href="#services">Outillage</a></li>
      </ul>
    </div>
    <div className="footer-col">
      <h4>Coordonnées</h4>
      <ul>
        <li><a href="tel:+2125XXXXXXXX">+212 5XX XXX XXX</a></li>
        <li><a href="mailto:contact@rifmachine.ma">contact@rifmachine.ma</a></li>
        <li><a href="#location">Casablanca, Maroc</a></li>
        <li><a href="#contact">Lun–Sam · 8h–18h</a></li>
      </ul>
    </div>
  </div>
  <div className="footer-bottom">
    <p>© 2026 <span>Rif Machine s.a.r.l</span> — Tous droits réservés.</p>
    <p>Conçu avec passion · Casablanca, <span>Maroc</span></p>
  </div>
</footer>



    </>
  );
}
