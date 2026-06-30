/* =====================================================================
   LETWE — Hero · scroll-vídeo no <canvas>
   GSAP + ScrollTrigger animam · Lenis dá fluidez · canvas "toca" os frames.
   Estrutura: preload -> desenha (cover) -> índice do frame = posição do scroll
   -> suaviza num loop (rAF). Tudo degrada com graça (sem JS / reduced-motion).
   ===================================================================== */
(function () {
  "use strict";

  /* ------------------------------------------------------------------
     CONFIG — frames extraídos DIRETO do vídeo (assets/video/letwe-hero.mp4)
     com ffmpeg, fiéis ao original, deduplicados (mpdecimate, sem repetição)
     e SÓ em JPEG. 144 frames distintos (origem: 24fps · 6s, todos únicos).
     Mobile é um recorte 9:16 centralizado, mais enxuto.
       • desktop: assets/frames-video  (1280×720)      · 144 JPG
       • mobile : assets/frames-mobile (480×852, 9:16)  · 144 JPG
     ------------------------------------------------------------------ */
  var CONFIG = {
    DESKTOP: { DIR: "assets/frames-video",  COUNT: 144 },
    MOBILE:  { DIR: "assets/frames-mobile", COUNT: 144 },
    EASING:  0.3,    // perseguição do frame no loop rAF: menor = mais "manteiga";
                     // maior = mais colado no scroll. Com JPEG não há atraso de decode.
    PAD:     3       // dígitos no nome do arquivo: f_001.jpg
  };

  var docEl        = document.documentElement;
  var reduceMotion = docEl.classList.contains("reduced");
  var hasGSAP      = typeof window.gsap !== "undefined";
  var hasLenis     = typeof window.Lenis !== "undefined";
  var isMobile     = window.matchMedia("(max-width: 760px)").matches;

  /* set e formato resolvidos no boot (não troca em resize p/ não re-baixar frames) */
  var SET         = isMobile ? CONFIG.MOBILE : CONFIG.DESKTOP;
  var FRAME_DIR   = SET.DIR;
  var FRAME_COUNT = SET.COUNT;
  // JPEG de propósito: WebP força um decode síncrono pesado no drawImage a cada
  // frame novo durante o scroll — a imagem "cai atrás" do scroll (delay). JPEG
  // decodifica rápido e mantém o scrub fluido. Os dois sets já têm JPG no disco.
  var EXT         = "jpg";

  /* =================== 1) Smooth scroll (Lenis) ==================== */
  var lenis = null;
  if (hasLenis && !reduceMotion) {
    // UMA camada de suavização do scroll (o frame é perseguido pelo loop rAF).
    // lerp maior = mais "grudado" no movimento; menor = mais deslizante.
    lenis = new Lenis({ lerp: 0.12, smoothWheel: true });
    if (hasGSAP) {
      gsap.registerPlugin(ScrollTrigger);
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
      gsap.ticker.lagSmoothing(0);
    } else {
      var raf = function (time) { lenis.raf(time); requestAnimationFrame(raf); };
      requestAnimationFrame(raf);
    }
  } else if (hasGSAP) {
    gsap.registerPlugin(ScrollTrigger);
  }

  /* ================= 2) Canvas: sequência de frames =============== */
  var canvas = document.getElementById("heroCanvas");
  var ctx    = canvas.getContext("2d", { alpha: false });
  var hero   = document.getElementById("hero");
  var loader = document.getElementById("loader");
  var bar    = document.getElementById("loaderBar");

  var DPR = Math.min(window.devicePixelRatio || 1, isMobile ? 1.5 : 2);
  var cw = 0, ch = 0;
  var frames = [];
  var target = 0, eased = 0, lastDrawn = -1, ready = false;

  function framePath(i) {
    var n = String(i).padStart(CONFIG.PAD, "0");
    return FRAME_DIR + "/f_" + n + "." + EXT;
  }

  function resize() {
    cw = canvas.clientWidth;
    ch = canvas.clientHeight;
    canvas.width  = Math.round(cw * DPR);
    canvas.height = Math.round(ch * DPR);
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    if (ready) draw(eased);
  }

  function draw(f) {
    var idx = Math.round(f);
    if (idx < 0) idx = 0;
    if (idx > FRAME_COUNT - 1) idx = FRAME_COUNT - 1;
    var img = frames[idx];
    if (!img || !img.naturalWidth) return;
    // "cover": preenche a tela sem borda branca (Math.max)
    var scale = Math.max(cw / img.naturalWidth, ch / img.naturalHeight);
    var w = img.naturalWidth * scale;
    var h = img.naturalHeight * scale;
    ctx.drawImage(img, (cw - w) * 0.5, (ch - h) * 0.5, w, h);
  }

  // scroll -> 0..1 dentro do herói alto
  function progress() {
    var rect = hero.getBoundingClientRect();
    var denom = hero.offsetHeight - window.innerHeight;
    if (denom <= 0) return 0;
    var p = -rect.top / denom;
    return p < 0 ? 0 : (p > 1 ? 1 : p);
  }

  // loop "manteiga": persegue o alvo e só redesenha quando muda de frame
  function tick() {
    target = progress() * (FRAME_COUNT - 1);
    eased += (target - eased) * CONFIG.EASING;
    if (Math.abs(target - eased) < 0.01) eased = target;   // snap no fim: sem drift residual
    var r = Math.round(eased);
    if (r !== lastDrawn) { draw(eased); lastDrawn = r; }
    requestAnimationFrame(tick);
  }

  /* =================== 3) Preload + loader ======================== */
  var loaded = 0;
  function preload() {
    // Movimento reduzido: sem scrub, basta o 1º frame — não baixa o set inteiro.
    var count = reduceMotion ? 1 : FRAME_COUNT;
    for (var i = 0; i < count; i++) {
      (function (idx) {
        var img = new Image();
        img.decoding = "async";
        img.onload = img.onerror = function () {
          loaded++;
          if (bar) bar.style.width = (loaded / count * 100) + "%";
          if (loaded === count) onReady();
        };
        img.src = framePath(idx + 1);
        frames[idx] = img;
      })(i);
    }
  }

  function onReady() {
    ready = true;
    resize();

    if (reduceMotion || !hasReasonableHeight()) {
      // estático: desenha 1 frame e mostra tudo, sem scrub
      draw(0);
      showReveals();
      hideLoader();
      return;
    }

    target = eased = progress() * (FRAME_COUNT - 1);
    draw(eased);
    requestAnimationFrame(tick);

    hideLoader();
    intro();
    scrollFades();
  }

  function hasReasonableHeight() {
    return (hero.offsetHeight - window.innerHeight) > 40;
  }

  function hideLoader() {
    if (!loader) return;
    if (hasGSAP) {
      gsap.to(loader, { autoAlpha: 0, duration: 0.6, onComplete: function () { loader.remove(); } });
    } else {
      loader.style.transition = "opacity .5s";
      loader.style.opacity = "0";
      setTimeout(function () { loader.remove(); }, 520);
    }
  }

  /* ===================== 4) Animações (GSAP) ====================== */
  function showReveals() {
    var els = document.querySelectorAll(".reveal");
    for (var i = 0; i < els.length; i++) {
      els[i].style.opacity = "1";
      els[i].style.transform = "none";
    }
  }

  function intro() {
    if (!hasGSAP) { showReveals(); return; }
    var tl = gsap.timeline({ defaults: { ease: "power3.out", duration: 0.9 } });
    tl.to(".kicker",       { opacity: 1, y: 0 })
      .to(".hero__title",  { opacity: 1, y: 0 }, "-=0.6")
      .to(".hero__sub",    { opacity: 1, y: 0 }, "-=0.6")
      .to(".hero__cta",    { opacity: 1, y: 0 }, "-=0.6")
      .to(".hero__status", { opacity: 1, y: 0 }, "-=0.55");
  }

  // o conteúdo some suavemente perto do fim do herói (handoff limpo)
  function scrollFades() {
    if (!hasGSAP) return;
    gsap.to("#heroContent", {
      opacity: 0, y: -40, ease: "none",
      scrollTrigger: { trigger: "#hero", start: "56% top", end: "90% top", scrub: true }
    });
    gsap.to(".hero__status", {
      opacity: 0, y: 24, ease: "none",
      scrollTrigger: { trigger: "#hero", start: "46% top", end: "82% top", scrub: true }
    });
    gsap.to("#scrollCue", {
      opacity: 0, ease: "none",
      scrollTrigger: { trigger: "#hero", start: "top top", end: "9% top", scrub: true }
    });
  }

  /* ===================== 5) Navbar + menu ========================= */
  var nav    = document.getElementById("nav");
  var burger = document.getElementById("navBurger");
  var links  = document.getElementById("navLinks");

  // O fundo branco da navbar só aparece quando o topo da 2ª seção (#solucoes,
  // logo após a hero) encosta na navbar — sobre a hero escura ela fica limpa.
  var navTrigger = document.getElementById("solucoes");
  function onScrollNav() {
    var navH = nav.offsetHeight || 78;
    var reached = navTrigger
      ? navTrigger.getBoundingClientRect().top <= navH
      : window.scrollY > 24;
    nav.classList.toggle("is-scrolled", reached);
  }
  window.addEventListener("scroll", onScrollNav, { passive: true });
  window.addEventListener("resize", onScrollNav, { passive: true });
  onScrollNav();

  if (burger) {
    burger.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      burger.setAttribute("aria-expanded", String(open));
      burger.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
    });
    links.addEventListener("click", function (e) {
      if (e.target.tagName === "A" && nav.classList.contains("is-open")) {
        nav.classList.remove("is-open");
        burger.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ===================== 6) Resize / boot ========================= */
  var rt;
  window.addEventListener("resize", function () {
    clearTimeout(rt);
    rt = setTimeout(function () {
      isMobile = window.matchMedia("(max-width: 760px)").matches;
      DPR = Math.min(window.devicePixelRatio || 1, isMobile ? 1.5 : 2);
      resize();
      if (hasGSAP && typeof ScrollTrigger !== "undefined") ScrollTrigger.refresh();
      if (window.innerWidth > 860 && nav.classList.contains("is-open")) {
        nav.classList.remove("is-open");
        if (burger) burger.setAttribute("aria-expanded", "false");
      }
    }, 180);
  });

  preload();
})();
