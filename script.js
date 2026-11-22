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

/* =======================================================
   10. REDAÇÕES EM FLASHCARDS
   -------------------------------------------------------
   ✏️ EDITE APENAS O CAMPO "nota" de cada redação
   (o resto do conteúdo já está com o seu texto)
======================================================= */
const redacoesData = [

  // ═══════════════ REDAÇÃO 01 ═══════════════
  {
    id: 1,
    ano: "3ª série",
    titulo: "O respeito às diferenças como caminho para a superação dos conflitos sociais na sociedade contemporânea",
    resumo: "Discute racismo, desigualdade social e polarização política como conflitos brasileiros, propondo que filhos de políticos vivenciem realidades vulneráveis para desenvolver empatia.",
    texto: `A sociedade brasileira tende a ter um preconceito empunhado desde a época da escravidão como o racismo, mas as pessoas acham que é "vitimismo" e que acabou esse tempo de racismo, porém não, continua até os dias de hoje como fosse um "tabu".

A desigualdade social é um dos exemplos de conflitos sociais na sociedade brasileira, as pessoas têm um preconceito com "favelado" de maneira eficiente e estruturada, como se fosse uma coisa comum na nossa sociedade, tendo esse conflito entre classes sociais e raciais.

A polarização política é mais um dos exemplos de conflitos sociais, com sua disputa entre esquerda e direita no Brasil, o presidente Lula ou o ex-presidente Bolsonaro, a forma que debatem política nos dias atuais são de baixo calão, mesmo sendo importante a política.

A sociedade brasileira é cheia de conflitos sociais como desigualdade social e polarização política, porém para diminuir isso basta colocar os filhos dos políticos, como senadores, deputados federais e estaduais, juízes do STF, etc. Isso resolveria 70% dos problemas brasileiros no país, dessa forma as pessoas parariam de ser preconceituosas com as pessoas mais fragilizadas pela sociedade.`
  },

  // ═══════════════ REDAÇÃO 02 ═══════════════
  {
    id: 2,
    ano: "3ª série",
    titulo: "Impactos sociais e econômicos das mudanças no ciclo hidrológico",
    resumo: "Analisa os impactos das enchentes e secas no Brasil, criticando a ausência de prevenção estatal, e usa os jogos Raft e The Last of Us como metáforas dos desastres climáticos.",
    texto: `Segundo a ONU News, o Brasil está entre países com maior número de pessoas expostas a inundações. Além disso, o estado não tendo auxílio para bancar os desastres climáticos causados, como Rio Grande do Sul que não teve o auxílio necessário para evitar a enchente, a responsabilidade da parte do governo que meramente não foi atrás do imprevisto que não preveniu as enchentes que aconteceu em 2024, a persistência dos impactos sociais sobre a seca e as enchentes são mais comuns do que parece nas redes sociais. Nesse contexto, observa-se que acontece sempre os mesmos acidentes por falta de assistência estatal para melhorar sobre os desastres hídricos e déficit hídrico.

Raft é um jogo de sobrevivência que tem um oceano infinito causado pelo derretimento das geleiras do polo norte e sul, tal catástrofe evidencia a responsabilidade humana no desastre, ocasionando pela emissão de gases do efeito estufa.

Além disso, temos outro jogo chamado The Last of Us (não terminei).`
  },

  // ═══════════════ REDAÇÃO 03 ═══════════════
  {
    id: 3,
    ano: "3ª série",
    titulo: "A estética como imperativo: riscos e implicações do uso indiscriminado de canetas emagrecedoras",
    resumo: "Aborda o uso indiscriminado de canetas emagrecedoras, defendendo que o emagrecimento saudável exige disciplina, mudança de hábitos e acompanhamento pós-tratamento.",
    texto: `O padrão de beleza estabelecido de forma periódica pela sociedade, como a magreza, traz certo "desespero" em parte da população. Esse desespero se deve à falta de conhecimento sobre a saúde do próprio corpo de alguns e a falta de disciplina em muitos casos.

As canetas emagrecedoras vieram com o intuito de dar apoio para a parte da população com doenças relacionadas à obesidade e diabete, porém, muitas pessoas utilizaram do medicamento como "muleta" para chegar ao padrão estético estabelecido no momento, esquecendo que não basta somente o uso do medicamento, será necessária a disciplina com o tratamento e com o pós-tratamento que se baseia basicamente em um estilo de vida mais saudável.

Caso os pacientes não entendam a importância desse pós-tratamento, o uso do medicamento se perde, pois a tendência natural do corpo é voltar ao ponto de partida de forma gradativa.

Não existem atalhos, independente do método de emagrecimento, o hábito de vida tem de mudar indiscutivelmente. O corpo é uma máquina perfeita, só funciona se tiver sendo usado de maneira correta.`
  },

  // ═══════════════ REDAÇÃO 04 ═══════════════
  {
    id: 4,
    ano: "3ª série",
    titulo: "O uso da Inteligência Artificial e as deepfakes: o que é real e o que é fictício na vida online?",
    resumo: "Discute o avanço das deepfakes e da IA, alertando sobre desinformação, conteúdos íntimos não consensuais e a urgência de regulamentação, especialmente em contextos eleitorais.",
    texto: `Segundo o JOTA Jornalismo, o debate sobre as deepfakes ficou mais popular quando vão começar as eleições de 2026, e o Tribunal Superior Eleitoral está reforçando regras para obrigar identificação de conteúdos criados por IA e também combater a desinformação eleitoral, essas são uma das situações das deepfakes que sempre pega no nosso pé por causa que pode causar desinformação e insegurança.

As deepfakes são imagens de IA que têm conteúdo explícito ou difamando as pessoas para coisas sexuais como crianças, adolescentes e jovens para deixar a pessoa insegura sobre seu corpo.

A Inteligência Artificial (IA) é um dos motivos para as deepfakes existirem nesse mundo por causa das pessoas que são más e insensíveis com outras pessoas, sem empatia ou sem sentido de vida.

Entretanto, temos que ter muitas regulamentações sobre a IA, porque ela é muito poderosa quando não conseguimos controlar ela, pode causar guerras. (não terminei)`
  },

  // ═══════════════ REDAÇÃO 05 ═══════════════
  {
    id: 5,
    ano: "3ª série • 2º TRI 2026",
    titulo: "Agro forte, futuro sustentável: equilíbrio entre produção e meio ambiente",
    resumo: "Defende que produção agrícola e preservação ambiental podem caminhar juntas por meio de inovação tecnológica, educação ambiental e técnicas sustentáveis como o controle biológico.",
    texto: `Segundo a EMBRAPA, desenvolveram isolados de actinobactérias que podem apresentar papéis importantes na agricultura sendo potencialmente ativas no controle biológico de patógenos de plantas; e na promoção do crescimento de plantas em solos secos. Um dos exemplos de uso sustentável foi esse isolado de actinobactérias que simplesmente pode reduzir os efeitos do estresse hídrico em soja, milho e trigo.

O agronegócio possui uma grande relevância para o nosso país sendo econômica e social, sendo responsável pela produção dos nossos alimentos, geração de empregos e movimentação da economia. No Brasil, o setor destaca-se pela alta capacidade produtiva e o avanço tecnológico, como o monitoramento digital das lavouras.

Entretanto, o crescimento da produção pode gerar desafios ambientais, como desmatamento, degradação do solo e o uso excessivo de recursos naturais. Dessa forma, práticas sustentáveis tornam-se um caminho para manter um equilíbrio entre produtividade e preservação ambiental.

Portanto, fortalecer o agronegócio e preservar o meio ambiente não são objetivos opostos. O investimento em inovação, educação ambiental e técnicas sustentáveis para conseguir construir um futuro aonde o crescimento econômico e a preservação ambiental caminhem juntos.`
  },

  // ═══════════════ REDAÇÃO 06 ═══════════════
  {
    id: 6,
    ano: "3ª série",
    titulo: "Da diversão ao endividamento: efeitos socioeconômicos das bets na vida de jovens brasileiros",
    resumo: "Alerta sobre os impactos das apostas online nos jovens, com dívidas, negativação no Serasa, evasão do ensino superior e necessidade de regulamentação mais rígida.",
    texto: `Segundo a Unifor, o mercado das "bets" cresceu rapidamente e as consequências vieram à tona: 86% dos apostadores acumulam dívidas, 64% estão negativados no Serasa e 63% comprometem parte relevante da renda mensal. Esse número ainda é um alarme para a saúde mental da população.

A CPI das "bets" é um exemplo de crimes como lavagem de dinheiro, evasão fiscal, organização criminosa e manipulação algorítmica com possível fraude de resultados que as "bets" podem fazer com a população, mas o impacto recai sobre os jovens brasileiros, cerca de 10,5% dos adolescentes entre 14 e 17 anos já realizaram apostas no último ano.

A ABMS, em parceria com a Educa Insights, aponta que 34% dos jovens entre 18 e 35 anos que pretendiam ingressar na graduação adiaram a matrícula devido aos gastos com apostas, representando 1 milhão de pessoas afastadas do ensino superior. Isso resulta em jovens simplesmente irresponsáveis e manipulados.

Portanto, as pessoas deveriam ter mais responsabilidade sobre o uso disso e deveria haver recursos para que o jovem pare de se viciar nos jogos de azar, como colocar o número de CPF e sua identidade para melhorar os acessos a esses aplicativos e sites.`
  },

  // ═══════════════ REDAÇÃO 07 ═══════════════
  {
    id: 7,
    ano: "3ª série",
    titulo: "Inclusão digital no Brasil: caminhos e desafios na sociedade contemporânea",
    resumo: "Aborda a exclusão digital no Brasil, agravada durante a pandemia, com 5,1 milhões de lares desconectados, e destaca iniciativas como Wi-Fi Brasil e E-Digital.",
    texto: `As pessoas são muito ligadas à internet, mas há pessoas que não têm essa condição e vivem isoladas da internet, e isso é muito ruim para a comunicação entre os cidadãos, para que a pessoa perceba que não existe só a "bolha" dela, e sim várias "bolhas" com características diferentes, hobbies diferentes e sonhos variados.

Um dos momentos mais críticos foi no período da pandemia, quando as pessoas que mais precisavam da internet, as pessoas de baixa renda, não conseguiram acompanhar as aulas, e milhões de estudantes de rede pública ficaram sem aulas (cerca de 4,3 milhões de alunos ficaram sem videoaula e 4,1 milhões desses alunos são de redes públicas).

Conforme a PNAD Contínua TIC, embora 93,6% dos domicílios possuam acesso à internet, persistem cerca de 5,1 milhões de lares desconectados, com maior concentração entre populações de baixa renda, idosos, e regiões Norte e Nordeste. Essa exclusão limita o desenvolvimento da cidadania, especialmente no acesso a serviços públicos digitais e oportunidades de qualificação.

Nesse sentido, iniciativas como o programa Wi-Fi Brasil e a Estratégia E-Digital representam caminhos promissores para melhorar a conectividade e o letramento digital de forma inclusiva.`
  },

  // ═══════════════ REDAÇÃO 08 ═══════════════
  {
    id: 8,
    ano: "ENEM 2020 • Digital",
    titulo: "O desafio de reduzir as desigualdades entre as regiões do Brasil",
    resumo: "Trata das desigualdades regionais brasileiras, usando a trajetória do rapper Sabotage e a demolição da Favela do Moinho como exemplos de abandono estatal e falta de infraestrutura.",
    texto: `A desigualdade social é uma das situações sociais mais aclamadas pela população, porque simplesmente as pessoas não têm chance de "sair" dessa vida miseravelmente triste, e isso tem mais profundidade do que se imagina.

"Sabotage" ou Mauro foi um dos rappers mais icônicos da população brasileira, nascido na Favela do Canãa, foi uma das pessoas que simplesmente fez história fazendo suas músicas falando como era a realidade da favela e criticando o Estado por sua incompetência com a população, como sem saneamento básico, sem infraestrutura e etc.

A prefeitura de São Paulo fez a demolição da Favela do Moinho para fazer um projeto, mas o Estado, ao invés de melhorar a infraestrutura do local ou dar casas para as pessoas, decidiu pagar um "bolsa família" por mês para tentar pagar algum aluguel em São Paulo, mas nunca que esse dinheiro iria pagar para uma família arrumar um aluguel decente para morar em São Paulo, e o pobre vai sair sempre perdendo se o Estado estiver mandando em tudo como fosse um "Deus".

Portanto, as pessoas deveriam fazer manifestações para causar um alarme no Estado, como na manifestação da "escala 6X1", podemos melhorar e fazer apartamentos para famílias ou para pessoas que moram sozinhas, para o melhoramento da igualdade social.`
  },

  // ═══════════════ REDAÇÃO 09 ═══════════════
  {
    id: 9,
    ano: "3ª série",
    titulo: "Cultura fitness: bem-estar ou busca por estética inatingível",
    resumo: "Analisa a cultura fitness e o uso de esteroides, citando o filme Magazine Dreams e o caso do fisiculturista Ganley para alertar sobre os riscos físicos e mentais.",
    texto: `Segundo Ana Escobar, as crianças e os adolescentes acreditam que a estética dos músculos é o caminho para o status social e para o bem-estar, mas essa realidade está muito longe de ser alcançada, porque eles consomem muitas horas de redes sociais e por causa dos influenciadores, que simplesmente as pessoas não se enquadram nos padrões estéticos impostos pela sociedade e por isso devem sentir vergonha e insegurança pelo seu corpo.

O filme "Magazine Dreams" fala de um fisiculturista chamado Killian Maddox, que é obcecado pelo fisiculturismo, mas com seus problemas mentais e uso de esteroides ele piora e fica louco por causa do seu ombro que acha que é "pequeno", e desmaia no meio do palco causando mais sofrimento. Podemos usar isso como um exemplo para não abusar de esteroides para não causar sofrimento contínuo.

Também temos o caso do Ganley, que foi um fisiculturista jovem, sempre amoroso com as pessoas, e morreu da forma mais trágica no meio fitness com o uso de esteroides, que causou morte súbita devido a uma cardiomiopatia hipertrófica. Esse é mais um dos exemplos do que os esteroides causam no meio mental e físico das pessoas.

Entretanto, temos que achar uma forma mais eficaz de evitar o abuso no uso de anabolizantes para não prejudicar pessoas do meio fitness natural e anabólico.`
  },

  // ═══════════════ REDAÇÃO 10 ═══════════════
  {
    id: 10,
    ano: "3ª série",
    titulo: "Povos originários e direitos constitucionais: desafios para a efetivação da cidadania indígena no Brasil",
    resumo: "Discute a violação de direitos dos povos originários, com garimpo ilegal e falta de fiscalização, e propõe parceria entre FUNAI e Governo Federal para ampliar proteção.",
    texto: `Segundo o Instituto Socioambiental, em 2024, apesar da queda no desmatamento (18,2%) em relação a 2023, Terras Indígenas com povos isolados seguiram sendo alvos de atividades ilegais como a mineração e a exploração madeireira. Como podemos observar, a sociedade indígena está ameaçada desde os períodos das grandes navegações, porém o garimpo destruiu e rouba terras indígenas como se fosse "mandão".

Além disso, temos o racismo e o preconceito como barreira para os indígenas, as pessoas pensam que eles têm excesso de terras como se fossem seus proprietários, mas isso serve para proteger eles de garimpo ilegal que pode prejudicá-los e causar impactos ambientais.

Ademais, a falta de fiscalização e de políticas públicas contribui para a violação dos direitos indígenas. Em algumas comunidades existem dificuldades na educação, saúde, infraestrutura e atendimento adequado para suas necessidades culturais. Portanto, mesmo estando escrito na Constituição, eles não funcionam 100%, precisamos que funcionem na prática.

Entretanto, precisamos combater as dificuldades da efetivação da cidadania indígena. Para isso, a Fundação Nacional dos Povos Indígenas (FUNAI) e o Governo Federal devem fazer parceria para ampliar a fiscalização e a proteção dos territórios indígenas, por meio do fortalecimento da Polícia Federal para monitorar e combater atividades ilegais, como o garimpo. Assim, será possível promover respeito, segurança e cidadania aos povos originários.`
  },

  // ═══════════════ REDAÇÃO 11 ═══════════════
  {
    id: 11,
    ano: "3ª série",
    titulo: "Consumo, mídia e cultura: como referências mediadas por algoritmos influenciam os modos de vida na sociedade contemporânea",
    resumo: "Reflete sobre como algoritmos moldam consumo e cultura, citando Theodore Kaczynski e o TikTok, e propõe educação midiática nas escolas e transparência das plataformas.",
    texto: `O avanço das tecnologias digitais mudou profundamente como as pessoas consomem informações, produtos e conteúdos culturais. Nesse contexto, as redes sociais utilizam algoritmos para selecionar e recomendar publicações de acordo com os interesses de cada usuário. Embora esse sistema facilite o acesso a conteúdos personalizados, ele também pode influenciar escolhas, hábitos de consumo e padrões culturais, e pode tornar-se necessário analisar como a atuação dos algoritmos interfere na autonomia das pessoas e na diversidade cultural.

A influência da tecnologia sobre o comportamento pode ser relacionada à obra "A Sociedade Industrial e seu Futuro", de Theodore Kaczynski, conhecido como "Unabomber". No livro, o autor apresenta críticas aos efeitos da sociedade tecnológica sobre a autonomia humana, argumentando que o desenvolvimento tecnológico pode aumentar o controle exercido sobre os indivíduos. Embora suas ideias sejam controversas, o pensamento apresentado na obra permite refletir sobre a realidade, onde as pessoas estão constantemente expostas a tecnologias que influenciam seus hábitos, escolhas e formas de interação. Assim, o uso excessivo e pouco consciente dessas ferramentas pode reduzir a autonomia da pessoa diante das referências que recebe.

Podemos também falar do TikTok, que pode exemplificar como os algoritmos podem interferir diretamente no consumo e na cultura. A plataforma utiliza sistemas de recomendação para selecionar vídeos conforme as interações e preferências demonstradas pelo usuário. Com isso, determinadas músicas, produtos, comportamentos e tendências podem alcançar grande visibilidade em pouco tempo. Consequentemente, os usuários podem passar a consumir determinados conteúdos e produtos não apenas por interesse próprio, mas também pela frequência com que essas referências aparecem em seu feed. Desse modo, o algoritmo contribui para uma espécie de "bolha", onde você só fica preso a uma cultura, ao invés de disseminar as culturas.

Portanto, é necessário promover a consciência sobre a influência dos algoritmos nos modos de vida. Para isso, o Ministério da Educação deve desenvolver projetos de educação midiática que ensinem os estudantes a compreender o funcionamento das recomendações digitais e a analisar criticamente os conteúdos consumidos. Além disso, as plataformas digitais devem ampliar a transparência sobre seus sistemas de recomendações. Assim, será possível fortalecer a autonomia dos usuários e favorecer uma relação mais consciente com o consumo, a mídia e a cultura.`
  },

  // ═══════════════ REDAÇÃO 12 ═══════════════
  {
    id: 12,
    ano: "3ª série",
    titulo: "Os desafios para a preservação dos monumentos históricos no Brasil contemporâneo",
    resumo: "Redação em construção — usa a música 'Epitaph' do King Crimson (1968) como ponto de partida para refletir sobre a preservação de monumentos históricos.",
    texto: `Epitaph é uma música do King Crimson, banda criada em 1968, parte do "rock progressivo psicodélico" em Londres, quando estava tudo começando no rock progressivo, tipo Pink Floyd.

(redação em construção)`
  },

  // ═══════════════ REDAÇÃO 13 ═══════════════
  {
    id: 13,
    ano: "3ª série",
    titulo: "Exploração espacial no século XXI: desafios para a conciliação entre avanço científico e responsabilidade social",
    resumo: "Discute os desafios da exploração espacial, citando a crítica de António Guterres aos bilionários e o risco moral intergeracional, propondo tratados internacionais atualizados.",
    texto: `A corrida espacial começou motivada pela Guerra Fria, e no século XXI ela ganha novos pensamentos com a participação de empresas privadas e países emergentes. Nesse cenário, o avanço científico se amplia, mas a responsabilidade social nem sempre acompanha esse progresso. Portanto, é fundamental discutir os desafios para conciliar a ciência e a justiça social na exploração espacial.

Além disso, o secretário-geral da ONU, António Guterres, criticou diretamente os bilionários com a frase "Bilionários passeando no espaço enquanto milhões passam fome na Terra", aonde a desresponsabilização dos bilionários sobre a sociedade para benefício próprio, como a população que passa necessidade, fosse um "peso" no mundo, ignorando as pessoas que passam fome.

O risco moral intergeracional é um dilema ético e econômico onde as ações da geração atual impõem custos, riscos e fardos para as gerações futuras, sem que estas tenham voz ou possam consentir com tais decisões. A economia espacial tem "dois lados": investimentos sustentáveis que aumentam a capacidade de regeneração de recursos, e investimentos exploratórios que geram externalidades ambientais e benefícios futuros incertos. A tensão entre eles é o cerne do risco moral entre gerações.

Nesse contexto, para conciliar avanço científico e responsabilidade social, é essencial que a ONU, em parceria com os países e a sociedade civil, por meio de tratados internacionais atualizados, estabeleça regras para o uso pacífico e democrático do espaço, de modo a garantir que os benefícios científicos sejam compartilhados com toda a humanidade.`
  },

  // ═══════════════ REDAÇÃO 14 ═══════════════
  {
    id: 14,
    ano: "3ª série",
    titulo: "Espécies em extinção e equilíbrio ecológico: desafios para a conservação da fauna brasileira",
    resumo: "Redação em construção — aborda a destruição de habitats e o risco à fauna brasileira, citando Ted Kaczynski, as queimadas na Amazônia e Chico Mendes.",
    texto: `Segundo Ted Kaczynski, ao criticar a sociedade industrial e seu impacto destrutivo sobre a natureza, já alertava para a ruptura entre o ser humano e o meio ambiente. As queimadas recentes na Amazônia confirmam essa preocupação, devido a milhares de hectares destruídos que aceleram a extinção de espécies e desequilibram ecossistemas inteiros, colocando a fauna sob séria ameaça. Nesse cenário, a destruição em massa sobre a natureza e o ecossistema pode afetar a vida humana.

O principal obstáculo está na destruição acelerada dos habitats. O fogo elimina abrigos e fontes de alimento em poucos dias, matando ou deslocando animais que não conseguem escapar. Espécies endêmicas perdem espaço vital, cadeias alimentares se rompem e o equilíbrio ecológico se fragiliza. Chico Mendes, ao defender o extrativismo sustentável e a preservação da floresta, mostrou que a proteção da fauna e dos biomas esbarra em interesses econômicos poderosos e em falhas de fiscalização, realidade que ainda persiste.

(redação em construção)`
  },

  // ═══════════════ REDAÇÃO 15 ═══════════════
  {
    id: 15,
    ano: "3ª série",
    titulo: "Migração e acolhimento: desafios da convivência em contextos globais",
    resumo: "Trata dos desafios do acolhimento de migrantes e refugiados, entre barreiras burocráticas, xenofobia e ausência de políticas integrativas, citando a Declaração Universal e o ACNUR.",
    texto: `A Declaração Universal dos Direitos Humanos prevê que todos os seres humanos nascem livres e iguais em dignidade e direitos. Contudo, o fenômeno migratório expõe uma profunda contradição entre esse ideal normativo e a realidade. Diante disso, o acolhimento de migrantes e refugiados em contextos globais enfrenta desafios estruturais que ultrapassam a recepção imediata, abrangendo desde a garantia de direitos básicos até o combate à xenofobia, o que evidencia a necessidade de políticas públicas efetivas de integração.

Primeiramente, é fundamental considerar as barreiras que dificultam a integração efetiva dos migrantes. O desconhecimento do idioma local, a complexidade dos processos de documentação e a dificuldade de revalidar diplomas acadêmicos constituem obstáculos que perpetuam a vulnerabilidade e limitam o acesso ao mercado de trabalho formal. Segundo dados do ACNUR, o acesso a emprego de qualidade, saúde e moradia permanece restrito para parcela significativa da população refugiada no Brasil. Além disso, a xenofobia e a discriminação aprofundam a exclusão e comprometem a convivência.

(redação em construção)`
  },

  // ═══════════════ REDAÇÃO 16 ═══════════════
  {
    id: 16,
    ano: "3ª série",
    titulo: "El Niño e mudanças climáticas: desafios para a preparação da sociedade diante de eventos extremos",
    resumo: "Analisa a intensificação de eventos climáticos extremos no Brasil, como as enchentes no RS em 2024, e propõe planos municipais de adaptação, alertas por SMS e educação climática.",
    texto: `Os eventos climáticos extremos têm se intensificado no Brasil, como mostram as enchentes no Rio Grande do Sul em 2024. O El Niño e as mudanças climáticas pioram esse cenário, mas a preparação da sociedade ainda é insuficiente. Isso ocorre devido à vulnerabilidade socioespacial e à fragilidade da gestão de riscos.

A princípio, a vulnerabilidade socioespacial piora os impactos dos eventos extremos. Populações pobres ocupam encostas e margens dos rios sem infraestrutura adequada. A Lei 12.608/2012 criou a Política Nacional de Defesa Civil, mas sua aplicação é desigual nos municípios. Assim, os mais pobres sofrem primeiro e se recuperam por último.

Ademais, falta uma cultura de prevenção no Brasil. O IPCC alerta que eventos extremos tendem a se intensificar, porém muitos municípios não possuem planos de contingência nem realizam simulados. Sem educação climática, a população reage de forma improvisada. Logo, a ausência de preparação transforma ameaças naturais em tragédias sociais.

Portanto, cabe ao Ministério da Integração e do Desenvolvimento Regional, em parceria com a Defesa Civil e universidades, coordenar planos municipais de adaptação climática, por meio de mapeamento de áreas de risco, sistemas de alerta por SMS e educação climática nas escolas, com verba federal e controle social, a fim de reduzir mortes e desigualdades.`
  },

  // ═══════════════ REDAÇÃO 17 ═══════════════
  {
    id: 17,
    ano: "3ª série",
    titulo: "Obsolescência tecnológica e descarte de resíduos eletrônicos: desafios para a sustentabilidade no Brasil",
    resumo: "Discute a obsolescência tecnológica e o descarte inadequado de eletrônicos, citando Zygmunt Bauman e a Política Nacional de Resíduos Sólidos, e propõe mais pontos de coleta e campanhas educativas.",
    texto: `O avanço tecnológico mudou essencialmente a vida no cotidiano, facilitando a comunicação e o acesso à informação. Entretanto, o lançamento constante de novos aparelhos e o incentivo ao consumo excessivo contribuem para o aumento do descarte de equipamentos eletrônicos. Nesse contexto, a obsolescência tecnológica e a falta de conscientização ambiental representam desafios para a sustentabilidade no Brasil, principalmente devido ao consumismo e à ausência de descarte adequado.

Em primeiro lugar, é importante destacar o consumismo como um dos principais responsáveis pelo aumento do lixo eletrônico. Nesse sentido, o sociólogo Zygmunt Bauman, ao abordar a sociedade de consumo, explica como os indivíduos são incentivados a substituir toda hora seus produtos. Essa realidade pode ser observada no mercado tecnológico, em que novos modelos de celulares e computadores são lançados frequentemente, estimulando a troca de aparelhos que ainda poderiam ser utilizados. Dessa forma, esse comportamento aumenta a produção de resíduos e a exploração dos recursos naturais.

Além disso, a falta de informação sobre o descarte correto piora o problema. Segundo a Política Nacional de Resíduos Sólidos, instituída pela Lei nº 12.305/2010, fabricantes, comerciantes, consumidores e poder público possuem responsabilidades na destinação adequada dos resíduos. Entretanto, muitos equipamentos eletrônicos ainda são descartados no lixo comum, podendo liberar substâncias tóxicas ao solo e à água. Assim, a falta de fiscalização e de pontos de coleta dificulta a aplicação dessa legislação e compromete a preservação ambiental.

Portanto, é necessário combater os desafios relacionados à obsolescência tecnológica e ao descarte de resíduos eletrônicos no Brasil. Para isso, o Governo Federal, por meio do Ministério do Meio Ambiente, deve ampliar os pontos de coleta de lixo eletrônico e fiscalizar o cumprimento da Política Nacional de Resíduos Sólidos. Além disso, as escolas devem promover campanhas educativas sobre o consumo consciente e a reciclagem, por meio de palestras e projetos ambientais. Dessa forma, será possível reduzir os impactos ambientais e construir uma sociedade mais sustentável.`
  }

];

