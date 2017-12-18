
var WIDTH = 1280;
var HEIGHT = 800;

function screenshot() {
	chrome.tabs.captureVisibleTab(null, {format:'png'}, function(dataUrl) {
		console.log(1);
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
	console.log(2);
	chrome.tabs.executeScript({
		file: "content.js"
	});
}

function clipImage(rect, dataImage, transparentBackground, rounded, callback) {
	console.log(3);
	var img = document.createElement('img');
	var canvas = document.createElement('canvas');

	console.log('RECT: ' + JSON.stringify(rect));
	console.log('ROUNDED: ' + rounded);
	canvas.width = rect.width;
	canvas.height = rect.height;
	img.src = dataImage;
	var ctx = canvas.getContext('2d');

	console.log('Clipping from ' + rect.left + ', ' + rect.top + ', width: ' + rect.width + ', height: ' + rect.height);
	ctx.drawImage(img, Math.ceil(rect.left), Math.ceil(rect.top), rect.width, rect.height, 0, 0, rect.width, rect.height)

	if (transparentBackground) {
		clearBackground(ctx, rect.width, rect.height);
	}
	var fullImage = canvas.toDataURL();
	console.log('ROUNDED '+  rounded + ', type: ' + typeof(rounded));
	if (!rounded) {
		callback(fullImage);
		return;
	}
	//Add rounded corners

	roundImage(rect, canvas, ctx, fullImage, rounded, callback);
}

function roundImage(rect, canvas, ctx, dataUrl, rounded, callback) {

	console.log('Adding rounded corner mask to image');
	canvas.width = rect.width;
	canvas.height = rect.height;

	var maskImageSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="' + rect.width + '" height="' + rect.height + '">' +
	        		'<rect width="100%" height="100%" rx="' + rounded + '" ry="' + rounded + '" fill="blue" /></svg>'   


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
			callback(canvas.toDataURL());
		}

		newImg.src = dataUrl;
	}
	console.log('Setting url on mask image: ' + maskUrl);
	maskImage.src = maskUrl;
}

function clearBackground(ctx, width, height) {
	var imgd = ctx.getImageData(0, 0, width, height),
    pix = imgd.data;

    var pixelsPerLine = width * 4;

    function isWhite(pos) {
    	var threshold = 230;
		var r = pix[pos],
		        g = pix[pos+1],
		        b = pix[pos+2];

	    // If its white then change it
	    return r >= threshold && g >= threshold && b >= threshold; 
    }

    function clearPixel(pos) {
    	pix[pos] = pix[pos+1] = pix[pos+2] = pix[pos+3] = 0;
    }
    
    for (var i=0; i < pix.length; i += pixelsPerLine) {
    	var n = i;
    	while (isWhite(n)) {
    		clearPixel(n);
 	    	n += 4;
    	}

		n = i-4;
    	while (n >= 0 && isWhite(n)) {
    		clearPixel(n);
	    	n -= 4;
    	}
    }

	ctx.putImageData(imgd, 0, 0);
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
	console.log(4);
	var id = sender.tab.id;
	chrome.tabs.captureVisibleTab(null, {format:'png'}, function(dataUrl) {
		clipImage(rect, dataUrl, !!rect.transparentBackground, rect.rounded, function(result) {
			chrome.tabs.create({url:result});
		});
	});
});