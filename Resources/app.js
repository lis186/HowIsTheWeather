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