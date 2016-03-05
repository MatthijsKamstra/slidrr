package;

import jQuery.*;
import js.Browser;
import js.html.*;
import js.html.XMLHttpRequest;

class Main {
	
	
	private var _doc = js.Browser.document;
	private var _win = js.Browser.window;
	
	private var _width : Int;
	private var _height : Int;
	private var _total : Int;
	private var _currentId : Int = 0;
	private var _prevId : Int = 0;
	
	public function new () {
		_doc.addEventListener("DOMContentLoaded", function(event) {
    		readTextFile('slidrr.md');
		});
	}
	
	private function build(md:String) : Void
	{
		var slides : Array<String> = md.split('---');
		_total = slides.length;
		for ( i in 0 ... _total ) {
			// trace(slides[i]);
			var slideHTML = Markdown.markdownToHtml(slides[i]);
			var div = _doc.createDivElement();
			div.id = "slide_" + i;
			div.className = ('slidrr hidden');
			div.innerHTML = slideHTML;
			_doc.body.appendChild(div);
		}
		
		slideId(0,true);
		
		_win.onkeydown = function (e){
			onKeyHandler(e);
		}
				
		// onResizeHandler ();
		// _win.onresize = function (){
		// 	onResizeHandler();
		// }
		
		buildProgress();
		buildControle();
		buildHelp();
	}
	
	
	public function buildProgress () : Void
	{
		var _container = _doc.createDivElement();
		_container.className = "progress";
		
		var _progressbar = _doc.createDivElement();
		_progressbar.className = "progress-bar";
		
		_container.appendChild(_progressbar);
		_doc.body.appendChild(_container);
	}

	public function buildControle () : Void
	{
		var _container = _doc.createDivElement();
		_container.className = "controls";
		
		var _arrowL = _doc.createDivElement();
		_arrowL.className = "arrow left prev";
		_arrowL.innerHTML = "";
		var _arrowR = _doc.createDivElement();
		_arrowR.className = "arrow right next";
		_arrowR.innerHTML = "";
		
		_container.appendChild(_arrowL);
		_container.appendChild(_arrowR);
		_doc.body.appendChild(_container);
		
		_arrowL.onclick = _arrowR.onclick = function (e){
			onClickHandler(e);
		};
	}
	
	public function buildHelp () : Void
	{
		var _container = _doc.createDivElement();
		_container.className = "help";
		
		var _logo = _doc.createDivElement();
		_logo.className = "logo";
		
		_container.appendChild(_logo);
		_doc.body.appendChild(_container);
	}

	// ____________________________________ move! ____________________________________
	
	function slideId (id:Int, isVisible:Bool) : Void 
	{
		var slide = _doc.getElementById("slide_" + id);
		slide.className = (isVisible) ? "slidrr" : "slidrr hidden";
	}
	
	function move (dir:Int) : Void 
	{
		slideId(_prevId,false);
		
		if(dir == -1)			
			_currentId--;
		else 
			_currentId++;

		if(_currentId >= (_total-1)) _currentId = (_total-1);
		if(_currentId <= 0) _currentId = 0;

		slideId(_currentId,true);
		_prevId = _currentId;
		
		// progress
		var percentage = (_currentId/(_total-1))*100;
		var progress =_doc.getElementsByClassName("progress-bar")[0];		
		progress.style.width = Std.string(percentage) + '%';		
	}

	// ____________________________________ handlers ____________________________________

	function onKeyHandler(e:KeyboardEvent) : Void 
	{
		switch (e.keyCode) {
			case 37 : move(-1);
			case 39 : move(1);
		}
	}
	
	function onClickHandler (e) : Void {
		var temp : DivElement = cast e.currentTarget;
		if(temp.className.indexOf('left') != -1){
			trace('left');
			move(-1);
		} else {
			trace('right');
			move(1);
		}
	}
	
	function onResizeHandler () : Void 
	{
		_width = _win.innerWidth;
		_height = _win.innerHeight; 
		
		// var divs = _doc.getElementsByClassName("slidrr");
		// for ( i in 0 ... divs.length ) {
		// 	var div : DivElement = cast divs[i];
		// 	div.style.width = Std.string(_width) + 'px';
		// 	div.style.height = Std.string(_height) + 'px';
		// }
	}
	
	// ____________________________________ read markdown file ____________________________________
	
	function readTextFile(file):Void
	{
		var rawFile = new XMLHttpRequest();
		rawFile.open("GET", file, false);
		rawFile.onreadystatechange = function ()
		{
			if(rawFile.readyState == 4)
			{
				if(rawFile.status == 200 || rawFile.status == 0)
				{
					var file = rawFile.responseText;
					build(file);
				} 
			} 
		}
		rawFile.send();
	}
	

	static public function main () {
		var app = new Main ();
	}
}