
var WIDTH = 1280;
var HEIGHT = 800;

function screenshot() {
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


function clipImage(rect, dataImage, transparentBackground, rounded, callback) {
	var canvas = document.createElement('canvas');
	var canvasImg = new Image();

	console.log('RECT: ' + JSON.stringify(rect));
	console.log('ROUNDED: ' + rounded);
	//canvas.width = rect.width;
	//canvas.height = rect.height;
	var ctx = canvas.getContext('2d');

	/*canvasImg.onload = function() {
		canvasImg = this;
		//ctx.drawImage(canvasImg, 0,0, rect.width, rect.height, 0, 0, rect.width, rect.height);
		ctx.drawImage(canvasImg, Math.ceil(rect.left), Math.ceil(rect.top), rect.width, rect.height, 0, 0, rect.width, rect.height);
		callback(canvas.toDataURL("image/png"));

	};*/

	canvasImg.src = dataImage;

	callback(dataImage);

	console.log('Clipping from ' + rect.left + ', ' + rect.top + ', width: ' + rect.width + ', height: ' + rect.height);
	//ctx.drawImage(img, Math.ceil(rect.left), Math.ceil(rect.top), rect.width, rect.height, 0, 0, rect.width, rect.height)


	//var fullImage = canvas.toDataURL();

	//Add rounded corners

	//roundImage(rect, canvas, ctx, fullImage, rounded, callback);
}

function roundImage(rect, canvas, ctx, dataUrl, rounded, callback) {

	console.log('Adding rounded corner mask to image');
	canvas.width = rect.width;
	canvas.height = rect.height;

	var maskImageSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="' + rect.width + '" height="' + rect.height + '">' +
	'<rect width="100%" height="100%" rx="' + rounded + '" ry="' + rounded + '" fill="blue" /></svg>';   


	var DOMURL = window.URL || window.webkitURL || window;

	var maskImage = new Image();
	var svg = new Blob([maskImageSvg], {type: 'image/svg+xml'});
	var maskUrl = DOMURL.createObjectURL(svg);

	maskImage.onload = function() {
		console.log('MASK LOADED');
		ctx.drawImage(maskImage, 0, 0, rect.width, rect.height);

		ctx.globalCompositeOperation = 'source-atop';

		var newImg = new Image();

		newImg.onload = function() {
			console.log('NEW IMAGE LOADED');
			ctx.drawImage(newImg,0,0, rect.width, rect.height);
			callback(canvas.toDataURL("image/png"));
		}

		newImg.src = dataUrl;
		//callback(canvas.toDataURL("image/png"));
	}
	console.log('Setting url on mask image: ' + maskUrl);
	maskImage.src = maskUrl;
}


chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	
	var id = sender.tab.id;
	console.log(id);
	if (request.type === 'picture') {
		chrome.tabs.captureVisibleTab(null, {format:'png'}, function(dataUrl) {
			clipImage(request, dataUrl, !!request.transparentBackground, false, function(result) {
				//chrome.tabs.create({url:result});
				sendResponse({imgData:result});
			});
		});
	} else if (request.type === 'report') {
		var dataToSend = {
			txt: request.text,
			img: request.image,
			req: requests,
			email: request.email
		};
		sendResponse(dataToSend);
	} else {
		console.log("wtf");
	}
	
	return true;
});

var requests = [];
var currUrl = "";

function logURL(requestDetails) {
	chrome.tabs.query({
		active: true,
		lastFocusedWindow: true
	}, function(tabs) {
		if (tabs) {
			currUrl = tabs[0].url;
			var reqUrl = requestDetails.url;
			if (!reqUrl.match('.*cardgames\.io.*') && !reqUrl.match('.*cloudfront.*') && currUrl.match('.*cardgames\.io.*')) {
				//console.log(reqUrl);
				requests.push(reqUrl);
			}
		} else {
			console.log("wtf");
		}
	});
}

chrome.webRequest.onBeforeRequest.addListener(
	logURL,
	{urls: ["<all_urls>"]}
);

chrome.webNavigation.onBeforeNavigate.addListener(function(details) {
	if (details.frameId === 0 && details.url.match('.*cardgames\.io.*')) {
		requests = [];
	}
});