exports.RootWindow = function(navController) {
	Ti.App.Properties.getString('debug') ? log('RootWindow: begin --') : log(null);

	var instance = Ti.UI.createWindow({
		title:'Window '+navController.windowStack.length,
		backgroundColor: '#f7f7f7',
		modal: true
	});

	if (navController.windowStack.length === 0){
		var left = (Ti.Platform.displayCaps.platformWidth - 70)/2;
		var closeBtnVisible = false;
	}
	else{
		var left = (Ti.Platform.displayCaps.platformWidth - 140)/3;
		var closeBtnVisible = true;
	}

	var newWindowBtn = Ti.UI.createButton({
		title: 'new',
		width: 70,
		height: 40,
		borderColor: '#64ABFF',
		borderWidth: 1,
		borderRadius: 5,
		left: left
	});

	newWindowBtn.addEventListener('click', function(){
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

		var RootWindow = require('/RootWindow').RootWindow;
		navController.open(new RootWindow(controller), options);
	});
	instance.add(newWindowBtn);

	if (closeBtnVisible){
		//closes all except first --i.e. returns to home
		var closeAllWindowsBtn = Ti.UI.createButton({
			title: 'close all',
			width: 70,
			height: 40,
			borderColor: '#64ABFF',
			borderWidth: 1,
			borderRadius: 5,
			left: newWindowBtn.left + newWindowBtn.width + ((Ti.Platform.displayCaps.platformWidth - 140)/3)
		});
		closeAllWindowsBtn.addEventListener('click',function(){
			navController.home();
		});

		instance.add(closeAllWindowsBtn);
	}

	


	return instance;
}