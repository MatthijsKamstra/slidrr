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
	
	private var isFullScreen : Bool = false;
	
	// default
	private var spliteSlide 	: String = '--';
	private var splitNote 		: String = '??';
	private var markdown 		: String = 'slidrr.md'; 
	private var author 			: String = ''; 
	private var time 			: Int = 45; // min

	private var queryArr : Array<String> = ['md', 'split', 'note', 'author', 'time'];

	private var flexContainer : DivElement;
	
	public function new () 
	{
		_doc.addEventListener("DOMContentLoaded", function(event) 
		{	
			// ?md=slidrrtest.md&author=mck
			var map : Map<String, String> = new Map();
			var arr = _win.location.search.substr(1).split("&");
			for ( i in 0 ... arr.length ) {
				var temp = arr[i].split("=");
				map.set(temp[0],temp[1]);
			}
			
			trace((map.exists('author')) ? (map.get('author')) : 'niets');
			// your code
			if(map.exists('md')) 		markdown = map.get('md');
			if(map.exists('split')) 	spliteSlide = map.get('split');
			if(map.exists('note')) 		splitNote = map.get('note');
			if(map.exists('author'))	author = map.get('author');
			if(map.exists('time')) 		time = Std.parseInt (map.get('time'));
			
    		readTextFile(markdown);
		});
	}
	
	private function build(md:String) : Void
	{
		flexContainer = _doc.createDivElement();
		flexContainer.className = 'container';
		_doc.body.appendChild(flexContainer);

		var slides : Array<String> = md.split(spliteSlide);
		_total = slides.length;
		for ( i in 0 ... _total ) {
			// trace(slides[i]);
			var slideArr = slides[i].split(splitNote);			
			var slideHTML = Markdown.markdownToHtml(slideArr[0]);
			var noteHTML = (slideArr.length>1) ? Markdown.markdownToHtml(slideArr[1]) : '';
			var div = _doc.createDivElement();
			div.id = "slide_" + i;
			div.className = ('slidrr hidden');
			div.innerHTML = slideHTML + '<!-- \n' + noteHTML + '\n -->';
			flexContainer.appendChild(div);
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
		buildLogo();
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
	 	
		_container.innerHTML = Markdown.markdownToHtml(showDefaults());

		_doc.body.appendChild(_container);
	}
	
	public function buildLogo() : Void
	{
		var _container = _doc.createDivElement();
		_container.className = "logo";
		
		_doc.body.appendChild(_container);
	}
	
	public function showDefaults () : String {
		var str = '
		
| action | shortcut |
| --- | --- |
| forward | `cursor right` , `.` , `space` |
| reverse | `cursor left` , `,` | 
| fullscreen | `f` | 
| help | `h` | 
| create black screen | `b` | 
| reverse fullscreen | `esc` | 
| speaker notes | `s` | 
';
			
		str += 'markdown: ${markdown}';
		str += 'slide split: ${spliteSlide}';
		str += 'note split: ${splitNote}';
		
		return str;
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



	public function toggleFullscreen () : Void 
	{	
		if(!isFullScreen)
		{
			isFullScreen = true;
			var elem = _doc.documentElement;
			if (untyped elem.requestFullscreen) {
				untyped elem.requestFullscreen();
			} else if (untyped elem.msRequestFullscreen) {
				untyped elem.msRequestFullscreen();
			} else if (untyped elem.mozRequestFullScreen) {
				untyped elem.mozRequestFullScreen();
			} else if (untyped elem.webkitRequestFullscreen) {
				untyped elem.webkitRequestFullscreen();
			}
		} else {
			isFullScreen = false;
			if (untyped _doc.exitFullscreen) {
				untyped _doc.exitFullscreen();
			} else if (untyped _doc.msExitFullscreen) {
				untyped _doc.msExitFullscreen();
			} else if (untyped _doc.mozCancelFullScreen) {
				untyped _doc.mozCancelFullScreen();
			} else if (untyped _doc.webkitExitFullscreen) {
				untyped _doc.webkitExitFullscreen();
			}
		} 
	}



	function showHelp () : Void {
		trace('showHelp');
	}

	function showBlackScreen () : Void {
		trace('showBlackScreen');
	}

	function showSpeakerNotes () : Void {
		trace('showSpeakerNotes');
	}

	// ____________________________________ handlers ____________________________________

	function onKeyHandler(e:KeyboardEvent) : Void 
	{
		// trace(e.keyCode);
		switch (e.keyCode) {
			case 37 : move(-1); // cursor left
			case 188 : move(-1); // , <
			case 39 : move(1); // cursor right
			case 32 : move(1); // space
			case 190 : move(1); // . >
			case 70 : toggleFullscreen(); // f / fullscreen
			case 72 : showHelp(); // h / help
			case 66 : showBlackScreen(); // b / black
			case 83 : showSpeakerNotes();  // s / speaker note
			
			
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