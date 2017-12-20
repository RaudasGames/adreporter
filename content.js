
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
	var dialogHTML = '<dialog id=\"ad-dialog\"><p>Please tell us your issue with this ad</p><textarea id=\"ad-text\" rows=\"5\" col=\"40\"></textarea><br>';
	dialogHTML += '<img src=' + imgSrc + ' /><br><div id=\"ad-button-div\"><button id=\"ad-close\">Cancel</button><button id=\"ad-send\">Send</button></div></dialog>';
	$('html').append(dialogHTML);
	var dialog = document.querySelector("dialog")
	$('#ad-close').on('click', function() {
		dialog.close();
	});
	$('#ad-send').on('click', function() {
		var adText = $('#ad-text').val();
		sendReport(adText, imgSrc);
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

function sendReport(txt, img) {
	setTimeout(function() {
		chrome.runtime.sendMessage({
			type: 'report',
			text: txt,
			image: img
		}, function(response) {

			var requestListString = "";
			var reqs = response.req;
			for (var i = 0; i < reqs.length; i++) {
				requestListString += (reqs[i] + '\n');
			}

			var dataToSend = {
				message: response.txt,
				image: response.img,
				requests: requestListString
			};

			/*$.post("http://localhost:5000/api/adreport", dataToSend, function(data, status) {
				console.log(status);
			});*/
			/*var xmlhttp = new XMLHttpRequest();

			var url = 'api/adreport';
			xmlhttp.open("POST", url, true);
			xmlhttp.setRequestHeader("Content-type", "application/json");
			xmlhttp.onreadystatechange = function () { //Call a function when the state changes.
				console.log("jamm");
				if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
					alert(xmlhttp.responseText);
				}
			};

			xmlhttp.send(dataToSend);*/
			$.ajax({
				type: "POST",
				url: 'api/adreport',
				data: JSON.stringify(dataToSend),
				contentType: "application/json",
				dataType: "json"
			});
		});
	}, 200);
}