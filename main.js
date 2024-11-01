document.addEventListener('DOMContentLoaded', init);

function init() {
  const darkModeElement = document.getElementById('dark-mode');
  const storedTheme = localStorage.getItem('theme');
  const browserDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
  if (storedTheme) {
    if (storedTheme == 'dark') {
      darkModeElement.checked = true;
      document.querySelector('html').setAttribute('data-theme', 'dark');
    } else {
      darkModeElement.checked = false;
      document.querySelector('html').setAttribute('data-theme', 'light');
    }
  } else if (browserDarkMode) {
    darkModeElement.checked = true;
    document.querySelector('html').setAttribute('data-theme', 'dark');
  }
  darkModeElement.addEventListener('click', function () {
    toggleDarkMode();
  });

  const urlParams = new URLSearchParams(window.location.search);
  const path = urlParams.get('path');

  if (path) {
    replaceContent(path, false);
  } else {
    replaceLinks();
  }

  // If the user navigates back or forward, we want to replace the content
  window.onpopstate = function (event) {
    window.location.reload();
  };

};
function replaceLinks() {
  document.querySelectorAll('a').forEach(function (link) {
    if (link.getAttribute('href').endsWith('.md')) {
      link.addEventListener('click', function (event) {
        event.preventDefault();

        const url = this.getAttribute('href') + '?t=' + new Date().getTime();

        replaceContent(url);
      });
    }
  });
}
function replaceContent(url, updatePath = true) {
  fetch(url)
    .then((response) => response.text())
    .then((text) => {
      main = document.querySelector('main');

      main.innerHTML = "<a href='/index.html'>Back</a><br><br>" + marked.parse(text);

      evalScripts(main);

      window.scrollTo(0, 0);

      if (updatePath) {
        history.pushState({}, '', parametrizeUrl(new URL(url, window.location)));
      }
      replaceLinks();
    });
}
function toggleDarkMode() {
  const html = document.querySelector('html');
  const currentTheme = html.getAttribute('data-theme')
  const newTheme = currentTheme == 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
  console.log('Switched from', currentTheme, 'to', newTheme);
}

// We want to replace the url /content/*.md with index.html?path=content/*.md
function parametrizeUrl(url) {
  const path = url.pathname;
  if (path.endsWith('.md')) {
    return '/index.html?path=' + path;
  }
  return url;
}

//recursively eval script tags in element
function evalScripts(element) {
  if (element.tagName == 'SCRIPT') {
    // handle remote scripts
    if (element.src) {
      const script = document.createElement('script');
      script.src = element.src;
      document.head.appendChild(script);
    } else {
      console.log('evaluating script', element.innerHTML);
      eval(element.innerHTML);
    }
  } else {
    element.childNodes.forEach(evalScripts);
  }
}
