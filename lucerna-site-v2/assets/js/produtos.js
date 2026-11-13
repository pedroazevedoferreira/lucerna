/*
 * Catálogo da Green House.
 * ATENÇÃO: áreas, plantas, preços e prazos abaixo são FICTÍCIOS, criados para demonstração.
 * Substitua pelos dados reais antes de publicar. Os preços "a partir de" são calculados
 * pela área × valor por m² de cada pacote (VALOR_M2) e arredondados para o milhar.
 */
window.LUCERNA = (function () {
  var VALOR_M2 = { estrutura: 1250, fechada: 3100, chave: 4900 };

  var PACOTES = [
    { id: "estrutura", nome: "Estrutura", para: "Para quem tem equipe para fechar e acabar a casa", resumo: "Projetos e esqueleto de aço montado no terreno." },
    { id: "fechada", nome: "Casa Fechada", para: "Para quem quer escolher e contratar os acabamentos", resumo: "Casa protegida da chuva, com paredes, telhado, janelas e tubulações." },
    { id: "chave", nome: "Chave na Mão", para: "Para quem quer receber a casa pronta para morar", resumo: "Casa pronta, com instalações, acabamentos, louças e limpeza final." }
  ];

  /* [etapa, item, estrutura, casa fechada, chave na mão] */
  var ITENS = [
    ["Projetos", "Projeto arquitetônico do modelo e adaptações simples", 1, 1, 1],
    ["Projetos", "Projeto estrutural em Light Steel Frame e ART", 1, 1, 1],
    ["Projetos", "Projetos elétrico e hidráulico", 0, 1, 1],
    ["Projetos", "Documentação para aprovação na prefeitura", 1, 1, 1],
    ["Fundação", "Fundação tipo radier com esperas de tubulação", 0, 1, 1],
    ["Estrutura", "Perfis de aço galvanizado montados no terreno", 1, 1, 1],
    ["Estrutura", "Estrutura do telhado", 1, 1, 1],
    ["Fechamento", "Placas externas e barreira contra umidade", 0, 1, 1],
    ["Fechamento", "Isolamento térmico e acústico nas paredes e no forro", 0, 1, 1],
    ["Fechamento", "Paredes internas em drywall", 0, 1, 1],
    ["Cobertura", "Telhas, rufos e calhas", 0, 1, 1],
    ["Esquadrias", "Janelas e porta de entrada", 0, 1, 1],
    ["Instalações", "Tubulações elétricas e hidráulicas embutidas", 0, 1, 1],
    ["Instalações", "Fiação, quadro de energia, tomadas e registros", 0, 0, 1],
    ["Acabamento", "Forro, piso e revestimentos", 0, 0, 1],
    ["Acabamento", "Portas internas", 0, 0, 1],
    ["Acabamento", "Louças, metais e bancadas", 0, 0, 1],
    ["Acabamento", "Pintura interna e externa", 0, 0, 1],
    ["Entrega", "Limpeza final, vistoria e manual do proprietário", 0, 0, 1]
  ];

  var FORA = ["Terreno", "Limpeza e nivelamento do terreno", "Muro, calçada e paisagismo", "Ligações de água, luz e esgoto com a concessionária", "Móveis planejados e eletrodomésticos"];

  /* plantas: [cômodo, x, y, largura, profundidade] em metros */
  var PROJETOS = [
    {
      id: "chale-aurora", nome: "Chalé Aurora", tipo: "chale", tipoLabel: "Chalé", estilo: "A-frame",
      img: "projeto-chale-aframe", foco: "50% 40%", destaque: true,
      alt: "Chalé A-frame com telhado verde, fachada de vidro e deck de madeira ao entardecer",
      frase: "Telhado triangular, fachada de vidro e deck para a vista.",
      descricao: "Chalé A-frame compacto, com sala e cozinha integradas voltadas para a fachada de vidro, quarto no térreo e mezanino. Pensado para serra, campo ou aluguel por temporada.",
      area: 58, quartos: 2, suites: 0, banheiros: 1, vagas: 0, pavimentos: "Térreo + mezanino",
      medidas: [6, 8], terreno: [12, 20], peDireito: "até 6,20 m",
      prazos: { estrutura: 35, fechada: 80, chave: 130 },
      plantas: [
        { nome: "Térreo", w: 6, h: 8, comodos: [["Sala e cozinha", 0, 0, 6, 4.5], ["Quarto", 0, 4.5, 3.4, 3.5], ["Banheiro", 3.4, 4.5, 2.6, 2], ["Escada e serviço", 3.4, 6.5, 2.6, 1.5]] },
        { nome: "Mezanino", w: 4, h: 2.5, comodos: [["Mezanino", 0, 0, 4, 2.5]] }
      ]
    },
    {
      id: "chale-serra", nome: "Chalé Serra", tipo: "chale", tipoLabel: "Chalé", estilo: "A-frame",
      img: "home-hero", foco: "72% 50%", destaque: false,
      alt: "Chalé A-frame de madeira e vidro sobre base de pedra, em meio à mata da serra",
      frase: "A-frame amplo sobre base de pedra, com dois banheiros.",
      descricao: "Versão maior do A-frame, com base em pedra, suíte de hóspedes no térreo e quarto no mezanino. Boa para terrenos com vista e leve inclinação.",
      area: 86, quartos: 2, suites: 0, banheiros: 2, vagas: 1, pavimentos: "Térreo + mezanino",
      medidas: [7, 9], terreno: [14, 25], peDireito: "até 7,00 m",
      prazos: { estrutura: 40, fechada: 90, chave: 145 },
      plantas: [
        { nome: "Térreo", w: 7, h: 9, comodos: [["Sala de estar", 0, 0, 7, 4], ["Cozinha", 0, 4, 3.5, 2.6], ["Banheiro", 3.5, 4, 2, 2.6], ["Serviço", 5.5, 4, 1.5, 2.6], ["Quarto", 0, 6.6, 4.2, 2.4], ["Banheiro 2", 4.2, 6.6, 2.8, 2.4]] },
        { nome: "Mezanino", w: 7, h: 3.3, comodos: [["Quarto mezanino", 0, 0, 7, 3.3]] }
      ]
    },
    {
      id: "casa-refugio", nome: "Casa Refúgio", tipo: "casa", tipoLabel: "Casa", estilo: "Térrea",
      img: "contato-refugio", foco: "75% 50%", destaque: false,
      alt: "Casa térrea com pilares de madeira e pedra, iluminada ao anoitecer em meio à mata",
      frase: "Térrea compacta, com suíte e varanda coberta.",
      descricao: "Casa térrea compacta com sala e cozinha integradas, suíte e quarto de hóspedes. Cabe em terrenos urbanos de 10 metros de frente.",
      area: 72, quartos: 2, suites: 1, banheiros: 2, vagas: 1, pavimentos: "Térrea",
      medidas: [8, 9], terreno: [10, 20], peDireito: "2,80 m",
      prazos: { estrutura: 30, fechada: 75, chave: 120 },
      plantas: [
        { nome: "Térreo", w: 8, h: 9, comodos: [["Sala de estar e jantar", 0, 0, 4.6, 4.5], ["Cozinha", 4.6, 0, 3.4, 3], ["Serviço", 4.6, 3, 3.4, 1.5], ["Circulação", 0, 4.5, 8, 1], ["Suíte", 0, 5.5, 3.6, 3.5], ["Banho suíte", 3.6, 5.5, 1.6, 2], ["Banheiro", 3.6, 7.5, 1.6, 1.5], ["Quarto", 5.2, 5.5, 2.8, 3.5]] }
      ]
    },
    {
      id: "casa-jardim", nome: "Casa Jardim", tipo: "casa", tipoLabel: "Casa", estilo: "Térrea",
      img: "projeto-casa-contemporanea", foco: "50% 55%", destaque: true,
      alt: "Casa térrea com telhado verde, varanda com pilares de madeira e jardim",
      frase: "Três quartos e varanda integrada à área social.",
      descricao: "Casa térrea para família, com três quartos, sala ampla aberta para a varanda e cozinha separada da área de serviço.",
      area: 110, quartos: 3, suites: 1, banheiros: 2, vagas: 2, pavimentos: "Térrea",
      medidas: [10, 11], terreno: [12, 25], peDireito: "2,80 m",
      prazos: { estrutura: 40, fechada: 95, chave: 150 },
      plantas: [
        { nome: "Térreo", w: 10, h: 11, comodos: [["Sala de estar e jantar", 0, 0, 6, 5], ["Cozinha", 6, 0, 4, 3.2], ["Serviço", 6, 3.2, 4, 1.8], ["Circulação", 0, 5, 10, 1], ["Suíte", 0, 6, 3.8, 3.4], ["Banho suíte", 0, 9.4, 3.8, 1.6], ["Quarto 1", 3.8, 6, 3.1, 3.4], ["Banheiro", 3.8, 9.4, 3.1, 1.6], ["Quarto 2", 6.9, 6, 3.1, 5]] }
      ]
    },
    {
      id: "casa-horizonte", nome: "Casa Horizonte", tipo: "casa", tipoLabel: "Casa", estilo: "Sobrado",
      img: "projeto-casa-familiar", foco: "55% 45%", destaque: true,
      alt: "Sobrado moderno com fachada branca, painel de madeira, varanda envidraçada e garagem coberta",
      frase: "Sobrado com duas suítes e garagem coberta.",
      descricao: "Sobrado com área social no térreo e três quartos no pavimento superior, sendo duas suítes. Ocupa pouco terreno e tem garagem coberta.",
      area: 136, quartos: 3, suites: 2, banheiros: 4, vagas: 2, pavimentos: "2 pavimentos",
      medidas: [8, 8.5], terreno: [10, 20], peDireito: "2,80 m",
      prazos: { estrutura: 45, fechada: 110, chave: 170 },
      plantas: [
        { nome: "Térreo", w: 8, h: 8.5, comodos: [["Sala de estar", 0, 0, 5, 4.5], ["Cozinha", 5, 0, 3, 4.5], ["Jantar", 0, 4.5, 5, 4], ["Lavabo", 5, 4.5, 1.5, 1.6], ["Serviço", 5, 6.1, 1.5, 2.4], ["Escada", 6.5, 4.5, 1.5, 4]] },
        { nome: "Superior", w: 8, h: 8.5, comodos: [["Suíte 1", 0, 0, 3.6, 4], ["Banho 1", 3.6, 0, 1.6, 2], ["Banho 2", 3.6, 2, 1.6, 2], ["Suíte 2", 5.2, 0, 2.8, 4], ["Circulação", 0, 4, 6.5, 1.2], ["Escada", 6.5, 4, 1.5, 4.5], ["Quarto", 0, 5.2, 4, 3.3], ["Banheiro", 4, 5.2, 2.5, 3.3]] }
      ]
    }
  ];

  function preco(p, pacote) { return Math.round(p.area * VALOR_M2[pacote] / 1000) * 1000; }
  function brl(n) { return n.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 }); }
  function num(n, casas) { return n.toLocaleString("pt-BR", { minimumFractionDigits: casas || 0, maximumFractionDigits: casas || 0 }); }
  function porId(id) { return PROJETOS.filter(function (p) { return p.id === id; })[0]; }

  return { VALOR_M2: VALOR_M2, PACOTES: PACOTES, ITENS: ITENS, FORA: FORA, PROJETOS: PROJETOS, preco: preco, brl: brl, num: num, porId: porId };
})();
