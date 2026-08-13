/**
 * Worker da Cloudflare que serve este site em
 * https://eusougustavosampaio.com/palestras/
 *
 * O domínio principal fica na GreatPages e ela não sabe entregar um subcaminho
 * para outro servidor. Este Worker resolve isso: intercepta só o que começa com
 * /palestras e busca o conteúdo na Vercel, devolvendo como se fosse do próprio
 * domínio. Todo o resto do site continua indo para a GreatPages, intocado.
 *
 * Rota a configurar no painel:  eusougustavosampaio.com/palestras*
 *
 * ATENÇÃO ao redirect de barra final: os caminhos das imagens no index.html são
 * relativos ao documento ("images/..." e não "/images/..."). Em /palestras/ o
 * navegador resolve para /palestras/images/... e o Worker pega. Sem a barra, ele
 * resolveria para /images/... — fora da rota, indo parar na GreatPages, e as 18
 * imagens quebrariam. Por isso a barra final é obrigatória, não é preferência.
 */

const ORIGEM = 'https://gustavo-sampaio-palestras.vercel.app';
const BASE = '/palestras';

export default {
  async fetch(request) {
    const url = new URL(request.url);

    // /palestras -> /palestras/  (senão as imagens quebram, ver nota acima)
    if (url.pathname === BASE) {
      return Response.redirect(url.origin + BASE + '/' + url.search, 301);
    }

    // Não é nosso: devolve para o destino original (GreatPages).
    if (!url.pathname.startsWith(BASE + '/')) {
      return fetch(request);
    }

    // /palestras/images/foo.jpg  ->  /images/foo.jpg na Vercel
    const alvo = new URL(url.pathname.slice(BASE.length) + url.search, ORIGEM);

    const headers = new Headers(request.headers);
    headers.delete('host'); // quem define o host é a URL de destino

    const resposta = await fetch(alvo, { method: request.method, headers });

    // Response da fetch é imutável: copia para poder ajustar os headers.
    const saida = new Response(resposta.body, resposta);
    saida.headers.set('x-servido-por', 'vercel-via-cloudflare-worker');
    return saida;
  },
};
