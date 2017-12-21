
var activeTarget;
var imgSrc = "";

var reportLeft="<div id=\"report-link-left\"><strong>Report ad</strong></div>";
var reportRight="<div id=\"report-link-right\"><strong>Report ad</strong></div>"
$('#draper-left').append(reportLeft); 
$('#draper-right').append(reportRight);

$('#report-link-left').on('click', function() {
	imgSrc = "";
	activeTarget = document.getElementById('draper-left');
	takePicture();
	//activeTarget = $('#draper-left');
});

$('#report-link-right').on('click', function() {
	imgSrc = "";
	activeTarget = document.getElementById('draper-right');
	takePicture();
	//activeTarget = $('#draper-right');
});

function adDialog() {
	var dialogHTML = '<dialog id=\"ad-dialog\"><p>Please tell us your issue with this ad</p><textarea id=\"ad-text\" rows=\"5\" col=\"40\"></textarea><br><div id=\"ad-email-input\">Your email: <input type=\"text\"/></div><br>';
	dialogHTML += '<img /><br><div id=\"ad-button-div\"><button id=\"ad-close\">Cancel</button><button id=\"ad-send\">Send</button></div></dialog>';
	$('html').append(dialogHTML);
	var left = $('#board').position().left + ($('#board').width() / 2) - ($('#ad-dialog').width() / 2) + 5;
	$('#ad-dialog').css("left", left + "px");
	$('#ad-dialog img').attr("src", imgSrc);
	$('#ad-text').val('');
	$('#ad-email-input input').val('');
	$('#ad-send').prop("disabled", true);

	setTimeout(function() {
		var dialogHeight = $('#ad-text').height() + $('#ad-dialog img').height() + 150;
			$('#ad-dialog').css('height', dialogHeight + "px");
		}, 10);
	

	$('#ad-email-input input').on('input', function() {
		var testEmail = /^[A-Z0-9._%+-]+@([A-Z0-9-]+\.)+[A-Z]{2,4}$/i;
		var currEmail = $('#ad-email-input input').val();
		if (testEmail.test(currEmail)) {
			$('#ad-send').prop("disabled", false);
		}
		else {
			$('#ad-send').prop("disabled", true);
		}
	});

	var dialog = document.querySelector("dialog")
	$('#ad-close').off().on('click', function() {
		dialog.close();
	});
	$('#ad-send').off().on('click', function() {
		var adText = $('#ad-text').val();
		var email = $('#ad-email-input input').val();
		sendReport(adText, imgSrc, email);
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
			type: 'picture',
			height: rect.height,
			left: rect.left, 
			top: rect.top, 
			width: rect.width
		}, function(response) {
			imgSrc = response.imgData;
			adDialog();
		});
	},200);
}

function sendReport(txt, img, email) {
	setTimeout(function() {
		chrome.runtime.sendMessage({
			type: 'report',
			text: txt,
			image: img,
			email: email
		}, function(response) {
			var requestListString = "";
			var reqs = response.req;
			for (var i = 0; i < reqs.length; i++) {
				requestListString += (reqs[i] + ' <br><br>');
			}

			var dataToSend = {
				message: response.txt,
				image: response.img,
				requests: requestListString,
				email: response.email
			};

			var xmlhttp = new XMLHttpRequest();
			$.ajax({
				type: "POST",
				url: 'http://localhost:5000/api/adreport',
				data: JSON.stringify(dataToSend),
				contentType: "application/json",
				dataType: "json"
			});
		});
	}, 200);
}