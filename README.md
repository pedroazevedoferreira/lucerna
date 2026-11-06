# Lucerna — site de casas e chalés em Light Steel Frame

Site de demonstração da **Lucerna Casas e Chalés**, feito para apresentação ao cliente.
É um site estático (HTML, CSS e JavaScript puros, sem etapa de build).

**Versão para o cliente:** pasta [`lucerna-site-v2/`](lucerna-site-v2/), publicada pelo GitHub Pages
(o endereço aparece em *Settings → Pages* e na aba *Actions* depois de cada publicação).

## Pastas

| Pasta | O que é |
|---|---|
| `lucerna-site-v2/` | **Versão de demonstração atual.** Base da v1 (catálogo, pacotes, páginas de projeto) com a nova página inicial: "janela da casa", faixa "Por dentro da parede" e manifesto que acende ao rolar. |
| `lucerna-site/` | Versão alternativa, editorial e enxuta, sem dados comerciais (só marcadores de "pendente"). Mantida como referência. |
| `docs/` | Documentação: histórico das decisões, como rodar e publicar, e lista do que falta do cliente. |
| `.github/workflows/` | Publicação automática da `lucerna-site-v2/` no GitHub Pages a cada envio para `main`. |

## Rodar localmente

```bash
python -m http.server 8768 --directory lucerna-site-v2
```

Depois abra <http://localhost:8768>.

## Documentação

- [Histórico do projeto e decisões](docs/HISTORICO.md)
- [Como publicar](docs/PUBLICACAO.md)
- [O que falta do cliente](docs/PENDENCIAS.md)

## Avisos importantes

- **Imagens** geradas por IA, ilustrativas. Não representam obras executadas pela Lucerna. O site avisa isso.
- **Preços, prazos, áreas e plantas** do catálogo são **fictícios**, para demonstração. O site avisa isso no rodapé, no catálogo e nas páginas de projeto.
- **Logo:** a logo aprovada pelo cliente só existe como prévia com marca d'água e **não** está neste repositório. O site usa o símbolo em SVG da v1 até chegar o arquivo final.
