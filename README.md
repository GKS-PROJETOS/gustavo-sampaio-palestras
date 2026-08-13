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

O destino final é `https://eusougustavosampaio.com/palestras/` — é esse endereço que
está nas tags `canonical`, `og:url` e `og:image`. Enquanto o domínio não apontar para cá,
as prévias em `*.vercel.app` funcionam normalmente, mas os previews de link em redes
sociais vão continuar apontando para o domínio final.

## Observações

- As imagens são referenciadas por caminho relativo e o Linux da Vercel diferencia
  maiúsculas de minúsculas: ao trocar uma imagem, manter o nome exatamente igual.
- `index-v1-backup.html` é a versão antiga e fica fora do repositório (`.gitignore`).
