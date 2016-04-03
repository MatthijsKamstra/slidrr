package view;

import js.Browser;
import js.html.*;

import model.App;

using StringTools;

class SlidrrView
{
	public var notesHtml ( get_notesHtml , set_notesHtml ) : String;
	private var _notesHtml : String;
	
	function get_notesHtml () : String {
		return _notesHtml;
	}
	function set_notesHtml(value : String) : String {
		return _notesHtml = value;
	}
	
	public var totalSlides ( get_totalSlides , set_totalSlides ) : Int;
	private var _totalSlides : Int;
	
	function get_totalSlides () : Int {
		return _totalSlides;
	}
	function set_totalSlides(value : Int) : Int {
		return _totalSlides = value;
	}

	public function new(md:String,el:Element,slideId:Int)
	{
		// var flexContainer = Browser.document.createDivElement();
		// flexContainer.className = 'slidrr-container';
		
		var slides : Array<String> = md.split('\n'+App.spliteSlide+'\n');
		totalSlides = slides.length;
		var i = slideId;

		var slideArr = slides[i].split('\n'+App.splitNote+'\n');	
		var vo : BackgroundVO = stripBackground(slideArr[0]);
		var slideHTML = Markdown.markdownToHtml(vo.markdown);
		notesHtml = (slideArr.length>1) ? Markdown.markdownToHtml(slideArr[1]) : '' ;
		
		var container = Browser.document.createDivElement();
		container.className = 'slidrr-flex';
		
		var div = Browser.document.createDivElement();
		div.id = "slidrr-" + i;
		div.className = ('slidrr');
		
		var container = Browser.document.createDivElement();
		container.className = 'slidrr-flex';
		container.innerHTML = slideHTML + '<!-- :: note :: \n' + notesHtml + '\n -->';
		
		if(vo.url != ''){
			div.className += ' slidrr-fullscreen glow';
			div.style.backgroundImage = 'url(${vo.url})';
		}
		if(vo.color != '') {
			if(vo.url == '') div.className += ' glow';
			div.style.backgroundColor = '${vo.color}';
			var hex = Std.parseInt (vo.color.replace("#","0x"));
			// [mck] check if background color is half white/black and change the color of the text 
			if(hex > (0xffffff/2)) div.className += ' dark';		
		}
		
		div.appendChild(container);
		el.appendChild(div);
		
		// test 
		// var div2 = Browser.document.createDivElement();
		// div2.id = "slidrr-mini-" + i;
		// div2.className = ('mini-slide');
		// div2.innerHTML = slideHTML + '<!-- :: note :: \n' + noteHTML + '\n -->';
	

	
		// el.appendChild(flexContainer);
	}

	/**
	 * check if the first item is an image, then make it full screen
	 * if the first item is not an image, this will do nothing and return ['','markdown']
	 * 
	 * @param		content of markdown file
	 *
	 * @return 		BackgroundVO with {markdown, color, url}
	 */
	function stripBackground (md:String) : BackgroundVO
	{
		// default values
		var _url = '';
		var _color = '';
		var _markdown = md;
		
		// check for image, check if first item is image
		if (md.indexOf('![') != -1){
			// [mck] there is an image in the md
			var temp = md.substring(0, md.indexOf('!['));
			if(temp.replace('\n','').replace('\t','').replace('\r','').replace(' ','').length == 0){
				_markdown = '';
				// [mck] get image and the rest of the _markdown content
				var arr = md.split('\n');
				for ( i in 0 ... arr.length ) {
					if (arr[i].indexOf('![') != -1)
					{
						_color = validColor (arr[i]);
						_url = arr[i].split('](')[1].replace(')','');
					} else {
						_markdown += arr[i] + '\n';
					} 
				}
			}
		}
		
		var _vo : BackgroundVO  = {
			url : _url,
			color : _color,
			markdown : _markdown	
		};
		
		return _vo;
	}
	
	function validColor(str:String):String
	{
		var _str = '';
		var _temp = str.split('](')[0].replace('![', '').ltrim().rtrim();
		if (_temp.indexOf('#') == 0){
			_str = _temp;
		}
		return _str;
	}

}


typedef BackgroundVO = 
{
	var url : String;
	var color : String;
	var markdown : String;	
}