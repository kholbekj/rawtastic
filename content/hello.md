<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/default.min.css">
<script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js"></script>
<script>
var waitForHljs = setInterval(function () {
if (typeof hljs != 'undefined') {
hljs.highlightAll();
clearInterval(waitForHljs);
}
}, 10);
</script>

# Hello! This is my new site!

It comes with a bird!

![](/images/bird.jpg)

Photo by [David Clode](https://unsplash.com/@davidclode?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash)
  
# How to grow the site
Right now, this site might not have much content (unless it does, and this comment is outdated!)

The best way to start growing it, is to add more content! It's easy.

## Adding new pages

1. Create a new file in the `content` folder. It's where this site lives, too! It should end with `.md`, because it's a "markdown" file. If you don't know markdown, don't worry, it's nothing complicated. I'll name mine `the_cup_noodle_incident.md`
2. Stick some text in it. Maybe a nice anecdote?
3. Open `index.html`, find the line that looks like this:
    ```html
    <li><a src="/content/hello.md">Hello</a></li>
    ```
4. Copy that line, but use your new file and title instead. So mine would be
   ```html
   <li><a src="/content/the_cup_noodle_incident.md">The cup noodle incident</a></li>
   ```
5. Put your new line under or over the line you copied.
6. Refresh the page, and you should now have a link to your new site!

## Markdown
It works to put text in the markdown file, but we can add other things, too!

For example, to make a title, put a `#` in front of some text, like so:
```md
# My title

And here my regular text
```

If you refresh your page, you should see a nice, big title.

Next up, let's add a link to another page. A link has two parts:
1. Where it's linking to
2. What it should say

The first part of the link we can call what we like, no rules here. Let's go with `[My introduction page]`

To make a link back to this page, we need to point to it - the file is in the `content` folder, and is called `hello.md`, so the second part of our link will be `(/content/hello.md)`.


Putting it together:
```md
# My title

And here my regular text
[My introduction page](/content/hello.md)
```

