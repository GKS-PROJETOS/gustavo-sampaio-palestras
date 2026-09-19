# Gustavo Sampaio — Palestras

Landing page de contratação de palestras do Gustavo Sampaio. Desde 19/09/2026 a página é a
**versão web do mídia kit** `PALESTRAS-GUSTAVO-SAMPAIO.pdf` (8 páginas, feito pela designer em
02/09/2026): cada `<section>` é uma página do kit, na mesma ordem, com o texto literal do PDF.

| Seção | `id` | Página do kit |
|---|---|---|
| Capa | `#topo` | 1 |
| Quem é Gustavo Sampaio | `#quem-e` | 2 |
| Não é apenas uma palestra | `#experiencia` | 3 |
| Do Everest aos Negócios | `#everest` | 4 |
| Palestras para diferentes desafios + formatos | `#palestras` | 5 |
| Os cinco temas | `#temas` | 6 |
| Resultados + empresas atendidas | `#resultados` | 7 |
| Leve Gustavo Sampaio para a sua empresa | `#contato` | 8 |

O que a página tem **a mais** que o PDF é só interface: menu, botões de WhatsApp (uma mensagem
diferente por botão, para saber de onde o contato veio), "Quero esta palestra" em cada tema,
QR de WhatsApp no desktop e rodapé.

## Estrutura

Site estático, sem build e sem dependências. Nenhum recurso de terceiro carrega com a página
(nem Google Fonts): fonte, imagem e script saem todos daqui.

```
index.html            página única, com CSS e JS embutidos
fonts/                Urbanist, Anton e Oooh Baby (woff2, subconjunto latin) + licenças OFL
images/kit/           fotos recortadas do PDF + og-palestras.jpg + qr-whatsapp.svg
images/logos-kit/     os 18 logos de "Algumas empresas atendidas", na ordem do kit
images/ , images/logos/   fotos e logos da versão de 10/08 — a página atual NÃO usa
```

`index-v1-backup.html` (06/08) e `index-v2-backup.html` (10/08) ficam só na máquina (`.gitignore`).

### De onde vêm as imagens

O PDF é 100% imagem — cada página é uma figura só, sem foto solta. As fotos de `images/kit/`
são recortes dessas páginas com o texto apagado, e a foto do banco sai do original em alta. Tudo
se refaz com os scripts de `GKS\Ferramentas\palestras-kit\`:

| Script | O que faz |
|---|---|
| `recortar_fotos.py` | gera todas as fotos de `images/kit/` a partir do PDF |
| `medir_logos.py` | mede no PDF o tamanho de cada logo em relação à célula da grade |
| `links_whatsapp.py` | gera os links `wa.me` já codificados |
| `qr_whatsapp.py` | gera o QR (e confere que ele lê) |
| `og-palestras.html` | molde da imagem de compartilhamento 1200×630 |
| `conferir_pagina.py` | **conferência**: texto do PDF presente, dado antigo vazando, links, assets |
| `testes\` | Playwright: 10 larguras, teclado, menu, sem JS, axe, contraste real, Firefox/WebKit |

Depois de mexer na página, rodar `python conferir_pagina.py` — tem de dar `0 falha(s)`.

### Decisões que fogem do PDF, de propósito

- **Fonte.** O kit usa Gilroy, que é comercial. Urbanist é a substituta que bateu na medição
  (largura das palavras −0,4%). Anton é a própria condensada do kit; Oooh Baby faz a assinatura.
- **Cor dos cards de tema.** No kit é `#997F65`; branco sobre ela dá 3,76:1 e reprova no
  contraste AA. A página usa `#89725A` (4,55:1), o mesmo bege ~7% mais escuro.
- **Holofote de "Resultados"** um tom mais contido que o do PDF, pelo mesmo motivo.
- **QR.** O do PDF leva ao Instagram por um encurtador de terceiro (`qrfacil.me`). O da página
  vai direto ao WhatsApp, só aparece no desktop e é escuro sobre placa clara, que lê melhor.
- **"PROGRAMAS  PARA EMPRESAS"** está com espaço duplo no PDF; aqui, um espaço.

## Rodar localmente

Abrir o `index.html` no navegador, ou servir por HTTP:

```bash
python -m http.server 8765
```

## Deploy

**No ar em https://eusougustavosampaio.com/palestras/ desde 19/09/2026**, por **Cloudflare
Workers** — a plataforma da GKS. A Vercel ficou para trás (decisão de 18/08/2026); o
`gustavo-sampaio-palestras.vercel.app` é resíduo, não a fonte da verdade.

Worker `gustavo-sampaio-palestras`, conta `Gustavosampaio1717@icloud.com`. Endereço de
reserva, servindo a mesma página na raiz:
`https://gustavo-sampaio-palestras.gustavosampaio1717.workers.dev/`.

### Como publicar

> ⚠️ **Este repo não tem Workers Builds conectado: push na `main` NÃO republica o site.**
> Quem publica é o comando abaixo, na mão. E a branch aqui é `main` — todos os outros repos
> da GKS são `master`.

```bash
rm -rf dist && mkdir -p dist/images
cp index.html dist/ && cp -r fonts dist/ && cp -r images/kit images/logos-kit dist/images/
npx wrangler deploy
```

O `dist/` só tem o que a página usa: `index.html`, `fonts/`, `images/kit/` e
`images/logos-kit/`. As pastas `images/*.jpg` e `images/logos/` são da versão de 10/08 e
ficam fora do deploy.

`wrangler.jsonc` declara as rotas do apex e do `www` (os dois servem o site sem redirecionar
um para o outro) e mantém `workers_dev: true`, senão declarar `routes` desligaria o endereço
de reserva. O `worker.js` tira o `/palestras` do caminho antes de servir o arquivo e
redireciona `/palestras` para `/palestras/` com 301.

### O que vale em qualquer plataforma

- **A barra final em `/palestras/` é obrigatória.** Os caminhos no HTML são relativos ao
  documento (`images/...`, `fonts/...`), então sem a barra o navegador os procura na raiz do
  domínio, fora da rota. O worker faz esse redirecionamento.
- **Nunca usar caminho começando com `/`** nem `<base href>`: quebra em `/palestras/`.
- O servidor diferencia maiúsculas de minúsculas: nome de arquivo sempre minúsculo, com hífen.
- `canonical`, `og:url`, `og:image` e o JSON-LD levam o endereço por extenso
  (`https://eusougustavosampaio.com/palestras/...`). Trocou a imagem, troca nos três.
