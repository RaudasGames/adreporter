console.log('The next element you click on will get its picture taken!');

var activeTarget;

function mousedown(e) {
	if (!activeTarget) {
		return;
	}
	e.preventDefault();
	takePicture();
}

function takePicture() {
	if (!activeTarget) {
		return;
	}

	var rect = activeTarget.getBoundingClientRect();

	clearStyle(activeTarget);
	var rounded = activeTarget.getAttribute('data-elementSnap-rounded');
	if (rounded === null || rounded == 'null') {
		rounded = false;
	}
	setTimeout(function() {
		chrome.runtime.sendMessage({
			left: rect.left, 
			top: rect.top, 
			width: rect.width, 
			height: rect.height, 
			rounded: rounded,
			transparentBackground: activeTarget.hasAttribute('data-transparent-background')
		});
		document.removeEventListener('mousedown', mousedown);
		document.removeEventListener('mouseover', mouseOver);
		document.removeEventListener('keydown', keydown);
	},200);
}

function keydown(e) {
	var ENTER = 13, UP = 38;

	if (activeTarget && e.keyCode == UP) {
		highlight(activeTarget.parentNode);
	}
	if (activeTarget && e.keyCode == ENTER) {
		takePicture();
	}

}
function highlight(element) {
	if (activeTarget != element) {
		clearStyle(activeTarget);
	}
	activeTarget = element;

	if (activeTarget.style.boxShadow) {
		activeTarget.setAttribute('data-elementSnap-boxShadow', activeTarget.style.boxShadow);
	}
	if (activeTarget.style.cursor) {
		activeTarget.setAttribute('data-elementSnap-cursor', activeTarget.style.boxShadow);
	}

	activeTarget.style.boxShadow = 'red 0 0 20px';
	activeTarget.style.cursor = 'cell';
}

function mouseOver(e) {
	if (e.target == document.body) return;
	highlight(e.target);
}

function clearStyle(element) {
	if (!element) {
		return;
	}
	var oldShadow = element.getAttribute('data-elementSnap-boxShadow');

	if (oldShadow) {
		element.style.boxShadow = oldShadow;
		element.removeAttribute('data-elementSnap-boxShadow');
	} else {
		element.style.boxShadow = 'none';
	}
	
	var oldCursor = element.getAttribute('data-elementSnap-cursor');

	if (oldShadow) {
		element.style.cursor = oldCursor;
		element.removeAttribute('data-elementSnap-cursor');
	} else {
		element.style.cursor = 'default';
	}
}

//Let's see if we have triggers

var triggers = document.querySelectorAll('[data-elementSnap]');

if (triggers.length > 0) {
	for (var i=0; i < triggers.length; i++) {
		triggers[i].addEventListener('click', function(ev) {
			activeTarget = document.getElementById(ev.target.getAttribute('data-elementSnap'));
			if (activeTarget) {
					activeTarget.setAttribute('data-elementSnap-rounded', ev.target.getAttribute('data-elementSnap-rounded'));
			}
			takePicture();
			
		});
	}
} else {
	document.addEventListener('mousedown', mousedown);
	document.addEventListener('mouseover', mouseOver);
	document.addEventListener('keydown', keydown)
}


