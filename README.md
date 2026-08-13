# Gustavo Sampaio — Palestras

Landing page de contratação de palestras do Gustavo Sampaio (liderança, inteligência
emocional e sucessão em empresas familiares).

## Estrutura

Site estático, sem build e sem dependências.

```
index.html            página única, com CSS e JS embutidos
images/               fotos de estúdio do Gustavo
images/logos/         logos das empresas atendidas
```

## Rodar localmente

Basta abrir o `index.html` no navegador. Para servir por HTTP:

```bash
npx serve .
```

## Deploy

Hospedado na Vercel, publicado a cada push na branch `main`.

Endereço técnico (origem): `https://gustavo-sampaio-palestras.vercel.app`
Endereço público: `https://eusougustavosampaio.com/palestras/`

O domínio principal está na **GreatPages**, com DNS na **Cloudflare**. A GreatPages não
entrega subcaminho para outro servidor, então quem faz a ponte é o `cloudflare-worker.js`
deste repositório: ele intercepta a rota `eusougustavosampaio.com/palestras*` e busca o
conteúdo na Vercel. O resto do domínio continua na GreatPages, sem alteração.

Para publicar uma mudança: `git push` na `main`. A Vercel republica sozinha e o Worker
passa a servir a versão nova — não é preciso mexer na Cloudflare de novo.

### Configuração do Worker (feita uma vez)

1. Cloudflare → Workers & Pages → Create Worker.
2. Colar o conteúdo de `cloudflare-worker.js` e fazer Deploy.
3. No Worker → Settings → Domains & Routes → Add route:
   `eusougustavosampaio.com/palestras*`, zona `eusougustavosampaio.com`.

## Observações

- **A barra final em `/palestras/` é obrigatória.** Os caminhos das imagens no HTML são
  relativos ao documento, então sem a barra o navegador as procura na raiz do domínio,
  fora da rota do Worker. O Worker já redireciona `/palestras` para `/palestras/` por isso.
- As imagens são referenciadas por caminho relativo e o Linux da Vercel diferencia
  maiúsculas de minúsculas: ao trocar uma imagem, manter o nome exatamente igual.
- `index-v1-backup.html` é a versão antiga e fica fora do repositório (`.gitignore`).
