function replaceLinks() {
  document.querySelectorAll('a').forEach(function (link) {
    if (link.getAttribute('href').endsWith('.md')) {
      link.addEventListener('click', function (event) {
        event.preventDefault();

        const url = this.getAttribute('href') + '?t=' + new Date().getTime();

        fetch(url)
          .then((response) => response.text())
          .then((text) => {
            main = document.querySelector('main');
            main.innerHTML = "<a href='index.html'>Back</a><br><br>" + marked.parse(text);
            replaceLinks();
          });
      });
    }
  });
}

function toggleDarkMode() {
  // pico uses html with data-theme="dark" or "light". If none are there, use browser settings.
  const html = document.querySelector('html');
  const currentTheme = html.getAttribute('data-theme') // || window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  const newTheme = currentTheme == 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', newTheme);
  console.log('Switched from', currentTheme, 'to', newTheme);
}

document.addEventListener('DOMContentLoaded', function () {
  replaceLinks();
  const darkModeElement = document.getElementById('dark-mode');
  const browserDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (browserDarkMode) {
      darkModeElement.checked = true;
      document.querySelector('html').setAttribute('data-theme', 'dark');
    }
  darkModeElement.addEventListener('click', function () {
    toggleDarkMode();
  }
                                                       );
});
