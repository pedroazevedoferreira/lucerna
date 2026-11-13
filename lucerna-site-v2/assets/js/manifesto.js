/* Green House v2 — manifesto: as palavras acendem uma a uma conforme a seção atravessa a tela. */
(function () {
  "use strict";
  var sec = document.querySelector("[data-manifesto]");
  if (!sec) return;
  var texto = sec.querySelector(".manifesto-texto");
  var DESTAQUES = /^(refúgio|madeira|vidro|luz|alpino|acolhimento)/i;

  /* quebra o texto em palavras (o leitor de tela continua lendo a frase inteira pelo aria-label) */
  var frase = texto.textContent.replace(/\s+/g, " ").trim();
  texto.setAttribute("aria-label", frase);
  texto.textContent = "";
  var palavras = frase.split(" ").map(function (p) {
    var s = document.createElement("span");
    s.className = "w" + (DESTAQUES.test(p) ? " dest" : "");
    s.setAttribute("aria-hidden", "true");
    s.textContent = p;
    texto.appendChild(s);
    texto.appendChild(document.createTextNode(" "));
    return s;
  });

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    palavras.forEach(function (w) { w.classList.add("on"); });
    sec.style.setProperty("--m", 1);
    return;
  }

  var pedido = false;
  function atualizar() {
    pedido = false;
    var r = sec.getBoundingClientRect(), vh = window.innerHeight;
    /* 0 quando a seção entra por baixo; 1 quando o centro dela passa um pouco acima do meio da tela */
    var p = Math.min(1, Math.max(0, (vh - r.top) / (vh * 0.55 + r.height * 0.5)));
    sec.style.setProperty("--m", p.toFixed(3));
    var acesas = Math.round(p * 1.15 * palavras.length);
    palavras.forEach(function (w, i) { w.classList.toggle("on", i < acesas); });
  }
  function pedir() { if (!pedido) { pedido = true; requestAnimationFrame(atualizar); } }
  window.addEventListener("scroll", pedir, { passive: true });
  window.addEventListener("resize", pedir);
  atualizar();
})();
