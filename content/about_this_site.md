# About this site
This site was made with the minimalistic Rawstatic template. 

Static sites generally come in two flavors:
- Written as HTML, and served
- Written as templates, and built by a generator (such as jekyll, hugo, gatsby)

Rawstatic takes a middleway - you author content in markdown, but serve a single html file which does the parsing of markdown into html on the fly. 

## Tradeoffs
### Simplicity
It's simpler to author than any of the other methods.
It is, however, more complicated than authoring html, technically speaking, as javascript doing ajaxy navigation emulation is involved.
It is certainly more simple than a fullblown generator, but certain usecases may not be - ie styling the resulting html, embedding things, etc.

### Performance
This is a curious one. At the time of writing, the index page is under 50kb. This could be less if the page would not include the javascript to handle the markdown conversion. However, every subsequent pageload is markdown, which is smaller than HTML, and so with site usage the network performance gets better than any the other methods discussed.

As the client has to generate the HTML from markdown, this does incur a computational overhead on the client, but this seems negligible.
