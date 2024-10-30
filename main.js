function replaceContent(url) {
  fetch(url)
    .then((response) => response.text())
    .then((text) => {
      main = document.querySelector('main');
      main.innerHTML = "<a href='/index.html'>Back</a><br><br>" + marked.parse(text);
      window.scrollTo(0, 0);
      history.pushState({}, '', parametrizeUrl(new URL(url, window.location)));
      replaceLinks();
    });
}

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

function toggleDarkMode() {
  const html = document.querySelector('html');
  const currentTheme = html.getAttribute('data-theme')
  const newTheme = currentTheme == 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
  console.log('Switched from', currentTheme, 'to', newTheme);
}

document.addEventListener('DOMContentLoaded', function () {
  replaceLinks();
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
    replaceContent(path);
  }

  // If the user navigates back or forward, we want to replace the content
  window.onpopstate = function (event) {
    window.location.reload();
  };

});

// We want to replace the url /content/*.md with index.html?path=content/*.md
function parametrizeUrl(url) {
  const path = url.pathname;
  if (path.endsWith('.md')) {
    return '/index.html?path=' + path;
  }
  return url;
}
