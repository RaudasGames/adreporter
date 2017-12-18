var reportLeft="<div id=\"report-link-left\">Report ad</div>";
var reportRight="<div id=\"report-link-right\">Report ad</div>"
$('#draper-left').append(reportLeft); 
$('#draper-right').append(reportRight);

$('#report-link-left').on('click', function() {
	activeTarget = document.getElementById('draper-left');
	takePicture();
});

$('#report-link-right').on('click', function() {
	activeTarget = document.getElementById('draper-right');
	takePicture();
});

var activeTarget;

function takePicture() {
	if (!activeTarget) {
		return;
	}

	console.log("Taking picture of... " + activeTarget.id);

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