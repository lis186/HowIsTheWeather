var mainWin = Titanium.UI.createWindow({  
    backgroundColor:'#fff'
});

var locationLabel = Titanium.UI.createLabel({
	color:'#000',
	font:{fontSize: 30, fontFamily:'Helvetica Neue'},
	textAlign:'center',
	width:'auto',
	height: 'auto',
	left: 15,
	top: 75
});

var weatherIcon = Titanium.UI.createImageView({
	width: 80,
	height: 80,
	left: 15,
	top: 120
});

var temperatureLabel = Titanium.UI.createLabel({
	color:'#000',
	font:{fontSize: 90},
	textAlign:'center',
	width:'auto',
	height: 'auto',
	right: 15,
	top: 100
});

var detailLabel = Titanium.UI.createLabel({
	color:'#000',
	font:{fontSize: 24},
	textAlign:'left',
	width:'90%',
	height: 'auto',
	left: 20,
	top: 220
});

var indicator = Titanium.UI.createActivityIndicator();

if(Titanium.Platform.osname === 'iphone')
{
	indicator.style = Titanium.UI.iPhone.ActivityIndicatorStyle.BIG;
	indicator.height = 30;
	indicator.width = 30;
}

var settingButton = Titanium.UI.createButton({
	width: 44,
	height: 44,
	right: 5,
	bottom: 5,
	style: Titanium.UI.iPhone.SystemButton.INFO_DARK
});


var settingWin = Titanium.UI.createWindow({  
    backgroundColor:'gray'
});

mainWin.add(locationLabel);
mainWin.add(weatherIcon);
mainWin.add(temperatureLabel);
mainWin.add(detailLabel);
mainWin.add(indicator);
mainWin.open();

if(Titanium.Platform.osname === 'iphone')
{
	var unitTabbedBar = Titanium.UI.createTabbedBar({
		fontSize: 40,
	    labels:['°C', '°F'],
	    style:Titanium.UI.iPhone.SystemButtonStyle.BAR,
	    height: 40,
	    width: '90%'
	});
	
	unitTabbedBar.addEventListener('click', function(e){
		if(e.index === 0)
		{
			Titanium.App.Properties.setString('tempUnit', 'c');
		}else if (e.index === 1){
			Titanium.App.Properties.setString('tempUnit', 'f');
		}
	});
	
	settingWin.add(unitTabbedBar);
	mainWin.add(settingButton);
	settingButton.addEventListener('click', function(e){
		settingWin.open({transition: Ti.UI.iPhone.AnimationStyle.FLIP_FROM_LEFT});
		var tempUnit = Titanium.App.Properties.getString('tempUnit', 'c');
		if(tempUnit === 'c')
		{
			unitTabbedBar.index = 0;
		}else if(tempUnit === 'f')
		{
			unitTabbedBar.index = 1;
		}
		mainWin.close();
	});
	
}else if(Titanium.Platform.osname === 'android')
{
	
	var cButton = Titanium.UI.createButton({
		title: '°C',
		top: '50%',
		width: '40%',
		height: 80,
		left: 10
	});
	
	cButton.addEventListener('click', function(e){
		Titanium.App.Properties.setString('tempUnit', 'c');
		cButton.enabled = false;
		fButton.enabled = true;
	});

	var fButton = Titanium.UI.createButton({
		title: '°F',
		top: '50%',
		width: '40%',
		height: 80,
		right: 10
	});

	fButton.addEventListener('click', function(e){
		Titanium.App.Properties.setString('tempUnit', 'f');
		cButton.enabled = true;
		fButton.enabled = false;
	});

	settingWin.add(cButton);
	settingWin.add(fButton);
	
	Titanium.Android.currentActivity.onCreateOptionsMenu = function(e) {
		Titanium.API.info("create menu");
	    var menu = e.menu;
	    var menuItem = menu.add({ title: '設定' });
	    menuItem.addEventListener("click", function(e) {
			settingWin.open();
			var tempUnit = Titanium.App.Properties.getString('tempUnit', 'c');
			if(tempUnit === 'c')
			{
				cButton.enabled = false;
				fButton.enabled = true;
			}else if(tempUnit === 'f')
			{
				cButton.enabled = true;
				fButton.enabled = false;
			}
			mainWin.close();
	    });
	};
}

