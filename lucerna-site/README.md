# Lucerna — site

Site estático (HTML, CSS e JavaScript, sem build). Para ver localmente:

```bash
python -m http.server 8767 --directory lucerna-site
```

Publique **apenas esta pasta** (`lucerna-site/`). As imagens originais e as referências ficam fora dela, em `../outputs/lucerna-site-imagens/`, porque incluem a prévia da logo com marca d'água e o conceito de logo rejeitado — nenhum dos dois pode ir ao ar.

## Páginas

| Arquivo | Conteúdo |
|---|---|
| `index.html` | Início editorial: foto panorâmica, "A casa começa pelo lugar.", sequência 01 O terreno · 02 O projeto · 03 A construção (âncora `#como-funciona`), projetos, Light Steel Frame, chamada de contato |
| `projetos.html` | Catálogo com filtro por tipo (Todos/Casas/Chalés, sincronizado com `?tipo=`) e cartões com dados pendentes |
| `light-steel-frame.html` | O que é, camadas da parede, etapas da obra, o que depende de cada projeto |
| `a-lucerna.html` | Princípios, blocos pendentes (história, equipe, obras, CNPJ) e imagem conceitual identificada como tal |
| `contato.html` | Formulário acessível (nome, telefone, cidade, UF, mensagem) com validação; `?projeto=` preenche a mensagem |

## Arquivos

- `assets/css/styles.css` — paleta, tipografia (Newsreader + Manrope) e componentes.
- `assets/js/config.js` — **dados comerciais e logo**. Campos vazios não aparecem; no lugar entra um aviso "Pendente".
- `assets/js/main.js` — menu móvel, logo, canais de contato, filtro do catálogo e formulário.
- `assets/img/` — WebP em 640/1024/1600 px gerados das imagens originais (que não foram alteradas) e favicon neutro.

## Logo

A logo aprovada é `../outputs/lucerna-site-imagens/logo-lucerna-referencia-cliente.png`, mas é uma prévia com marca d'água e **não deve ser publicada**. Até chegar o arquivo original limpo, o cabeçalho e o rodapé mostram um marcador neutro ("LUCERNA · logo pendente"). Ao receber o arquivo, salve em `assets/img/` e preencha `logo.claro` e `logo.escuro` em `config.js` — sem redesenhar nada. Peça ao cliente versões para fundo claro e escuro (PNG transparente ou SVG): a prévia é dourada sobre azul-escuro, e o cabeçalho do site é off-white.

## Pendências (dados do cliente)

- Arquivo final da logo (limpo, fundo transparente, versões clara e escura).
- Telefone, WhatsApp, e-mail, endereço, Instagram, Facebook.
- Destino do formulário (`formEndpoint` ou `whatsapp` em `config.js`). Sem isso, o formulário valida e avisa que nada foi enviado.
- Política de privacidade (LGPD) para o formulário.
- Por projeto: nome comercial, área, quartos, planta, valores e especificações.
- Light Steel Frame: normas seguidas, sistemas de fechamento e isolamento, prazos e garantias, validados pelo responsável técnico.
- A Lucerna: história, equipe e responsável técnico (com registro), obras entregues com fotos reais, região de atendimento, CNPJ.
- Validar os textos de processo (01/02/03, etapas da obra, princípios), escritos como rascunho.

Quando tudo estiver preenchido, `ocultarPendencias: true` em `config.js` esconde os avisos restantes.

## Versão anterior

A primeira versão do site (com pacotes, preços, plantas e logo redesenhada, todos fictícios) foi movida para `../arquivo-versao-anterior/lucerna-site-v1/` e não deve ser publicada.
