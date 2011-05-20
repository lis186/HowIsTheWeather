var win = Titanium.UI.createWindow({  
    backgroundColor:'#fff'
});

var locationLabel = Titanium.UI.createLabel({
	color:'#000',
	text:'台北',
	font:{fontSize: 30, fontFamily:'Helvetica Neue'},
	textAlign:'center',
	width:'auto',
	height: 'auto',
	left: 15,
	top: 75
});

var weatherIcon = Titanium.UI.createImageView({
	image: 'images/mostly_cloudy.gif',
	width: 80,
	height: 80,
	left: 15,
	top: 120
});

var temperatureLabel = Titanium.UI.createLabel({
	color:'#000',
	text:'28°C',
	font:{fontSize: 90, fontFamily:'Helvetica Neue'},
	textAlign:'center',
	width:'auto',
	height: 'auto',
	right: 15,
	top: 100
});

var detailLabel = Titanium.UI.createLabel({
	color:'#000',
	text: '多雲時陰\n濕度： 62%\n風向： 西北\n風速：10 公里/小時',
	font:{fontSize: 24, fontFamily:'Helvetica Neue'},
	textAlign:'left',
	width:'auto',
	height: 'auto',
	left: 20,
	top: 220
});

win.add(locationLabel);
win.add(weatherIcon);
win.add(temperatureLabel);
win.add(detailLabel);
win.open();

function updateLocationName(lat, lng)
{
	Titanium.Geolocation.reverseGeocoder(lat, lng, function(e)
	{
		if (e.success) {
			var places = e.places;
			if (places && places.length) {
				locationLabel.text = places[0].city;
			} else {
				locationLabel.text = "找不到地名";
			}
			Ti.API.debug("reverse geolocation result = "+JSON.stringify(e));
		}
		else {
			Ti.UI.createAlertDialog({
				title:'Reverse geo error',
				message:evt.error
			}).show();
			Ti.API.info("Code translation: "+translateErrorCode(e.code));
		}
	});
}

if (Titanium.Geolocation.locationServicesEnabled === false)
{
    Titanium.UI.createAlertDialog({title:'無法使用定位服務', message:'請開啓定位服務，這樣才能取得現在位置的天氣。'}).show();
}
else
{ 
	Ti.Geolocation.purpose = "get current position";
    Titanium.Geolocation.accuracy = Titanium.Geolocation.ACCURACY_THREE_KILOMETERS;
 
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
		updateLocationName(latitude, longitude);
    });
 
    Titanium.Geolocation.addEventListener('location',function(e)
    {
        if (e.error)
        {
            Titanium.API.info("error: " + JSON.stringify(e.error));
            return;
        }
 		
		var latitude = e.coords.latitude;
        var longitude = e.coords.longitude;  
 		Ti.API.info(longitude+','+latitude);
		updateLocationName(latitude, longitude);
    }); 
}