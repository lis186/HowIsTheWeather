//
// iPhone background service to update temperature on badge
//

function updateWeather(lat, lng)
{	
	Ti.API.info('updateWeather('+lat+', '+lng+')');
	var xhr = Titanium.Network.createHTTPClient();
	xhr.onload = function()
	{
		var tempUnit = Titanium.App.currentService.tempUnit;
		Ti.API.info('tempUnit: '+tempUnit);
		Ti.API.info('weather xml ' + this.responseXML + ' text ' + this.responseText);
		var doc = Titanium.XML.parseString(this.responseText).documentElement;
		var temp_f = doc.evaluate("//weather/current_conditions/temp_f").item(0).getAttribute('data');
		Ti.API.info(temp_f);
		var temp_c = doc.evaluate("//weather/current_conditions/temp_c").item(0).getAttribute('data');
		Ti.API.info(temp_c);

		if(tempUnit === 'c')
		{
			Titanium.UI.iPhone.appBadge = temp_c;
			Ti.API.info('Update badge:' + temp_c);
		}else if(tempUnit === 'f')
		{
			Titanium.UI.iPhone.appBadge = temp_f;
			Ti.API.info('Update badge:' + temp_f);
		}
	};
	var url = 'http://www.google.com/ig/api?hl=zh-tw&weather=,,,'+parseInt(lat*1000000, 10)+','+parseInt(lng*1000000, 10);
	Ti.API.info(url);
	xhr.open('GET', url);
	xhr.send();
}

function getCurrentWeather()
{
	nextUpdateTime = new Date().getTime()+300000;
	if (Titanium.Geolocation.locationServicesEnabled === false)
	{
		Ti.API.info('無法使用定位服務');
	}
	else
	{ 
		Ti.Geolocation.purpose = "取得目前位置的天氣資訊";
	    Titanium.Geolocation.accuracy = Titanium.Geolocation.ACCURACY_BEST;	
	    Titanium.Geolocation.distanceFilter = 1000;	
	    Titanium.Geolocation.getCurrentPosition(function(e)
	    {
	        if (e.error)
	        {
	            Titanium.API.info("error: " + JSON.stringify(e.error));
	            return;
	        }
			var latitude = e.coords.latitude;
	        var longitude = e.coords.longitude;
			Ti.API.info(longitude+','+latitude);
			updateWeather(latitude, longitude);
	    });
	}
}

function printTime()
{
	var timeToNextupdate = nextUpdateTime-new Date();
	Ti.API.info(new Date(timeToNextupdate).getMinutes()+':'+new Date(timeToNextupdate).getSeconds());
}

Ti.API.info('starting background service');
var updateInterval = setInterval(getCurrentWeather, 300000);
var nextUpdateTime = new Date().getTime()+ 300000;
setInterval(printTime, 1000);



