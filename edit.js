var editor = ace.edit("editor");
editor.setTheme("ace/theme/monokai");

loadFiles();

async function loadFiles() {
  const response = await fetch("/rawtastic-main.zip");
  const blob = await response.blob();
  const zip = new JSZip();
  await zip.loadAsync(blob);
  const files = zip.files;
  const fileNames = Object.keys(files);
  window.files = files;

  // Load index.html
  const indexHtml = await files['index.html'].async('text');
  editor.setValue(indexHtml);
  editor.session.setMode("ace/mode/html");

  const fileLinks = document.createElement('div');
  fileLinks.id = 'fileLinks';
  document.getElementById('editor').after(fileLinks);
  for (const fileName of fileNames.filter(fileName => fileName.endsWith('.html') || fileName.endsWith('.css') || fileName.endsWith('.js') || fileName.endsWith('.md'))) {
    const link = document.createElement('a');
    link.href = '#';
    link.innerText = fileName;
    link.onclick = async () => {
      const file = files[fileName];
      const text = await file.async('text');
      editor.setValue(text);
      editor.session.setMode("ace/mode/" + fileName.split('.').pop());
    }
    var p = document.createElement('p');
    p.appendChild(link);
    fileLinks.appendChild(p);
  }

  return files;
}



document.getElementById('preview').addEventListener('click', function() {
  generateSiteMapFromList(window.files).then(() => {
    localStorage.setItem('siteMap', JSON.stringify(Array.from(siteMap.entries())));
    var url = siteMap.get('/index.html');
    window.open(url, '_blank').focus();
  });
});

// This generates blobs for all files, then stores them in a map
async function generateSiteMapFromList(files) {
  siteMap = new Map();

  fileNames = Object.keys(files);
  nonDirs = fileNames.filter(fileName => !fileName.endsWith('/'));

  // Ignore html for now
  for (var fileName of nonDirs.filter(name => !name.endsWith('.html'))) {
    type = fileName.split('.').pop();
    address = `/${fileName}`;

    if (type === 'css' || type === 'js') {
      siteMap.set(address, URL.createObjectURL(new Blob([await files[fileName].async('text')], { type: "text/" + type })));
    } else if (type === 'md') {
      siteMap.set(address, URL.createObjectURL(new Blob([await files[fileName].async('text')], { type: "text/markdown" })));
    } else if (type === 'png' || type === 'jpg' || type === 'jpeg' || type === 'gif') {
      siteMap.set(address, URL.createObjectURL(new Blob([await files[fileName].async('blob')], { type: "image/" + type })));
    } else {
      console.error('Unknown file type: ' + type);
    }
  }

  // Then do html, but replacing static links
  for (var fileName of nonDirs.filter(name => name.endsWith('.html'))) {
    const html = await files[fileName].async('text');
    doc = new DOMParser().parseFromString(html, 'text/html');
    replaceStaticLinks(doc, siteMap);
    siteMap.set(`/${fileName}`, URL.createObjectURL(new Blob([doc.documentElement.outerHTML], { type: "text/html" })));
  }

  return siteMap;
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
    var url = element.getAttribute(attr);
    if (url && !url.startsWith('http')) {
      url = url.startsWith('/') ? url : '/' + url;
      const newUrl = siteMap.get(url);
      if (newUrl) {
        element.setAttribute(attr, newUrl);
      }
    }
  }
}
