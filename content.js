var reportLeft="<div id=\"report-link-left\">Report ad</div>";
var reportRight="<div id=\"report-link-right\">Report ad</div>"
$('#draper-left').append(reportLeft); 
$('#draper-right').append(reportRight);

$('#report-link-left').on('click', function() {
	activeTarget = document.getElementById('draper-left');
	//activeTarget = $('#draper-left');
	takePicture();
});

$('#report-link-right').on('click', function() {
	activeTarget = document.getElementById('draper-right');
	//activeTarget = $('#draper-right');
	takePicture();
});

var activeTarget;

function takePicture() {
	if (!activeTarget) {
		return;
	}
	console.log("Taking picture of... " + activeTarget.id);
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