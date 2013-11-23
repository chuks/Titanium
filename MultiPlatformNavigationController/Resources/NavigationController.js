exports.NavigationController = function() {
	this.windowStack = [];
};

exports.NavigationController.prototype.open = function(windowToOpen, options) { 
	//add the window to the stack of windows managed by the controller

	this.windowStack.push(windowToOpen);

	//grab a copy of the current nav controller for use in the callback
	var that = this;
	windowToOpen.addEventListener('close', function() {
		that.windowStack.pop();
	});

	
	//this sets the navBarHidden property of the windows
	if (options){
		Ti.App.Properties.getString('debug') ? log('NavigationController: options is not null') : log(null);

		if (Ti.Platform.name === 'android'){
			Ti.App.Properties.getString('debug') ? log('NavigationController: android') : log(null);

			if (options.android){
				Ti.App.Properties.getString('debug') ? log('NavigationController: options.android is not null') : log(null);

				for (var key in options.android) {
					if (options.android.hasOwnProperty(key)) {
						if (key === 'navBarHidden'){
							windowToOpen.navBarHidden = options.android[key];
						}
					}
				}
			}
			else{
				Ti.App.Properties.getString('debug') ? log('NavigationController: options.android is null') : log(null);
			}
		}

		else if (Ti.Platform.name === 'iPhone OS'){
			Ti.App.Properties.getString('debug') ? log('NavigationController: iPhone OS') : log(null);

			if (options.iOS){ 
				Ti.App.Properties.getString('debug') ? log('NavigationController: options.iOS is not null') : log(null);

				for (var key in options.iOS) {
					if (options.iOS.hasOwnProperty(key)) {
						if (key === 'navBarHidden'){
							Ti.App.Properties.getString('debug') ? log('NavigationController: found navBarHidden key, value is '+options.iOS[key]) : log(null);

							windowToOpen.navBarHidden = options.iOS[key];
						}
					}
				}
			}
			else{
				Ti.App.Properties.getString('debug') ? log('NavigationController: options.iOS is null') : log(null);
			}
		}
	}
	else{
		Ti.App.Properties.getString('debug') ? log('NavigationController: options is null') : log(null);
	}

	//This is the first window
	if (this.windowStack.length === 1) {
		if (Ti.Platform.name === 'android') {
			Ti.Android.currentActivity.addEventListener('create',    callback);
			Ti.Android.currentActivity.addEventListener('pause',     callback);
			Ti.Android.currentActivity.addEventListener('resume',    callback);
			Ti.Android.currentActivity.addEventListener('start',     callback);
			Ti.Android.currentActivity.addEventListener('stop',      callback);
			Ti.Android.currentActivity.addEventListener('destroy', 	 callback);
			Ti.Android.currentActivity.addEventListener('newintent', callback);

			windowToOpen.exitOnClose = true;
			windowToOpen.open();
		} else {
			
			this.navWindow = Ti.UI.iOS.createNavigationWindow({
				window : windowToOpen
			});

			this.navWindow.open();
			
		}
	}

	//All subsequent windows
	else {
		if (Ti.Platform.name === 'android') {
			windowToOpen.open();
		} else {
			//windowToOpen.navBarHidden = true;
			if (options.iOS){
				this.navWindow.openWindow(windowToOpen, options.iOS);
			}
			else{
				this.navWindow.openWindow(windowToOpen);
			}
			
		}
	}

	function callback(e){
		Ti.App.Properties.getString('debug') ? log('NavigationController: function callback(e)) --') : log(null);

		//alert('callback: event is '+e.type+', source is '+e.source);
	}
};

exports.NavigationController.prototype.close = function(windowToClose) { 
	//This is the first window
	if (this.windowStack.length === 1) {
		//can't close first window
		alert('can\'t close root window');
	}

	//All subsequent windows
	else {
		if (Ti.Platform.name === 'android') {
			windowToClose.close();
		} 
		else if (Ti.Platform.name === 'iPhone OS'){
			Ti.App.Properties.getString('debug') ? log('NavigationController: function callback(e)) --calling navWindow.closeWindow(windowToClose)') : log(null);

			this.navWindow.closeWindow(windowToClose, {animated: true});

			//todo get titanium version to support navGroup --deprecated in 3.1.2
		}
	}
};

//go back to the initial/root window of the NavigationController
exports.NavigationController.prototype.home = function() {
	//store a copy of all the current windows on the stack
	var windows = this.windowStack.concat([]);
	for(var i = 1, l = windows.length; i < l; i++) {
		(this.navWindow) ? this.navWindow.closeWindow(windows[i], {animated: true}) : windows[i].close();
	}
	this.windowStack = [this.windowStack[0]]; //reset stack
};
