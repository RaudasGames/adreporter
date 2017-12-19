
var activeTarget;

var reportLeft="<div id=\"report-link-left\">Report ad</div>";
var reportRight="<div id=\"report-link-right\">Report ad</div>"
$('#draper-left').append(reportLeft); 
$('#draper-right').append(reportRight);

$('#report-link-left').on('click', function() {
	activeTarget = document.getElementById('draper-left');
	adDialog();
});

$('#report-link-right').on('click', function() {
	activeTarget = document.getElementById('draper-right');
	adDialog();
});

function adDialog() {
	document.body.innerHTML += '<dialog id=\"ad-dialog\"><p>Please tell us your issue with this ad</p><textarea id=\"ad-text\" rows=\"5\" col=\"40\"></textarea><br><div id=\"ad-button-div\"><button id=\"ad-close\">Cancel</button><button id=\"ad-send\">Send</button></div></dialog>';
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

	setTimeout(function() {
		chrome.runtime.sendMessage({
			left: rect.left, 
			top: rect.top, 
			width: rect.width, 
			height: rect.height
		});
	},200);
}
