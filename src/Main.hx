package;

import jQuery.*;
import js.Browser;
import js.html.*;
import js.html.XMLHttpRequest;

using StringTools;

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
	
	/**
	* first function called after reading md file
	
	*/
	private function build(md:String) : Void
	{
		flexContainer = _doc.createDivElement();
		flexContainer.className = 'container';
		_doc.body.appendChild(flexContainer);

		var slides : Array<String> = md.split('\n'+spliteSlide+'\n');
		_total = slides.length;
		for ( i in 0 ... _total ) 
		{
			var slideArr = slides[i].split('\n'+splitNote+'\n');	
			var stripArr = stripBackground(slideArr[0]);
			var slideHTML = Markdown.markdownToHtml(stripArr[1]);
			var noteHTML = (slideArr.length>1) ? Markdown.markdownToHtml(slideArr[1]) : '';
			var div = _doc.createDivElement();
			div.id = "slide_" + i;
			div.className = ('slidrr hidden');
			div.innerHTML = slideHTML + '<!-- \n' + noteHTML + '\n -->';
			
			if(stripArr[0] != ''){
				div.className += ' fullscreen';
				div.style.backgroundImage = 'url(${stripArr[0]})';
			}
			
			flexContainer.appendChild(div);
		}

		onResizeHandler ();
		
		// [mck] wait for everything
		readURL ();
		
		// [mck] readURL should start the correct slide
		// slideId(0,true);
		
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
	
	/**
	 * check if the first item is an image, then make it full screen
	 * if the first item is not an image, this will do nothing and return ['','markdown']
	 * 
	 * @param		content of markdown file
	 *
	 * @return 		array ['background-image','markdown without background-image']
	 */
	function stripBackground (md:String) : Array<String> 
	{
		var imageUrl = '';
		var markdown = '';
		if (md.indexOf('![') != -1){
			// [mck] there is an image in the md
			var temp = md.substring(0, md.indexOf('!['));
			if(temp.replace('\n','').replace('\t','').replace('\r','').replace(' ','').length == 0){
				// trace('first thing is an image');
				// [mck] now get image
				var arr = md.split('\n');
				for ( i in 0 ... arr.length ) {
					if (arr[i].indexOf('![') != -1) 
						imageUrl = arr[i].replace('![', '').replace(']','').replace(')','').replace('(','');
					else 
						markdown += arr[i] + '\n';
				}
			}
		} else {
			markdown = md;
		}
		return [imageUrl,markdown];
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
	
		str += '\n';	
		for ( i in 0 ... queryArr.length ) {
			str += 'queryArr ${queryArr[i]}';
		}
		str += '\n';	
		
		
		
		return str;
	}

	// ____________________________________ hash ____________________________________

	/**
	 * Updates the page URL (hash) to reflect the current state.
	 */
	function writeURL (id:Int) : Void
	{
		// trace('writeURL ($id)');
		var url = '/' + Std.string(id);
		_win.location.hash = url;
	}
	
	/**
	 * Reads the current URL (hash) and navigates accordingly.
	 */
	function readURL () : Void 
	{
		// trace('readURL');
		var hash = _win.location.hash;
		var id = Std.parseInt ( hash.split('/')[1] );
		if(id == null) id = 0;
		// trace('hash: ${hash}, id: ${id}');
		_currentId = id;
		slideId(id,true);
	}

	// ____________________________________ move! ____________________________________
	
	function slideId (id:Int, isVisible:Bool) : Void 
	{
		var slide = _doc.getElementById("slide_" + id);
		var css = slide.className.replace('hidden','').rtrim().replace('  ',' ');
		slide.className = (isVisible) ? css : (css + " hidden");
		
		writeURL (id);
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
		// var notesPopup = _win.open( 'notes.html', 'Notes', 'width=1100,height=700' );
		
		var html  = '<!doctype html>
<html lang="en">
	<head>
		<meta charset="utf-8">
		<title>Slidrr Speakers Notes</title>

<script>
//respond to events
window.addEventListener(\'message\',function(event) {
	console.log(\'message received:  \' + event.data,event);
	event.source.postMessage(\'holla back youngin!\',event.origin);
},false);
</script>

	</head>
	<body>
		<div id="current-slide"></div>
		<div id="upcoming-slide"><span class="label">UPCOMING:</span></div>
		<div id="speaker-controls">
			<div class="speaker-controls-time">
				<h4 class="label">Time <span class="reset-button">Click to Reset</span></h4>
				<div class="clock">
					<span class="clock-value">0:00 AM</span>
				</div>
				<div class="timer">
					<span class="hours-value">00</span><span class="minutes-value">:00</span><span class="seconds-value">:00</span>
				</div>
				<div class="clear"></div>
			</div>
			<div class="speaker-controls-notes hidden">
				<h4 class="label">Notes</h4>
				<div class="value"></div>
			</div>
		</div>
	</body>
</html>';
		
		
		var notesPopup = _win.open('', 'Notes::','width=1100,height=700');
		notesPopup.document.write(html);

		var timer = new haxe.Timer(6000); // 1000ms delay
		timer.run = function() { 
			var message = 'Hello!  The time is: ' + (Date.now().getTime());
			trace('blog.local:  sending message:  ' + message);
			notesPopup.postMessage(message,'*'); //send the message and target URI
		}
		
		//listen to holla back
		_win.addEventListener('message',function(event) {
			// if(event.origin !== 'http://scriptandstyle.com') return;
			trace('received response: ' , event.data);
		},false);
		
		// var timer = new haxe.Timer(6000); // 1000ms delay
		// timer.run = function() { 
		// 	var message = 'Hello!  The time is: ' + (Date.now().getTime());
		// 	trace('blog.local:  sending message:  ' + message);
		// 	notesPopup.postMessage(message,''); //send the message and target URI
		// }
	
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
	
	// starting point Haxe
	static public function main () {
		var app = new Main ();
	}
}