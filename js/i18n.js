/* =====================================================================
   LETWE — i18n (PT/EN)
   Aplica traduções a [data-i18n] via innerHTML (permite <em>, <span>).
   Persiste a escolha em localStorage('letwe-lang'). PT é o padrão.
   ===================================================================== */
(function () {
  "use strict";

  var DICT = {
    pt: {
      "nav.home": "Home",
      "nav.solutions": "Soluções",
      "nav.about": "Sobre",
      "nav.clients": "Clientes",
      "nav.blog": "Blog",
      "nav.cta": "Fale com a gente",

      "hero.kicker": "Transformação digital na logística",
      "hero.title": "Aceleramos a transformação<br>digital na <em>logística</em>.",
      "hero.sub": "Um ecossistema de soluções que otimiza tempo, recursos e custos na operação dos nossos clientes, movido por muita inovação e tecnologia.",
      "hero.cta1": "Fale com a gente",
      "hero.cta2": "Conheça as soluções",
      "hero.stat1": "movendo a logística",
      "hero.stat2": "soluções integradas",
      "hero.stat3": "operações que escalam",
      "hero.scroll": "role para conhecer",

      "sol.eyebrow": "Nosso ecossistema",
      "sol.title": "Soluções que promovem a verdadeira <em>transformação digital na logística</em>",
      "sol.lead": "Quatro plataformas que conversam entre si para otimizar cada elo da sua operação, do armazém à frota, do time ao impacto ambiental.",
      "sol.know": "Conhecer",
      "sol.gtiplug.tag": "WMS · Gestão de armazém",
      "sol.gtiplug.desc": "Plataforma para gestão estratégica de armazenagem e movimentação de produtos: controle de estoque, endereçamento e produtividade em tempo real.",
      "sol.cosmos.tag": "Smart fleet · Frotas",
      "sol.cosmos.desc": "Solução smart fleet para monitoramento e otimização de frotas de forma integrada: telemetria, rotas e custos sob controle numa só visão.",
      "sol.univexus.tag": "Capacitação · Pessoas",
      "sol.univexus.desc": "Conteúdo prático para capacitação, formação e atualização do seu time, de maneira ágil, aplicável e no ritmo da sua operação.",
      "sol.abundance.tag": "ESG · Créditos de carbono",
      "sol.abundance.desc": "Créditos de carbono que impulsionam a restauração ambiental do Brasil por meio de um criptoativo seguro e eficiente.",

      "about.eyebrow": "Sobre nós",
      "about.title": "Ajudamos você a se tornar cada vez mais <em>digital</em>.",
      "about.text": "Com uma visão estratégica e contínua em transformação digital, nosso time de especialistas em logística atua no diagnóstico de problemas e na geração de oportunidades de negócio, com tecnologia aplicada de ponta a ponta.",
      "about.li1": "Diagnóstico e estratégia de ponta a ponta",
      "about.li2": "Ecossistema integrado de soluções",
      "about.li3": "Resultados sólidos e mensuráveis",
      "about.cta": "Fale com a gente",

      "move.title": "Venha movimentar o Brasil e o mundo com a gente",
      "move.text": "Solucionamos os desafios das empresas com uma cultura pautada por resultados sólidos e foco em inovação.",
      "move.cta": "Conheça o que fazemos",

      "depo.eyebrow": "Quem confia",
      "depo.title": "A <em>transformação digital</em> que nossos clientes alcançaram",
      "depo.q1": "Nossa parceria sempre foi extremamente produtiva e eficiente. A equipe é muito capacitada e disposta a ajudar, e os produtos são de alto nível. Valorizamos muito essa parceria.",
      "depo.q1role": "Diretor Comercial · Grupo Delta Facilities",
      "depo.q2": "A equipe do GTI PLUG é muito flexível e trabalha em prol das nossas necessidades como clientes.",
      "depo.q2role": "BioGrow Brasil",
      "depo.q3": "O GTI PLUG tem auxiliado muito numa necessidade que foge do sistema padrão de mercado. Tivemos um ganho enorme no processo logístico, com baixo custo de operação.",
      "depo.q3role": "Amapá",

      "clients.title": "Marcas líderes movimentam com a Letwe",

      "faq.eyebrow": "FAQ",
      "faq.title": "Perguntas frequentes",
      "faq.lead": "Tudo o que você precisa saber antes de acelerar a transformação digital da sua logística.",
      "faq.q1": "O que é a Letwe?",
      "faq.a1": "Somos uma plataforma de transformação digital para a logística. Reunimos um ecossistema de soluções que impacta positivamente a operação dos nossos clientes, otimizando tempo, recursos, custos e gerando inovação.",
      "faq.q2": "Para quais empresas as soluções servem?",
      "faq.a2": "De operações em crescimento a grandes indústrias e operadores logísticos. Marcas líderes como Ambev, Klabin, Porsche e Kuehne+Nagel já movimentam com a gente.",
      "faq.q3": "Como funciona o GTI PLUG?",
      "faq.a3": "É a nossa plataforma de gestão estratégica de armazenagem e movimentação de produtos: controle de estoque, endereçamento inteligente e indicadores de produtividade em tempo real, com baixo custo de operação.",
      "faq.q4": "Vocês atendem em todo o Brasil?",
      "faq.a4": "Sim. Atendemos operações em todo o Brasil e damos suporte a clientes que movimentam cargas para o mundo todo.",
      "faq.q5": "Como eu começo?",
      "faq.a5": "Fale com a gente pelo WhatsApp ou pelo formulário de contato. Fazemos um diagnóstico da sua operação e indicamos as soluções que mais geram resultado para o seu negócio.",

      "cta.title": "Chegou a vez da sua empresa ir além do tradicional.",
      "cta.text": "Alavanque a sua transformação digital com as melhores soluções para logística.",
      "cta.cta": "Vamos conversar?",
      "cta.alt": "Outros canais",

      "foot.tagline": "Transformação digital na logística. Um ecossistema de soluções que move o seu negócio, do armazém à frota, do time ao impacto.",
      "foot.nav": "Navegação",
      "foot.sol": "Soluções",
      "foot.contact": "Contato",
      "foot.made": "Transformação digital na logística",
      "foot.signBy": "Feito por",

      "blog.eyebrow": "Blog Letwe",
      "blog.title": "Insights em logística e transformação digital",
      "blog.lead": "Conteúdo prático sobre WMS, frotas, pessoas e ESG para quem move o Brasil e o mundo.",
      "blog.featured": "Em destaque",
      "blog.read": "Ler artigo",
      "blog.min": "min de leitura",
      "blog.back": "Voltar ao site",
      "blog.cat.digital": "Transformação digital",
      "blog.cat.wms": "Armazém · WMS",
      "blog.cat.fleet": "Frotas",
      "blog.cat.people": "Pessoas",
      "blog.cat.esg": "ESG",
      "blog.cat.kpi": "Operação",
      "blog.p1.title": "O que é transformação digital na logística e por onde começar",
      "blog.p1.desc": "Da coleta de dados à automação: um guia direto para tirar a sua operação do modo tradicional.",
      "blog.p2.title": "WMS na prática: controle de estoque em tempo real que reduz custos",
      "blog.p2.desc": "Como o endereçamento inteligente e os indicadores certos enxugam perdas no armazém.",
      "blog.p3.title": "Gestão de frotas inteligente: o que a telemetria revela",
      "blog.p3.desc": "Rotas, consumo e manutenção preditiva numa só visão para baixar o custo por entrega.",
      "blog.p4.title": "Capacitação de times logísticos: o ativo que mais escala",
      "blog.p4.desc": "Por que treinar pessoas no ritmo da operação acelera resultados mais que qualquer ferramenta isolada.",
      "blog.p5.title": "Créditos de carbono na logística: ESG que vira vantagem",
      "blog.p5.desc": "Como transformar a agenda ambiental em diferencial competitivo com ativos seguros e rastreáveis.",
      "blog.p6.title": "5 indicadores que todo armazém deveria acompanhar",
      "blog.p6.desc": "OTIF, acuracidade de estoque, produtividade e mais: o que medir para evoluir todo dia."
    },

    en: {
      "nav.home": "Home",
      "nav.solutions": "Solutions",
      "nav.about": "About",
      "nav.clients": "Clients",
      "nav.blog": "Blog",
      "nav.cta": "Talk to us",

      "hero.kicker": "Digital transformation in logistics",
      "hero.title": "We accelerate digital<br>transformation in <em>logistics</em>.",
      "hero.sub": "An ecosystem of solutions that optimizes time, resources and costs across our clients' operations, powered by innovation and technology.",
      "hero.cta1": "Talk to us",
      "hero.cta2": "Explore solutions",
      "hero.stat1": "moving logistics",
      "hero.stat2": "integrated solutions",
      "hero.stat3": "operations that scale",
      "hero.scroll": "scroll to explore",

      "sol.eyebrow": "Our ecosystem",
      "sol.title": "Solutions that drive real <em>digital transformation in logistics</em>",
      "sol.lead": "Four platforms that talk to each other to optimize every link of your operation, from warehouse to fleet, from team to environmental impact.",
      "sol.know": "Learn more",
      "sol.gtiplug.tag": "WMS · Warehouse management",
      "sol.gtiplug.desc": "A platform for strategic warehouse and product movement management: inventory control, smart slotting and real time productivity.",
      "sol.cosmos.tag": "Smart fleet · Fleets",
      "sol.cosmos.desc": "A smart fleet solution for integrated fleet monitoring and optimization: telemetry, routes and costs under control in a single view.",
      "sol.univexus.tag": "Training · People",
      "sol.univexus.desc": "Practical content to train, develop and upskill your team, fast, applicable and at the pace of your operation.",
      "sol.abundance.tag": "ESG · Carbon credits",
      "sol.abundance.desc": "Carbon credits that boost Brazil's environmental restoration through a secure and efficient crypto asset.",

      "about.eyebrow": "About us",
      "about.title": "We help you become more <em>digital</em> every day.",
      "about.text": "With a strategic, continuous vision for digital transformation, our team of logistics specialists diagnoses problems and generates business opportunities, with technology applied end to end.",
      "about.li1": "End-to-end diagnosis and strategy",
      "about.li2": "An integrated ecosystem of solutions",
      "about.li3": "Solid, measurable results",
      "about.cta": "Talk to us",

      "move.title": "Come move Brazil and the world with us",
      "move.text": "We solve companies' challenges with a culture built on solid results and a focus on innovation.",
      "move.cta": "See what we do",

      "depo.eyebrow": "Trusted by",
      "depo.title": "The <em>digital transformation</em> our clients achieved",
      "depo.q1": "Our partnership has always been extremely productive and efficient. The team is highly skilled and willing to help, and the products are top quality. We truly value this partnership.",
      "depo.q1role": "Commercial Director · Grupo Delta Facilities",
      "depo.q2": "The GTI PLUG team is very flexible and works to meet our needs as clients.",
      "depo.q2role": "BioGrow Brasil",
      "depo.q3": "GTI PLUG has greatly helped with a need that falls outside the standard market system. We had a huge gain in our logistics process, with low operating cost.",
      "depo.q3role": "Amapá",

      "clients.title": "Leading brands move with Letwe",

      "faq.eyebrow": "FAQ",
      "faq.title": "Frequently asked questions",
      "faq.lead": "Everything you need to know before accelerating the digital transformation of your logistics.",
      "faq.q1": "What is Letwe?",
      "faq.a1": "We are a digital transformation platform for logistics. We bring together an ecosystem of solutions that positively impacts our clients' operations, optimizing time, resources and costs while driving innovation.",
      "faq.q2": "Which companies are the solutions for?",
      "faq.a2": "From growing operations to large industries and logistics operators. Leading brands such as Ambev, Klabin, Porsche and Kuehne+Nagel already move with us.",
      "faq.q3": "How does GTI PLUG work?",
      "faq.a3": "It's our platform for strategic warehouse and product movement management: inventory control, smart slotting and real time productivity indicators, with low operating cost.",
      "faq.q4": "Do you operate across Brazil?",
      "faq.a4": "Yes. We serve operations all over Brazil and support clients moving cargo worldwide.",
      "faq.q5": "How do I get started?",
      "faq.a5": "Talk to us on WhatsApp or through the contact form. We assess your operation and recommend the solutions that deliver the most results for your business.",

      "cta.title": "It's your company's turn to go beyond the traditional.",
      "cta.text": "Boost your digital transformation with the best solutions for logistics.",
      "cta.cta": "Let's talk?",
      "cta.alt": "Other channels",

      "foot.tagline": "Digital transformation in logistics. An ecosystem of solutions that moves your business, from warehouse to fleet, from team to impact.",
      "foot.nav": "Navigation",
      "foot.sol": "Solutions",
      "foot.contact": "Contact",
      "foot.made": "Digital transformation in logistics",
      "foot.signBy": "Made by",

      "blog.eyebrow": "Letwe Blog",
      "blog.title": "Insights on logistics and digital transformation",
      "blog.lead": "Practical content on WMS, fleets, people and ESG for those who move Brazil and the world.",
      "blog.featured": "Featured",
      "blog.read": "Read article",
      "blog.min": "min read",
      "blog.back": "Back to site",
      "blog.cat.digital": "Digital transformation",
      "blog.cat.wms": "Warehouse · WMS",
      "blog.cat.fleet": "Fleets",
      "blog.cat.people": "People",
      "blog.cat.esg": "ESG",
      "blog.cat.kpi": "Operations",
      "blog.p1.title": "What digital transformation in logistics really means and where to start",
      "blog.p1.desc": "From data capture to automation: a straightforward guide to move your operation beyond the traditional.",
      "blog.p2.title": "WMS in practice: real time inventory control that cuts costs",
      "blog.p2.desc": "How smart slotting and the right indicators trim losses across the warehouse.",
      "blog.p3.title": "Smart fleet management: what telemetry reveals",
      "blog.p3.desc": "Routes, fuel and predictive maintenance in one view to lower cost per delivery.",
      "blog.p4.title": "Upskilling logistics teams: the asset that scales the most",
      "blog.p4.desc": "Why training people at the pace of the operation accelerates results more than any single tool.",
      "blog.p5.title": "Carbon credits in logistics: ESG that becomes an advantage",
      "blog.p5.desc": "How to turn the environmental agenda into a competitive edge with secure, traceable assets.",
      "blog.p6.title": "5 metrics every warehouse should track",
      "blog.p6.desc": "OTIF, inventory accuracy, productivity and more: what to measure to improve every day."
    }
  };

  var STORAGE_KEY = "letwe-lang";

  function getLang() {
    try {
      var s = localStorage.getItem(STORAGE_KEY);
      if (s === "pt" || s === "en") return s;
    } catch (e) {}
    return "pt";
  }

  function apply(lang) {
    var dict = DICT[lang] || DICT.pt;
    var nodes = document.querySelectorAll("[data-i18n]");
    for (var i = 0; i < nodes.length; i++) {
      var key = nodes[i].getAttribute("data-i18n");
      if (dict[key] != null) nodes[i].innerHTML = dict[key];
    }
    document.documentElement.setAttribute("lang", lang === "en" ? "en" : "pt-BR");

    var btns = document.querySelectorAll(".lang__btn");
    for (var j = 0; j < btns.length; j++) {
      var on = btns[j].getAttribute("data-lang") === lang;
      btns[j].classList.toggle("is-active", on);
      btns[j].setAttribute("aria-pressed", String(on));
    }
    try { localStorage.setItem(STORAGE_KEY, lang); } catch (e) {}
  }

  function init() {
    apply(getLang());
    var btns = document.querySelectorAll(".lang__btn");
    for (var i = 0; i < btns.length; i++) {
      btns[i].addEventListener("click", function () {
        apply(this.getAttribute("data-lang"));
      });
    }
  }

  // expõe para outras páginas (ex.: blog) reutilizarem o mesmo dicionário base
  window.LetweI18n = { apply: apply, getLang: getLang, DICT: DICT };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else { init(); }
})();
