(function () {
  "use strict";
  var CFG = window.LUCERNA_CONFIG || {};
  var L = window.LUCERNA;
  var root = document.documentElement;
  var reduz = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var params = new URLSearchParams(location.search);
  var SETA = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
  var ICO = {
    area: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M4 4h16v16H4z"/><path d="M4 9h5V4M20 15h-5v5"/></svg>',
    quarto: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true"><path d="M3 18V8M3 14h18v4M21 14v-2a3 3 0 0 0-3-3h-7v5"/><circle cx="7" cy="11" r="1.6"/></svg>',
    banho: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true"><path d="M3 12h18v2a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5zM6 12V6a2 2 0 0 1 4 0M7 19l-1 2M17 19l1 2"/></svg>',
    vaga: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 16V11l2-5h10l2 5v5M3 16h18v3H3z"/><circle cx="7.5" cy="13.5" r=".8"/><circle cx="16.5" cy="13.5" r=".8"/></svg>'
  };

  /* =========================================================
     Abertura animada (home, primeira visita da sessão)
     ========================================================= */
  var intro = document.getElementById("intro");
  if (intro && root.classList.contains("intro-on")) {
    var acabou = false;
    var eventos = ["keydown", "pointerdown", "wheel", "touchstart"];
    var fim = function () {
      if (acabou) return;
      acabou = true;
      root.classList.remove("intro-lock");
      intro.remove();
      eventos.forEach(function (ev) { window.removeEventListener(ev, pular); });
    };
    var pular = function () {
      if (acabou || intro.classList.contains("is-leaving")) return;
      intro.classList.add("is-leaving");
      try {
        var h1 = $(".hero h1");
        var anim = h1 && h1.getAnimations && h1.getAnimations()[0];
        if (anim && anim.startTime !== null && document.timeline) {
          var passou = (document.timeline.currentTime - anim.startTime) / 1000;
          if (passou < 3.1) root.style.setProperty("--hero-start", Math.max(passou, 0).toFixed(2) + "s");
        }
      } catch (e) { /* mantém o tempo padrão */ }
      setTimeout(fim, 400);
    };
    intro.addEventListener("animationend", function (e) { if (e.target === intro) fim(); });
    eventos.forEach(function (ev) { window.addEventListener(ev, pular, { passive: true }); });
    setTimeout(fim, 5500);
  }

  /* =========================================================
     Navegação
     ========================================================= */
  var toggle = $(".nav-toggle"), nav = document.getElementById("site-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var aberto = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(aberto));
      root.classList.toggle("menu-open", aberto);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("is-open")) {
        nav.classList.remove("is-open"); root.classList.remove("menu-open");
        toggle.setAttribute("aria-expanded", "false"); toggle.focus();
      }
    });
  }

  var header = $(".site-header"), topo = $(".to-top"), heroMedia = $(".hero-media");
  var tick = false;
  var onScroll = function () {
    var y = window.scrollY;
    if (header) header.classList.toggle("is-scrolled", y > 24);
    if (topo) topo.classList.toggle("is-visible", y > 700);
    if (heroMedia && !reduz && y < window.innerHeight * 1.2) heroMedia.style.transform = "translate3d(0," + (y * 0.25).toFixed(1) + "px,0)";
    tick = false;
  };
  window.addEventListener("scroll", function () { if (!tick) { tick = true; requestAnimationFrame(onScroll); } }, { passive: true });
  onScroll();
  if (topo) topo.addEventListener("click", function () { window.scrollTo({ top: 0, behavior: reduz ? "auto" : "smooth" }); });

  $$("[data-year]").forEach(function (el) { el.textContent = new Date().getFullYear(); });

  /* =========================================================
     Dados configuráveis (config.js)
     ========================================================= */
  function formatarTel(v) {
    var d = String(v).replace(/\D/g, "");
    if (d.indexOf("55") === 0 && d.length > 11) d = d.slice(2);
    if (d.length === 11) return "(" + d.slice(0, 2) + ") " + d.slice(2, 7) + "-" + d.slice(7);
    if (d.length === 10) return "(" + d.slice(0, 2) + ") " + d.slice(2, 6) + "-" + d.slice(6);
    return v;
  }
  $$("[data-config]").forEach(function (el) {
    var k = el.getAttribute("data-config"), v = (CFG[k] || "").trim(), wrap = el.closest("[data-config-wrap]");
    if (!v) { if (wrap) wrap.hidden = true; return; }
    if (el.tagName === "A") {
      el.href = k === "email" ? "mailto:" + v : k === "telefone" ? "tel:" + v.replace(/[^\d+]/g, "") : k === "whatsapp" ? "https://wa.me/" + v.replace(/\D/g, "") : v;
      if (/^https?:/.test(el.href)) { el.target = "_blank"; el.rel = "noopener"; }
    }
    if (!el.hasAttribute("data-config-keep-text")) el.textContent = k === "whatsapp" ? formatarTel(v) : v;
    if (wrap) wrap.hidden = false;
  });
  $$("[data-channel]").forEach(function (el) {
    if (!(CFG[el.getAttribute("data-channel")] || "").trim()) el.innerHTML = '<span class="pending">A informar</span>';
  });

  /* =========================================================
     Animações de entrada ao rolar
     ========================================================= */
  var observador = ("IntersectionObserver" in window && !reduz) ? new IntersectionObserver(function (entradas) {
    entradas.forEach(function (e) {
      if (!e.isIntersecting) return;
      e.target.classList.add("is-visible");
      if (e.target.hasAttribute("data-count")) contar(e.target);
      observador.unobserve(e.target);
    });
  }, { rootMargin: "0px 0px -8% 0px", threshold: 0.12 }) : null;

  function revelar(escopo) {
    $$("[data-reveal], [data-count]", escopo).forEach(function (el) {
      if (observador) observador.observe(el);
      else { el.classList.add("is-visible"); if (el.hasAttribute("data-count")) el.textContent = L.brl(+el.getAttribute("data-count")); }
    });
  }

  function contar(el) {
    var alvo = +el.getAttribute("data-count"), t0 = null, dur = 1300;
    var passo = function (t) {
      if (!t0) t0 = t;
      var p = Math.min((t - t0) / dur, 1), ease = 1 - Math.pow(1 - p, 3);
      el.textContent = L.brl(Math.round(alvo * ease / 100) * 100);
      if (p < 1) requestAnimationFrame(passo); else el.textContent = L.brl(alvo);
    };
    requestAnimationFrame(passo);
  }

  /* =========================================================
     Cartões de projeto
     ========================================================= */
  function img(nome, alt, foco, sizes, extra) {
    return '<img src="assets/img/' + nome + '-800.webp" srcset="assets/img/' + nome + '-800.webp 800w, assets/img/' + nome + '-1600.webp 1600w" sizes="' + (sizes || "100vw") + '" width="800" height="450" loading="lazy" decoding="async" alt="' + alt + '" style="object-position:' + (foco || "50% 50%") + '"' + (extra || "") + ">";
  }
  function cartao(p, i) {
    var url = "projeto.html?id=" + p.id;
    return '<article class="project-card" data-reveal style="--d:' + ((i || 0) % 3 * 0.12) + 's">' +
      '<a class="project-link" href="' + url + '" aria-label="Ver o projeto ' + p.nome + '"></a>' +
      '<figure class="figure">' + img(p.img, p.alt, p.foco, "(max-width: 640px) 100vw, (max-width: 980px) 50vw, 380px") +
        '<figcaption>Imagem ilustrativa</figcaption><span class="card-tag">' + p.tipoLabel + ' · ' + p.estilo + '</span></figure>' +
      '<div class="project-body">' +
        '<h3>' + p.nome + '</h3><p class="project-frase">' + p.frase + '</p>' +
        '<ul class="facts">' +
          '<li>' + ICO.area + '<span><b>' + L.num(p.area) + '</b> m²</span></li>' +
          '<li>' + ICO.quarto + '<span><b>' + p.quartos + '</b> ' + (p.quartos > 1 ? "quartos" : "quarto") + '</span></li>' +
          '<li>' + ICO.banho + '<span><b>' + p.banheiros + '</b> ' + (p.banheiros > 1 ? "banheiros" : "banheiro") + '</span></li>' +
        '</ul>' +
        '<div class="price-row"><div><span class="price-label">Chave na Mão a partir de</span><span class="price-value">' + L.brl(L.preco(p, "chave")) + '</span>' +
        '<span class="price-sub">Estrutura a partir de ' + L.brl(L.preco(p, "estrutura")) + '</span></div>' +
        '<span class="card-arrow" aria-hidden="true">' + SETA + '</span></div>' +
      '</div></article>';
  }

  var destaque = $("[data-projects-preview]");
  if (destaque && L) {
    destaque.innerHTML = L.PROJETOS.filter(function (p) { return p.destaque; }).slice(0, 3).map(cartao).join("");
  }

  /* =========================================================
     Catálogo com filtros
     ========================================================= */
  var grade = $("[data-projects-grid]");
  if (grade && L) {
    var precos = L.PROJETOS.map(function (p) { return L.preco(p, "chave"); });
    var minP = Math.floor(Math.min.apply(null, precos) / 10000) * 10000, maxP = Math.ceil(Math.max.apply(null, precos) / 10000) * 10000;
    var F = { tipo: params.get("tipo") || "todos", quartos: 0, area: "todas", max: maxP, ordem: "destaque" };
    var faixa = $("#f-preco"), faixaOut = $("#f-preco-out"), ordem = $("#f-ordem"), cont = $("[data-results-count]"), vazio = $("[data-empty]");
    faixa.min = minP; faixa.max = maxP; faixa.step = 10000; faixa.value = maxP; faixaOut.textContent = L.brl(maxP);

    var AREAS = { todas: [0, 9999], ate80: [15, 80], "80a120": [80, 120], acima120: [120, 9999] };
    var aplicar = function () {
      var lista = L.PROJETOS.filter(function (p) {
        var a = AREAS[F.area];
        return (F.tipo === "todos" || p.tipo === F.tipo) && p.quartos >= F.quartos && p.area >= a[0] && p.area < a[1] && L.preco(p, "chave") <= F.max;
      });
      var ord = {
        destaque: function (a, b) { return (b.destaque ? 1 : 0) - (a.destaque ? 1 : 0); },
        menor: function (a, b) { return L.preco(a, "chave") - L.preco(b, "chave"); },
        maior: function (a, b) { return L.preco(b, "chave") - L.preco(a, "chave"); },
        area: function (a, b) { return b.area - a.area; }
      }[F.ordem];
      lista.sort(ord);
      grade.innerHTML = lista.map(cartao).join("");
      $$(".project-card", grade).forEach(function (c, i) { c.style.setProperty("--d", (i * 0.07) + "s"); c.classList.add("is-entering"); });
      requestAnimationFrame(function () { $$(".project-card", grade).forEach(function (c) { c.classList.add("is-visible"); }); });
      cont.textContent = lista.length + (lista.length === 1 ? " projeto encontrado" : " projetos encontrados");
      vazio.hidden = lista.length !== 0;
    };
    var marcar = function (grupo, valor) {
      $$('.chip[data-filter="' + grupo + '"]').forEach(function (c) { c.setAttribute("aria-pressed", String(c.dataset.value === String(valor))); });
    };
    $$(".chip[data-filter]").forEach(function (c) {
      c.addEventListener("click", function () {
        var g = c.dataset.filter;
        F[g] = g === "quartos" ? +c.dataset.value : c.dataset.value;
        marcar(g, c.dataset.value); aplicar();
      });
    });
    faixa.addEventListener("input", function () { F.max = +faixa.value; faixaOut.textContent = L.brl(F.max); aplicar(); });
    ordem.addEventListener("change", function () { F.ordem = ordem.value; aplicar(); });
    $$("[data-reset-filters]").forEach(function (b) {
      b.addEventListener("click", function () {
        F.tipo = "todos"; F.quartos = 0; F.area = "todas"; F.max = maxP; F.ordem = "destaque";
        marcar("tipo", "todos"); marcar("quartos", 0); marcar("area", "todas");
        faixa.value = maxP; faixaOut.textContent = L.brl(maxP); ordem.value = "destaque"; aplicar();
      });
    });
    var painel = $("#filtros"), abrir = $("[data-filters-toggle]");
    if (abrir) abrir.addEventListener("click", function () {
      var a = painel.classList.toggle("is-open"); abrir.setAttribute("aria-expanded", String(a));
    });
    marcar("tipo", F.tipo);
    aplicar();
  }

  /* =========================================================
     Página do projeto
     ========================================================= */
  function plantaSVG(pl) {
    var S = 54, pad = 48, W = pl.w * S, H = pl.h * S;
    var c = pl.comodos.map(function (r) {
      var n = r[0], x = r[1], y = r[2], w = r[3], h = r[4], peq = w < 2.2 || h < 1.7, fs = peq ? 11 : 13.5;
      var cx = pad + (x + w / 2) * S, cy = pad + (y + h / 2) * S, degraus = "";
      if (n === "Escada") for (var i = 1; i < Math.floor(h * S / 15); i++) degraus += '<line x1="' + (pad + x * S) + '" x2="' + (pad + (x + w) * S) + '" y1="' + (pad + y * S + i * 15) + '" y2="' + (pad + y * S + i * 15) + '" stroke="#C9BBA4"/>';
      return '<g class="room"><rect x="' + (pad + x * S) + '" y="' + (pad + y * S) + '" width="' + (w * S) + '" height="' + (h * S) + '" fill="#FFFDF8" stroke="#243B32" stroke-width="3"/>' + degraus +
        '<text x="' + cx + '" y="' + (cy - 2) + '" text-anchor="middle" font-size="' + fs + '" font-weight="700" fill="#243B32" font-family="Manrope, sans-serif">' + n + '</text>' +
        '<text x="' + cx + '" y="' + (cy + fs + 2) + '" text-anchor="middle" font-size="' + (fs - 1.5) + '" fill="#594638" font-family="Manrope, sans-serif">' + L.num(w * h, 2) + ' m²</text></g>';
    }).join("");
    var cota = '<g stroke="#A58B68" stroke-width="1"><line x1="' + pad + '" x2="' + (pad + W) + '" y1="' + (pad - 24) + '" y2="' + (pad - 24) + '"/><line x1="' + pad + '" x2="' + pad + '" y1="' + (pad - 30) + '" y2="' + (pad - 18) + '"/><line x1="' + (pad + W) + '" x2="' + (pad + W) + '" y1="' + (pad - 30) + '" y2="' + (pad - 18) + '"/>' +
      '<line x1="' + (pad - 24) + '" x2="' + (pad - 24) + '" y1="' + pad + '" y2="' + (pad + H) + '"/><line x1="' + (pad - 30) + '" x2="' + (pad - 18) + '" y1="' + pad + '" y2="' + pad + '"/><line x1="' + (pad - 30) + '" x2="' + (pad - 18) + '" y1="' + (pad + H) + '" y2="' + (pad + H) + '"/></g>' +
      '<text x="' + (pad + W / 2) + '" y="' + (pad - 30) + '" text-anchor="middle" font-size="12.5" fill="#594638" font-family="Manrope, sans-serif">' + L.num(pl.w, 2) + ' m</text>' +
      '<text x="' + (pad - 30) + '" y="' + (pad + H / 2) + '" text-anchor="middle" font-size="12.5" fill="#594638" font-family="Manrope, sans-serif" transform="rotate(-90 ' + (pad - 30) + ' ' + (pad + H / 2) + ')">' + L.num(pl.h, 2) + ' m</text>';
    return '<svg class="plan-svg" viewBox="0 0 ' + (W + pad * 2) + ' ' + (H + pad * 2) + '" role="img" aria-label="Planta baixa ilustrativa, ' + pl.nome + '">' + cota + '<rect x="' + pad + '" y="' + pad + '" width="' + W + '" height="' + H + '" fill="none" stroke="#243B32" stroke-width="6"/>' + c + '</svg>';
  }

  function planta3DSVG(pl) {
    var pad = 42, parede = 30, sx = Math.min(30, 540 / (pl.w + pl.h)), sy = sx * .56;
    var largura = (pl.w + pl.h) * sx + pad * 2, altura = (pl.w + pl.h) * sy + parede + pad * 2;
    var pt = function (x, y, z) { return [pad + (x - y) * sx + pl.h * sx, pad + parede + (x + y) * sy - z]; };
    var poly = function (pts) { return pts.map(function (p) { return p[0].toFixed(1) + "," + p[1].toFixed(1); }).join(" "); };
    var a = pt(0, 0, 0), b = pt(pl.w, 0, 0), c = pt(pl.w, pl.h, 0), d = pt(0, pl.h, 0);
    var A = pt(0, 0, parede), B = pt(pl.w, 0, parede), C = pt(pl.w, pl.h, parede), D = pt(0, pl.h, parede);
    var faces = '<polygon points="' + poly([B, C, c, b]) + '" fill="#BFA47E" stroke="#70583F" stroke-width="1.5"/>' +
      '<polygon points="' + poly([C, D, d, c]) + '" fill="#A98E6D" stroke="#70583F" stroke-width="1.5"/>' +
      '<polygon points="' + poly([A, B, C, D]) + '" fill="#E9E0D0" stroke="#243B32" stroke-width="2"/>';
    var cores = ["#F8F4EA", "#EDE4D5", "#F4EBDD", "#E5EADF"];
    var rooms = pl.comodos.map(function (r, i) {
      var n = r[0], x = r[1], y = r[2], w = r[3], h = r[4];
      var q = [pt(x, y, parede + .5), pt(x + w, y, parede + .5), pt(x + w, y + h, parede + .5), pt(x, y + h, parede + .5)];
      var mid = pt(x + w / 2, y + h / 2, parede + 1), fs = Math.max(8, Math.min(12, sx * .42));
      var textWidth = Math.max(26, Math.min((w + h) * sx * .7, 180));
      return '<g><polygon points="' + poly(q) + '" fill="' + cores[i % cores.length] + '" stroke="#8E7960" stroke-width="1.2" stroke-linejoin="round"/>' +
        '<text x="' + mid[0].toFixed(1) + '" y="' + (mid[1] - 1).toFixed(1) + '" text-anchor="middle" textLength="' + textWidth.toFixed(1) + '" lengthAdjust="spacingAndGlyphs" font-size="' + fs.toFixed(1) + '" font-weight="700" fill="#243B32" font-family="Manrope, sans-serif">' + n + '</text>' +
        '<text x="' + mid[0].toFixed(1) + '" y="' + (mid[1] + fs + 2).toFixed(1) + '" text-anchor="middle" font-size="' + Math.max(7, fs - 2).toFixed(1) + '" fill="#594638" font-family="Manrope, sans-serif">' + L.num(w * h, 1) + ' m²</text></g>';
    }).join("");
    return '<svg class="plan-svg plan-svg--3d" viewBox="0 0 ' + largura.toFixed(1) + ' ' + altura.toFixed(1) + '" role="img" aria-label="Planta 3D ilustrativa, ' + pl.nome + '"><ellipse cx="' + (largura / 2).toFixed(1) + '" cy="' + (altura - 22).toFixed(1) + '" rx="' + ((pl.w + pl.h) * sx * .4).toFixed(1) + '" ry="10" fill="#102B33" fill-opacity=".08"/>' + faces + rooms + '<polygon points="' + poly([A, B, C, D]) + '" fill="none" stroke="#243B32" stroke-width="2.4" stroke-linejoin="round"/></svg>';
  }

  /* 5 itens de destaque por pacote: o 1º lista o que inclui; os seguintes, "Tudo do anterior" + o que acrescentam */
  function destaques(i) {
    if (i === 0) return L.ITENS.filter(function (it) { return it[2]; }).slice(0, 5).map(function (it) { return it[1]; });
    return ["Tudo do pacote " + L.PACOTES[i - 1].nome].concat(
      L.ITENS.filter(function (it) { return it[2 + i] && !it[1 + i]; }).slice(0, 4).map(function (it) { return it[1]; }));
  }

  var detalhe = $("[data-projeto]");
  if (detalhe && L) {
    var p = L.porId(params.get("id")) || L.PROJETOS[0];
    document.title = p.nome + " | Green House Casas e Chalés";
    $$("[data-crumb-atual]").forEach(function (el) { el.textContent = p.nome; });

    var abas = [{ id: "fachada", rot: "Fachada" }, { id: "interior", rot: "Interior" }];
    p.plantas.forEach(function (pl, i) {
      var andar = p.plantas.length > 1 ? " · " + pl.nome : "";
      abas.push({ id: "planta2d-" + i, rot: "Planta 2D" + andar });
      abas.push({ id: "planta3d-" + i, rot: "Planta 3D" + andar });
    });
    var comodos = p.plantas.map(function (pl) {
      return (p.plantas.length > 1 ? '<li class="rooms-floor">' + pl.nome + '</li>' : "") + pl.comodos.filter(function (r) { return r[0] !== "Circulação" && r[0] !== "Escada"; }).map(function (r) { return '<li><span>' + r[0] + '</span><span>' + L.num(r[3] * r[4], 2) + ' m²</span></li>'; }).join("");
    }).join("");

    detalhe.innerHTML =
      '<section class="product-top"><div class="container">' +
        '<div class="product-head" data-reveal>' +
          '<div class="product-title"><span class="eyebrow">' + p.tipoLabel + ' · ' + p.estilo + '</span><h1>' + p.nome + '</h1><p class="lead">' + p.frase + '</p>' +
            '<ul class="facts facts--lg">' +
              '<li>' + ICO.area + '<span><b>' + L.num(p.area) + '</b> m²</span></li>' +
              '<li>' + ICO.quarto + '<span><b>' + p.quartos + '</b> ' + (p.quartos > 1 ? "quartos" : "quarto") + (p.suites ? " (" + p.suites + (p.suites > 1 ? " suítes" : " suíte") + ")" : "") + '</span></li>' +
              '<li>' + ICO.banho + '<span><b>' + p.banheiros + '</b> ' + (p.banheiros > 1 ? "banheiros" : "banheiro") + '</span></li>' +
              '<li>' + ICO.vaga + '<span><b>' + p.vagas + '</b> ' + (p.vagas === 1 ? "vaga" : "vagas") + '</span></li>' +
            '</ul></div>' +
          '<div class="product-price"><span class="price-label">Chave na Mão a partir de</span><span class="price-value price-value--lg" data-count="' + L.preco(p, "chave") + '">' + L.brl(L.preco(p, "chave")) + '</span>' +
            '<span class="price-sub">Obra em cerca de ' + p.prazos.chave + ' dias · valores fictícios</span>' +
            '<a class="btn btn-primary" href="#orcar">Solicitar orçamento ' + SETA + '</a></div>' +
        '</div>' +
        '<div class="product-grid">' +
          '<div class="gallery" data-reveal>' +
            '<div class="tabs" role="tablist" aria-label="Imagens do projeto">' + abas.map(function (a, i) { return '<button type="button" class="tab" role="tab" id="tab-' + a.id + '" aria-controls="painel-galeria" aria-selected="' + (i === 0) + '" data-tab="' + a.id + '">' + a.rot + '</button>'; }).join("") + '</div>' +
            '<div class="gallery-stage" id="painel-galeria" role="tabpanel" aria-live="polite"></div>' +
            '<p class="product-desc">' + p.descricao + '</p>' +
            '<div class="rooms-block"><h3>Cômodos</h3><ul class="rooms rooms--cols">' + comodos + '</ul></div>' +
          '</div>' +
          '<aside class="spec-card" data-reveal style="--d:.15s"><h2>Ficha técnica</h2>' +
            '<dl class="specs">' +
              '<dt>Área construída</dt><dd>' + L.num(p.area) + ' m²</dd>' +
              '<dt>Dimensões da casa</dt><dd>' + L.num(p.medidas[0], 2) + ' × ' + L.num(p.medidas[1], 2) + ' m</dd>' +
              '<dt>Terreno mínimo</dt><dd>' + L.num(p.terreno[0]) + ' × ' + L.num(p.terreno[1]) + ' m</dd>' +
              '<dt>Pé-direito</dt><dd>' + p.peDireito + '</dd>' +
              '<dt>Pavimentos</dt><dd>' + p.pavimentos + '</dd>' +
              '<dt>Quartos / suítes</dt><dd>' + p.quartos + ' / ' + p.suites + '</dd>' +
              '<dt>Banheiros</dt><dd>' + p.banheiros + '</dd>' +
              '<dt>Vagas</dt><dd>' + p.vagas + '</dd>' +
            '</dl>' +
            '<p class="form-note">Dados de exemplo para demonstração. Medidas sujeitas ao projeto executivo.</p></aside>' +
        '</div>' +
      '</div></section>' +

      '<section class="section section--sand" aria-labelledby="pacotes-titulo"><div class="container">' +
        '<div class="section-head section-head--row" data-reveal><div style="display:grid;gap:14px"><span class="eyebrow">Pacotes</span><h2 id="pacotes-titulo">Escolha até onde a Green House vai</h2></div><a class="btn btn-outline" href="pacotes.html">Comparar item a item ' + SETA + '</a></div>' +
        '<div class="packages">' + L.PACOTES.map(function (pk, i) {
          var n = L.ITENS.filter(function (it) { return it[2 + i]; }).length;
          return '<article class="package' + (i === 2 ? " package--featured" : "") + '" data-reveal style="--d:' + (i * 0.12) + 's">' +
            (i === 2 ? '<span class="package-badge">Mais completo</span>' : "") +
            '<h3>' + pk.nome + '</h3><p class="package-for">' + pk.para + '</p>' +
            '<div class="package-price"><span class="price-label">a partir de</span><span class="price-value" data-count="' + L.preco(p, pk.id) + '">' + L.brl(L.preco(p, pk.id)) + '</span><span class="price-sub">Obra em cerca de ' + p.prazos[pk.id] + ' dias · ' + n + ' de ' + L.ITENS.length + ' itens</span></div>' +
            '<ul class="package-list">' + destaques(i).map(function (t) { return '<li class="yes"><span class="mark" aria-hidden="true"></span>' + t + '</li>'; }).join("") + '</ul>' +
            '<details class="package-more"><summary>Ver todos os itens</summary><ul class="package-list">' + L.ITENS.map(function (it) { return '<li class="' + (it[2 + i] ? "yes" : "no") + '"><span class="mark" aria-hidden="true"></span>' + it[1] + (it[2 + i] ? "" : '<span class="visually-hidden"> (não incluso)</span>') + '</li>'; }).join("") + '</ul></details>' +
            '<a class="btn ' + (i === 2 ? "btn-primary" : "btn-outline") + '" href="contato.html?projeto=' + p.id + '&pacote=' + pk.id + '">Orçar ' + pk.nome + '</a></article>';
        }).join("") + '</div>' +
        '<div class="note" data-reveal><strong>Fica por conta do cliente em qualquer pacote:</strong> ' + L.FORA.join(", ").toLowerCase() + '. Valores fictícios, para demonstração; o valor final depende da análise do terreno.</div>' +
      '</div></section>' +

      '<section class="section" id="orcar" aria-labelledby="orcar-titulo"><div class="container"><div class="cta-inline" data-reveal>' +
        '<div><span class="eyebrow">Orçamento</span><h2 id="orcar-titulo">Leve o projeto ' + p.nome + ' para o seu terreno</h2><p class="lead">Conte onde fica o terreno e qual pacote faz sentido. Um especialista responde com o orçamento.</p></div>' +
        '<a class="btn btn-primary" href="contato.html?projeto=' + p.id + '">Solicitar orçamento ' + SETA + '</a></div></div></section>' +

      '<section class="section section--sand" aria-labelledby="similares"><div class="container"><div class="section-head" data-reveal><span class="eyebrow">Veja também</span><h2 id="similares">Outros projetos</h2></div><div class="projects">' +
        L.PROJETOS.filter(function (x) { return x.id !== p.id; }).sort(function (a, b) { return (a.tipo === p.tipo ? -1 : 0) - (b.tipo === p.tipo ? -1 : 0); }).slice(0, 3).map(cartao).join("") +
      '</div></div></section>';

    var palco = $(".gallery-stage");
    var mostrar = function (id) {
      $$(".tab", detalhe).forEach(function (t) { t.setAttribute("aria-selected", String(t.dataset.tab === id)); });
      var html;
      if (id === "fachada") html = '<figure class="figure figure--stage">' + img(p.img, p.alt, p.foco, "(max-width: 960px) 100vw, 760px", ' loading="eager"') + '<figcaption>Fachada ilustrativa</figcaption></figure>';
      else if (id === "interior") html = '<figure class="figure figure--stage">' + img(p.interior, "Interior ilustrativo do projeto " + p.nome, "50% 50%", "(max-width: 960px) 100vw, 760px", ' loading="eager"') + '<figcaption>Imagem ilustrativa gerada por IA; acabamentos e disposição podem variar.</figcaption></figure>';
      else {
        var partes = id.split("-"), tipoPlanta = partes[0] === "planta3d" ? "3d" : "2d", andarIndex = +partes[1], planta = p.plantas[andarIndex], e3D = tipoPlanta === "3d";
        html = '<div class="plan-box"><h3 class="plan-title">' + (e3D ? "Planta 3D" : "Planta 2D") + (p.plantas.length > 1 ? " · " + planta.nome : "") + '</h3>' +
          (e3D ? planta3DSVG(planta) : plantaSVG(planta)) +
          '<p class="form-note">Planta ilustrativa baseada na distribuição cadastrada. Medidas sujeitas ao projeto executivo.</p></div>';
      }
      palco.classList.remove("is-swapping"); void palco.offsetWidth;
      palco.innerHTML = html; palco.classList.add("is-swapping");
    };
    $$(".tab", detalhe).forEach(function (t) {
      t.addEventListener("click", function () { mostrar(t.dataset.tab); });
      t.addEventListener("keydown", function (e) {
        if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
        var ts = $$(".tab", detalhe), i = ts.indexOf(t), n = ts[(i + (e.key === "ArrowRight" ? 1 : -1) + ts.length) % ts.length];
        n.focus(); n.click();
      });
    });
    mostrar("fachada");
  }

  /* =========================================================
     Página de pacotes
     ========================================================= */
  var tabela = $("[data-pacotes-tabela]");
  if (tabela && L) {
    tabela.innerHTML = '<thead><tr><th scope="col">Etapa</th><th scope="col">Item</th>' + L.PACOTES.map(function (pk) { return '<th scope="col" class="c">' + pk.nome + '</th>'; }).join("") + '</tr></thead><tbody>' +
      L.ITENS.map(function (it) { return '<tr><td class="grp">' + it[0] + '</td><td>' + it[1] + '</td>' + [2, 3, 4].map(function (i) { return '<td class="c">' + (it[i] ? '<span class="tick" aria-label="Incluso"></span>' : '<span class="dash" aria-label="Não incluso">—</span>') + '</td>'; }).join("") + '</tr>'; }).join("") + '</tbody>';
  }
  var exemplo = $("[data-pacotes-exemplo]");
  if (exemplo && L) {
    exemplo.innerHTML = '<thead><tr><th scope="col">Projeto</th><th scope="col" class="c">Área</th>' + L.PACOTES.map(function (pk) { return '<th scope="col" class="c">' + pk.nome + '</th>'; }).join("") + '</tr></thead><tbody>' +
      L.PROJETOS.map(function (p) { return '<tr><td><a href="projeto.html?id=' + p.id + '">' + p.nome + '</a></td><td class="c">' + L.num(p.area) + ' m²</td>' + L.PACOTES.map(function (pk) { return '<td class="c"><strong>' + L.brl(L.preco(p, pk.id)) + '</strong><br><span class="price-sub">' + p.prazos[pk.id] + ' dias</span></td>'; }).join("") + '</tr>'; }).join("") + '</tbody>';
  }
  var resumo = $("[data-pacotes-resumo]");
  if (resumo && L) {
    var ref = L.PROJETOS.reduce(function (a, b) { return L.preco(a, "estrutura") < L.preco(b, "estrutura") ? a : b; });
    resumo.innerHTML = L.PACOTES.map(function (pk, i) {
      var n = L.ITENS.filter(function (it) { return it[2 + i]; }).length;
      return '<article class="package package--mini' + (i === 2 ? " package--featured" : "") + '" data-reveal style="--d:' + (i * 0.12) + 's">' +
        (i === 2 ? '<span class="package-badge">Mais completo</span>' : "") +
        '<span class="package-step">Nível ' + (i + 1) + '</span><h3>' + pk.nome + '</h3><p>' + pk.resumo + '</p>' +
        '<div class="meter" aria-hidden="true"><span style="--w:' + Math.round(n / L.ITENS.length * 100) + '%"></span></div>' +
        '<p class="price-sub">' + n + ' de ' + L.ITENS.length + ' itens · a partir de <strong>' + L.brl(L.preco(ref, pk.id)) + '</strong></p></article>';
    }).join("");
  }

  /* =========================================================
     Pedido de orçamento
     ========================================================= */
  var form = document.getElementById("contact-form");
  if (form && L) {
    var selProj = form.elements.projeto, selPac = form.elements.pacote;
    L.PROJETOS.forEach(function (p) { selProj.insertAdjacentHTML("beforeend", '<option value="' + p.id + '">' + p.nome + ' (' + L.num(p.area) + ' m²)</option>'); });
    L.PACOTES.forEach(function (pk) { selPac.insertAdjacentHTML("beforeend", '<option value="' + pk.id + '">' + pk.nome + '</option>'); });
    if (L.porId(params.get("projeto"))) selProj.value = params.get("projeto");
    if (params.get("pacote")) selPac.value = params.get("pacote");

    var tel = form.elements.telefone;
    tel.addEventListener("input", function () {
      var d = tel.value.replace(/\D/g, "").slice(0, 11), f = d;
      if (d.length > 2) f = "(" + d.slice(0, 2) + ") " + d.slice(2);
      if (d.length > 6) f = "(" + d.slice(0, 2) + ") " + d.slice(2, d.length - 4) + "-" + d.slice(-4);
      tel.value = f;
    });

    var boxTerreno = $("#terreno-medidas");
    var atualizarTerreno = function () {
      var v = (form.querySelector('input[name="terreno"]:checked') || {}).value;
      boxTerreno.hidden = !(v === "Sim" || v === "Estou negociando");
    };
    $$('input[name="terreno"]', form).forEach(function (r) { r.addEventListener("change", atualizarTerreno); });
    atualizarTerreno();

    var regras = {
      nome: function (v) { return v.trim().length >= 2 ? "" : "Digite seu nome."; },
      telefone: function (v) { return v.replace(/\D/g, "").length >= 10 ? "" : "Digite o telefone com DDD, por exemplo (21) 90000-0000."; },
      cidade: function (v) { return v.trim() ? "" : "Informe a cidade onde pretende construir."; },
      uf: function (v) { return v ? "" : "Escolha o estado."; },
      terreno: function () { return form.querySelector('input[name="terreno"]:checked') ? "" : "Diga se já tem terreno."; }
    };
    var validar = function (nome) {
      var erro = regras[nome](form.elements[nome].value || ""), out = document.getElementById(nome + "-erro");
      out.textContent = erro;
      var alvo = form.elements[nome];
      if (alvo && alvo.setAttribute) alvo.setAttribute("aria-invalid", erro ? "true" : "false");
      return !erro;
    };
    ["nome", "telefone", "cidade", "uf"].forEach(function (n) { form.elements[n].addEventListener("blur", function () { if (this.value) validar(n); }); });

    var status = $("#form-status");
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var primeiro = null;
      Object.keys(regras).forEach(function (n) {
        if (!validar(n) && !primeiro) primeiro = n === "terreno" ? form.querySelector('input[name="terreno"]') : form.elements[n];
      });
      if (primeiro) { primeiro.focus(); return; }
      var f = form.elements, proj = L.porId(f.projeto.value), pac = L.PACOTES.filter(function (x) { return x.id === f.pacote.value; })[0];
      var terreno = form.querySelector('input[name="terreno"]:checked').value;
      if (terreno !== "Ainda não" && f.largura.value && f.profundidade.value) terreno += ", " + f.largura.value + " x " + f.profundidade.value + " m";
      var linhas = ["Olá, Green House! Quero um orçamento.", "", "Nome: " + f.nome.value.trim(), "Telefone: " + f.telefone.value.trim(), "Cidade: " + f.cidade.value.trim() + "/" + f.uf.value,
        "Projeto: " + (proj ? proj.nome : "Ainda não escolhi"), "Pacote: " + (pac ? pac.nome : "Quero ajuda para escolher"), "Terreno: " + terreno];
      if (f.mensagem.value.trim()) linhas.push("", f.mensagem.value.trim());
      var texto = linhas.join("\n"), wa = (CFG.whatsapp || "").replace(/\D/g, "");
      status.hidden = false;
      if (wa) {
        status.className = "form-status form-status--ok";
        status.innerHTML = "<strong>Pedido pronto!</strong> Abrimos o WhatsApp com a sua mensagem.";
        window.open("https://wa.me/" + wa + "?text=" + encodeURIComponent(texto), "_blank", "noopener");
      } else {
        status.className = "form-status form-status--info";
        status.innerHTML = "<strong>Pedido validado.</strong> O WhatsApp da empresa ainda não foi configurado (assets/js/config.js). Esta é a mensagem que será enviada:<pre class=\"msg\"></pre>";
        $(".msg", status).textContent = texto;
      }
      status.focus();
    });
  }

  revelar(document);
})();
