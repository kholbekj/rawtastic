// Editing should be done in dark mode
document.querySelector('html').setAttribute('data-theme', 'dark');
// Beginning of Editor
var editor = ace.edit("editor");
editor.setTheme("ace/theme/dracula");

loadFiles();

// Load the zip file, open index.html in the editor
async function loadFiles() {
  const response = await fetch("/rawtastic-main.zip");
  const blob = await response.blob();
  const zip = new JSZip();
  await zip.loadAsync(blob);
  const files = zip.files;
  const fileNames = Object.keys(files);
  filemap = new Map();
  for (const fileName of fileNames) {
    if (fileName.endsWith('.jpg') || fileName.endsWith('.jpeg') || fileName.endsWith('.png') || fileName.endsWith('.gif')) {
      filemap.set(fileName, await files[fileName].async('blob'));
    } else {
      filemap.set(fileName, await files[fileName].async('text'));
    }
  };

  window.files = filemap;

  // If the query param q is set, we want to swap the word "cyan" in index.html with the value
  // in the map
  const urlParams = new URLSearchParams(window.location.search);
  const q = urlParams.get('q');
  if (q) {
    const indexHtml = filemap.get('index.html');
    const newHtml = indexHtml.replace('cyan', q);
    filemap.set('index.html', newHtml);
  }

  // Load index.html
  document.getElementById('editor').dataset.currentFile = 'index.html';
  const indexHtml = filemap.get('index.html');
  editor.setValue(indexHtml);
  editor.session.setMode("ace/mode/html");

  const fileLinks = document.createElement('ul');
  const br = document.createElement('br');
  fileLinks.id = 'fileLinks';
  document.getElementById('controls').after(br);
  br.after(fileLinks);
  for (const fileName of fileNames.filter(fileName => fileName.endsWith('.html') || fileName.endsWith('.css') || fileName.endsWith('.js') || fileName.endsWith('.md'))) {
    const link = document.createElement('a');
    link.href = '#';
    link.innerText = fileName;
    const languageModes = {
      'html': 'html',
      'css': 'css',
      'js': 'javascript',
      'md': 'markdown'
    };
    const languageMode = languageModes[fileName.split('.').pop()];

    link.onclick = async () => {
      const text = window.files.get(fileName);
      console.log(text);
      editor.setValue(text);
      console.log(`Setting mode to ace/mode/${languageMode}`);
      editor.session.setMode("ace/mode/" + languageMode);
      document.getElementById('editor').dataset.currentFile = fileName;
    }
    var p = document.createElement('li');
    p.appendChild(link);
    fileLinks.appendChild(p);
  }

  return files;
}

// Save file on press save
document.getElementById('save').addEventListener('click', function() {
  const fileName = document.getElementById('editor').dataset.currentFile;
  console.log(fileName);
  content = editor.getValue();
  window.files.set(fileName, content);
});


// End of Editor

// Begining of Preview Generation

// This generates blobs for all files, then stores them in a map
async function generateSiteMapFromList(files) {
  siteMap = new Map();

  fileNames = [...files.keys()];
  nonDirs = fileNames.filter(fileName => !fileName.endsWith('/'));

  // Ignore html for now
  for (var fileName of nonDirs.filter(name => !name.endsWith('.html'))) {
    type = fileName.split('.').pop();
    address = `/${fileName}`;

    if (type === 'css' || type === 'js') {
      siteMap.set(address, URL.createObjectURL(new Blob([files.get(fileName)], { type: "text/" + type })));
    } else if (type === 'md') {
      siteMap.set(address, URL.createObjectURL(new Blob([files.get(fileName)], { type: "text/markdown" })));
    } else if (type === 'png' || type === 'jpg' || type === 'jpeg' || type === 'gif') {
      siteMap.set(address, URL.createObjectURL(new Blob([files.get(fileName)], { type: "image/" + type })));
    } else {
      console.error('Unknown file type: ' + type);
    }
  }

  // Then do html, but replacing static links
  for (var fileName of nonDirs.filter(name => name.endsWith('.html'))) {
    const html = files.get(fileName);
    doc = new DOMParser().parseFromString(html, 'text/html');
    replaceStaticLinks(doc, siteMap);
    siteMap.set(`/${fileName}`, URL.createObjectURL(new Blob([doc.documentElement.outerHTML], { type: "text/html" })));
  }

  return siteMap;
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

document.getElementById('preview').addEventListener('click', function() {
  generateSiteMapFromList(window.files).then(() => {
    localStorage.setItem('siteMap', JSON.stringify(Array.from(siteMap.entries())));
    var url = siteMap.get('/index.html');
    window.open(url, '_blank').focus();
  });
});

// End of Preview Generation


// Begining of Download Generation
document.getElementById('download').addEventListener('click', function() {
  const zip = new JSZip();
  console.log(window.files);
  for (const [fileName, content] of window.files) {
    zip.file(fileName, content);
  }
  zip.generateAsync({ type: "blob" }).then(function(content) {
    var link = document.createElement('a');
    link.href = URL.createObjectURL(content);
    link.download = "rawtastic-main.zip";
    link.click();
  });
});
