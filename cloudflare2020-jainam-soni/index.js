addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

const links = [
  { "name": "JAINAM123", "url": "https://github.com/zumaad/Remote-Control-Roach-Destroyer" },
  { "name": "another project of mine: async python http server", "url": "https://github.com/zumaad/pyrver" },
  { "name": "one of the main contributors to this open source project :)", "url": "https://github.com/Belieal/flipping-utilities" }
]

class LinksTransformer {
  constructor(links) {
    this.links = links
  }
  
  async element(element) {
    const newContent = this.links.map(link => `<a href=${link.url}>${link.name}</a>`).join("")
    element.setInnerContent(newContent, {html:true})
  }
}

const API_URL = 'https://static-links-page.signalnerve.workers.dev';

const transformer = new HTMLRewriter().
  on("div#links", new LinksTransformer(links));
 

async function htmlHander() {
  const init = {
    method: 'GET',
  };

  const res = await fetch(API_URL, init);
  const transformedHtmlResponse = await transformer.transform(res);

  return transformedHtmlResponse
}

/**
 * Respond with hello worker text
 * @param {Request} request
 */
async function handleRequest(request) {

  try {
    const init = {
      method: 'GET',
    };

    const transformedHtmlResponse = await htmlHander();
    // return transformedHtmlResponse

    return transformedHtmlResponse;
  
    // console.log(transformedHtmlResponse.text());

    // return new Response(transformedHtmlResponse, {
    //   headers: { 'content-type': 'text/html' },
    // });

  }
  catch (err) {
    // Return the error stack as the response
    return new Response(err.stack || err)
  }
}