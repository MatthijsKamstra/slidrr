package utils;

using StringTools;

class TimeUtil{


	public static function readableTime(mlseconds:Int):String
	{
		var totalSec 	: Int = Math.floor( mlseconds/1000 );
		var hours 		: Int = Math.floor( (totalSec / 3600 ) % 24);
		var minutes 	: Int = Math.floor( (totalSec / 60 ) % 60);
		var seconds 	: Int = Math.floor( (totalSec % 60 ));
		var result = Std.string(hours).lpad("0",2) + ":" + Std.string(minutes).lpad("0",2) + ":" + Std.string(seconds).lpad("0",2);
		return result;
	}

	public static function readableDate(date:Date):String
	{
		return '${Std.string(date.getHours()).lpad('0',2)}:${Std.string(date.getMinutes()).lpad('0',2)}:${Std.string(date.getSeconds()+1).lpad('0',2)}';
	}

	public static function countdown(minutes:Int,mlseconds:Int) : String
	{
		var totalSec : Int =  Math.round( minutes * 60);
		var progressSec  =  Math.round( mlseconds/1000 );
		var temp = totalSec - progressSec;
		
		if (temp <= 0) temp = 0;
		return TimeUtil.readableTime(temp*1000);
	}

	public static function countdownSeconds(seconds:Int,mlseconds:Int) : String
	{
		var totalSec : Int =  Math.round( seconds);
		var progressSec  =  Math.round( mlseconds/1000 );
		var temp = totalSec - progressSec;
		
		if (temp <= 0) temp = 0;
		return TimeUtil.readableTime(temp*1000);
	}


}