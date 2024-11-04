var editor = ace.edit("editor");
editor.setTheme("ace/theme/monokai");
editor.session.setMode("ace/mode/html");
fetch('/index.html')
  .then(response => response.text())
  .then(data => editor.setValue(data));

document.getElementById('preview').addEventListener('click', function() {
  var html = editor.getValue();
  doc = new DOMParser().parseFromString(html, 'text/html');
  window.doc = doc;
  generateSiteMap(doc).then(() => {
    localStorage.setItem('siteMap', JSON.stringify(Array.from(siteMap.entries())));
    var blob = new Blob([doc.documentElement.outerHTML], { type: "text/html" });
    var url = URL.createObjectURL(blob);
    window.open(url, '_blank').focus();
  });
});

// Traverse links, fetch resources, traverse those links, until sitemap is filled in.
async function generateSiteMap(doc) {
  siteMap = new Map();

  links = getLinks(doc);
  for (const link of links) {
    try {
      const response = await fetch(link);
      if (response.headers.get('Content-Type').includes('text/html')) {
        const resourceHtml = await response.text();
        const resourceDoc = new DOMParser().parseFromString(resourceHtml, 'text/html');
        replaceStaticLinks(resourceDoc, siteMap);
        siteMap.set(link, URL.createObjectURL(new Blob([resourceDoc.documentElement.outerHTML], { type: "text/html" })));
      } else if (link.endsWith('.md')){
        // Just get static links from markdown (images, etc)
        const resourceText = await response.text();
        const links = resourceText.match(/!\[.*?\]\((.*?)\)/g)?.map(match => match.match(/\((.*?)\)/)[1]);
        if (links) {
          relevantLinks = links.filter(link => !link.startsWith('http')).filter(link => !link.endsWith('.md') || link.endsWith('.html'))
          for (const link of relevantLinks) {
            const response = await fetch(link)
            blob = await response.blob()
            siteMap.set(link, URL.createObjectURL(blob));
          }
        }
        const resourceBlob = new Blob([resourceText], { type: "text/markdown" });
        const resourceUrl = URL.createObjectURL(resourceBlob);
        siteMap.set(link, resourceUrl);
      } else {
        const resourceBlob = await response.blob();
        const resourceUrl = URL.createObjectURL(resourceBlob);
        siteMap.set(link, resourceUrl);
      }
    } catch (e) {
      console.error(e);
    }
  }
  replaceStaticLinks(doc, siteMap);
  siteMap.set('index.html', URL.createObjectURL(new Blob([doc.documentElement.outerHTML], { type: "text/html" })));
}

// Only get relative links
function getLinks(doc) {
  const elements = doc.querySelectorAll('img[src], script[src], link[href], a[href]');
  const links = [];
  for (const element of elements) {
    const attr = element.src ? 'src' : 'href';
    const url = element.getAttribute(attr);
    if (url && !url.startsWith('http')) {
      links.push(url);
    }
  }
  return links;
}

function replaceStaticLinks(doc, siteMap) {
  const elements = doc.querySelectorAll('link[href], script[src]', 'img[src]');
  for (const element of elements) {
    const attr = element.href ? 'href' : 'src';
    const url = element.getAttribute(attr);
    if (url && !url.startsWith('http')) {
      const newUrl = siteMap.get(url);
      if (newUrl) {
        element.setAttribute(attr, newUrl);
      }
    }
  }
}
