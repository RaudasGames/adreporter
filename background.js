
var WIDTH = 1280;
var HEIGHT = 800;

function screenshot() {
	console.log(1);
	chrome.tabs.captureVisibleTab(null, {format:'png'}, function(dataUrl) {
		var img = new Image();
		var realWidth = WIDTH * (window.devicePixelRatio||1);
		var realHeight = HEIGHT * (window.devicePixelRatio||1);
		img.onload = function() {
			var rect = {
				left : Math.ceil((img.width - realWidth)/2),
				top : 0,
				width: realWidth,
				height: realHeight
			};
			var result = clipImage(rect, dataUrl);
			chrome.tabs.create({url:result});
		};
		img.src = dataUrl;
	});
}

function elementScreenshot() {
	chrome.tabs.executeScript({
		file: "content.js"
	});
}

function clipImage(rect, dataImage, callback) {
	
	var canvas = document.createElement('canvas');
	console.log(dataImage);

	console.log('RECT: ' + JSON.stringify(rect));
	canvas.width = rect.width;
	canvas.height = rect.height;
	
	var ctx = canvas.getContext('2d');
	var img = new Image();
	img.onload = function () {
		ctx.drawImage(img, Math.ceil(rect.left), Math.ceil(rect.top), rect.width, rect.height, 0, 0, rect.width, rect.height);
		callback(canvas.toDataURL());
	};
	img.src = dataImage;
}



chrome.contextMenus.create({
	title : 'Take ' + WIDTH + 'x' + HEIGHT + ' screenshot', 
	contexts : ["page"],
 	onclick: screenshot
 });

chrome.contextMenus.create({
	title : "Select element to take picture of", 
	contexts : ["page"],
 	onclick: elementScreenshot
 });

chrome.runtime.onMessage.addListener(function(rect, sender, sendResponse) {
	var id = sender.tab.id;
	chrome.tabs.captureVisibleTab(null, {format:'png'}, function(dataUrl) {
		clipImage(rect, dataUrl, function(result) {
			chrome.tabs.create({url:result});
		});
	});
});