// ================= Cria os flashcards =================
const flashcardsGrid = document.getElementById("flashcardsGrid");

if (flashcardsGrid) {
  redacoesData.forEach((r) => {
    const card = document.createElement("div");
    card.className = "flashcard";
    card.dataset.flashcard = r.id;

    card.innerHTML = `
      <div class="flashcard-inner">
        <div class="flashcard-front">
          <span class="fc-number">${String(r.id).padStart(2, "0")}</span>
          <h3 class="fc-titulo">${r.titulo}</h3>
          <span class="fc-ano">${r.ano}</span>
          <p class="fc-hint">Clique para virar</p>
        </div>
        <div class="flashcard-back">
          <p class="fc-resumo">${r.resumo}</p>
          <button class="fc-btn-ler" data-redacao="${r.id}">Ler completa</button>
        </div>
      </div>
    `;
    flashcardsGrid.appendChild(card);
  });
}

// ================= Vira o card ao clicar =================
document.querySelectorAll("[data-flashcard]").forEach((card) => {
  card.addEventListener("click", (e) => {
    if (e.target.closest(".fc-btn-ler")) return;
    card.classList.toggle("flipped");
  });
});

// ================= Modal "Ler completa" =================
const redacaoModal = document.getElementById("redacaoModal");
const redacaoModalClose = document.getElementById("redacaoModalClose");

