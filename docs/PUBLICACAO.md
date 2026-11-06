# Como publicar

A pasta `lucerna-site-v2/` é publicada no **GitHub Pages** pelo fluxo `.github/workflows/pages.yml`
a cada envio para a branch `main`. A pasta `referencias/` não entra na publicação.

## Primeira vez

1. No GitHub, abra o repositório → **Settings → Pages**.
2. Em **Build and deployment → Source**, escolha **GitHub Actions**.
3. Abra a aba **Actions** e rode (ou aguarde) o fluxo **Publicar site**. O endereço final aparece no resumo da execução.

## Atualizar

Basta enviar as alterações para `main`; o site é republicado sozinho em cerca de 1 minuto.

## Trocar dados

- Contatos, WhatsApp, redes, CNPJ: `lucerna-site-v2/assets/js/config.js`.
- Projetos, áreas, plantas, preços e prazos: `lucerna-site-v2/assets/js/produtos.js`.
- Ao mudar CSS ou JS, aumente o número `?v=` nos links das páginas para o navegador não usar a versão antiga.
