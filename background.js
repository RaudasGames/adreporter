
function clipImage(dataImage, callback) {
	var canvas = document.createElement('canvas');
	var canvasImg = new Image();

	var ctx = canvas.getContext('2d');

	canvasImg.src = dataImage;

	callback(dataImage);
}


chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	
	var id = sender.tab.id;
	if (request.type === 'picture') {
		chrome.tabs.captureVisibleTab(null, {format:'png'}, function(dataUrl) {
			clipImage(dataUrl, function(result) {
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
			if (!reqUrl.match('https://cardgames\.io.*') && !reqUrl.match('http://dev.cardgames.io.*') && !reqUrl.match('.*cloudfront.*') && currUrl.match('.*cardgames\.io.*')) {
				if (tabs[0].id === requestDetails.tabId) {
					requests.push(reqUrl);
				}
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