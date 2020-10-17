const Router = require('./router');

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

const links = [
  { "name": "JAINAM12", "url": "https://github.com/zumaad/Remote-Control-Roach-Destroyer" },
  { "name": "another project of mine: async python http server", "url": "https://github.com/zumaad/pyrver" },
  { "name": "one of the main contributors to this open source project :)", "url": "https://github.com/Belieal/flipping-utilities" }
]

const socialLinks= [
  { name: "github", details: { url: "https://zumaad.me", svg:"https://simpleicons.org/icons/github.svg"} },
  { name: "linkedin", details: { url: "https://zumaad.me", svg:"https://simpleicons.org/icons/linkedin.svg"} },
]

class LinksHandler {
  constructor(links) {
    this.links = links
  }
  
  async element(element) {
    const newElement = this.links.map(link => `<a href=${link.url}>${link.name}</a>`).join("")
    element.setInnerContent(newElement, {html:true})
  }
}

class SocialLinksHandler {
  constructor(links) {
    this.links = links
  }
  
  async element(element) {
    element.setAttribute("style", "")
    const newContent = this.links.map(link => `<a href=${link.details.url}><img src=${link.details.svg}></a>`).join("")
    element.setInnerContent(newContent, {html:true})
  }
}

class ProfileHandler {
  async element(element) {
    element.removeAttribute("style");
  }
}

const PROFILE_URL="https://media-exp1.licdn.com/dms/image/C5103AQFAVOV6lHYcyw/profile-displayphoto-shrink_800_800/0?e=1608163200&v=beta&t=GD9X9LgXpYN8IW6yJ9hOpXrFQT0wVRUT24EnbHTQvF8";

class AvatarHandler {
  async element(element) {
    element.setAttribute("src", PROFILE_URL)
  }
}

class NameHandler {
  async element(element) {
    element.setInnerContent("zumaad")
  }
}

//adds some of my social links to the div with id social.


class TitleHandler {
  async element(element) {
    element.setInnerContent("Jainam Soni")
  }
}

class BodyHandler {
  async element(element) {
    element.removeAttribute("class");
    element.setAttribute("style","background-color:#CBD5E0");
  }
}

const API_URL = 'https://static-links-page.signalnerve.workers.dev';

const transformer = new HTMLRewriter().
  on("div#links", new LinksHandler(links)).
  on("div#profile", new ProfileHandler()).
  on("img#avatar", new AvatarHandler()).
  on("h1#name", new NameHandler())
  ;

// EXTRA TASK
transformer.
  on("div#social", new SocialLinksHandler(socialLinks)).
  on("title", new TitleHandler()).
  on("body", new BodyHandler())
  ;
 
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

  const r = new Router()
    // Replace with the appropriate paths and handlers
    r.get('/links', () => getLinks())
    r.get('/', () => slash())
    const resp = await r.route(request)
    return resp  
}

function getLinks() {
  // array = [
  //     { "name": "Link Name", "url": "https://linkurl" },
  //     { "name": "Link Name1", "url": "https://linkurl1" },
  //     { "name": "Link Name2", "url": "https://linkurl2" }
  // ]

  const init = {
      headers: { 'content-type': 'application/json' },
  }

  const body = JSON.stringify({ 'links': links })
  return new Response(body, init)
}

async function slash(){
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