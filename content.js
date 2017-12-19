
var activeTarget;

var reportLeft="<div id=\"report-link-left\">Report ad</div>";
var reportRight="<div id=\"report-link-right\">Report ad</div>"
$('#draper-left').append(reportLeft); 
$('#draper-right').append(reportRight);

$('#report-link-left').on('click', function() {
	activeTarget = document.getElementById('draper-left');
	takePicture();
	//activeTarget = $('#draper-left');
});

$('#report-link-right').on('click', function() {
	activeTarget = document.getElementById('draper-right');
	takePicture();
	//activeTarget = $('#draper-right');
});

function adDialog() {
	var dialogHTML = '<dialog id=\"ad-dialog\"><p>Please tell us your issue with this ad</p><textarea id=\"ad-text\" rows=\"5\" col=\"40\"></textarea><br><div id=\"ad-button-div\"><button id=\"ad-close\">Cancel</button><button id=\"ad-send\">Send</button></div>';
	dialogHTML += '<img src=' + imgSrc + ' /></dialog>';
	$('html').append(dialogHTML);
	var dialog = document.querySelector("dialog")
	$('#ad-close').on('click', function() {
		dialog.close();
	});
	$('#ad-send').on('click', function() {
		var adText = $('#ad-text').val();
		dialog.close();
	});
	dialog.showModal();
}


function takePicture() {
	if (!activeTarget) {
		return;
	}
	var rect = activeTarget.getBoundingClientRect();
	
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
		}, function(response) {
			imgSrc = response.imgData;
			adDialog();
		});
	},200);
}
