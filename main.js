document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('a').forEach(function (link) {
    if (link.getAttribute('href').endsWith('.md')) {
      link.addEventListener('click', function (event) {
        event.preventDefault();

        const url = this.getAttribute('href');
        fetch(url)
          .then((response) => response.text())
          .then((text) => {
            main = document.querySelector('main');
            main.innerHTML = "<a href='index.html'>Back</a><br><br>" + marked.parse(text);
          });
        });
    }
    });
});
