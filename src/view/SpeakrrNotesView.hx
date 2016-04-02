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
	
	public function new(md:String) 
	{
		buildNotes(md);
	}

	/**
	* use one js for both windows
	* slidrr-presentation mode
	* and slidrr-speakrr-notes mode
	*/
	function buildNotes (md:String)
	{
		// Browser.console.info('notes');		
		var slideCurrent = _doc.getElementById('current-slide');
		var slideNext = _doc.getElementById('upcoming-slide');
		
		new view.SlidrrView(md,slideCurrent,5);
		new view.SlidrrView(md,slideNext,6);

		// [mck] start highlight plugin? // doesn't work yet
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