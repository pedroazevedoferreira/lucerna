/* Lucerna — comportamento do site (sem dependências) */
(function () {
  "use strict";

  var CFG = window.LUCERNA_CONFIG || {};
  var $ = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };

  if (CFG.ocultarPendencias) document.documentElement.classList.add("ocultar-pendencias");

  /* ---------- Logo: troca o marcador neutro pelo arquivo aprovado, quando existir ---------- */
  $$("[data-logo-slot]").forEach(function (slot) {
    var tema = slot.getAttribute("data-logo-slot");
    var logo = CFG.logo || {};
    var src = tema === "escuro" ? (logo.escuro || logo.claro) : (logo.claro || logo.escuro);
    if (!src) return;
    var img = new Image();
    img.alt = "Lucerna, casas e chalés";
    img.onload = function () {
      slot.textContent = "";
      slot.appendChild(img);
      slot.classList.add("has-logo");
    };
    img.src = src;
  });

  /* ---------- Menu móvel ---------- */
  var toggle = $(".nav-toggle");
  var nav = $("#site-nav");
  if (toggle && nav) {
    var fechar = function (devolverFoco) {
      toggle.setAttribute("aria-expanded", "false");
      nav.classList.remove("is-open");
      if (devolverFoco) toggle.focus();
    };
    toggle.addEventListener("click", function () {
      var aberto = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!aberto));
      nav.classList.toggle("is-open", !aberto);
      if (!aberto) { var primeiro = $("a", nav); if (primeiro) primeiro.focus(); }
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("is-open")) fechar(true);
    });
    document.addEventListener("click", function (e) {
      if (nav.classList.contains("is-open") && !nav.contains(e.target) && !toggle.contains(e.target)) fechar(false);
    });
    nav.addEventListener("click", function (e) { if (e.target.closest("a")) fechar(false); });
    window.matchMedia("(min-width: 961px)").addEventListener("change", function (mq) { if (mq.matches) fechar(false); });
  }

  /* ---------- Canais de contato (só os confirmados em config.js) ---------- */
  function canais() {
    var lista = [];
    var digitos = function (s) { return String(s).replace(/\D/g, ""); };
    if (CFG.telefone) {
      var d = digitos(CFG.telefone);
      lista.push({ rotulo: "Telefone", texto: CFG.telefone, href: "tel:+" + (d.length <= 11 ? "55" + d : d) });
    }
    if (CFG.whatsapp) lista.push({ rotulo: "WhatsApp", texto: "Conversar pelo WhatsApp", href: "https://wa.me/" + digitos(CFG.whatsapp), externo: true });
    if (CFG.email) lista.push({ rotulo: "E-mail", texto: CFG.email, href: "mailto:" + CFG.email });
    if (CFG.endereco) lista.push({ rotulo: "Endereço", texto: CFG.endereco });
    if (CFG.instagram) lista.push({ rotulo: "Instagram", texto: "Instagram", href: CFG.instagram, externo: true });
    if (CFG.facebook) lista.push({ rotulo: "Facebook", texto: "Facebook", href: CFG.facebook, externo: true });
    return lista;
  }
  var listaCanais = canais();
  $$("[data-canais]").forEach(function (ul) {
    if (!listaCanais.length) { ul.hidden = true; return; }
    var comRotulo = ul.hasAttribute("data-com-rotulo");
    listaCanais.forEach(function (c) {
      var li = document.createElement("li");
      if (comRotulo) {
        var r = document.createElement("span");
        r.textContent = c.rotulo;
        li.appendChild(r);
      }
      var alvo;
      if (c.href) {
        alvo = document.createElement("a");
        alvo.href = c.href;
        if (c.externo) { alvo.target = "_blank"; alvo.rel = "noopener"; alvo.setAttribute("aria-label", c.texto + " (abre em nova aba)"); }
      } else {
        alvo = document.createElement("span");
      }
      alvo.textContent = c.texto;
      li.appendChild(alvo);
      ul.appendChild(li);
    });
  });
  if (listaCanais.length) $$("[data-sem-canais]").forEach(function (el) { el.hidden = true; });

  /* ---------- Ano no rodapé ---------- */
  $$("[data-ano]").forEach(function (el) { el.textContent = new Date().getFullYear(); });

  /* ---------- Catálogo: filtro por tipo ---------- */
  var filtros = $("[data-filtros]");
  if (filtros) {
    var cards = $$("[data-tipo]");
    var status = $("[data-filtro-status]");
    var aplicar = function (tipo, atualizarUrl) {
      var n = 0;
      cards.forEach(function (card) {
        var mostra = tipo === "todos" || card.getAttribute("data-tipo") === tipo;
        card.hidden = !mostra;
        if (mostra) n++;
      });
      if (status) status.textContent = n === 1 ? "Mostrando 1 projeto" : "Mostrando " + n + " projetos";
      if (atualizarUrl && window.history.replaceState) {
        var url = new URL(window.location.href);
        if (tipo === "todos") url.searchParams.delete("tipo"); else url.searchParams.set("tipo", tipo);
        window.history.replaceState(null, "", url);
      }
    };
    filtros.addEventListener("change", function (e) {
      if (e.target.name === "tipo") aplicar(e.target.value, true);
    });
    var inicial = new URLSearchParams(window.location.search).get("tipo");
    var radio = inicial && $('input[name="tipo"][value="' + inicial.replace(/[^a-z]/g, "") + '"]', filtros);
    if (radio) { radio.checked = true; aplicar(radio.value, false); }
    else aplicar("todos", false);
  }

  /* ---------- Formulário de contato ---------- */
  var form = $("[data-contato-form]");
  if (form) {
    var PROJETOS = {
      "casa-contemporanea": "Casa contemporânea",
      "chale-aframe": "Chalé A-frame",
      "casa-familiar": "Casa familiar"
    };
    var projeto = new URLSearchParams(window.location.search).get("projeto");
    var msg = form.elements.mensagem;
    if (projeto && PROJETOS[projeto] && msg && !msg.value) {
      msg.value = "Olá! Tenho interesse no projeto " + PROJETOS[projeto] + ". ";
    }

    var sumario = $("[data-form-sumario]", form.parentNode);
    var statusEl = $("[data-form-status]", form.parentNode);

    var regras = {
      nome: function (v) { return v.trim().length >= 2 ? "" : "Informe seu nome."; },
      telefone: function (v) {
        var d = v.replace(/\D/g, "");
        if (!d) return "Informe um telefone para retorno.";
        return d.length >= 10 && d.length <= 13 ? "" : "Informe o telefone com DDD, por exemplo (00) 00000-0000.";
      },
      cidade: function (v) { return v.trim() ? "" : "Informe a cidade do terreno ou onde você mora."; },
      uf: function (v) { return v ? "" : "Selecione a UF."; },
      mensagem: function (v) { return v.trim().length >= 10 ? "" : "Escreva uma mensagem com pelo menos 10 caracteres."; }
    };
    var ROTULOS = { nome: "Nome", telefone: "Telefone", cidade: "Cidade", uf: "UF", mensagem: "Mensagem" };

    var validarCampo = function (nome) {
      var campo = form.elements[nome];
      var erro = regras[nome](campo.value);
      var saida = $("#erro-" + nome);
      campo.setAttribute("aria-invalid", erro ? "true" : "false");
      if (saida) saida.textContent = erro;
      return erro;
    };

    /* Valida ao sair do campo só depois da primeira tentativa de envio, para não interromper quem digita */
    var tentou = false;
    Object.keys(regras).forEach(function (nome) {
      var campo = form.elements[nome];
      campo.addEventListener("blur", function () { if (tentou) validarCampo(nome); });
      campo.addEventListener("input", function () {
        if (campo.getAttribute("aria-invalid") === "true") validarCampo(nome);
      });
    });

    /* Máscara leve de telefone: (00) 00000-0000 */
    var tel = form.elements.telefone;
    tel.addEventListener("input", function () {
      var d = tel.value.replace(/\D/g, "").slice(0, 11);
      var f = d;
      if (d.length > 2) f = "(" + d.slice(0, 2) + ") " + d.slice(2);
      if (d.length > 6) f = "(" + d.slice(0, 2) + ") " + d.slice(2, d.length - 4) + "-" + d.slice(d.length - 4);
      tel.value = f;
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      tentou = true;
      statusEl.textContent = "";
      statusEl.className = "form-status";

      var erros = Object.keys(regras).map(function (nome) {
        return { nome: nome, erro: validarCampo(nome) };
      }).filter(function (x) { return x.erro; });

      if (erros.length) {
        sumario.hidden = false;
        var ul = $("ul", sumario);
        ul.textContent = "";
        erros.forEach(function (x) {
          var li = document.createElement("li");
          var a = document.createElement("a");
          a.href = "#campo-" + x.nome;
          a.textContent = ROTULOS[x.nome] + ": " + x.erro;
          a.addEventListener("click", function (ev) { ev.preventDefault(); form.elements[x.nome].focus(); });
          li.appendChild(a);
          ul.appendChild(li);
        });
        $("h2", sumario).textContent = erros.length === 1 ? "Corrija 1 campo para enviar" : "Corrija " + erros.length + " campos para enviar";
        sumario.focus();
        return;
      }
      sumario.hidden = true;

      var dados = {
        nome: form.elements.nome.value.trim(),
        telefone: form.elements.telefone.value.trim(),
        cidade: form.elements.cidade.value.trim(),
        uf: form.elements.uf.value,
        mensagem: form.elements.mensagem.value.trim(),
        projeto: projeto && PROJETOS[projeto] ? PROJETOS[projeto] : ""
      };

      var mostrar = function (texto, ok) {
        statusEl.className = "form-status" + (ok ? " form-status--ok" : "");
        statusEl.textContent = texto;
        statusEl.focus();
      };

      if (CFG.formEndpoint) {
        var botao = $("button[type=submit]", form);
        botao.disabled = true;
        fetch(CFG.formEndpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json", "Accept": "application/json" },
          body: JSON.stringify(dados)
        }).then(function (r) {
          if (!r.ok) throw new Error(r.status);
          form.reset();
          mostrar("Mensagem enviada. Obrigado, " + dados.nome.split(" ")[0] + "!", true);
        }).catch(function () {
          mostrar("Não foi possível enviar agora. Seus dados continuam no formulário; tente novamente em instantes.", false);
        }).then(function () { botao.disabled = false; });
        return;
      }

      if (CFG.whatsapp) {
        var texto = "Olá, Lucerna! Meu nome é " + dados.nome + ".\n" +
          "Telefone: " + dados.telefone + "\n" +
          "Cidade/UF: " + dados.cidade + "/" + dados.uf + "\n\n" + dados.mensagem;
        window.open("https://wa.me/" + String(CFG.whatsapp).replace(/\D/g, "") + "?text=" + encodeURIComponent(texto), "_blank", "noopener");
        mostrar("Abrimos o WhatsApp com a sua mensagem. Se a conversa não abriu, verifique se o navegador bloqueou a nova janela.", true);
        return;
      }

      mostrar("Formulário preenchido corretamente, mas o envio ainda não está ativo: o canal de atendimento da Lucerna está pendente de configuração. Nada foi enviado.", false);
    });
  }
})();
