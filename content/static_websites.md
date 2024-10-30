# Static Websites

Going off of the [solarpunk](/content/solarpunk.md) my first thought was how am I spending power, currently? I already had some thoughts about things I suspected matter a lot and a little, but I wanted to question a little bit the margins for improvement in different areas of life.

...and then I tried.

![](/images/math.jpg) 

And I got overwhelmed. And I immediately fell into exactly the pattern I didn't want to - the focus on abstinence, the feeling of helplessness when confronted with the indirect cost of different kinds of services and consumption, the panic that sets in when I get the feeling that there's a tension between what I ethically want to do, and the life that I have. That's of course all important, but that's not what has rallied me, and it's not what will rally others.

So, I'll pull myself out of there, and try, instead, to think of something things that would be cool to build, that builds sustainability at there core value.

One of the topics that seem obvious is websites. Not big web apps, like social media, but little websites like this one. When I started writing this post, my website was already a static site, which is certainly a minority. But it's probably a good place to start. Why aren't more websites static?

I'd guess the reasons are usually
- It's more convenient to author content in the website itself. ie. wordpress.
- The website actually needs dynamic functions
- It's extremely convenient to just have a website that is really a page in someone else's website (hosted wordpress, webflow)
- People don't want to build things from scratch, they want to use templates and design-tools to put together what they want.

Well, we could address some things.

Clearly, using most static site generators are targeted at quite technical people. All the "easiest" recommendations requirest installing some package (be it npm, cargo, go, ruby), adjust templates in a templating language and html, apply some template maybe, author content, run commands, deploy to a host somewhere. This is really complicated if you don't use a commandline, or god forbid use Windows.

Maybe I could take my very simple static site template ([Rawstatic](/content/about_this_site.md), which this site is written in), but build a dynamic site that helps you select a template, build and deploy your site, and then gives you the instructions on how to maintain it from there.

I think a lot of people could manage that.

That seems like a fun quest.
