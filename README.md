# Slidrr

![](bin/img/slidrr.png)

Entering the world of **presentations** you have a lot of tools to your disposal.
The most popular must be Powerpoint (windows) and Keynote (mac).

Both are awesome but will cost you money and generate [lock-in](https://en.wikipedia.org/wiki/Vendor_lock-in).
These tools are popular with **non**-developers.

Developers like something simple to get the message across. And open-source. And freedom of which tool to use.
That's why html presentation tools like [reveal.js](https://github.com/hakimel/reveal.js) and [cleaver](https://github.com/jdan/cleaver) are popular with developers.
You can share your presentation online (github or own website).
Modify the presentation with tools you already use.
And if you want: version controle.

If you combine html with easy writing with [Markdown](https://daringfireball.net/projects/markdown/) you focus on writing and getting the message across.

There are enough tools that work like that (see previously mentioned html tools), but I think I can do better!


## But why another html tool?

I was curios if I could build a presentation tool with [Haxe](http://www.haxe.org).
And I wanted features that I could find in some, but not in all.

Till it's finished, you should consider this an experiment / a WIP repos.

## Extra added to Markdown

To use standard Markdown for presentations, I need to add some extra "rules" to Markdown.
They shouldn't be to difficult to learn but they will show up in a standard Markdown editor (like MacDown) because they are not part of Markdown.
I concider the additions simple and not intrucive.

To add a slide: `--` (2 dashes) _but you can changes that into something that you find easier to use_
To add speaker notes: `??` (2 questionmarks) _but you can changes that into something that you find easier to use_

To create a fullscreen image: use the default way to create an image `![](path/to/image)` and it should be the first markdown you write after creating a slide.  
To create a fullscreen image __but__ don't crop the image: use the default way to create an image `![](path/to/image?)` and it should be the first markdown you write after creating a slide. Notice the `?` at the end of the image, this will make sure the image is as big as possible but won't be cropped.  
To create a slide with an different background color: it works the same as an fullscreen image, but you add the hex value to the alt text of the image and leave the image source empty `![#ff3333]()`  
This works also with fullscreen images with text over it, it will help to change the color (use black background, get white text and vice versa)  


**Summary**

```
first slide
--
second slide with speaker notes
??
something important
--
![](path/to/image)
fullscreen image
--
![#ff3333]()
background color is red
```

You need help with the basics of Markdown, check out this [cheatsheet](markdown.md)


## Features in Slidrr

1. Write your presentation with [Markdown](#markdown)
2. Split into chapters using `--`
3. Add speaker-notes with `??`
10. Keyboard [navigation](#navigation)
11. Default changes via quarystrings `?md=haxe.md&css=foobar.css&author=Matthijs Kamstra aka [mck]&time=45`
	- md
	- author
	- [css](#custom-css)
	- time (in minutes)
13. Easy to use [fullscreen images](#fullscreen-images)
14. [Change background color of slide](#change-background-color), change font color automaticly to black or white


## Features that need more love (still working on them)

- ~~Default changes via quarystrings~~
- ~~Change background color~~
	- ~~change font color based upon background color~~
	- ~~enhance contrast with glow~~
- Speaker notes
	- time
	- layout
	- notes
	- progress
	- time per slide
- Default styling
	- ~~code~~
	- lists
	- help
	- typo
- ~~Code hightlight~~


## Features I want in Slidrr

4. use config file (first work with default settings)
5. simple but nice design
	- nice transition
	- default styling
	- code highlighting
	- ..
6. ready for offline use
7. clean, simple, one file
8. default styling / no web-fonts (see #6)
9. simple styling (see #6)
12. Speaker-note help:
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
| toggle fullscreen | `f` |
| toggle help | `h` |
| toggle focus screen | `b` |
| reverse fullscreen | `esc` |
| speaker notes | `s` |


# Custom css

You can change the html and add a new css,
you can modify the existing `slidrr.css`
or you can test by adding the path to the css to the url
like `?css=test.css`

```
http://localhost:2000/?css=css/test.css#/13
```


# Fullscreen images

Create a slide with fullscreen images
```
![](path/to/image)
fullscreen image
```
_first the image then text_

Create a slide with a image as-big-as-possible without cropping
```
![](path/to/image?)
fullscreen image without cropping
```
_first the image then text_



# Change background color

Create a slide with a different colored background
```
![#ff3333]()
background color is red
```
_use the image Markdown, but don't add an image-path_


# Hightlight code

I use [highlight.js](https://highlightjs.org/) for language code highlighting.
But I don't use the complete set supported by highlight.js.

Included in this presentation is

- CSS
- HTML, XML
- JavaScript
- JSON
- Markdown
- Haxe

And default I use [monokai-sublime](https://github.com/isagalaev/highlight.js/blob/master/src/styles/monokai-sublime.css) styling.

You know what to do if you don't agree!




### existing examples

- https://github.com/jdan/cleaver
- https://github.com/gnab/remark
- https://github.com/hakimel/reveal.js


# Build

You need [Haxe](http://haxe.org/download/)!

Install via haxelib

`haxelib install markdown`

**Build, open Google Chrome and start Neko server**

```
cd 'to/this/folder' (replace with your own path)
haxe build.hxml
cd 'to/this/folder/bin' (use previous path and add /bin)
open -a Google\ Chrome http://localhost:2000/
nekotools server
```

**Use NPM for automated build**

```
cd 'to/this/folder'
npm run watch
```

# Testing

```
http://localhost:2000/?md=slidrrtest.md&author=mck
```

# Markdown

[Markdown](https://daringfireball.net/projects/markdown/), created by John Gruber, author of the Daring Fireball blog.
The original source of Markdown can be found at Daring Fireball - Markdown.

