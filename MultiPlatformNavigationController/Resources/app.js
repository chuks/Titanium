// this sets the background color of the master UIView (when there are no windows/tab groups on it)
Titanium.UI.setBackgroundColor('#000');
Ti.include('/lib/log.js');

//set debug string
Ti.App.Properties.setString('debug', true); 

//define windows open properties as objects for both iOS and Android
var androidWinOptions = {
	navBarHidden: false
}

var iOSWinOptions = {
	navBarHidden: false,
	animated: true
}

var options = {
	android: androidWinOptions,
	iOS: iOSWinOptions
}

//require the UI components necessary to drive the test
var NavigationController = require('NavigationController').NavigationController;

//create NavigationController which will drive our simple application
var controller = new NavigationController();

var RootWindow = require('/RootWindow').RootWindow;
controller.open(new RootWindow(controller), options);

