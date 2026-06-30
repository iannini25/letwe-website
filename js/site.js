/* =====================================================================
   LETWE — site.js
   Interações fora da hero (a hero é cuidada por hero.js):
   • scroll-reveal das .r-up (GSAP/ScrollTrigger → IntersectionObserver → fallback)
   • ano automático no rodapé
   • FAQ: fecha os outros ao abrir um (acordeão suave)
   Tudo degrada com graça (sem JS / reduced-motion).
   ===================================================================== */
(function () {
  "use strict";

  var docEl = document.documentElement;
  var reduce = docEl.classList.contains("reduced");
  var hasGSAP = typeof window.gsap !== "undefined" && typeof window.ScrollTrigger !== "undefined";

  /* -------------------- ano no rodapé -------------------- */
  var y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();

  /* -------------------- scroll-reveal .r-up -------------------- */
  function revealAll() {
    var els = document.querySelectorAll(".r-up");
    for (var i = 0; i < els.length; i++) els[i].classList.add("is-in");
  }

  if (reduce) {
    revealAll();
  } else if (hasGSAP) {
    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.batch(".r-up", {
      start: "top 86%",
      once: true,
      onEnter: function (batch) {
        gsap.to(batch, {
          opacity: 1, y: 0, duration: 0.8, ease: "power3.out",
          stagger: 0.09,
          onStart: function () {
            for (var i = 0; i < batch.length; i++) batch[i].classList.add("is-in");
          }
        });
      }
    });
    // garante refresh depois que fontes/imagens mudam a altura
    window.addEventListener("load", function () { ScrollTrigger.refresh(); });
  } else if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); }
      });
    }, { rootMargin: "0px 0px -10% 0px", threshold: 0.12 });
    document.querySelectorAll(".r-up").forEach(function (el) { io.observe(el); });
  } else {
    revealAll();
  }

  /* -------------------- navbar (só quando NÃO há hero/canvas) --------------------
     No index.html o hero.js já cuida da navbar. Em páginas sem hero (ex.: blog),
     o site.js assume: fundo sólido ao rolar + menu mobile. ------------------- */
  if (!document.getElementById("heroCanvas")) {
    var nav = document.getElementById("nav");
    var burger = document.getElementById("navBurger");
    var links = document.getElementById("navLinks");
    if (nav) {
      var onScroll = function () {
        if (window.scrollY > 24) nav.classList.add("is-scrolled");
        else nav.classList.remove("is-scrolled");
      };
      window.addEventListener("scroll", onScroll, { passive: true });
      onScroll();
      if (burger && links) {
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
    }
  }

  /* -------------------- vídeo (YouTube) na seção Sobre --------------------
     Fachada leve: troca o pôster pelo iframe só no clique (perf + privacidade). */
  var ytTrigger = document.querySelector(".about__video-trigger");
  if (ytTrigger) {
    ytTrigger.addEventListener("click", function () {
      var id = ytTrigger.getAttribute("data-yt");
      if (!id) return;
      var iframe = document.createElement("iframe");
      iframe.className = "about__video-frame";
      iframe.title = "Vídeo institucional da Letwe";
      iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
      iframe.setAttribute("allowfullscreen", "");
      iframe.src = "https://www.youtube-nocookie.com/embed/" + id +
                   "?autoplay=1&rel=0&modestbranding=1&playsinline=1";
      var wrap = ytTrigger.closest(".about__video") || ytTrigger.parentNode;
      var glow = wrap.querySelector(".about__video-glow");
      wrap.innerHTML = "";
      if (glow) wrap.appendChild(glow);
      wrap.appendChild(iframe);
    });
  }

  /* -------------------- FAQ acordeão -------------------- */
  var items = document.querySelectorAll(".faq__item");
  items.forEach(function (item) {
    item.addEventListener("toggle", function () {
      if (!item.open) return;
      items.forEach(function (other) {
        if (other !== item) other.open = false;
      });
    });
  });
})();
