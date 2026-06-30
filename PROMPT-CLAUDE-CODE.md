# PROMPT PARA O CLAUDE CODE — finalizar o rebrand Letwe

> Cole isto no Claude Code, já dentro da pasta `letwe-site/`. Ele tem rede + FFmpeg e
> assume o controle local. **A mecânica de scroll-vídeo já está pronta e o rebrand visual
> (marca, cores, fontes, conteúdo, blog, i18n) já foi aplicado.** Aqui é só o acabamento.

---

Você está na pasta `letwe-site/`. É o site institucional da **Letwe — Transformação digital
na logística**. A base de **hero com scroll-vídeo** já funciona e o site já foi reescrito na
identidade da Letwe (roxo `#613F92` + verde neon `#76FF93`, fontes **Poppins/Roboto**, logo
oficial em SVG, conteúdo real dos 4 produtos + prova social, **blog bilíngue** e **tradução PT/EN**).

**Não quebre a hero.** O `js/hero.js` desenha os frames no `<canvas>` conforme o scroll e
depende destes hooks no HTML: `#hero, #heroCanvas, #loader, #loaderBar, #nav, #navBurger,
#navLinks, .reveal, #heroContent, .hero__status, #scrollCue`. As seções abaixo da hero usam a
classe `.r-up` (revelada pelo `js/site.js`), **não** `.reveal`.

## Faça o acabamento (o "detalhe"):

1. **Suba e revise no navegador.** `python3 -m http.server 8080` e confira em desktop e mobile:
   - o scroll-vídeo da hero continua fluido (frames `assets/frames-video/` desktop e `assets/frames-mobile/` no mobile);
   - os **reveals** das seções entram suaves ao rolar;
   - o **seletor PT/EN** troca todos os textos e persiste ao recarregar (inclusive no `blog.html`);
   - a navbar troca de logo (clara → escura) ao rolar; o menu mobile abre/fecha.

2. **Logos reais dos clientes.** Hoje a seção "Clientes" (`#clientes`, no `index.html`) é um
   *marquee* com os **nomes** das marcas (Ambev, Klabin, Porsche, Kuehne+Nagel, Brinks, Grupo
   Delta, Fitoway, Codil, TSV, Grupo SA). Se tiver os SVGs/PNGs oficiais, troque os `<span>` por
   `<img>` em escala de cinza (filtro `grayscale`) com hover colorido. Mantenha o efeito de esteira.

3. **Conteúdo real do blog.** O `blog.html` tem 6 artigos com títulos/resumos coerentes com os
   produtos, mas os links são `#`. Aponte para os posts reais (a Letwe publica em
   `logisticaemobilidade.com.br`) ou crie páginas de post internas reaproveitando o header/footer.

4. **Favicon/OG em PNG (compatibilidade).** Existe `assets/img/favicon.svg`. Gere também
   `favicon-32.png`, `apple-touch-icon.png` (180px) e uma imagem OG `assets/img/poster.jpg`
   atualizada com a marca Letwe, e referencie no `<head>`. Confira se o símbolo no `favicon.svg`
   está bem centralizado (ajuste o `transform` do `<g>` se precisar).

5. **(Opcional) Hero própria da Letwe.** A imagem atual é de logística e combina. Se quiser uma
   cena nova, gere o vídeo, salve em `assets/video/letwe-hero.mp4` e rode
   `python3 tools/gerar_frames_video.py` para regenerar os dois sets de frames (mantém o método
   cinemagraph por máscara: fundo fiel da foto + céu/veículos do vídeo).

6. **Passada final de QA.** Rode um Lighthouse, confira contraste (o verde neon é só acento —
   nunca texto sobre branco), `node --check js/*.js`, e teste com `prefers-reduced-motion`.

## Referências de marca
- Cores: `#613F92` (roxo/main) + gradientes · `#76FF93` (neon/detalhe).
- Fontes: Poppins (títulos) + Roboto (texto). Logo: SVG vetorial (não precisa de fonte proprietária).
- WhatsApp oficial: `5531971326885` · Contato: `contate.me/letwe` · Produtos: GTI PLUG, COSMOS,
  UNIVEXUS, ABUNDANCE (abundancebrasil.com).
