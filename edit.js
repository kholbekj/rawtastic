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
  replaceLinksWithBlobsUsingFetch(doc).then(() => {

    var blob = new Blob([doc.documentElement.outerHTML], { type: "text/html" })
    var url = URL.createObjectURL(blob);
    window.open(url, '_blank').focus();
  });
});
async function replaceLinksWithBlobsUsingFetch(doc) {
  const elements = doc.querySelectorAll('script[src], link[rel="stylesheet"], img[src], a');
  for (const element of elements) {
    const attr = (element.tagName.toLowerCase() === 'a' || element.tagName.toLowerCase() === 'link') ? 'href' : 'src';
    const relativeUrl = element.getAttribute(attr);
    console.log(relativeUrl);

    // Skip if the URL is absolute or already a blob
    if (!relativeUrl || /^(https?|blob)/.test(relativeUrl)) {
      continue;
    }

    try {
      const response = await fetch(relativeUrl);
      const resourceBlob = await response.blob();
      const resourceUrl = URL.createObjectURL(resourceBlob);

      element.setAttribute(attr, resourceUrl);
      element.setAttribute('data-original-url', relativeUrl);
    } catch (error) {
      console.error(`Failed to fetch resource ${relativeUrl}: `, error);
    }
  }
}
