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
	private var slideStartTime : Date;
	
	var slideCurrent : DivElement;
	var slideNext : DivElement;
	
	var slideCurrentContainer : DivElement;
	var slideNextContainer : DivElement;
	
	var totalSlides : Int;
	
	public function new(md:String) 
	{
		Browser.console.info('Speakrr-Notes');	
			
		slideCurrent = cast (_doc.getElementById('current-slide'), DivElement);
		slideNext = cast (_doc.getElementById('upcoming-slide'), DivElement);
		
		buildNotes(md);
		onResizeHandler();
		
		_win.onresize = function (){
			onResizeHandler();
		}
	}

	/**
	* use one js for both windows
	* slidrr-presentation mode
	* and slidrr-speakrr-notes mode
	*/
	function buildNotes (md:String)
	{
		slideCurrentContainer = _doc.createDivElement();
		slideCurrentContainer.className = 'slidrr-container current-slidrr';
		slideCurrent.appendChild(slideCurrentContainer);

		slideNextContainer = _doc.createDivElement();
		slideNextContainer.className = 'slidrr-container next-slidrr';
		slideNext.appendChild(slideNextContainer);

		var currentSlide = new view.SlidrrView(md,slideCurrentContainer,5);
		var nextSlide = new view.SlidrrView(md,slideNextContainer,4);
		totalSlides = nextSlide.totalSlides;

		var elSpeakrrNotes = Browser.document.getElementsByClassName("speaker-controls-notes")[0];
		if(elSpeakrrNotes != null && currentSlide.notesHtml != ''){
			elSpeakrrNotes.innerHTML = currentSlide.notesHtml;
		}		

		// [mck] start highlight plugin? // doesn't work yet in original mode (opening with `s`)...
		untyped hljs.initHighlightingOnLoad();
		
		restartSlideTimer();
		startTime = Date.now();
		timer.run = function () {setClock();};
	}
	
	function restartSlideTimer() : Void
	{
		slideStartTime = Date.now();	
	}

	/**
	 * countdown time (let's say 10 min)
	 * totalSlides number is 20  
	 * means approximatly 30 seconds per slide
	 */
	function setClock():Void
	{
		var timer = _doc.getElementsByClassName('timer')[0];
		var clock = _doc.getElementsByClassName('clock')[0];
		var countdown = _doc.getElementsByClassName('countdown')[0];
		var slidecountdown = _doc.getElementsByClassName('slide-countdown')[0];
		var temp = _doc.getElementsByClassName('temp2')[0];
		
		// App.time in minutes 
		var totalPresentationTimeSec : Int =  Math.round( App.time * 60);
		// time per slide 
		var perSlideTimeSec = Std.int (totalPresentationTimeSec / totalSlides);
		
		var now = Date.now();
		var progress = Std.int (now.getTime() - startTime.getTime());
		var slideprogress = Std.int (now.getTime() - slideStartTime.getTime());
		timer.innerHTML = '<span class="time-text">during :</span><span class="time">${utils.TimeUtil.readableTime(progress)}</span>';
		clock.innerHTML = '<span class="time-text">time:</span><span class="time">${utils.TimeUtil.readableDate(now)}</span>';
		countdown.innerHTML = '<span class="time-text">countdown:</span><span class="time">${utils.TimeUtil.countdown(App.time,progress)}</span>';
		slidecountdown.innerHTML = '<span class="time-text">slide countdown:</span><span class="time">${utils.TimeUtil.countdownSeconds(perSlideTimeSec,slideprogress)}</span>';
		temp.innerHTML = 'total slides: ${totalSlides}, totaltime: ${App.time} minutes, time per slide: ${perSlideTimeSec} seconds';
		
	}
	
	
	public function onResizeHandler () : Void 
	{
		var w = Browser.window.innerWidth;
		
		// 1024 x 768px;
		// 60 / 40
		var currentScale = 0.60;
		
		slideCurrent.style.width = Std.string(Math.floor(w * currentScale)) + 'px'; 
		slideCurrent.style.height = Std.string(Math.floor((slideCurrent.clientWidth / 1024) * 768)) + 'px';
		
		// trace('w: ${w}');
		// trace('width: ${Math.floor(w * currentScale)}');
		// trace('height: ${(slideCurrent.clientWidth / 1024) * 768}');
		
		slideNext.style.width = Std.string(Math.floor(w * (1-currentScale))) + 'px'; 
		slideNext.style.height = Std.string(Math.floor((slideNext.clientWidth / 1024) * 768)) + 'px';
		
		scaleEl();	
	}
	
	/*
	transform-origin: left top;
	-ms-transform: scale(0.5, 0.5); / * IE 9 * /
    -webkit-transform: scale(0.5, 0.5); / * Safari * /
    transform: scale(0.5, 0.5);	
	*/
	function scaleEl ()
	{
		// trace('${slideCurrent.clientWidth} / ${slideCurrentContainer.clientWidth}');
		
		var scale = 0.1; 
		if(slideCurrentContainer != null) {
			scale = slideCurrent.clientWidth / 1024;
			slideCurrentContainer.style.transform = 'scale($scale,$scale)';
		} 
		if(slideNextContainer != null){
			scale = slideNext.clientWidth / 1024;
			slideNextContainer.style.transform = 'scale($scale,$scale)';
		} 
	}
	
}