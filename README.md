# LETWE — Site institucional (rebrand sobre a base de scroll-vídeo)

Site empresarial da **Letwe — Transformação digital na logística**, construído sobre a
mecânica de **hero com scroll-vídeo** (canvas que "toca" uma sequência de frames conforme
a página rola). Esta versão reaproveita **só o efeito da hero** e troca **marca, cores,
fontes, conteúdo e elementos** para a identidade da Letwe.

## Identidade
- **Cores:** roxo `#613F92` (marca) + variações/gradientes · **verde neon `#76FF93`** (detalhe/acento).
- **Tipografia:** **Poppins** (display/títulos) + **Roboto** (texto). A logo é vetorial (SVG), não depende de fonte proprietária.
- **Logo:** `assets/img/letwe-logo.svg` (símbolo roxo + texto escuro) e `assets/img/letwe-logo-light.svg` (símbolo neon + texto branco, p/ navbar sobre o vídeo e rodapé escuro).
- **Favicon:** `assets/img/favicon.svg` (símbolo da marca em quadrado com gradiente).

## O que tem
- **index.html** — uma página com: navbar (logo + idioma PT/EN + CTA WhatsApp), **hero scroll-vídeo**,
  **Soluções** (GTI PLUG, COSMOS, UNIVEXUS, ABUNDANCE — com SVGs autorais), **Sobre**, faixa
  **Movimento**, **Depoimentos** (clientes reais), **Clientes** (marquee de marcas), **FAQ** e **CTA final**.
- **blog.html** — blog na mesma identidade: post em destaque + grid de 6 artigos cobrindo
  WMS, frotas, pessoas, ESG e KPIs. Bilíngue.
- **Tradução PT/EN** — `js/i18n.js` aplica as traduções a `[data-i18n]` e persiste a escolha
  em `localStorage('letwe-lang')`. O seletor fica na navbar.

## Como rodar
Precisa ser servido por HTTP (o canvas carrega os frames via `fetch`/`Image`):

```bash
cd letwe-site
python3 -m http.server 8080
# abra http://localhost:8080
```

## Estrutura
```
letwe-site/
├─ index.html              # home (hero scroll-vídeo + seções Letwe)
├─ blog.html               # blog (bilíngue)
├─ css/
│  └─ style.css            # design system Letwe (roxo + neon, Poppins/Roboto)
├─ js/
│  ├─ hero.js              # scroll-vídeo no <canvas> (intocado na mecânica)
│  ├─ i18n.js              # dicionário PT/EN + troca de idioma
│  └─ site.js              # scroll-reveal das seções, ano, FAQ, navbar do blog
├─ assets/
│  ├─ img/                 # logos, favicon, poster, imagem original
│  ├─ frames-video/        # 100 frames (desktop) do vídeo — cinemagraph por máscara
│  ├─ frames-mobile/       # 72 frames (mobile, recorte 9:16)
│  └─ video/letwe-hero.mp4 # vídeo-fonte (só p/ regerar frames; o site usa os frames)
└─ tools/
   ├─ gerar_frames.py      # gera frames (modo "zoom" antigo)
   └─ gerar_frames_video.py# gera frames a partir do vídeo (cinemagraph/máscara)
```

## Como a hero funciona (resumo)
A seção `.hero` é mais alta que a tela (300vh). O bloco interno fica `sticky` e o
`<canvas>` desenha o frame correspondente à posição do scroll. Em telas até 760px usa
`frames-mobile/` (9:16). Degrada com graça sem JS e respeita `prefers-reduced-motion`.

> A imagem da hero é de logística (porto/rodovia) — combina com o posicionamento da Letwe
> e foi **mantida de propósito**, conforme o briefing.
