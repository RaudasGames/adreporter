function el(selector) {
	return document.querySelector(selector);
}

var dialogHtml = document.createElement("div");
dialogHtml.innerHTML = `
    <h3>Please tell us your issue with this ad</h3>
    <textarea id="ad-text" rows="5" col="40"></textarea>
    <div id="ad-email-input">Your email: <input type="text"/></div>
    
    <h5>Screenshot of ad</h5>
    <img id="screenshot" />
    <br>
    <div id="ad-button-div">
        <button class="big btn" id="ad-close">Cancel</button>
        <button class="big btn" id="ad-send">Send</button>
    </div>
`;

dialogHtml.setAttribute("id", "ad-dialog");

el("#play-page").appendChild(dialogHtml);

el("#ad-email-input input").addEventListener("input", function() {
    el('#ad-send').disabled = !/.+@/.test(el("#ad-email-input input").value);
});

el("#ad-close").addEventListener("click", function() {
	dialogHtml.style.display = "none";
});

el("#ad-send").addEventListener("click", function() {
	sendReport(el("#ad-text").value, el('#screenshot').src, el("#ad-email-input input").value);
	dialogHtml.style.display = "none";
});

var reportLeft = document.createElement("div");
reportLeft.innerHTML = "<strong>Report ad</strong>";
reportLeft.setAttribute("id", "report-link-left");
el("#draper-left").appendChild(reportLeft);

var reportRight = document.createElement("div");
reportRight.innerHTML = "<strong>Report ad</strong>";
reportRight.setAttribute("id", "report-link-right");
el("#draper-right").appendChild(reportRight);

function reportAd() {
	//Prevent dialog opening if it already is open
	if (dialogHtml.style.display !== "block") {
		chrome.runtime.sendMessage({ type: "picture" }, response => adDialog(response.imgData)); 
	}
}
reportLeft.addEventListener("click", reportAd);
reportRight.addEventListener("click", reportAd);

function adDialog(imgData) {
	dialogHtml.style.display = "block";

	el("#ad-dialog img").src = imgData;
	el("#ad-text").value = "";
	el("#ad-email-input input").value = "";
	el("#ad-send").disabled = true;
}

function sendReport(txt, img, email) {
    chrome.runtime.sendMessage({ type: "geturls" },
        function(response) {
            var dataToSend = {
                message: txt,
                image: img,
                requests: response.requests,
                email: email
            };

            var xmlhttp = new XMLHttpRequest();
            var url = "/api/adreport";
            xmlhttp.open("POST", url, true);
            xmlhttp.setRequestHeader("Content-type", "application/json");
            xmlhttp.send(JSON.stringify(dataToSend));
            alert('Thank you. We will look into this ad.');
        }
    );
}
