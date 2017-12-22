
var reportLeft = document.createElement('div');
reportLeft.innerHTML = '<strong>Report ad</strong>';
reportLeft.setAttribute('id', 'report-link-left');
el('#draper-left').appendChild(reportLeft);

var reportRight = document.createElement('div');
reportRight.innerHTML = '<strong>Report ad</strong>';
reportRight.setAttribute('id', 'report-link-right');
el('#draper-right').appendChild(reportRight);


reportLeft.addEventListener('click', function() {
	imgSrc = "";
	takePicture();
});

reportRight.addEventListener('click', function() {
	imgSrc = "";
	takePicture();
});

function adDialog(imgSrc) {
	var dialogHtml = document.createElement('dialog');
	dialogHtml.innerHTML = '<p>Please tell us your issue with this ad</p><textarea id=\"ad-text\" rows=\"5\" col=\"40\"></textarea><br><div id=\"ad-email-input\">Your email: <input type=\"text\"/></div>';
	dialogHtml.innerHTML += '<p>Screenshot of ad</p><img /><br><div id=\"ad-button-div\"><button id=\"ad-close\">Cancel</button><button id=\"ad-send\">Send</button></div></dialog>';
	dialogHtml.setAttribute('id', 'ad-dialog');
	el('#play-page').appendChild(dialogHtml);
	//dialogHtml.style.visibility = 'hidden';


	/*var left;
	setTimeout(function() {
		var boardPos = document.getElementById('board').getBoundingClientRect();
		var adDialogWidth = dialogHtml.getBoundingClientRect().width;
		left = boardPos.left + (boardPos.width / 2) - (adDialogWidth / 2) + 5;
		dialogHtml.style.left = left + 'px';
		dialogHtml.style.visibility = 'visible';
	}, 2);*/

	el('#ad-dialog img').setAttribute('src', imgSrc);
	el('#ad-text').value = '';
	el('#ad-email-input input').value = '';
	el('#ad-send').disabled = true;

	setTimeout(function() {
 		var dialogHeight = el('#ad-text').getBoundingClientRect().height + el('#ad-dialog img').getBoundingClientRect().height + 170;
			dialogHtml.style.height = dialogHeight + 'px';
		}, 10);
	
	
	el('#ad-email-input input').addEventListener('input', function () {
		var testEmail = /.+@.+\..+/;
		var currEmail = el('#ad-email-input input').value;
		if (testEmail.test(currEmail)) {
			el('#ad-send').disabled = false;
		}
		else {
			el('#ad-send').disabled = true;
		}
	});

	var dialog = document.querySelector("dialog");
	
	el('#ad-close').addEventListener('click', function() {
		dialog.close();
	});
	el('#ad-send').addEventListener('click', function() {
		var adText = el('#ad-text').value;
		var email = el('#ad-email-input input').value;
		sendReport(adText, imgSrc, email);
		dialog.close();
	});
	dialog.showModal();
}


function takePicture() {
	if (!activeTarget) {
		return;
	}

	setTimeout(function() {
		chrome.runtime.sendMessage({
			type: 'picture'
		}, function(response) {
			var imgSrc = response.imgData;
			adDialog(imgSrc);
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
			
			var dataToSend = {
				message: response.txt,
				image: response.img,
				requests: response.req,
				email: response.email
			};

			var xmlhttp = new XMLHttpRequest();
 
 			var url = '/api/adreport';
 			xmlhttp.open("POST", url, true);
 			xmlhttp.setRequestHeader("Content-type", "application/json");
			xmlhttp.send(JSON.stringify(dataToSend));
		});
	}, 200);
}

function el(selector) { 
	return document.querySelector(selector); 
}
