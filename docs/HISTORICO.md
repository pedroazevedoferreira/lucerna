# Histórico do projeto e decisões

Registro do que foi feito no site da Lucerna, na ordem em que aconteceu, e por quê.

## 1. Material do cliente

- **Briefing do site:** casas e chalés em Light Steel Frame; organização de catálogo inspirada na MCPF e modernidade da Fast Homes; paleta azul-petróleo `#102B33`, verde-floresta `#243B32`, dourado-champagne `#E8BD61`, areia `#D9CBB5`, madeira `#A58B68`, marrom-cedro `#594638` e off-white `#F3F0E8`.
- **Imagens:** conceitos gerados por IA (casas, chalés, estrutura em aço, interior, refúgio noturno).
- **Proposta de marca:** origem do nome (lanterna/luz; montanhas suíças), slogans ("Construindo o seu refúgio"), manifesto e direção visual (madeira, vidro, luz natural, tons terrosos e champagne).
- **Logo aprovada:** recebida só como prévia com marca d'água; aguardando o arquivo original.

## 2. Versão v1 (base)

Site completo com página inicial, catálogo com filtros, página de cada projeto (galeria, planta, ficha técnica), comparação de pacotes (Estrutura, Casa Fechada, Chave na Mão), Light Steel Frame, Sobre e Contato com pedido de orçamento pelo WhatsApp.
Preços, prazos, áreas e plantas são **fictícios** e o site avisa isso.

## 3. Versão editorial (`lucerna-site/`)

Releitura enxuta pedida em seguida: foto panorâmica, título "A casa começa pelo lugar.", sequência 01 terreno / 02 projeto / 03 construção, catálogo sem números (dados marcados como pendentes) e espaço reservado neutro para a logo.
Mantida como alternativa; o manifesto e o slogan da proposta foram aplicados nela também.

## 4. Versão de demonstração (`lucerna-site-v2/`)

Partiu de uma cópia fiel da v1. A estrutura, as páginas internas, a logo, as fontes e a paleta da v1 foram preservadas. Mudanças na página inicial, em etapas:

1. **Carrossel no topo** no lugar da foto única, sem botões sobre as fotos.
2. Testes de primeira tela (foto limpa com texto abaixo; vitrine de produtos com ficha e preço) que não convenceram. Ficaram guardados fora do repositório.
3. **"Janela da casa"** (versão aprovada): a foto aparece recortada no formato de uma casa, com contorno dourado que se desenha na abertura; ao rolar, a janela se abre até a tela cheia, como uma câmera entrando. As fotos trocam sozinhas a cada 6 s, com zoom lento; tocar numa linha escolhe a foto e encerra a troca automática.
4. **Faixa "Por dentro da parede"** no lugar dos três ícones genéricos: desenho das camadas de uma parede em Light Steel Frame, com a mesma legenda da página Light Steel Frame.
5. **Manifesto** da proposta de marca, em seção escura com a foto noturna ao fundo e um brilho dourado; as palavras acendem uma a uma ao rolar, e as palavras-chave (refúgio, madeira, vidro, alpino, acolhimento) ficam em dourado. O texto é o da proposta sem a frase "feitos para durar gerações", que é uma promessa sem comprovação.
6. **Pacotes, preços e catálogo:** chegaram a ser retirados para seguir só a proposta de marca e depois **foram restaurados** a pedido, para a demonstração ao cliente. Continuam fictícios e sinalizados.

## 5. Acessibilidade e comportamento

- Navegação por teclado, foco visível, textos alternativos nas imagens e anúncio da foto atual para leitores de tela nas trocas feitas pela pessoa.
- Quem pede menos movimento no sistema vê tudo parado: sem abertura da janela, sem troca automática e com o manifesto já aceso.
- Testado em 375 px (celular), 1024 × 768, 1366 × 768 e 1440 × 900, sem rolagem lateral.
