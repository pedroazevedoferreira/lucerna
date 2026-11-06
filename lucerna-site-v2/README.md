# Lucerna — site

Site estático (HTML, CSS e JavaScript, sem etapa de build). Abra `index.html` por um servidor local, por exemplo:

```bash
python -m http.server 8766
```

## Estrutura

| Caminho | Conteúdo |
|---|---|
| `index.html` | Início: abertura animada (1ª visita), hero, benefícios, projetos em destaque, pacotes, como funciona, estrutura, perguntas, chamada |
| `projetos.html` | Catálogo com filtros (tipo, quartos, área, preço), ordenação e contador |
| `projeto.html?id=…` | Página de cada projeto: galeria (fachada, interior, planta por pavimento), ficha técnica, 3 pacotes com preço, prazo e itens |
| `pacotes.html` | O que cada pacote cobre item a item, preços por projeto, prazos, garantias e responsabilidades |
| `light-steel-frame.html` | O que é o sistema, etapas da obra, camadas da parede, perguntas comuns |
| `sobre.html` | Propósito, compromissos e blocos de informações pendentes |
| `contato.html` | Pedido de orçamento (projeto, pacote, cidade/UF, terreno e medidas) que gera a mensagem de WhatsApp |
| `assets/css/styles.css` | Estilos, paleta da marca e animações |
| `assets/js/config.js` | **Dados comerciais configuráveis** (telefone, WhatsApp, e-mail, redes, área de atendimento, responsável técnico, CNPJ) |
| `assets/js/produtos.js` | **Catálogo**: projetos, plantas, valor por m² de cada pacote, prazos e itens inclusos. Hoje com dados FICTÍCIOS |
| `assets/js/main.js` | Abertura, menu, animações de rolagem, catálogo, página do projeto, pacotes e formulário |
| `assets/img/` | Imagens otimizadas em WebP (800 e 1600 px), logo em SVG e favicon |
| `referencias/lucerna-site-imagens/` | Cópia íntegra da pasta original de imagens e da referência de layout |

## Dados pendentes

- Telefone, WhatsApp, e-mail, Instagram, Facebook, área de atendimento, responsável técnico e CNPJ: preencher em `assets/js/config.js`.
  Com o WhatsApp preenchido, o formulário de contato abre a conversa com a mensagem pronta.
- Área, quartos, plantas, preços e prazos de cada projeto: hoje são fictícios, em `assets/js/produtos.js`. O site avisa isso no catálogo, nas páginas de projeto e no rodapé.
- Prazos de garantia por sistema (cobertura, instalações, acabamentos), a confirmar com o responsável técnico.
- História da empresa (página Sobre).
- Texto da política de privacidade.
- Versão final do logo (o símbolo em SVG foi redesenhado a partir do conceito em PNG).

Todas as imagens são ilustrativas, geradas por IA, e estão identificadas como tal no site.
