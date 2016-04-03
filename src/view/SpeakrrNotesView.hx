package view;

import js.Browser;
import js.html.*;

import model.App;

using StringTools;

class SpeakrrNotesView
{
	private var _doc = js.Browser.document;
	private var _win = js.Browser.window;
	
	private var timer = new haxe.Timer(1000); // 1000ms delay
	private var startTime : Date;
	
	var slideCurrent : DivElement;
	var slideNext : DivElement;
	
	public function new(md:String) 
	{
		Browser.console.info('Speakrr-Notes');	
			
		slideCurrent = cast (_doc.getElementById('current-slide'), DivElement);
		slideNext = cast (_doc.getElementById('upcoming-slide'), DivElement);
		
		Browser.console.info(slideCurrent.clientWidth);
		Browser.console.info(slideCurrent.clientHeight);
		
		buildNotes(md);
	}

	/**
	* use one js for both windows
	* slidrr-presentation mode
	* and slidrr-speakrr-notes mode
	*/
	function buildNotes (md:String)
	{
		var slideCurrentContainer = _doc.createDivElement();
		slideCurrentContainer.className = 'slidrr-container';
		slideCurrent.appendChild(slideCurrentContainer);

		var slideNextContainer = _doc.createDivElement();
		slideNextContainer.className = 'slidrr-container';
		slideNext.appendChild(slideNextContainer);

		var currentSlide = new view.SlidrrView(md,slideCurrentContainer,5);
		var nextSlide = new view.SlidrrView(md,slideNextContainer,4);

		var elSpeakrrNotes = Browser.document.getElementsByClassName("speaker-controls-notes")[0];
		if(elSpeakrrNotes != null && currentSlide.notesHtml != ''){
			elSpeakrrNotes.innerHTML = currentSlide.notesHtml;
		}		

		// [mck] start highlight plugin? // doesn't work yet in original mode (opening with `s`)...
		untyped hljs.initHighlightingOnLoad();
		
		startTime = Date.now();
		timer.run = function () {setClock();};
	}

	function setClock():Void
	{
		var timer = _doc.getElementsByClassName('timer')[0];
		var clock = _doc.getElementsByClassName('clock')[0];
		var countdown = _doc.getElementsByClassName('countdown')[0];
		var now = Date.now();
		var progress = Std.int (now.getTime() - startTime.getTime());
		timer.innerHTML = '<span class="time-text">start from presentation:</span> ${utils.TimeUtil.readableTime(progress)}';
		clock.innerHTML = '<span class="time-text">current time:</span> ${Std.string(now.getHours()).lpad('0',2)}:${Std.string(now.getMinutes()).lpad('0',2)}:${Std.string(now.getSeconds()+1).lpad('0',2)}';
		countdown.innerHTML = '<span class="time-text">countdown time:</span> ${utils.TimeUtil.countdown(App.time,progress)}';
	}
}