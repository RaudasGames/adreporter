
var activeTarget;

var reportLeft="<div id=\"report-link-left\">Report ad</div>";
var reportRight="<div id=\"report-link-right\">Report ad</div>"
$('#draper-left').append(reportLeft); 
$('#draper-right').append(reportRight);

$('#report-link-left').on('click', function() {
	activeTarget = document.getElementById('draper-left');
	adDialog();
	//activeTarget = $('#draper-left');
});

$('#report-link-right').on('click', function() {
	activeTarget = document.getElementById('draper-right');
	adDialog();
	//activeTarget = $('#draper-right');
});

function adDialog() {
	var dialogHTML = '<dialog id=\"ad-dialog\"><p>Please tell us your issue with this ad</p><textarea id=\"ad-text\" rows=\"5\" col=\"40\"></textarea><br><div id=\"ad-button-div\"><button id=\"ad-close\">Cancel</button><button id=\"ad-send\">Send</button></div></dialog>';
	$('html').append(dialogHTML);
	var dialog = document.querySelector("dialog")
	$('#ad-close').on('click', function() {
		dialog.close();
	});
	$('#ad-send').on('click', function() {
		var adText = $('#ad-text').val();
		dialog.close();
		takePicture();
	});
	dialog.showModal();
}


function takePicture() {
	if (!activeTarget) {
		return;
	}
	var rect = activeTarget.getBoundingClientRect();
	console.log("rect.top: ", rect.top, " rect.left: ", rect.left, " rect.width: ", rect.width, " rect.height: ", rect.height);
	setTimeout(function() {
		chrome.runtime.sendMessage({
			height: rect.height,
			left: rect.left, 
			top: rect.top, 
			width: rect.width
			/*left: activeTarget.offset().left,
			top: activeTarget.offset().top,
			width: activeTarget.width(),
			height: activeTarget.height()*/
		});
	},200);
}
