/* =========================================================
   FRUTIGER AERO — Memórias Escolares
   Interatividade + Sistema de Bolhas
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  console.log(
    "%c🫧 Minha Jornada Escolar — Frutiger Aero Edition 🫧",
    "color:#03A9F4;font-size:15px;font-weight:bold;padding:6px;"
  );

  /* =======================================================
     DIAGNÓSTICO — verifica se o fundo está carregado
  ======================================================= */
  const bgSky = document.querySelector(".bg-sky");
  if (bgSky) {
    const style = getComputedStyle(bgSky);
    console.log("✅ .bg-sky encontrado");
    console.log("🎨 background-color:", style.backgroundColor);
    console.log("🖼️ background-image:", style.backgroundImage.slice(0, 80) + "...");
    console.log("📐 z-index:", style.zIndex);
  } else {
    console.error("❌ .bg-sky NÃO encontrado no HTML!");
  }

  /* =======================================================
     1. CANVAS DE BOLHAS INTERATIVAS
  ======================================================= */
  const canvas = document.getElementById("bubblesCanvas");
  if (!canvas) {
    console.error("❌ Canvas #bubblesCanvas não encontrado!");
    return;
  }

  const ctx = canvas.getContext("2d");
  let bubbles = [];
  const mouse = { x: -9999, y: -9999 };

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  class Bubble {
    constructor() { this.reset(true); }

    reset(initial = false) {
      this.x = Math.random() * canvas.width;
      this.y = initial
        ? Math.random() * canvas.height
        : canvas.height + Math.random() * 100;
      this.r = Math.random() * 26 + 10;
      this.speed = Math.random() * 0.9 + 0.3;
      this.wobble = Math.random() * Math.PI * 2;
      this.wobbleSpeed = Math.random() * 0.02 + 0.008;
      this.opacity = Math.random() * 0.4 + 0.35;
      this.hue = Math.random() * 60 + 175;
      this.popped = false;
      this.popTime = 0;
      this.scale = 1;
    }

    update() {
      if (this.popped) {
        this.popTime++;
        this.scale = Math.max(0, 1 - this.popTime * 0.09);
        if (this.scale <= 0) this.reset();
        return;
      }

      this.y -= this.speed;
      this.wobble += this.wobbleSpeed;
      this.x += Math.sin(this.wobble) * 0.55;

      const dx = this.x - mouse.x;
      const dy = this.y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const repelRadius = this.r + 90;

      if (dist < repelRadius && dist > 0.1) {
        const force = (repelRadius - dist) / repelRadius;
        this.x += (dx / dist) * force * 4.5;
        this.y += (dy / dist) * force * 4.5;
      }

      if (this.y + this.r < -40) this.reset();
      if (this.x < -60) this.x = canvas.width + 60;
      if (this.x > canvas.width + 60) this.x = -60;
    }

    draw() {
      if (this.popped && this.popTime > 0 && this.popTime < 12) {
        const progress = this.popTime / 12;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r * (1 + progress * 0.8), 0, Math.PI * 2);
        ctx.strokeStyle = `hsla(${this.hue}, 100%, 85%, ${1 - progress})`;
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      if (this.scale <= 0) return;
      const r = this.r * this.scale;

      const gradient = ctx.createRadialGradient(
        this.x - r * 0.3, this.y - r * 0.35, r * 0.1,
        this.x, this.y, r
      );
      gradient.addColorStop(0, `hsla(${this.hue}, 100%, 97%, ${this.opacity})`);
      gradient.addColorStop(0.4, `hsla(${this.hue}, 100%, 78%, ${this.opacity * 0.7})`);
      gradient.addColorStop(0.85, `hsla(${this.hue}, 100%, 58%, ${this.opacity * 0.35})`);
      gradient.addColorStop(1, `hsla(${this.hue}, 100%, 48%, ${this.opacity * 0.55})`);

      ctx.beginPath();
      ctx.arc(this.x, this.y, r, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();

      ctx.strokeStyle = `hsla(${this.hue}, 100%, 90%, ${this.opacity * 0.85})`;
      ctx.lineWidth = 1.3;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(this.x - r * 0.32, this.y - r * 0.36, r * 0.28, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity * 0.95})`;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(this.x + r * 0.35, this.y + r * 0.3, r * 0.12, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity * 0.5})`;
      ctx.fill();
    }

    pop() {
      if (!this.popped) {
        this.popped = true;
        this.popTime = 0;
      }
    }

    contains(px, py) {
      const dx = px - this.x;
      const dy = py - this.y;
      return dx * dx + dy * dy <= this.r * this.r;
    }
  }

  const bubbleCount = window.innerWidth < 768 ? 16 : 28;
  for (let i = 0; i < bubbleCount; i++) bubbles.push(new Bubble());
  console.log(`✅ ${bubbleCount} bolhas criadas`);

  function animateBubbles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    bubbles.forEach((b) => { b.update(); b.draw(); });
    requestAnimationFrame(animateBubbles);
  }
  animateBubbles();

  /* =======================================================
     2. INTERAÇÃO COM AS BOLHAS
  ======================================================= */
  window.addEventListener("mousemove", (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener("mouseleave", () => {
    mouse.x = -9999;
    mouse.y = -9999;
  });

  window.addEventListener("touchmove", (e) => {
    if (e.touches[0]) {
      mouse.x = e.touches[0].clientX;
      mouse.y = e.touches[0].clientY;
    }
  }, { passive: true });

  window.addEventListener("touchend", () => {
    mouse.x = -9999;
    mouse.y = -9999;
  });

  window.addEventListener("click", (e) => {
    if (e.target.closest("a, button, .menu-toggle, [data-lightbox], .timeline-card, .card, .stat, .galeria-item, .mensagem-box")) {
      return;
    }
    bubbles.forEach((b) => {
      if (b.contains(e.clientX, e.clientY)) b.pop();
    });
  });

  /* =======================================================
     3. NAVBAR — sombra ao rolar + back to top
  ======================================================= */
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

  /* =======================================================
     4. MENU MOBILE
  ======================================================= */
  const menuToggle = document.getElementById("menuToggle");
  const navLinks = document.getElementById("navLinks");

  menuToggle.addEventListener("click", () => {
    menuToggle.classList.toggle("active");
    navLinks.classList.toggle("open");
  });

  document.querySelectorAll(".nav-links a").forEach((link) => {
    link.addEventListener("click", () => {
      menuToggle.classList.remove("active");
      navLinks.classList.remove("open");
    });
  });

  /* =======================================================
     5. REVELAÇÃO AO ROLAR
  ======================================================= */
  const revealElements = document.querySelectorAll(".timeline-item, .card, .galeria-item");
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("reveal");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealElements.forEach((el) => revealObserver.observe(el));

  /* =======================================================
     6. CONTADOR ANIMADO
  ======================================================= */
  const statNumbers = document.querySelectorAll(".stat h3[data-count]");
  const animateCount = (el) => {
    const target = el.dataset.count;
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

  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCount(entry.target);
        statsObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  statNumbers.forEach((num) => statsObserver.observe(num));

  /* =======================================================
     7. LIGHTBOX
  ======================================================= */
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
    if (e.key === "Escape" && lightbox.classList.contains("active")) closeLightbox();
  });

  /* =======================================================
     8. SCROLL SUAVE com offset
  ======================================================= */
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

  console.log("%c💧 Clique nas bolhas do fundo para estourá-las!", "color:#00BCD4;font-size:12px;");
});