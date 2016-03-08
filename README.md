# Slidrr

![](bin/img/slidrr.png)

Entering the world of presentations you have a lot of tools to you disposal.
The most popular must be Powerpoint (windows) and Keynote (mac).
 
Both are awesome but will cost you money and generate [lock-in](https://en.wikipedia.org/wiki/Vendor_lock-in).
These tools are popular with non-developers.

Developers like something simple to get the message across. And open-source. And freedom of which tool to use.
That's why html presentation tools like [reveal.js](https://github.com/hakimel/reveal.js) and [cleaver](https://github.com/jdan/cleaver) are popular with developers.
You can share your presentation online (github or own website).
Modify the presentation with tools you already use.
And if you want: version controle.

If you combine html with easy writing with [Markdown](https://daringfireball.net/projects/markdown/) you focus on writing and getting the message across.  

There are enough tools that work like that (see previously mentioned html tools), but I think I can do better!


## But why another?

I was curios if I could build a presentation tool with Haxe.
And I wanted something features that I could find in some, but not in all.

Till it's finished, you should consider this an experiment / a WIP repos.


## Features I want in Slidrr

1. write in Markdown
2. split into chapters using `---` 
3. speaker-notes with `???` 
4. use config file (first work with default settings)
5. simple but nice design
	- nice transition 	
	- default styling
	- ..
6. ready for offline use
7. clean, simple, one file
8. default styling / no web-fonts (see #6) 
9. simple styling (see #6)
10. keyboard [navigation](#navigation)
11. default changes via quarystrings `?css=foobar.css&author=Matthijs Kamstra aka [mck]&time`
	- md
	- author
	- css
	- time
12. Speaker-note help: 
	- time
	- total time
	- current slide
	- previous slide
	- speaker notes
13. easy way to use fullscreen images
	- start with image == used for background images

## Navigation

Slidrr uses keyboard navigation

| action | shortcut |
| --- | --- |
| forward | `cursor right` , `.` , `space` |
| reverse | `cursor left` , `,` | 
| fullscreen | `f` | 
| help | `h` | 
| create black screen | `b` | 
| reverse fullscreen | `esc` | 
| speaker notes | `s` | 







### existing examples

- https://github.com/jdan/cleaver
- https://github.com/gnab/remark
- https://github.com/hakimel/reveal.js


# Build

You need Haxe!

install

`haxelib install markdown`


```
cd to/this/folder (replace with your own path)
haxe build.hxml
open -a Google\ Chrome http://localhost:2000/
nekotools server
```

# Testing

```
http://localhost:2000/?md=slidrrtest.md&author=mck
```

# Markdown

[Markdown](https://daringfireball.net/projects/markdown/), created by John Gruber, author of the Daring Fireball blog. 
The original source of Markdown can be found at Daring Fireball - Markdown.