var doneButton = Titanium.UI.createButton({
	width: '90%',
	height: 80,
	title: '完成',
	bottom: 20
});

settingWin.add(doneButton);

doneButton.addEventListener('click', function(e){
	settingWin.close({transition: Ti.UI.iPhone.AnimationStyle.FLIP_FROM_RIGHT});
	mainWin.open();
	getCurrentWeather();
});

getCurrentWeather();

updateInterval = setInterval(getCurrentWeather, 300000);

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
			Titanium.UI.createAlertDialog({title:'無法取得地名', message:'請稍候再試。'}).show();
			Ti.API.info("Code translation: "+translateErrorCode(e.code));
		}
	});
}

function updateWeather(lat, lng)
{
	var xhr = Titanium.Network.createHTTPClient();
	xhr.onload = function()
	{
		indicator.hide();
		Ti.API.info('weather xml ' + this.responseXML + ' text ' + this.responseText);
		//var doc = this.responseXML.documentElement; responseXML has an encoding bug on Andrid
		var doc = Titanium.XML.parseString(this.responseText).documentElement;
		var condition = doc.evaluate("//weather/current_conditions/condition").item(0).getAttribute('data');
		Ti.API.info(condition);
		var temp_f = doc.evaluate("//weather/current_conditions/temp_f").item(0).getAttribute('data');
		Ti.API.info(temp_f);
		var temp_c = doc.evaluate("//weather/current_conditions/temp_c").item(0).getAttribute('data');
		Ti.API.info(temp_c);
		var humidity = doc.evaluate("//weather/current_conditions/humidity").item(0).getAttribute('data');
		Ti.API.info(humidity);
		var icon = 'http://www.google.com' + doc.evaluate("//weather/current_conditions/icon").item(0).getAttribute('data');
		Ti.API.info(icon);
		var wind_condition = doc.evaluate("//weather/current_conditions/wind_condition").item(0).getAttribute('data');
		Ti.API.info(wind_condition.split('、')[0]);
		Ti.API.info(wind_condition.split('、')[1]);
		var tempUnit = Titanium.App.Properties.getString('tempUnit', 'c');
		if(tempUnit === 'c')
		{
			temperatureLabel.text = temp_c + '°C';
			if(Titanium.Platform.osname === 'iphone')
			{
				Titanium.UI.iPhone.appBadge = temp_c;
			}
		}else if(tempUnit === 'f')
		{
			temperatureLabel.text = temp_f + '°F';
			if(Titanium.Platform.osname === 'iphone')
			{
				Titanium.UI.iPhone.appBadge = temp_f;
			}
		}
		weatherIcon.image = icon;
		detailLabel.text = condition + '\n';
		detailLabel.text += humidity + '\n';
		detailLabel.text += wind_condition.split('、')[0] + '\n';
		detailLabel.text += wind_condition.split('、')[1] + '\n';
	};

	var url = 'http://www.google.com/ig/api?hl=zh-tw&weather=,,,'+parseInt(lat*1000000, 10)+','+parseInt(lng*1000000, 10);
	Ti.API.info(url);
	xhr.open('GET', url);
	xhr.send();
}

function getCurrentWeather()
{
	if(Titanium.Platform.osname === 'android')
	{
		indicator.message = '取得目前位置';
	}
	indicator.show();
	
	if (Titanium.Geolocation.locationServicesEnabled === false)
	{
		indicator.hide();
	    Titanium.UI.createAlertDialog({title:'無法使用定位服務', message:'請開啓定位服務，這樣才能取得現在位置的天氣。'}).show();
	}
	else
	{ 
		Ti.Geolocation.purpose = "取得目前位置的天氣資訊";
	    Titanium.Geolocation.accuracy = Titanium.Geolocation.ACCURACY_BEST;

	    Titanium.Geolocation.distanceFilter = 1000;
		
	    Titanium.Geolocation.getCurrentPosition(function(e)
	    {
			indicator.hide();
	        if (e.error)
	        {
	            Titanium.API.info("error: " + JSON.stringify(e.error));
				Titanium.UI.createAlertDialog({title:'無法取得位置資訊', message: e.error.message}).show();
	            return;
	        }
			var latitude = e.coords.latitude;
	        var longitude = e.coords.longitude;
			Ti.API.info(longitude+','+latitude);
			updateLocationName(latitude, longitude);
			updateWeather(latitude, longitude);
	    });
	}
}
