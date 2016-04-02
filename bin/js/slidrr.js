(function (console, $global) { "use strict";
function $extend(from, fields) {
	function Inherit() {} Inherit.prototype = from; var proto = new Inherit();
	for (var name in fields) proto[name] = fields[name];
	if( fields.toString !== Object.prototype.toString ) proto.toString = fields.toString;
	return proto;
}
var EReg = function(r,opt) {
	opt = opt.split("u").join("");
	this.r = new RegExp(r,opt);
};
EReg.__name__ = true;
EReg.prototype = {
	match: function(s) {
		if(this.r.global) this.r.lastIndex = 0;
		this.r.m = this.r.exec(s);
		this.r.s = s;
		return this.r.m != null;
	}
	,matched: function(n) {
		if(this.r.m != null && n >= 0 && n < this.r.m.length) return this.r.m[n]; else throw new js__$Boot_HaxeError("EReg::matched");
	}
	,matchedPos: function() {
		if(this.r.m == null) throw new js__$Boot_HaxeError("No string matched");
		return { pos : this.r.m.index, len : this.r.m[0].length};
	}
	,matchSub: function(s,pos,len) {
		if(len == null) len = -1;
		if(this.r.global) {
			this.r.lastIndex = pos;
			this.r.m = this.r.exec(len < 0?s:HxOverrides.substr(s,0,pos + len));
			var b = this.r.m != null;
			if(b) this.r.s = s;
			return b;
		} else {
			var b1 = this.match(len < 0?HxOverrides.substr(s,pos,null):HxOverrides.substr(s,pos,len));
			if(b1) {
				this.r.s = s;
				this.r.m.index += pos;
			}
			return b1;
		}
	}
	,replace: function(s,by) {
		return s.replace(this.r,by);
	}
	,map: function(s,f) {
		var offset = 0;
		var buf = new StringBuf();
		do {
			if(offset >= s.length) break; else if(!this.matchSub(s,offset)) {
				buf.add(HxOverrides.substr(s,offset,null));
				break;
			}
			var p = this.matchedPos();
			buf.add(HxOverrides.substr(s,offset,p.pos - offset));
			buf.add(f(this));
			if(p.len == 0) {
				buf.add(HxOverrides.substr(s,p.pos,1));
				offset = p.pos + 1;
			} else offset = p.pos + p.len;
		} while(this.r.global);
		if(!this.r.global && offset > 0 && offset < s.length) buf.add(HxOverrides.substr(s,offset,null));
		return buf.b;
	}
	,__class__: EReg
};
var HxOverrides = function() { };
HxOverrides.__name__ = true;
HxOverrides.cca = function(s,index) {
	var x = s.charCodeAt(index);
	if(x != x) return undefined;
	return x;
};
HxOverrides.substr = function(s,pos,len) {
	if(pos != null && pos != 0 && len != null && len < 0) return "";
	if(len == null) len = s.length;
	if(pos < 0) {
		pos = s.length + pos;
		if(pos < 0) pos = 0;
	} else if(len < 0) len = s.length + len - pos;
	return s.substr(pos,len);
};
HxOverrides.indexOf = function(a,obj,i) {
	var len = a.length;
	if(i < 0) {
		i += len;
		if(i < 0) i = 0;
	}
	while(i < len) {
		if(a[i] === obj) return i;
		i++;
	}
	return -1;
};
HxOverrides.iter = function(a) {
	return { cur : 0, arr : a, hasNext : function() {
		return this.cur < this.arr.length;
	}, next : function() {
		return this.arr[this.cur++];
	}};
};
var Main = function() {
	this.queryArr = ["md","split","note","author","time"];
	this.isSpeakrrNotes = false;
	this.isFullScreen = false;
	this._prevId = 0;
	this._currentId = 0;
	this._win = window;
	this._doc = window.document;
	var _g = this;
	this._doc.addEventListener("DOMContentLoaded",function(event) {
		_g.init();
	});
	if(this._doc.getElementById("slidrr-speakrr-notes") != null) {
		this.isSpeakrrNotes = true;
		this.init();
	}
};
Main.__name__ = true;
Main.main = function() {
	var app = new Main();
};
Main.prototype = {
	init: function() {
		var map = new haxe_ds_StringMap();
		var arr = HxOverrides.substr(this._win.location.search,1,null).split("&");
		var _g1 = 0;
		var _g = arr.length;
		while(_g1 < _g) {
			var i = _g1++;
			var temp = arr[i].split("=");
			map.set(temp[0],temp[1]);
		}
		if(__map_reserved.md != null?map.existsReserved("md"):map.h.hasOwnProperty("md")) model_App.markdown = __map_reserved.md != null?map.getReserved("md"):map.h["md"];
		if(__map_reserved.split != null?map.existsReserved("split"):map.h.hasOwnProperty("split")) model_App.spliteSlide = __map_reserved.split != null?map.getReserved("split"):map.h["split"];
		if(__map_reserved.note != null?map.existsReserved("note"):map.h.hasOwnProperty("note")) model_App.splitNote = __map_reserved.note != null?map.getReserved("note"):map.h["note"];
		if(__map_reserved.author != null?map.existsReserved("author"):map.h.hasOwnProperty("author")) model_App.author = __map_reserved.author != null?map.getReserved("author"):map.h["author"];
		if(__map_reserved.time != null?map.existsReserved("time"):map.h.hasOwnProperty("time")) model_App.time = Std.parseInt(__map_reserved.time != null?map.getReserved("time"):map.h["time"]);
		if(__map_reserved.css != null?map.existsReserved("css"):map.h.hasOwnProperty("css")) model_App.css = __map_reserved.css != null?map.getReserved("css"):map.h["css"];
		if(model_App.css != "") this.addCSS(model_App.css);
		this.readTextFile(model_App.markdown);
	}
	,buildNotes: function(md) {
		var speakrrNotes = new view_SpeakrrNotesView(md);
	}
	,buildPresentation: function(md) {
		var _g = this;
		var flexContainer = this._doc.createElement("div");
		flexContainer.className = "slidrr-container";
		this._doc.body.appendChild(flexContainer);
		var slides = md.split("\n" + model_App.spliteSlide + "\n");
		this._total = slides.length;
		var _g1 = 0;
		var _g2 = this._total;
		while(_g1 < _g2) {
			var i = _g1++;
			new view_SlidrrView(md,flexContainer,i);
		}
		this.buildNav();
		var _nav = this._doc.getElementsByClassName("nav")[0];
		this._win.onkeydown = function(e) {
			_g.onKeyHandler(e);
		};
		this.buildProgress();
		this.buildControle();
		this.buildHelp();
		this.buildLogo();
		this.buildFocus();
		this.onResizeHandler();
		this.readURL();
		hljs.initHighlightingOnLoad();
	}
	,buildProgress: function() {
		var _container = this._doc.createElement("div");
		_container.className = "progress";
		var _progressbar = this._doc.createElement("div");
		_progressbar.className = "progress-bar";
		_container.appendChild(_progressbar);
		this._doc.body.appendChild(_container);
	}
	,buildControle: function() {
		var _g = this;
		var _container = this._doc.createElement("div");
		_container.className = "controls";
		var _arrowL = this._doc.createElement("div");
		_arrowL.className = "arrow left prev";
		_arrowL.innerHTML = "";
		var _arrowR = this._doc.createElement("div");
		_arrowR.className = "arrow right next";
		_arrowR.innerHTML = "";
		_container.appendChild(_arrowL);
		_container.appendChild(_arrowR);
		this._doc.body.appendChild(_container);
		_arrowL.onclick = _arrowR.onclick = function(e) {
			_g.onClickHandler(e);
		};
	}
	,buildHelp: function() {
		var _container = this._doc.createElement("div");
		_container.className = "help";
		_container.innerHTML = Markdown.markdownToHtml(this.showDefaults());
		this._doc.body.appendChild(_container);
	}
	,buildNav: function() {
		var _container = this._doc.createElement("div");
		_container.className = "nav";
		_container.innerHTML = "<div class='mini-slide'>test</div>";
		this._doc.body.appendChild(_container);
	}
	,buildFocus: function() {
		var _container = this._doc.createElement("div");
		_container.className = "focus";
		this._doc.body.appendChild(_container);
	}
	,buildLogo: function() {
		var _container = this._doc.createElement("div");
		_container.className = "logo";
		this._doc.body.appendChild(_container);
	}
	,addCSS: function(css) {
		var head = this._doc.getElementsByTagName("head")[0];
		var s = this._doc.createElement("link");
		s.setAttribute("rel","stylesheet");
		s.setAttribute("href","" + css);
		head.appendChild(s);
	}
	,showDefaults: function() {
		var str = "\n\t\t\n| action | shortcut |\n| --- | --- |\n| forward | `cursor right` , `.` , `space` |\n| reverse | `cursor left` , `,` | \n| fullscreen | `f` | \n| help | `h` | \n| create black screen | `b` | \n| reverse fullscreen | `esc` | \n| speaker notes | `s` | \n";
		str += "\n- markdown: " + model_App.markdown;
		str += "\n- slide split: " + model_App.spliteSlide;
		str += "\n- note split: " + model_App.splitNote;
		str += "\n---\n";
		var _g1 = 0;
		var _g = this.queryArr.length;
		while(_g1 < _g) {
			var i = _g1++;
			str += "\n- queryArr " + this.queryArr[i];
		}
		str += "\n";
		return str;
	}
	,writeURL: function(id) {
		var url;
		url = "/" + (id == null?"null":"" + id);
		this._win.location.hash = url;
	}
	,readURL: function() {
		var hash = this._win.location.hash;
		var id = Std.parseInt(hash.split("/")[1]);
		if(id == null) id = 0;
		this.slideId(id,true);
	}
	,move: function(dir) {
		this.slideId(this._prevId,false);
		if(dir == -1) this._currentId--; else this._currentId++;
		if(this._currentId >= this._total - 1) this._currentId = this._total - 1;
		if(this._currentId <= 0) this._currentId = 0;
		this.slideId(this._currentId,true);
	}
	,slideId: function(id,isVisible) {
		var slide = this._doc.getElementById("slidrr-" + id);
		var css = StringTools.replace(StringTools.rtrim(StringTools.replace(slide.className,"hidden","")),"  "," ");
		if(isVisible) slide.className = css; else slide.className = css + " hidden";
		this._currentId = id;
		this._prevId = id;
		this.writeURL(id);
		this.updateProgress();
	}
	,updateProgress: function() {
		var percentage = this._currentId / (this._total - 1) * 100;
		var progress = this._doc.getElementsByClassName("progress-bar")[0];
		progress.style.width = (percentage == null?"null":"" + percentage) + "%";
	}
	,toggleFullscreen: function() {
		if(!this.isFullScreen) {
			this.isFullScreen = true;
			var elem = this._doc.documentElement;
			if($bind(elem,elem.requestFullscreen)) elem.requestFullscreen(); else if(elem.msRequestFullscreen) elem.msRequestFullscreen(); else if(elem.mozRequestFullScreen) elem.mozRequestFullScreen(); else if(elem.webkitRequestFullscreen) elem.webkitRequestFullscreen();
		} else {
			this.isFullScreen = false;
			if(($_=this._doc,$bind($_,$_.exitFullscreen))) this._doc.exitFullscreen(); else if(this._doc.msExitFullscreen) this._doc.msExitFullscreen(); else if(this._doc.mozCancelFullScreen) this._doc.mozCancelFullScreen(); else if(this._doc.webkitExitFullscreen) this._doc.webkitExitFullscreen();
		}
	}
	,toggleHelp: function() {
		haxe_Log.trace("toggleHelp",{ fileName : "Main.hx", lineNumber : 335, className : "Main", methodName : "toggleHelp"});
		var help = this._doc.getElementsByClassName("help")[0];
		if(help.style.visibility == "visible") {
			help.style.visibility = "hidden";
			help.style.opacity = "0";
		} else {
			help.style.visibility = "visible";
			help.style.opacity = "1";
		}
	}
	,toggleNav: function() {
		var help = this._doc.getElementsByClassName("nav")[0];
		if(help.style.visibility == "visible") {
			help.style.visibility = "hidden";
			help.style.opacity = "0";
		} else {
			help.style.visibility = "visible";
			help.style.opacity = "1";
		}
	}
	,toggleFocus: function() {
		var focus = this._doc.getElementsByClassName("focus")[0];
		if(focus.style.visibility == "visible") {
			focus.style.visibility = "hidden";
			focus.style.opacity = "0";
		} else {
			focus.style.visibility = "visible";
			focus.style.opacity = "1";
		}
	}
	,showSpeakerNotes: function() {
		haxe_Log.trace("showSpeakerNotes",{ fileName : "Main.hx", lineNumber : 376, className : "Main", methodName : "showSpeakerNotes"});
		var html = "\n<!DOCTYPE html>\n<html lang=\"en\" id=\"slidrr-speakrr-notes\">\n  <head>\n    <meta charset=\"utf-8\">\n    <meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge\">\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">\n    <!-- The above 3 meta tags *must* come first in the head; any other head content must come *after* these tags -->\n\t\n    <meta name=\"description\" content=\"\">\n    <meta name=\"author\" content=\"\">\n    <link rel=\"icon\" href=\"favicon.ico\">\n\t\n\t<meta name=\"google\" value=\"notranslate\">\n\t\n\t<title>Slidrr :: speakrr-notes</title>\n\t\n\t<!-- Latest compiled and minified CSS -->\n\t<!--<link rel=\"stylesheet\" href=\"https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css\" integrity=\"sha384-1q8mTJOASx8j1Au+a5WDVnPi2lkFfwwEAa8hDDdjZlpLegxhjVME1fgjWPGmkzs7\" crossorigin=\"anonymous\">-->\n\t\n\t<!-- custom css -->\n\t<link rel=\"stylesheet\" href=\"css/slidrr.css\" >\n\t<link rel=\"stylesheet\" href=\"css/monokai-sublime-min.css\" >\n\n<script>\n//respond to events\nwindow.addEventListener('message',function(event) {\n\tconsole.log('message received:  ' + event.data,event);\n\tevent.source.postMessage('holla back youngin!',event.origin);\n},false);\n</script>\n\n</head>\n<body>\n\t\n\t<div id=\"current-slide\"></div>\n\t<div id=\"upcoming-slide\"></div>\n\t<div id=\"speaker-controls\">\n\t\t<div class=\"speaker-controls-time\">\n\t\t\t<h4 class=\"label\">Time <span class=\"reset-button\">Click to Reset</span></h4>\n\t\t\t<div class=\"clock\"></div>\n\t\t\t<div class=\"timer\"></div>\n\t\t\t<div class=\"countdown\"></div>\n\t\t</div>\n\t\t<div class=\"speaker-controls-notes\">\n\t\t\t<h4 class=\"label\">Notes</h4>\n\t\t\t<div class=\"value\"></div>\n\t\t</div>\n\t</div>\n\t\t\n\t\t\n\t<!-- Code generated using Haxe -->\n\t<script type=\"text/javascript\" src=\"js/highlight.pack.js\"></script>\n\t<script type=\"text/javascript\" src=\"js/slidrr.js\"></script>\n</body>\n</html>\n";
		var notesPopup = this._win.open("","Notes::","width=1100,height=700");
		notesPopup.document.write(html);
		this._win.addEventListener("message",function(event) {
			haxe_Log.trace("received response: ",{ fileName : "Main.hx", lineNumber : 451, className : "Main", methodName : "showSpeakerNotes", customParams : [event.data]});
		},false);
	}
	,onKeyHandler: function(e) {
		var _g = e.keyCode;
		switch(_g) {
		case 37:
			this.move(-1);
			break;
		case 188:
			this.move(-1);
			break;
		case 39:
			this.move(1);
			break;
		case 32:
			this.move(1);
			break;
		case 190:
			this.move(1);
			break;
		case 70:
			this.toggleFullscreen();
			break;
		case 72:
			this.toggleHelp();
			break;
		case 66:
			this.toggleFocus();
			break;
		case 83:
			this.showSpeakerNotes();
			break;
		case 78:
			this.toggleNav();
			break;
		}
	}
	,onClickHandler: function(e) {
		var temp = e.currentTarget;
		if(temp.className.indexOf("left") != -1) {
			haxe_Log.trace("left",{ fileName : "Main.hx", lineNumber : 487, className : "Main", methodName : "onClickHandler"});
			this.move(-1);
		} else {
			haxe_Log.trace("right",{ fileName : "Main.hx", lineNumber : 490, className : "Main", methodName : "onClickHandler"});
			this.move(1);
		}
	}
	,onResizeHandler: function() {
		this._width = this._win.innerWidth;
		this._height = this._win.innerHeight;
	}
	,readTextFile: function(file) {
		var _g = this;
		var rawFile = new XMLHttpRequest();
		rawFile.open("GET",file,false);
		rawFile.onreadystatechange = function() {
			if(rawFile.readyState == 4) {
				if(rawFile.status == 200 || rawFile.status == 0) {
					var md = rawFile.responseText;
					if(!_g.isSpeakrrNotes) _g.buildPresentation(md); else _g.buildNotes(md);
				}
			}
		};
		rawFile.send();
	}
	,__class__: Main
};
var Markdown = function() { };
Markdown.__name__ = true;
Markdown.markdownToHtml = function(markdown) {
	var document = new Document();
	try {
		var lines = new EReg("(\r\n|\r)","g").replace(markdown,"\n").split("\n");
		document.parseRefLinks(lines);
		var blocks = document.parseLines(lines);
		return Markdown.renderHtml(blocks);
	} catch( e ) {
		if (e instanceof js__$Boot_HaxeError) e = e.val;
		return "<pre>" + Std.string(e) + "</pre>";
	}
};
Markdown.renderHtml = function(blocks) {
	return new markdown_HtmlRenderer().render(blocks);
};
var Document = function() {
	this.refLinks = new haxe_ds_StringMap();
	this.inlineSyntaxes = [];
};
Document.__name__ = true;
Document.prototype = {
	parseRefLinks: function(lines) {
		var indent = "^[ ]{0,3}";
		var id = "\\[([^\\]]+)\\]";
		var quote = "\"[^\"]+\"";
		var apos = "'[^']+'";
		var paren = "\\([^)]+\\)";
		var titles = new EReg("(" + quote + "|" + apos + "|" + paren + ")","");
		var link = new EReg("" + indent + id + ":\\s+(\\S+)\\s*(" + quote + "|" + apos + "|" + paren + "|)\\s*$","");
		var _g1 = 0;
		var _g = lines.length;
		while(_g1 < _g) {
			var i = _g1++;
			if(!link.match(lines[i])) continue;
			var id1 = link.matched(1);
			var url = link.matched(2);
			var title = link.matched(3);
			if(StringTools.startsWith(url,"<") && StringTools.endsWith(url,">")) url = HxOverrides.substr(url,1,url.length - 2);
			if(title == "" && lines[i + 1] != null && titles.match(lines[i + 1])) {
				title = titles.matched(1);
				lines[i + 1] = "";
			}
			if(title == "") title = null; else title = title.substring(1,title.length - 1);
			id1 = id1.toLowerCase();
			var value = new Link(id1,url,title);
			this.refLinks.set(id1,value);
			lines[i] = "";
		}
	}
	,parseLines: function(lines) {
		var parser = new markdown_BlockParser(lines,this);
		var blocks = [];
		while(!(parser.pos >= parser.lines.length)) {
			var _g = 0;
			var _g1 = markdown_BlockSyntax.get_syntaxes();
			while(_g < _g1.length) {
				var syntax = _g1[_g];
				++_g;
				if(syntax.canParse(parser)) {
					var block = syntax.parse(parser);
					if(block != null) blocks.push(block);
					break;
				}
			}
		}
		return blocks;
	}
	,parseInline: function(text) {
		return new markdown_InlineParser(text,this).parse();
	}
	,__class__: Document
};
var Link = function(id,url,title) {
	this.id = id;
	this.url = url;
	this.title = title;
};
Link.__name__ = true;
Link.prototype = {
	__class__: Link
};
Math.__name__ = true;
var Reflect = function() { };
Reflect.__name__ = true;
Reflect.compare = function(a,b) {
	if(a == b) return 0; else if(a > b) return 1; else return -1;
};
var Std = function() { };
Std.__name__ = true;
Std.string = function(s) {
	return js_Boot.__string_rec(s,"");
};
Std["int"] = function(x) {
	return x | 0;
};
Std.parseInt = function(x) {
	var v = parseInt(x,10);
	if(v == 0 && (HxOverrides.cca(x,1) == 120 || HxOverrides.cca(x,1) == 88)) v = parseInt(x);
	if(isNaN(v)) return null;
	return v;
};
var StringBuf = function() {
	this.b = "";
};
StringBuf.__name__ = true;
StringBuf.prototype = {
	add: function(x) {
		this.b += Std.string(x);
	}
	,__class__: StringBuf
};
var StringTools = function() { };
StringTools.__name__ = true;
StringTools.htmlEscape = function(s,quotes) {
	s = s.split("&").join("&amp;").split("<").join("&lt;").split(">").join("&gt;");
	if(quotes) return s.split("\"").join("&quot;").split("'").join("&#039;"); else return s;
};
StringTools.startsWith = function(s,start) {
	return s.length >= start.length && HxOverrides.substr(s,0,start.length) == start;
};
StringTools.endsWith = function(s,end) {
	var elen = end.length;
	var slen = s.length;
	return slen >= elen && HxOverrides.substr(s,slen - elen,elen) == end;
};
StringTools.isSpace = function(s,pos) {
	var c = HxOverrides.cca(s,pos);
	return c > 8 && c < 14 || c == 32;
};
StringTools.ltrim = function(s) {
	var l = s.length;
	var r = 0;
	while(r < l && StringTools.isSpace(s,r)) r++;
	if(r > 0) return HxOverrides.substr(s,r,l - r); else return s;
};
StringTools.rtrim = function(s) {
	var l = s.length;
	var r = 0;
	while(r < l && StringTools.isSpace(s,l - r - 1)) r++;
	if(r > 0) return HxOverrides.substr(s,0,l - r); else return s;
};
StringTools.trim = function(s) {
	return StringTools.ltrim(StringTools.rtrim(s));
};
StringTools.lpad = function(s,c,l) {
	if(c.length <= 0) return s;
	while(s.length < l) s = c + s;
	return s;
};
StringTools.replace = function(s,sub,by) {
	return s.split(sub).join(by);
};
var haxe_IMap = function() { };
haxe_IMap.__name__ = true;
var haxe_Log = function() { };
haxe_Log.__name__ = true;
haxe_Log.trace = function(v,infos) {
	js_Boot.__trace(v,infos);
};
var haxe_Timer = function(time_ms) {
	var me = this;
	this.id = setInterval(function() {
		me.run();
	},time_ms);
};
haxe_Timer.__name__ = true;
haxe_Timer.prototype = {
	run: function() {
	}
	,__class__: haxe_Timer
};
var haxe_ds_StringMap = function() {
	this.h = { };
};
haxe_ds_StringMap.__name__ = true;
haxe_ds_StringMap.__interfaces__ = [haxe_IMap];
haxe_ds_StringMap.prototype = {
	set: function(key,value) {
		if(__map_reserved[key] != null) this.setReserved(key,value); else this.h[key] = value;
	}
	,get: function(key) {
		if(__map_reserved[key] != null) return this.getReserved(key);
		return this.h[key];
	}
	,setReserved: function(key,value) {
		if(this.rh == null) this.rh = { };
		this.rh["$" + key] = value;
	}
	,getReserved: function(key) {
		if(this.rh == null) return null; else return this.rh["$" + key];
	}
	,existsReserved: function(key) {
		if(this.rh == null) return false;
		return this.rh.hasOwnProperty("$" + key);
	}
	,keys: function() {
		var _this = this.arrayKeys();
		return HxOverrides.iter(_this);
	}
	,arrayKeys: function() {
		var out = [];
		for( var key in this.h ) {
		if(this.h.hasOwnProperty(key)) out.push(key);
		}
		if(this.rh != null) {
			for( var key in this.rh ) {
			if(key.charCodeAt(0) == 36) out.push(key.substr(1));
			}
		}
		return out;
	}
	,__class__: haxe_ds_StringMap
};
var js__$Boot_HaxeError = function(val) {
	Error.call(this);
	this.val = val;
	this.message = String(val);
	if(Error.captureStackTrace) Error.captureStackTrace(this,js__$Boot_HaxeError);
};
js__$Boot_HaxeError.__name__ = true;
js__$Boot_HaxeError.__super__ = Error;
js__$Boot_HaxeError.prototype = $extend(Error.prototype,{
	__class__: js__$Boot_HaxeError
});
var js_Boot = function() { };
js_Boot.__name__ = true;
js_Boot.__unhtml = function(s) {
	return s.split("&").join("&amp;").split("<").join("&lt;").split(">").join("&gt;");
};
js_Boot.__trace = function(v,i) {
	var msg;
	if(i != null) msg = i.fileName + ":" + i.lineNumber + ": "; else msg = "";
	msg += js_Boot.__string_rec(v,"");
	if(i != null && i.customParams != null) {
		var _g = 0;
		var _g1 = i.customParams;
		while(_g < _g1.length) {
			var v1 = _g1[_g];
			++_g;
			msg += "," + js_Boot.__string_rec(v1,"");
		}
	}
	var d;
	if(typeof(document) != "undefined" && (d = document.getElementById("haxe:trace")) != null) d.innerHTML += js_Boot.__unhtml(msg) + "<br/>"; else if(typeof console != "undefined" && console.log != null) console.log(msg);
};
js_Boot.getClass = function(o) {
	if((o instanceof Array) && o.__enum__ == null) return Array; else {
		var cl = o.__class__;
		if(cl != null) return cl;
		var name = js_Boot.__nativeClassName(o);
		if(name != null) return js_Boot.__resolveNativeClass(name);
		return null;
	}
};
js_Boot.__string_rec = function(o,s) {
	if(o == null) return "null";
	if(s.length >= 5) return "<...>";
	var t = typeof(o);
	if(t == "function" && (o.__name__ || o.__ename__)) t = "object";
	switch(t) {
	case "object":
		if(o instanceof Array) {
			if(o.__enum__) {
				if(o.length == 2) return o[0];
				var str2 = o[0] + "(";
				s += "\t";
				var _g1 = 2;
				var _g = o.length;
				while(_g1 < _g) {
					var i1 = _g1++;
					if(i1 != 2) str2 += "," + js_Boot.__string_rec(o[i1],s); else str2 += js_Boot.__string_rec(o[i1],s);
				}
				return str2 + ")";
			}
			var l = o.length;
			var i;
			var str1 = "[";
			s += "\t";
			var _g2 = 0;
			while(_g2 < l) {
				var i2 = _g2++;
				str1 += (i2 > 0?",":"") + js_Boot.__string_rec(o[i2],s);
			}
			str1 += "]";
			return str1;
		}
		var tostr;
		try {
			tostr = o.toString;
		} catch( e ) {
			if (e instanceof js__$Boot_HaxeError) e = e.val;
			return "???";
		}
		if(tostr != null && tostr != Object.toString && typeof(tostr) == "function") {
			var s2 = o.toString();
			if(s2 != "[object Object]") return s2;
		}
		var k = null;
		var str = "{\n";
		s += "\t";
		var hasp = o.hasOwnProperty != null;
		for( var k in o ) {
		if(hasp && !o.hasOwnProperty(k)) {
			continue;
		}
		if(k == "prototype" || k == "__class__" || k == "__super__" || k == "__interfaces__" || k == "__properties__") {
			continue;
		}
		if(str.length != 2) str += ", \n";
		str += s + k + " : " + js_Boot.__string_rec(o[k],s);
		}
		s = s.substring(1);
		str += "\n" + s + "}";
		return str;
	case "function":
		return "<function>";
	case "string":
		return o;
	default:
		return String(o);
	}
};
js_Boot.__interfLoop = function(cc,cl) {
	if(cc == null) return false;
	if(cc == cl) return true;
	var intf = cc.__interfaces__;
	if(intf != null) {
		var _g1 = 0;
		var _g = intf.length;
		while(_g1 < _g) {
			var i = _g1++;
			var i1 = intf[i];
			if(i1 == cl || js_Boot.__interfLoop(i1,cl)) return true;
		}
	}
	return js_Boot.__interfLoop(cc.__super__,cl);
};
js_Boot.__instanceof = function(o,cl) {
	if(cl == null) return false;
	switch(cl) {
	case Int:
		return (o|0) === o;
	case Float:
		return typeof(o) == "number";
	case Bool:
		return typeof(o) == "boolean";
	case String:
		return typeof(o) == "string";
	case Array:
		return (o instanceof Array) && o.__enum__ == null;
	case Dynamic:
		return true;
	default:
		if(o != null) {
			if(typeof(cl) == "function") {
				if(o instanceof cl) return true;
				if(js_Boot.__interfLoop(js_Boot.getClass(o),cl)) return true;
			} else if(typeof(cl) == "object" && js_Boot.__isNativeObj(cl)) {
				if(o instanceof cl) return true;
			}
		} else return false;
		if(cl == Class && o.__name__ != null) return true;
		if(cl == Enum && o.__ename__ != null) return true;
		return o.__enum__ == cl;
	}
};
js_Boot.__nativeClassName = function(o) {
	var name = js_Boot.__toStr.call(o).slice(8,-1);
	if(name == "Object" || name == "Function" || name == "Math" || name == "JSON") return null;
	return name;
};
js_Boot.__isNativeObj = function(o) {
	return js_Boot.__nativeClassName(o) != null;
};
js_Boot.__resolveNativeClass = function(name) {
	return $global[name];
};
var markdown_Node = function() { };
markdown_Node.__name__ = true;
markdown_Node.prototype = {
	__class__: markdown_Node
};
var markdown_NodeVisitor = function() { };
markdown_NodeVisitor.__name__ = true;
markdown_NodeVisitor.prototype = {
	__class__: markdown_NodeVisitor
};
var markdown_ElementNode = function(tag,children) {
	this.tag = tag;
	this.children = children;
	this.attributes = new haxe_ds_StringMap();
};
markdown_ElementNode.__name__ = true;
markdown_ElementNode.__interfaces__ = [markdown_Node];
markdown_ElementNode.empty = function(tag) {
	return new markdown_ElementNode(tag,null);
};
markdown_ElementNode.text = function(tag,text) {
	return new markdown_ElementNode(tag,[new markdown_TextNode(text)]);
};
markdown_ElementNode.prototype = {
	accept: function(visitor) {
		if(visitor.visitElementBefore(this)) {
			var _g = 0;
			var _g1 = this.children;
			while(_g < _g1.length) {
				var child = _g1[_g];
				++_g;
				child.accept(visitor);
			}
			visitor.visitElementAfter(this);
		}
	}
	,__class__: markdown_ElementNode
};
var markdown_TextNode = function(text) {
	this.text = text;
};
markdown_TextNode.__name__ = true;
markdown_TextNode.__interfaces__ = [markdown_Node];
markdown_TextNode.prototype = {
	accept: function(visitor) {
		visitor.visitText(this);
	}
	,__class__: markdown_TextNode
};
var markdown_BlockParser = function(lines,document) {
	this.lines = lines;
	this.document = document;
	this.pos = 0;
};
markdown_BlockParser.__name__ = true;
markdown_BlockParser.prototype = {
	get_next: function() {
		if(this.pos >= this.lines.length - 1) return null;
		return this.lines[this.pos + 1];
	}
	,advance: function() {
		this.pos++;
	}
	,matches: function(ereg) {
		if(this.pos >= this.lines.length) return false;
		return ereg.match(this.lines[this.pos]);
	}
	,matchesNext: function(ereg) {
		if(this.get_next() == null) return false;
		return ereg.match(this.get_next());
	}
	,__class__: markdown_BlockParser
};
var markdown_BlockSyntax = function() {
};
markdown_BlockSyntax.__name__ = true;
markdown_BlockSyntax.get_syntaxes = function() {
	if(markdown_BlockSyntax.syntaxes == null) markdown_BlockSyntax.syntaxes = [new markdown_EmptyBlockSyntax(),new markdown_BlockHtmlSyntax(),new markdown_SetextHeaderSyntax(),new markdown_HeaderSyntax(),new markdown_CodeBlockSyntax(),new markdown_GitHubCodeBlockSyntax(),new markdown_BlockquoteSyntax(),new markdown_HorizontalRuleSyntax(),new markdown_UnorderedListSyntax(),new markdown_OrderedListSyntax(),new markdown_TableSyntax(),new markdown_ParagraphSyntax()];
	return markdown_BlockSyntax.syntaxes;
};
markdown_BlockSyntax.isAtBlockEnd = function(parser) {
	if(parser.pos >= parser.lines.length) return true;
	var _g = 0;
	var _g1 = markdown_BlockSyntax.get_syntaxes();
	while(_g < _g1.length) {
		var syntax = _g1[_g];
		++_g;
		if(syntax.canParse(parser) && syntax.get_canEndBlock()) return true;
	}
	return false;
};
markdown_BlockSyntax.prototype = {
	get_pattern: function() {
		return null;
	}
	,get_canEndBlock: function() {
		return true;
	}
	,canParse: function(parser) {
		return this.get_pattern().match(parser.lines[parser.pos]);
	}
	,parse: function(parser) {
		return null;
	}
	,__class__: markdown_BlockSyntax
};
var markdown_EmptyBlockSyntax = function() {
	markdown_BlockSyntax.call(this);
};
markdown_EmptyBlockSyntax.__name__ = true;
markdown_EmptyBlockSyntax.__super__ = markdown_BlockSyntax;
markdown_EmptyBlockSyntax.prototype = $extend(markdown_BlockSyntax.prototype,{
	get_pattern: function() {
		return markdown_BlockSyntax.RE_EMPTY;
	}
	,parse: function(parser) {
		parser.advance();
		return null;
	}
	,__class__: markdown_EmptyBlockSyntax
});
var markdown_SetextHeaderSyntax = function() {
	markdown_BlockSyntax.call(this);
};
markdown_SetextHeaderSyntax.__name__ = true;
markdown_SetextHeaderSyntax.__super__ = markdown_BlockSyntax;
markdown_SetextHeaderSyntax.prototype = $extend(markdown_BlockSyntax.prototype,{
	canParse: function(parser) {
		return parser.matchesNext(markdown_BlockSyntax.RE_SETEXT);
	}
	,parse: function(parser) {
		var re = markdown_BlockSyntax.RE_SETEXT;
		re.match(parser.get_next());
		var tag;
		if(re.matched(1).charAt(0) == "=") tag = "h1"; else tag = "h2";
		var contents = parser.document.parseInline(parser.lines[parser.pos]);
		parser.advance();
		parser.advance();
		return new markdown_ElementNode(tag,contents);
	}
	,__class__: markdown_SetextHeaderSyntax
});
var markdown_HeaderSyntax = function() {
	markdown_BlockSyntax.call(this);
};
markdown_HeaderSyntax.__name__ = true;
markdown_HeaderSyntax.__super__ = markdown_BlockSyntax;
markdown_HeaderSyntax.prototype = $extend(markdown_BlockSyntax.prototype,{
	get_pattern: function() {
		return markdown_BlockSyntax.RE_HEADER;
	}
	,parse: function(parser) {
		this.get_pattern().match(parser.lines[parser.pos]);
		parser.advance();
		var level = this.get_pattern().matched(1).length;
		var contents = parser.document.parseInline(StringTools.trim(this.get_pattern().matched(2)));
		return new markdown_ElementNode("h" + level,contents);
	}
	,__class__: markdown_HeaderSyntax
});
var markdown_BlockquoteSyntax = function() {
	markdown_BlockSyntax.call(this);
};
markdown_BlockquoteSyntax.__name__ = true;
markdown_BlockquoteSyntax.__super__ = markdown_BlockSyntax;
markdown_BlockquoteSyntax.prototype = $extend(markdown_BlockSyntax.prototype,{
	get_pattern: function() {
		return markdown_BlockSyntax.RE_BLOCKQUOTE;
	}
	,parseChildLines: function(parser) {
		var childLines = [];
		while(!(parser.pos >= parser.lines.length)) if(this.get_pattern().match(parser.lines[parser.pos])) {
			childLines.push(this.get_pattern().matched(1));
			parser.advance();
		} else {
			var nextMatch;
			if(parser.get_next() != null) nextMatch = this.get_pattern().match(parser.get_next()); else nextMatch = false;
			if(StringTools.trim(parser.lines[parser.pos]) == "" && nextMatch) {
				childLines.push("");
				childLines.push(this.get_pattern().matched(1));
				parser.advance();
				parser.advance();
			} else break;
		}
		return childLines;
	}
	,parse: function(parser) {
		var childLines = this.parseChildLines(parser);
		var children = parser.document.parseLines(childLines);
		return new markdown_ElementNode("blockquote",children);
	}
	,__class__: markdown_BlockquoteSyntax
});
var markdown_CodeBlockSyntax = function() {
	markdown_BlockSyntax.call(this);
};
markdown_CodeBlockSyntax.__name__ = true;
markdown_CodeBlockSyntax.__super__ = markdown_BlockSyntax;
markdown_CodeBlockSyntax.prototype = $extend(markdown_BlockSyntax.prototype,{
	get_pattern: function() {
		return markdown_BlockSyntax.RE_INDENT;
	}
	,parseChildLines: function(parser) {
		var childLines = [];
		while(!(parser.pos >= parser.lines.length)) if(this.get_pattern().match(parser.lines[parser.pos])) {
			childLines.push(this.get_pattern().matched(1));
			parser.advance();
		} else {
			var nextMatch;
			if(parser.get_next() != null) nextMatch = this.get_pattern().match(parser.get_next()); else nextMatch = false;
			if(StringTools.trim(parser.lines[parser.pos]) == "" && nextMatch) {
				childLines.push("");
				childLines.push(this.get_pattern().matched(1));
				parser.advance();
				parser.advance();
			} else break;
		}
		return childLines;
	}
	,parse: function(parser) {
		var childLines = this.parseChildLines(parser);
		childLines.push("");
		var escaped = StringTools.htmlEscape(childLines.join("\n"));
		return new markdown_ElementNode("pre",[markdown_ElementNode.text("code",escaped)]);
	}
	,__class__: markdown_CodeBlockSyntax
});
var markdown_GitHubCodeBlockSyntax = function() {
	markdown_BlockSyntax.call(this);
};
markdown_GitHubCodeBlockSyntax.__name__ = true;
markdown_GitHubCodeBlockSyntax.__super__ = markdown_BlockSyntax;
markdown_GitHubCodeBlockSyntax.prototype = $extend(markdown_BlockSyntax.prototype,{
	get_pattern: function() {
		return markdown_BlockSyntax.RE_CODE;
	}
	,parseChildLines: function(parser) {
		var childLines = [];
		parser.advance();
		while(!(parser.pos >= parser.lines.length)) if(!this.get_pattern().match(parser.lines[parser.pos])) {
			childLines.push(parser.lines[parser.pos]);
			parser.advance();
		} else {
			parser.advance();
			break;
		}
		return childLines;
	}
	,parse: function(parser) {
		var syntax = this.get_pattern().matched(1);
		var childLines = this.parseChildLines(parser);
		var code = markdown_ElementNode.text("code",StringTools.htmlEscape(childLines.join("\n")));
		if(syntax != null && syntax.length > 0) code.attributes.set("class","prettyprint " + syntax);
		return new markdown_ElementNode("pre",[code]);
	}
	,__class__: markdown_GitHubCodeBlockSyntax
});
var markdown_HorizontalRuleSyntax = function() {
	markdown_BlockSyntax.call(this);
};
markdown_HorizontalRuleSyntax.__name__ = true;
markdown_HorizontalRuleSyntax.__super__ = markdown_BlockSyntax;
markdown_HorizontalRuleSyntax.prototype = $extend(markdown_BlockSyntax.prototype,{
	get_pattern: function() {
		return markdown_BlockSyntax.RE_HR;
	}
	,parse: function(parser) {
		parser.advance();
		return markdown_ElementNode.empty("hr");
	}
	,__class__: markdown_HorizontalRuleSyntax
});
var markdown_BlockHtmlSyntax = function() {
	markdown_BlockSyntax.call(this);
};
markdown_BlockHtmlSyntax.__name__ = true;
markdown_BlockHtmlSyntax.__super__ = markdown_BlockSyntax;
markdown_BlockHtmlSyntax.prototype = $extend(markdown_BlockSyntax.prototype,{
	get_pattern: function() {
		return markdown_BlockSyntax.RE_HTML;
	}
	,get_canEndBlock: function() {
		return false;
	}
	,parse: function(parser) {
		var childLines = [];
		while(!(parser.pos >= parser.lines.length) && !parser.matches(markdown_BlockSyntax.RE_EMPTY)) {
			childLines.push(parser.lines[parser.pos]);
			parser.advance();
		}
		return new markdown_TextNode(childLines.join("\n"));
	}
	,__class__: markdown_BlockHtmlSyntax
});
var markdown_ListItem = function(lines) {
	this.forceBlock = false;
	this.lines = lines;
};
markdown_ListItem.__name__ = true;
markdown_ListItem.prototype = {
	__class__: markdown_ListItem
};
var markdown_ParagraphSyntax = function() {
	markdown_BlockSyntax.call(this);
};
markdown_ParagraphSyntax.__name__ = true;
markdown_ParagraphSyntax.__super__ = markdown_BlockSyntax;
markdown_ParagraphSyntax.prototype = $extend(markdown_BlockSyntax.prototype,{
	get_canEndBlock: function() {
		return false;
	}
	,canParse: function(parser) {
		return true;
	}
	,parse: function(parser) {
		var childLines = [];
		while(!markdown_BlockSyntax.isAtBlockEnd(parser)) {
			childLines.push(StringTools.ltrim(parser.lines[parser.pos]));
			parser.advance();
		}
		var contents = parser.document.parseInline(childLines.join("\n"));
		return new markdown_ElementNode("p",contents);
	}
	,__class__: markdown_ParagraphSyntax
});
var markdown_ListSyntax = function(listTag) {
	markdown_BlockSyntax.call(this);
	this.listTag = listTag;
};
markdown_ListSyntax.__name__ = true;
markdown_ListSyntax.__super__ = markdown_BlockSyntax;
markdown_ListSyntax.prototype = $extend(markdown_BlockSyntax.prototype,{
	get_canEndBlock: function() {
		return false;
	}
	,parse: function(parser) {
		var items = [];
		var childLines = [];
		var endItem = function() {
			if(childLines.length > 0) {
				items.push(new markdown_ListItem(childLines));
				childLines = [];
			}
		};
		var match;
		var tryMatch = function(pattern) {
			match = pattern;
			return pattern.match(parser.lines[parser.pos]);
		};
		while(!(parser.pos >= parser.lines.length)) {
			if(tryMatch(markdown_BlockSyntax.RE_EMPTY)) childLines.push(""); else if(tryMatch(markdown_BlockSyntax.RE_UL) || tryMatch(markdown_BlockSyntax.RE_OL)) {
				endItem();
				childLines.push(match.matched(1));
			} else if(tryMatch(markdown_BlockSyntax.RE_INDENT)) childLines.push(match.matched(1)); else if(markdown_BlockSyntax.isAtBlockEnd(parser)) break; else {
				if(childLines.length > 0 && childLines[childLines.length - 1] == "") break;
				childLines.push(parser.lines[parser.pos]);
			}
			parser.advance();
		}
		endItem();
		var _g1 = 0;
		var _g = items.length;
		while(_g1 < _g) {
			var i = _g1++;
			var len = items[i].lines.length;
			var _g3 = 1;
			var _g2 = len + 1;
			while(_g3 < _g2) {
				var jj = _g3++;
				var j = len - jj;
				if(markdown_BlockSyntax.RE_EMPTY.match(items[i].lines[j])) {
					if(i < items.length - 1) {
						items[i].forceBlock = true;
						items[i + 1].forceBlock = true;
					}
					items[i].lines.pop();
				} else break;
			}
		}
		var itemNodes = [];
		var _g4 = 0;
		while(_g4 < items.length) {
			var item = items[_g4];
			++_g4;
			var blockItem = item.forceBlock || item.lines.length > 1;
			var blocksInList = [markdown_BlockSyntax.RE_BLOCKQUOTE,markdown_BlockSyntax.RE_HEADER,markdown_BlockSyntax.RE_HR,markdown_BlockSyntax.RE_INDENT,markdown_BlockSyntax.RE_UL,markdown_BlockSyntax.RE_OL];
			if(!blockItem) {
				var _g11 = 0;
				while(_g11 < blocksInList.length) {
					var pattern1 = blocksInList[_g11];
					++_g11;
					if(pattern1.match(item.lines[0])) {
						blockItem = true;
						break;
					}
				}
			}
			if(blockItem) {
				var children = parser.document.parseLines(item.lines);
				if(!item.forceBlock && children.length == 1) {
					if(js_Boot.__instanceof(children[0],markdown_ElementNode)) {
						var node = children[0];
						if(node.tag == "p") children = node.children;
					}
				}
				itemNodes.push(new markdown_ElementNode("li",children));
			} else {
				var contents = parser.document.parseInline(item.lines[0]);
				itemNodes.push(new markdown_ElementNode("li",contents));
			}
		}
		return new markdown_ElementNode(this.listTag,itemNodes);
	}
	,__class__: markdown_ListSyntax
});
var markdown_UnorderedListSyntax = function() {
	markdown_ListSyntax.call(this,"ul");
};
markdown_UnorderedListSyntax.__name__ = true;
markdown_UnorderedListSyntax.__super__ = markdown_ListSyntax;
markdown_UnorderedListSyntax.prototype = $extend(markdown_ListSyntax.prototype,{
	get_pattern: function() {
		return markdown_BlockSyntax.RE_UL;
	}
	,__class__: markdown_UnorderedListSyntax
});
var markdown_OrderedListSyntax = function() {
	markdown_ListSyntax.call(this,"ol");
};
markdown_OrderedListSyntax.__name__ = true;
markdown_OrderedListSyntax.__super__ = markdown_ListSyntax;
markdown_OrderedListSyntax.prototype = $extend(markdown_ListSyntax.prototype,{
	get_pattern: function() {
		return markdown_BlockSyntax.RE_OL;
	}
	,__class__: markdown_OrderedListSyntax
});
var markdown_TableSyntax = function() {
	markdown_BlockSyntax.call(this);
};
markdown_TableSyntax.__name__ = true;
markdown_TableSyntax.__super__ = markdown_BlockSyntax;
markdown_TableSyntax.prototype = $extend(markdown_BlockSyntax.prototype,{
	get_pattern: function() {
		return markdown_TableSyntax.TABLE_PATTERN;
	}
	,get_canEndBlock: function() {
		return false;
	}
	,parse: function(parser) {
		var lines = [];
		while(!(parser.pos >= parser.lines.length) && parser.matches(markdown_TableSyntax.TABLE_PATTERN)) {
			lines.push(parser.lines[parser.pos]);
			parser.advance();
		}
		var heads = [];
		var rows = [];
		var align = [];
		var headLine = lines.shift();
		var alignLine = lines.shift();
		var aligns = [];
		if(alignLine != null) markdown_TableSyntax.CELL_PATTERN.map(alignLine,function(e) {
			var text = e.matched(2);
			var align1;
			if(text.charAt(0) == ":") {
				if(text.charAt(text.length - 1) == ":") align1 = "center"; else align1 = "left";
			} else if(text.charAt(text.length - 1) == ":") align1 = "right"; else align1 = "left";
			aligns.push(align1);
			return "";
		});
		var index = 0;
		markdown_TableSyntax.CELL_PATTERN.map(headLine,function(e1) {
			var text1 = StringTools.trim(e1.matched(2));
			var cell = new markdown_ElementNode("th",parser.document.parseInline(text1));
			if(aligns[index] != "left") cell.attributes.set("align",aligns[index]);
			heads.push(cell);
			index += 1;
			return "";
		});
		var _g = 0;
		while(_g < lines.length) {
			var line = lines[_g];
			++_g;
			var cols = [[]];
			rows.push(new markdown_ElementNode("tr",cols[0]));
			var index1 = [0];
			markdown_TableSyntax.CELL_PATTERN.map(line,(function(index1,cols) {
				return function(e2) {
					var text2 = StringTools.trim(e2.matched(2));
					var cell1 = new markdown_ElementNode("td",parser.document.parseInline(text2));
					if(aligns[index1[0]] != "left") cell1.attributes.set("align",aligns[index1[0]]);
					cols[0].push(cell1);
					index1[0] += 1;
					return "";
				};
			})(index1,cols));
		}
		return new markdown_ElementNode("table",[new markdown_ElementNode("thead",heads),new markdown_ElementNode("tbody",rows)]);
	}
	,__class__: markdown_TableSyntax
});
var markdown_HtmlRenderer = function() {
};
markdown_HtmlRenderer.__name__ = true;
markdown_HtmlRenderer.__interfaces__ = [markdown_NodeVisitor];
markdown_HtmlRenderer.sortAttributes = function(a,b) {
	var ia = HxOverrides.indexOf(markdown_HtmlRenderer.attributeOrder,a,0);
	var ib = HxOverrides.indexOf(markdown_HtmlRenderer.attributeOrder,a,0);
	if(ia > -1 && ib > -1) return ia - ib;
	return Reflect.compare(a,b);
};
markdown_HtmlRenderer.prototype = {
	render: function(nodes) {
		this.buffer = new StringBuf();
		var _g = 0;
		while(_g < nodes.length) {
			var node = nodes[_g];
			++_g;
			node.accept(this);
		}
		return this.buffer.b;
	}
	,visitText: function(text) {
		if(text.text == null) this.buffer.b += "null"; else this.buffer.b += "" + text.text;
	}
	,visitElementBefore: function(element) {
		if(this.buffer.b != "" && markdown_HtmlRenderer.BLOCK_TAGS.match(element.tag)) this.buffer.b += "\n";
		this.buffer.b += Std.string("<" + element.tag);
		var attributeNames;
		var _g = [];
		var $it0 = element.attributes.keys();
		while( $it0.hasNext() ) {
			var k = $it0.next();
			_g.push(k);
		}
		attributeNames = _g;
		attributeNames.sort(markdown_HtmlRenderer.sortAttributes);
		var _g1 = 0;
		while(_g1 < attributeNames.length) {
			var name = attributeNames[_g1];
			++_g1;
			this.buffer.add(" " + name + "=\"" + element.attributes.get(name) + "\"");
		}
		if(element.children == null) {
			this.buffer.b += " />";
			return false;
		} else {
			this.buffer.b += ">";
			return true;
		}
	}
	,visitElementAfter: function(element) {
		this.buffer.b += Std.string("</" + element.tag + ">");
	}
	,__class__: markdown_HtmlRenderer
};
var markdown_InlineSyntax = function(pattern) {
	this.pattern = new EReg(pattern,"m");
};
markdown_InlineSyntax.__name__ = true;
markdown_InlineSyntax.prototype = {
	tryMatch: function(parser) {
		if(this.pattern.match(parser.get_currentSource()) && this.pattern.matchedPos().pos == 0) {
			parser.writeText();
			if(this.onMatch(parser)) parser.consume(this.pattern.matched(0).length);
			return true;
		}
		return false;
	}
	,onMatch: function(parser) {
		return false;
	}
	,__class__: markdown_InlineSyntax
};
var markdown_AutolinkSyntaxWithoutBrackets = function() {
	markdown_InlineSyntax.call(this,"\\b((http|https|ftp)://[^\\s]*)\\b");
};
markdown_AutolinkSyntaxWithoutBrackets.__name__ = true;
markdown_AutolinkSyntaxWithoutBrackets.__super__ = markdown_InlineSyntax;
markdown_AutolinkSyntaxWithoutBrackets.prototype = $extend(markdown_InlineSyntax.prototype,{
	tryMatch: function(parser) {
		return markdown_InlineSyntax.prototype.tryMatch.call(this,parser);
	}
	,onMatch: function(parser) {
		var url = this.pattern.matched(1);
		var anchor = markdown_ElementNode.text("a",StringTools.htmlEscape(url));
		anchor.attributes.set("href",url);
		parser.addNode(anchor);
		return true;
	}
	,__class__: markdown_AutolinkSyntaxWithoutBrackets
});
var markdown_TextSyntax = function(pattern,substitute) {
	markdown_InlineSyntax.call(this,pattern);
	this.substitute = substitute;
};
markdown_TextSyntax.__name__ = true;
markdown_TextSyntax.__super__ = markdown_InlineSyntax;
markdown_TextSyntax.prototype = $extend(markdown_InlineSyntax.prototype,{
	onMatch: function(parser) {
		if(this.substitute == null) {
			parser.advanceBy(this.pattern.matched(0).length);
			return false;
		}
		parser.addNode(parser.createText(this.substitute));
		return true;
	}
	,__class__: markdown_TextSyntax
});
var markdown_AutolinkSyntax = function() {
	markdown_InlineSyntax.call(this,"<((http|https|ftp)://[^>]*)>");
};
markdown_AutolinkSyntax.__name__ = true;
markdown_AutolinkSyntax.__super__ = markdown_InlineSyntax;
markdown_AutolinkSyntax.prototype = $extend(markdown_InlineSyntax.prototype,{
	onMatch: function(parser) {
		var url = this.pattern.matched(1);
		var anchor = markdown_ElementNode.text("a",StringTools.htmlEscape(url));
		anchor.attributes.set("href",url);
		parser.addNode(anchor);
		return true;
	}
	,__class__: markdown_AutolinkSyntax
});
var markdown_TagSyntax = function(pattern,tag,end) {
	markdown_InlineSyntax.call(this,pattern);
	this.tag = tag;
	this.endPattern = new EReg(end == null?pattern:end,"m");
};
markdown_TagSyntax.__name__ = true;
markdown_TagSyntax.__super__ = markdown_InlineSyntax;
markdown_TagSyntax.prototype = $extend(markdown_InlineSyntax.prototype,{
	onMatch: function(parser) {
		parser.stack.push(new markdown_TagState(parser.pos,parser.pos + this.pattern.matched(0).length,this));
		return true;
	}
	,onMatchEnd: function(parser,state) {
		parser.addNode(new markdown_ElementNode(this.tag,state.children));
		return true;
	}
	,__class__: markdown_TagSyntax
});
var markdown_LinkSyntax = function(linkResolver) {
	markdown_TagSyntax.call(this,"\\[",null,markdown_LinkSyntax.linkPattern);
	this.linkResolver = linkResolver;
};
markdown_LinkSyntax.__name__ = true;
markdown_LinkSyntax.__super__ = markdown_TagSyntax;
markdown_LinkSyntax.prototype = $extend(markdown_TagSyntax.prototype,{
	onMatchEnd: function(parser,state) {
		var url;
		var title;
		if(this.endPattern.matched(1) == null || this.endPattern.matched(1) == "") {
			if(this.linkResolver == null) return false;
			if(state.children.length != 1) return false;
			if(!js_Boot.__instanceof(state.children[0],markdown_TextNode)) return false;
			var link = state.children[0];
			var node = this.linkResolver(link.text);
			if(node == null) return false;
			parser.addNode(node);
			return true;
		}
		if(this.endPattern.matched(3) != null && this.endPattern.matched(3) != "") {
			url = this.endPattern.matched(3);
			title = this.endPattern.matched(4);
			if(StringTools.startsWith(url,"<") && StringTools.endsWith(url,">")) url = url.substring(1,url.length - 1);
		} else {
			var id = this.endPattern.matched(2);
			if(id == "") id = parser.source.substring(state.startPos + 1,parser.pos);
			id = id.toLowerCase();
			var link1 = parser.document.refLinks.get(id);
			if(link1 == null) return false;
			url = link1.url;
			title = link1.title;
		}
		var anchor = new markdown_ElementNode("a",state.children);
		var value = StringTools.htmlEscape(url);
		anchor.attributes.set("href",value);
		if(title != null && title != "") {
			var value1 = StringTools.htmlEscape(title);
			anchor.attributes.set("title",value1);
		}
		parser.addNode(anchor);
		return true;
	}
	,__class__: markdown_LinkSyntax
});
var markdown_ImgSyntax = function(linkResolver) {
	markdown_TagSyntax.call(this,"!\\[",null,markdown_ImgSyntax.linkPattern);
	this.linkResolver = linkResolver;
};
markdown_ImgSyntax.__name__ = true;
markdown_ImgSyntax.__super__ = markdown_TagSyntax;
markdown_ImgSyntax.prototype = $extend(markdown_TagSyntax.prototype,{
	onMatchEnd: function(parser,state) {
		var url;
		var title;
		if(this.endPattern.matched(1) == null || this.endPattern.matched(1) == "") {
			if(this.linkResolver == null) return false;
			if(state.children.length != 1) return false;
			if(!js_Boot.__instanceof(state.children[0],markdown_TextNode)) return false;
			var link = state.children[0];
			var node = this.linkResolver(link.text);
			if(node == null) return false;
			parser.addNode(node);
			return true;
		}
		if(this.endPattern.matched(3) != null && this.endPattern.matched(3) != "") {
			url = this.endPattern.matched(3);
			title = this.endPattern.matched(4);
			if(StringTools.startsWith(url,"<") && StringTools.endsWith(url,">")) url = url.substring(1,url.length - 1);
		} else {
			var id = this.endPattern.matched(2);
			if(id == "") id = parser.source.substring(state.startPos + 1,parser.pos);
			id = id.toLowerCase();
			var link1 = parser.document.refLinks.get(id);
			if(link1 == null) return false;
			url = link1.url;
			title = link1.title;
		}
		var img = new markdown_ElementNode("img",null);
		var value = StringTools.htmlEscape(url);
		img.attributes.set("src",value);
		if(state.children.length == 1 && js_Boot.__instanceof(state.children[0],markdown_TextNode)) {
			var alt = state.children[0];
			img.attributes.set("alt",alt.text);
		}
		if(title != null && title != "") {
			var value1 = StringTools.htmlEscape(title);
			img.attributes.set("title",value1);
		}
		parser.addNode(img);
		return true;
	}
	,__class__: markdown_ImgSyntax
});
var markdown_CodeSyntax = function(pattern) {
	markdown_InlineSyntax.call(this,pattern);
};
markdown_CodeSyntax.__name__ = true;
markdown_CodeSyntax.__super__ = markdown_InlineSyntax;
markdown_CodeSyntax.prototype = $extend(markdown_InlineSyntax.prototype,{
	onMatch: function(parser) {
		parser.addNode(markdown_ElementNode.text("code",StringTools.htmlEscape(this.pattern.matched(1))));
		return true;
	}
	,__class__: markdown_CodeSyntax
});
var markdown_InlineParser = function(source,document) {
	this.start = 0;
	this.pos = 0;
	this.source = source;
	this.document = document;
	this.stack = [];
	if(document.inlineSyntaxes != null) {
		this.syntaxes = [];
		var _g = 0;
		var _g1 = document.inlineSyntaxes;
		while(_g < _g1.length) {
			var syntax = _g1[_g];
			++_g;
			this.syntaxes.push(syntax);
		}
		var _g2 = 0;
		var _g11 = markdown_InlineParser.defaultSyntaxes;
		while(_g2 < _g11.length) {
			var syntax1 = _g11[_g2];
			++_g2;
			this.syntaxes.push(syntax1);
		}
	} else this.syntaxes = markdown_InlineParser.defaultSyntaxes;
	var x = new markdown_LinkSyntax(document.linkResolver);
	this.syntaxes.splice(1,0,x);
};
markdown_InlineParser.__name__ = true;
markdown_InlineParser.prototype = {
	parse: function() {
		this.stack.push(new markdown_TagState(0,0,null));
		while(!this.get_isDone()) {
			var matched = false;
			var _g1 = 1;
			var _g = this.stack.length;
			while(_g1 < _g) {
				var i = _g1++;
				if(this.stack[this.stack.length - i].tryMatch(this)) {
					matched = true;
					break;
				}
			}
			if(matched) continue;
			var _g2 = 0;
			var _g11 = this.syntaxes;
			while(_g2 < _g11.length) {
				var syntax = _g11[_g2];
				++_g2;
				if(syntax.tryMatch(this)) {
					matched = true;
					break;
				}
			}
			if(matched) continue;
			this.advanceBy(1);
		}
		return this.stack[0].close(this);
	}
	,writeText: function() {
		this.writeTextRange(this.start,this.pos);
		this.start = this.pos;
	}
	,writeTextRange: function(start,end) {
		if(end > start) {
			var text = this.source.substring(start,end);
			var nodes = this.stack[this.stack.length - 1].children;
			if(nodes.length > 0 && js_Boot.__instanceof(nodes[nodes.length - 1],markdown_TextNode)) {
				var lastNode = nodes[nodes.length - 1];
				var newNode = this.createText("" + lastNode.text + text);
				nodes[nodes.length - 1] = newNode;
			} else nodes.push(this.createText(text));
		}
	}
	,createText: function(text) {
		return new markdown_TextNode(this.unescape(text));
	}
	,addNode: function(node) {
		this.stack[this.stack.length - 1].children.push(node);
	}
	,get_currentSource: function() {
		return this.source.substring(this.pos,this.source.length);
	}
	,get_isDone: function() {
		return this.pos == this.source.length;
	}
	,advanceBy: function(length) {
		this.pos += length;
	}
	,consume: function(length) {
		this.pos += length;
		this.start = this.pos;
	}
	,unescape: function(text) {
		text = new EReg("\\\\([\\\\`*_{}[\\]()#+-.!])","g").replace(text,"$1");
		text = StringTools.replace(text,"\t","    ");
		return text;
	}
	,__class__: markdown_InlineParser
};
var markdown_TagState = function(startPos,endPos,syntax) {
	this.startPos = startPos;
	this.endPos = endPos;
	this.syntax = syntax;
	this.children = [];
};
markdown_TagState.__name__ = true;
markdown_TagState.prototype = {
	tryMatch: function(parser) {
		if(this.syntax.endPattern.match(parser.get_currentSource()) && this.syntax.endPattern.matchedPos().pos == 0) {
			this.close(parser);
			return true;
		}
		return false;
	}
	,close: function(parser) {
		var index = HxOverrides.indexOf(parser.stack,this,0);
		var unmatchedTags = parser.stack.splice(index + 1,parser.stack.length - index);
		var _g = 0;
		while(_g < unmatchedTags.length) {
			var unmatched = unmatchedTags[_g];
			++_g;
			parser.writeTextRange(unmatched.startPos,unmatched.endPos);
			var _g1 = 0;
			var _g2 = unmatched.children;
			while(_g1 < _g2.length) {
				var child = _g2[_g1];
				++_g1;
				this.children.push(child);
			}
		}
		parser.writeText();
		parser.stack.pop();
		if(parser.stack.length == 0) return this.children;
		if(this.syntax.onMatchEnd(parser,this)) parser.consume(this.syntax.endPattern.matched(0).length); else {
			parser.start = this.startPos;
			parser.advanceBy(this.syntax.endPattern.matched(0).length);
		}
		return null;
	}
	,__class__: markdown_TagState
};
var model_App = function() { };
model_App.__name__ = true;
var utils_TimeUtil = function() { };
utils_TimeUtil.__name__ = true;
utils_TimeUtil.readableTime = function(mlseconds) {
	var totalSec = Math.floor(mlseconds / 1000);
	var hours = Math.floor(totalSec / 3600 % 24);
	var minutes = Math.floor(totalSec / 60 % 60);
	var seconds = Math.floor(totalSec % 60);
	var result = StringTools.lpad(hours == null?"null":"" + hours,"0",2) + ":" + StringTools.lpad(minutes == null?"null":"" + minutes,"0",2) + ":" + StringTools.lpad(seconds == null?"null":"" + seconds,"0",2);
	return result;
};
utils_TimeUtil.countdown = function(minutes,mlseconds) {
	var totalSec = Math.round(minutes * 60);
	var progressSec = Math.round(mlseconds / 1000);
	var temp = totalSec - progressSec;
	if(temp <= 0) temp = 0;
	return utils_TimeUtil.readableTime(temp * 1000);
};
var view_SlidrrView = function(md,el,slideId) {
	var slides = md.split("\n" + model_App.spliteSlide + "\n");
	var i = slideId;
	var slideArr = slides[i].split("\n" + model_App.splitNote + "\n");
	var vo = this.stripBackground(slideArr[0]);
	var slideHTML = Markdown.markdownToHtml(vo.markdown);
	var noteHTML;
	if(slideArr.length > 1) noteHTML = Markdown.markdownToHtml(slideArr[1]); else noteHTML = "";
	var container;
	var _this = window.document;
	container = _this.createElement("div");
	container.className = "slidrr-flex";
	var div;
	var _this1 = window.document;
	div = _this1.createElement("div");
	div.id = "slidrr-" + i;
	div.className = "slidrr";
	var container1;
	var _this2 = window.document;
	container1 = _this2.createElement("div");
	container1.className = "slidrr-flex";
	container1.innerHTML = slideHTML + "<!-- :: note :: \n" + noteHTML + "\n -->";
	if(vo.url != "") {
		div.className += " slidrr-fullscreen glow";
		div.style.backgroundImage = "url(" + vo.url + ")";
	}
	if(vo.color != "") {
		if(vo.url == "") div.className += " glow";
		div.style.backgroundColor = "" + vo.color;
		var hex = Std.parseInt(StringTools.replace(vo.color,"#","0x"));
		if(hex > 8388607.5) div.className += " dark";
	}
	div.appendChild(container1);
	el.appendChild(div);
};
view_SlidrrView.__name__ = true;
view_SlidrrView.prototype = {
	stripBackground: function(md) {
		var _url = "";
		var _color = "";
		var _markdown = md;
		if(md.indexOf("![") != -1) {
			var temp = md.substring(0,md.indexOf("!["));
			if(StringTools.replace(StringTools.replace(StringTools.replace(StringTools.replace(temp,"\n",""),"\t",""),"\r","")," ","").length == 0) {
				_markdown = "";
				var arr = md.split("\n");
				var _g1 = 0;
				var _g = arr.length;
				while(_g1 < _g) {
					var i = _g1++;
					if(arr[i].indexOf("![") != -1) {
						_color = this.validColor(arr[i]);
						_url = StringTools.replace(arr[i].split("](")[1],")","");
					} else _markdown += arr[i] + "\n";
				}
			}
		}
		var _vo = { url : _url, color : _color, markdown : _markdown};
		return _vo;
	}
	,validColor: function(str) {
		var _str = "";
		var _temp = StringTools.rtrim(StringTools.ltrim(StringTools.replace(str.split("](")[0],"![","")));
		if(_temp.indexOf("#") == 0) _str = _temp;
		return _str;
	}
	,__class__: view_SlidrrView
};
var view_SpeakrrNotesView = function(md) {
	this.timer = new haxe_Timer(1000);
	this._doc = window.document;
	this.buildNotes(md);
};
view_SpeakrrNotesView.__name__ = true;
view_SpeakrrNotesView.prototype = {
	buildNotes: function(md) {
		var _g = this;
		var slideCurrent = this._doc.getElementById("current-slide");
		var slideNext = this._doc.getElementById("upcoming-slide");
		new view_SlidrrView(md,slideCurrent,5);
		new view_SlidrrView(md,slideNext,6);
		hljs.initHighlightingOnLoad();
		this.startTime = new Date();
		this.timer.run = function() {
			_g.setClock();
		};
	}
	,setClock: function() {
		var timer = this._doc.getElementsByClassName("timer")[0];
		var clock = this._doc.getElementsByClassName("clock")[0];
		var countdown = this._doc.getElementsByClassName("countdown")[0];
		var now = new Date();
		var progress = Std["int"](now.getTime() - this.startTime.getTime());
		timer.innerHTML = "<span class=\"time-text\">start from presentation:</span> " + utils_TimeUtil.readableTime(progress);
		clock.innerHTML = "<span class=\"time-text\">current time:</span> " + StringTools.lpad(Std.string(now.getHours()),"0",2) + ":" + StringTools.lpad(Std.string(now.getMinutes()),"0",2) + ":" + StringTools.lpad(Std.string(now.getSeconds() + 1),"0",2);
		countdown.innerHTML = "<span class=\"time-text\">countdown time:</span> " + utils_TimeUtil.countdown(model_App.time,progress);
	}
	,__class__: view_SpeakrrNotesView
};
var $_, $fid = 0;
function $bind(o,m) { if( m == null ) return null; if( m.__id__ == null ) m.__id__ = $fid++; var f; if( o.hx__closures__ == null ) o.hx__closures__ = {}; else f = o.hx__closures__[m.__id__]; if( f == null ) { f = function(){ return f.method.apply(f.scope, arguments); }; f.scope = o; f.method = m; o.hx__closures__[m.__id__] = f; } return f; }
if(Array.prototype.indexOf) HxOverrides.indexOf = function(a,o,i) {
	return Array.prototype.indexOf.call(a,o,i);
};
String.prototype.__class__ = String;
String.__name__ = true;
Array.__name__ = true;
Date.prototype.__class__ = Date;
Date.__name__ = ["Date"];
var Int = { __name__ : ["Int"]};
var Dynamic = { __name__ : ["Dynamic"]};
var Float = Number;
Float.__name__ = ["Float"];
var Bool = Boolean;
Bool.__ename__ = ["Bool"];
var Class = { __name__ : ["Class"]};
var Enum = { };
var __map_reserved = {}
js_Boot.__toStr = {}.toString;
markdown_BlockSyntax.RE_EMPTY = new EReg("^([ \\t]*)$","");
markdown_BlockSyntax.RE_SETEXT = new EReg("^((=+)|(-+))$","");
markdown_BlockSyntax.RE_HEADER = new EReg("^(#{1,6})(.*?)#*$","");
markdown_BlockSyntax.RE_BLOCKQUOTE = new EReg("^[ ]{0,3}>[ ]?(.*)$","");
markdown_BlockSyntax.RE_INDENT = new EReg("^(?:    |\t)(.*)$","");
markdown_BlockSyntax.RE_CODE = new EReg("^```(\\w*)\\s*$","");
markdown_BlockSyntax.RE_HR = new EReg("^[ ]{0,3}((-+[ ]{0,2}){3,}|(_+[ ]{0,2}){3,}|(\\*+[ ]{0,2}){3,})$","");
markdown_BlockSyntax.RE_HTML = new EReg("^<[ ]*\\w+[ >]","");
markdown_BlockSyntax.RE_UL = new EReg("^[ ]{0,3}[*+-][ \\t]+(.*)$","");
markdown_BlockSyntax.RE_OL = new EReg("^[ ]{0,3}\\d+\\.[ \\t]+(.*)$","");
markdown_TableSyntax.TABLE_PATTERN = new EReg("^(.+? +:?\\|:? +)+(.+)$","");
markdown_TableSyntax.CELL_PATTERN = new EReg("(\\|)?([^\\|]+)(\\|)?","g");
markdown_HtmlRenderer.BLOCK_TAGS = new EReg("blockquote|h1|h2|h3|h4|h5|h6|hr|p|pre","");
markdown_HtmlRenderer.attributeOrder = ["src","alt"];
markdown_LinkSyntax.linkPattern = "\\](?:(" + "\\s?\\[([^\\]]*)\\]" + "|" + "\\s?\\(([^ )]+)(?:[ ]*\"([^\"]+)\"|)\\)" + ")|)";
markdown_ImgSyntax.linkPattern = "\\](?:(" + "\\s?\\[([^\\]]*)\\]" + "|" + "\\s?\\(([^ )]+)(?:[ ]*\"([^\"]+)\"|)\\)" + ")|)";
markdown_InlineParser.defaultSyntaxes = [new markdown_AutolinkSyntaxWithoutBrackets(),new markdown_TextSyntax(" {2,}\n","<br />\n"),new markdown_TextSyntax("\\s*[A-Za-z0-9]+"),new markdown_AutolinkSyntax(),new markdown_LinkSyntax(),new markdown_ImgSyntax(),new markdown_TextSyntax(" \\* "),new markdown_TextSyntax(" _ "),new markdown_TextSyntax("&[#a-zA-Z0-9]*;"),new markdown_TextSyntax("&","&amp;"),new markdown_TextSyntax("</?\\w+.*?>"),new markdown_TextSyntax("<","&lt;"),new markdown_TagSyntax("\\*\\*","strong"),new markdown_TagSyntax("__","strong"),new markdown_TagSyntax("\\*","em"),new markdown_TagSyntax("\\b_","em","_\\b"),new markdown_CodeSyntax("``\\s?((?:.|\\n)*?)\\s?``"),new markdown_CodeSyntax("`([^`]*)`")];
model_App.spliteSlide = "--";
model_App.splitNote = "??";
model_App.markdown = "slidrr.md";
model_App.author = "";
model_App.css = "";
model_App.time = 10;
Main.main();
})(typeof console != "undefined" ? console : {log:function(){}}, typeof window != "undefined" ? window : typeof global != "undefined" ? global : typeof self != "undefined" ? self : this);

//# sourceMappingURL=slidrr.js.map