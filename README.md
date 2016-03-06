# Slidrr

Powerpoint and Keynote are presentation tools for designers.

Developers like html presentation tools like [reveal.js](https://github.com/hakimel/reveal.js) and [cleaver](https://github.com/jdan/cleaver)
The easiest way to write something (like a presentation) is with [Markdown](https://daringfireball.net/projects/markdown/).  

And with the help of previously mentioned tools you can do both easily.
But I think I can do better!


## But why another?

I was curios if I could build it with Haxe.
And I wanted something features that I could find in some, but not in all.

Till it's finished, you should consider this a experiment / a WIP repos.


## Features I want in Slidrr

1. writen in Markdown
2. split into chapters using `---` 
3. add speaker-notes with `???` 
4. use config file (first work with default setttings)
5. nice transitions
6. ready for offline use
7. clean, simple, one file
8. default styling / no webfonts (see #6) 
9. simple styling (see #6)
10. keyboard navigation
11. default changes via quarystrings `?css=foobar.css&author=Matthijs Kamstra aka [mck]&time`
	- md
	- author
	- css
	- time
12. speaker-note help: 
	- time
	- total time
	- current slide
	- previous slide
	- speaker notes

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

