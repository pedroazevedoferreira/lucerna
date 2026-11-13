/* Green House v2 — "janela da casa" na página inicial.
   1. Recorta a foto no formato de uma casa (telhado de duas águas) logo abaixo do título,
      com contorno dourado e linha do chão. Ao rolar, a janela se abre até a tela cheia.
   2. Dentro dela, as fotos trocam sozinhas a cada 6 s, com zoom lento.
      A primeira troca feita pela pessoa (linha, teclado ou gesto) encerra a troca automática
      (é assim que se para o movimento — WCAG 2.2.2). Quem pediu menos movimento no sistema
      vê a janela fechada e parada, sem troca automática. */
(function () {
  "use strict";

  var hero = document.querySelector("[data-moldura]");
  if (!hero) return;
  var sticky = hero.querySelector(".moldura-sticky");
  var head = hero.querySelector("[data-moldura-head]");
  var svg = hero.querySelector("[data-moldura-lines]");
  var outline = svg.querySelector(".moldura-outline");
  var ground = svg.querySelector(".moldura-ground");
  var ui = hero.querySelector("[data-moldura-ui]");
  var num = hero.querySelector("[data-moldura-num]");
  var status = hero.querySelector("[data-moldura-status]");
  var slides = Array.prototype.slice.call(hero.querySelectorAll(".moldura-slide"));
  var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-moldura-dot]"));
  var reduz = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* =========================================================
     1. Geometria da janela e abertura ao rolar
     ========================================================= */
  var geo = null;
  var clamp = function (v, a, b) { return Math.min(b, Math.max(a, v)); };
  var ease = function (t) { return t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; };
  var mix = function (a, b, t) { return a + (b - a) * t; };
  /* mantém a foto cobrindo a área: entre mín e máx; se não couber, centraliza */
  var limitar = function (v, min, max) { return min > max ? (min + max) / 2 : clamp(v, min, max); };

  function medir() {
    var W = sticky.clientWidth, H = sticky.clientHeight;
    var celular = W <= 760;
    var top0 = head.offsetTop + head.offsetHeight + (celular ? 22 : 30);
    /* a seção começa abaixo do cabeçalho: no topo da página, só esta parte dela aparece na tela */
    var visivel = Math.min(H, window.innerHeight - hero.offsetTop);
    /* no celular, reserva espaço para os controles e a barra fixa da v1 */
    var bottom0 = visivel - (celular ? 72 + 50 + 44 + 22 : 88);
    var alto = Math.max(160, bottom0 - top0);
    var largura = Math.min(W * (celular ? 0.86 : 0.5), alto * 1.35, 780);
    var telhado = Math.min(largura * 0.34, alto * 0.42);
    var cx = W / 2, l = cx - largura / 2, r = cx + largura / 2;
    geo = {
      W: W, H: H, cx: cx, bottom0: bottom0,
      ext: Math.min(W * 0.2, 260),
      ini: [[cx, top0], [r, top0 + telhado], [r, bottom0], [l, bottom0], [l, top0 + telhado]],
      fim: [[cx, 0], [W, 0], [W, H], [0, H], [0, 0]],
      l: l, r: r, top0: top0
    };
    /* medidas de cada foto ao cobrir a área (object-fit: cover) e o zoom com a janela fechada */
    slides.forEach(function (s) {
      var img = s.querySelector("img");
      var iw = +img.getAttribute("width") || 16, ih = +img.getAttribute("height") || 9;
      var k = Math.max(W / iw, H / ih);
      s._rw = iw * k; s._rh = ih * k;
      img.style.width = s._rw.toFixed(1) + "px";
      img.style.height = s._rh.toFixed(1) + "px";
      img.style.left = ((W - s._rw) / 2).toFixed(1) + "px";
      img.style.top = ((H - s._rh) / 2).toFixed(1) + "px";
      s._fx = parseFloat(getComputedStyle(s).getPropertyValue("--fx")) || 0.5;
      s._fy = parseFloat(getComputedStyle(s).getPropertyValue("--fy")) || 0.5;
      s._z0 = clamp(Math.max(largura / (s._rw * 0.78), (bottom0 - top0) * 1.06 / s._rh), 0.3, 1);
    });
    svg.setAttribute("viewBox", "0 0 " + W + " " + H);
  }

  function progresso() {
    if (reduz) return 0;
    var percurso = hero.offsetHeight - sticky.clientHeight;
    if (percurso <= 0) return 0;
    /* abre nos primeiros 75% do percurso; no resto, a foto fica em tela cheia */
    return clamp(-hero.getBoundingClientRect().top / (percurso * 0.75), 0, 1);
  }

  function desenhar() {
    if (!geo) return;
    var p = progresso(), e = ease(p);
    var pts = geo.ini.map(function (a, i) {
      var b = geo.fim[i];
      return [mix(a[0], b[0], e), mix(a[1], b[1], e)];
    });
    var txt = pts.map(function (q) { return q[0].toFixed(1) + "px " + q[1].toFixed(1) + "px"; }).join(", ");
    hero.style.setProperty("--clip", "polygon(" + txt + ")");
    outline.setAttribute("points", pts.map(function (q) { return q[0].toFixed(1) + "," + q[1].toFixed(1); }).join(" "));
    var gy = mix(geo.bottom0, geo.H, e);
    ground.setAttribute("x1", (mix(geo.l, 0, e) - geo.ext * (1 - e)).toFixed(1));
    ground.setAttribute("x2", (mix(geo.r, geo.W, e) + geo.ext * (1 - e)).toFixed(1));
    ground.setAttribute("y1", gy.toFixed(1));
    ground.setAttribute("y2", gy.toFixed(1));
    /* área que a foto precisa cobrir: a janela (fechada) até a tela inteira (aberta) */
    var R = { l: mix(geo.l, 0, e), r: mix(geo.r, geo.W, e), t: mix(geo.top0, 0, e), b: mix(geo.bottom0, geo.H, e) };
    var alvoX = mix(geo.cx, geo.W / 2, e);
    var alvoY = mix(geo.top0 + (geo.bottom0 - geo.top0) * 0.58, geo.H / 2, e);
    slides.forEach(function (s) {
      var z = mix(s._z0, 1, e), w = s._rw * z, hh = s._rh * z;
      var tx = alvoX - geo.W / 2 - (s._fx - 0.5) * w;
      var ty = alvoY - geo.H / 2 - (s._fy - 0.5) * hh;
      tx = limitar(tx, R.r - geo.W / 2 - w / 2, R.l - geo.W / 2 + w / 2);
      ty = limitar(ty, R.b - geo.H / 2 - hh / 2, R.t - geo.H / 2 + hh / 2);
      s.style.transform = "translate(" + tx.toFixed(1) + "px, " + ty.toFixed(1) + "px) scale(" + z.toFixed(4) + ")";
    });
    /* parte da seção que ainda está abaixo da tela (no topo da página, por causa do cabeçalho) */
    var fora = Math.max(0, geo.H - (window.innerHeight - sticky.getBoundingClientRect().top));
    hero.style.setProperty("--ui-off", fora.toFixed(1) + "px");
    hero.style.setProperty("--head-o", (1 - clamp(p * 2.2, 0, 1)).toFixed(3));
    hero.style.setProperty("--head-y", (-p * 80).toFixed(1) + "px");
    hero.style.setProperty("--lines", (1 - clamp(p * 2.5, 0, 1)).toFixed(3));
    hero.style.setProperty("--shade", e.toFixed(3));
    hero.classList.toggle("is-open", p > 0.55);
  }

  var pedido = false;
  function agendarDesenho() {
    if (pedido) return;
    pedido = true;
    requestAnimationFrame(function () { pedido = false; desenhar(); });
  }
  function recalcular() { medir(); desenhar(); }

  recalcular();
  window.addEventListener("resize", recalcular);
  if (!reduz) window.addEventListener("scroll", agendarDesenho, { passive: true });
  /* as fontes da web mudam a altura do título: recalcula quando carregarem */
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(recalcular);
  window.addEventListener("load", recalcular);

  /* =========================================================
     2. Carrossel
     ========================================================= */
  var total = slides.length;
  if (total < 2) { ui.hidden = true; return; }

  var INTERVALO = 6000;
  ui.style.setProperty("--intervalo", INTERVALO / 1000 + "s");
  var atual = 0;
  var manual = reduz;
  var motivos = {};
  var timer = null, inicio = 0, restante = INTERVALO;
  if (document.documentElement.classList.contains("intro-on")) restante += 3000;
  var pad = function (n) { return (n < 10 ? "0" : "") + n; };

  function carregar(i) {
    var img = slides[i].querySelector("img");
    if (img && img.loading === "lazy") img.loading = "eager";
  }

  function mostrar(i, pelaPessoa) {
    atual = (i + total) % total;
    slides.forEach(function (s, k) {
      var ativo = k === atual;
      s.classList.toggle("is-active", ativo);
      if (ativo) s.removeAttribute("aria-hidden"); else s.setAttribute("aria-hidden", "true");
    });
    dots.forEach(function (d, k) {
      if (k === atual) d.setAttribute("aria-current", "true"); else d.removeAttribute("aria-current");
    });
    num.textContent = pad(atual + 1);
    carregar(atual);
    carregar((atual + 1) % total);
    if (pelaPessoa) {
      manual = true;
      var img = slides[atual].querySelector("img");
      status.textContent = "Foto " + (atual + 1) + " de " + total + (img && img.alt ? ": " + img.alt : "");
    }
    restante = INTERVALO;
    agendar();
  }

  function segurando() {
    for (var k in motivos) if (motivos[k]) return true;
    return false;
  }
  function parar() {
    if (!timer) return;
    clearTimeout(timer);
    timer = null;
    restante = Math.max(0, restante - (Date.now() - inicio));
  }
  function agendar() {
    if (timer) { clearTimeout(timer); timer = null; }
    var tocando = !manual;
    ui.classList.toggle("is-playing", tocando);
    ui.classList.toggle("is-held", tocando && segurando());
    if (!tocando || segurando()) return;
    inicio = Date.now();
    timer = setTimeout(function () { timer = null; mostrar(atual + 1, false); }, restante);
  }
  function segurar(motivo, ativo) {
    if (!!motivos[motivo] === ativo) return;
    if (ativo) parar();
    motivos[motivo] = ativo;
    agendar();
  }

  dots.forEach(function (d, k) { d.addEventListener("click", function () { mostrar(k, true); }); });
  ui.addEventListener("keydown", function (e) {
    var alvo = null;
    if (e.key === "ArrowLeft") alvo = atual - 1;
    else if (e.key === "ArrowRight") alvo = atual + 1;
    else if (e.key === "Home") alvo = 0;
    else if (e.key === "End") alvo = total - 1;
    if (alvo === null) return;
    e.preventDefault();
    mostrar(alvo, true);
    dots[atual].focus();
  });
  ui.addEventListener("mouseenter", function () { segurar("mouse", true); });
  ui.addEventListener("mouseleave", function () { segurar("mouse", false); });
  ui.addEventListener("focusin", function () { segurar("foco", true); });
  ui.addEventListener("focusout", function (e) { if (!ui.contains(e.relatedTarget)) segurar("foco", false); });
  document.addEventListener("visibilitychange", function () { segurar("aba", document.hidden); });
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (en) { segurar("tela", !en[0].isIntersecting); }, { threshold: 0.05 }).observe(hero);
  }

  /* gesto de deslizar na horizontal (a rolagem vertical continua normal) */
  var x0 = null, y0 = null;
  sticky.addEventListener("touchstart", function (e) {
    if (e.touches.length !== 1) { x0 = null; return; }
    x0 = e.touches[0].clientX; y0 = e.touches[0].clientY;
  }, { passive: true });
  sticky.addEventListener("touchend", function (e) {
    if (x0 === null) return;
    var dx = e.changedTouches[0].clientX - x0, dy = e.changedTouches[0].clientY - y0;
    x0 = null;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) mostrar(atual + (dx < 0 ? 1 : -1), true);
  }, { passive: true });

  carregar(1);
  agendar();
})();