const abrirRedacao = (id) => {
  const r = redacoesData.find((x) => x.id === parseInt(id));
  if (!r || !redacaoModal) return;

  document.getElementById("redacaoModalTag").textContent = "Redação " + String(r.id).padStart(2, "0");
  document.getElementById("redacaoModalTitulo").textContent = r.titulo;
  document.getElementById("redacaoModalAno").textContent = r.ano;

  const paragrafos = r.texto
    .split(/\n\s*\n/)
    .filter((p) => p.trim())
    .map((p) => `<p>${p.trim()}</p>`)
    .join("");
  document.getElementById("redacaoModalTexto").innerHTML = paragrafos;

  redacaoModal.classList.add("active");
  document.body.style.overflow = "hidden";
};

const fecharRedacao = () => {
  if (!redacaoModal) return;
  redacaoModal.classList.remove("active");
  document.body.style.overflow = "";
};

if (redacaoModalClose) {
  document.querySelectorAll(".fc-btn-ler").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      abrirRedacao(btn.dataset.redacao);
    });
  });

  redacaoModalClose.addEventListener("click", fecharRedacao);
  redacaoModal.addEventListener("click", (e) => {
    if (e.target === redacaoModal) fecharRedacao();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && redacaoModal.classList.contains("active")) fecharRedacao();
  });
}

console.log("%c📚 17 redações em flashcards carregadas!", "color:#0277BD;font-size:12px;font-weight:bold;");