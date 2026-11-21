/* =========================================================
   SITE PESSOAL — MEMÓRIAS ESCOLARES
   Interatividade em JavaScript puro
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  /* -------------------------------------------------------
     1. NAVBAR — sombra ao rolar
  ------------------------------------------------------- */
  const navbar = document.getElementById("navbar");
  const backToTop = document.getElementById("backToTop");

  window.addEventListener("scroll", () => {
    if (window.scrollY > 60) {
      navbar.classList.add("scrolled");
      backToTop.classList.add("visible");
    } else {
      navbar.classList.remove("scrolled");
      backToTop.classList.remove("visible");
    }
  });

  backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  /* -------------------------------------------------------
     2. MENU MOBILE
  ------------------------------------------------------- */
  const menuToggle = document.getElementById("menuToggle");
  const navLinks = document.getElementById("navLinks");

  menuToggle.addEventListener("click", () => {
    menuToggle.classList.toggle("active");
    navLinks.classList.toggle("open");
  });

  // Fechar menu ao clicar em um link
  document.querySelectorAll(".nav-links a").forEach((link) => {
    link.addEventListener("click", () => {
      menuToggle.classList.remove("active");
      navLinks.classList.remove("open");
    });
  });

  /* -------------------------------------------------------
     3. ANIMAÇÃO DE REVELAÇÃO (IntersectionObserver)
  ------------------------------------------------------- */
  const revealElements = document.querySelectorAll(
    ".timeline-item, .card, .galeria-item"
  );

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("reveal");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  revealElements.forEach((el) => revealObserver.observe(el));

  /* -------------------------------------------------------
     4. CONTADOR ANIMADO (seção "stats")
  ------------------------------------------------------- */
  const statNumbers = document.querySelectorAll(".stat h3[data-count]");

  const animateCount = (el) => {
    const target = el.dataset.count;
    // Ignora valor infinito
    if (target === "∞") return;

    const finalValue = parseInt(target, 10);
    let current = 0;
    const duration = 1400;
    const stepTime = Math.max(10, duration / finalValue);

    const timer = setInterval(() => {
      current++;
      el.textContent = current;
      if (current >= finalValue) {
        clearInterval(timer);
        el.textContent = finalValue;
      }
    }, stepTime);
  };

  const statsObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          statsObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  statNumbers.forEach((num) => statsObserver.observe(num));

  /* -------------------------------------------------------
     5. LIGHTBOX (galeria)
  ------------------------------------------------------- */
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightboxImg");
  const lightboxClose = document.getElementById("lightboxClose");

  const openLightbox = (src, alt) => {
    lightboxImg.src = src;
    lightboxImg.alt = alt || "Imagem ampliada";
    lightbox.classList.add("active");
    document.body.style.overflow = "hidden";
  };

  const closeLightbox = () => {
    lightbox.classList.remove("active");
    document.body.style.overflow = "";
  };

  document.querySelectorAll("[data-lightbox]").forEach((img) => {
    img.addEventListener("click", () => openLightbox(img.src, img.alt));
  });

  lightboxClose.addEventListener("click", closeLightbox);

  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && lightbox.classList.contains("active")) {
      closeLightbox();
    }
  });

  /* -------------------------------------------------------
     6. SCROLL SUAVE personalizado (fallback extra)
  ------------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
      const targetId = anchor.getAttribute("href");
      if (targetId.length > 1) {
        const target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          const offset = 70;
          const top = target.getBoundingClientRect().top + window.scrollY - offset;
          window.scrollTo({ top, behavior: "smooth" });
        }
      }
    });
  });

  /* -------------------------------------------------------
     7. LOG no console (para o professor ver que JS rodou 😉)
  ------------------------------------------------------- */
  console.log(
    "%c✦ Minha Jornada Escolar — Projeto de Programação Web ✦",
    "color:#f59e0b;font-size:14px;font-weight:bold;"
  );
});