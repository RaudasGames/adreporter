chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	if (request.type === "picture") {
		chrome.tabs.captureVisibleTab(null, { format: "png" }, dataUrl => sendResponse({imgData: dataUrl}));
	} else if (request.type === "geturls") {
		sendResponse({requests:activeTabs[sender.tab.id]});
	}
	return true;
});

var requests = [];

var activeTabs = {}; //Mapping of tabId => [list of requests]
var ourDomains = /^https:\/\/cardgames\.io\/.*/;

function logURL(requestDetails) {
    var tabId = requestDetails.tabId;

    console.log('url ' + requestDetails.url + ' Matches: ' + requestDetails.url.match(ourDomains));
    if (requestDetails.type === 'main_frame') {
        if (requestDetails.url.match(ourDomains)) {
            activeTabs[tabId] = []; //Reset on each page load... 
        } else {
            delete activeTabs[tabId];
        }
    } else if (typeof activeTabs[tabId] !== 'undefined') {
        //Any other requests inside a cardgames.io page...
        if (!requestDetails.url.match(ourDomains)) {
            activeTabs[tabId].push(requestDetails.url);
        } 
    }
}

chrome.webRequest.onBeforeRequest.addListener(logURL, { urls: ["<all_urls>"] });

chrome.webNavigation.onBeforeNavigate.addListener(function(details) {
	if (details.frameId === 0 && details.url.match(".*cardgames.io.*")) {
		requests = [];
	}
});
