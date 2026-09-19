// A pagina mora em eusougustavosampaio.com/palestras/, mas os arquivos em dist/
// ficam na raiz (index.html, fonts/..., images/...). Este worker tira o prefixo
// do caminho antes de procurar o arquivo, para os links relativos do HTML
// funcionarem nos dois enderecos: o /palestras/ do dominio e a raiz do
// *.workers.dev.

const PREFIXO = "/palestras";

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Sem a barra no fim os links relativos quebrariam (fonts/... cairia na raiz
    // do dominio, fora da rota). Manda para a versao com barra, preservando a
    // query e o fragmento.
    if (url.pathname === PREFIXO) {
      url.pathname = PREFIXO + "/";
      return Response.redirect(url.toString(), 301);
    }

    if (url.pathname.startsWith(PREFIXO + "/")) {
      url.pathname = url.pathname.slice(PREFIXO.length);
      return env.ASSETS.fetch(new Request(url, request));
    }

    return env.ASSETS.fetch(request);
  },
};
