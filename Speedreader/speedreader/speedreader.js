/*
Minhhue H. Khuu
May 20, 2015
SpeedReader javascript file.

The purpose of the speedreader.js file is to assign action listeners and event handlers.
This javascript file will allow the user to change the speed and size of the words in real time.
It will also allow the user to read any input text in the text area.
The stop button is disabled at the start.
When the start button is pressed, the start and text area is disabled; the stop button becomes enabled.
When the stop button is pressed, the stop button is disabled; the start and textarea becomes enabled.
*/
(function() {
	"use strict";
	
	/*
	The fields for the speedreader.js file
	@timer Timer is used to hold information of the current time event.
	@frame Frame is used to hold information of the words to be displayed.
	@readSpeed readSpeed is used to determine the rate the words are displayed, allows seamless change.
	*/
	var timer = null;
	var frame = null;
	var readSpeed = null;

	/*
	The anonymous function that is ran when the HTML file is finished loading.
	It serves to attach action listeners on specified HTML elements.
	*/
	window.onload = function() {
		document.getElementById("start").onclick = start;		// start button
		document.getElementById("stop").onclick = end;			// stop button
		
		var size = document.getElementsByName("size");			// size radio buttons
		for(var i = 0; i <size.length; i++) {
			size[i].onchange = setSize;
		}
		
		var speed = document.getElementsByName("wpm");			// speed select options
		for(var i = 0; i <speed.length; i++) {
			speed[i].onchange = setSpeed;
		}
		
		setSpeed();												// initialize speed field
	};
	
	/*
	The setSpeed() function will set the speed at which the words appear.
	If a timer event is going, it will end it and update it with the new speed.
	*/
	function setSpeed() {
		readSpeed = getSpeed();
		if(timer !== null) {
			clearTimeout(timer);
			timer = setInterval(display, readSpeed);
		}
	}
	
	/*
	The getSpeed() function will return the speed that is currently selected.
	@return The select reading speed.
	*/
	function getSpeed() {
		var speedArray = document.getElementsByName("wpm");
		return speedArray[0].value;
	}
	
	/*
	The setSize() function will set the text size for the speedreader.
	*/
	function setSize() {
		var textElements = document.getElementsByTagName("span");
		textElements[0].id = getSize();
	}
	
	/*
	The getSize() function returns the size selected from the radio buttons
	@return The string that corresponds to the size selected.
	*/
	function getSize() {
		var sizeArray = document.getElementsByName("size");
		for(var i = 0; i < sizeArray.length; i++) {
			if(sizeArray[i].checked) {
				return sizeArray[i].value;
			}
		}
	}

	/*
	The getText() function returns the non-white spaced text in the text area.
	@return An array that consists of every non-white spaced text.
	*/
	function setText() {
		var textElement = document.getElementById("text");
		var text = textElement.value;
		
		// trims white spaces from beginning and end
		// explodes the string into an array, delim by white spaces
		var textArray = text.trim().split(/\s+/);
		
		// create a new array that checks if last character in the string is
		// a punctuation (, . ! ? : ;), 
		// if so then copy the string without the last punctuation character TWICE.
		// if not just copy the whole string ONCE.
		var newArray = [];
		for(var i = 0; i < textArray.length; i++) {
			// temp variable to get last char of current string.
			var lc = textArray[i].charAt(textArray[i].length-1);
			if(lc == "," || lc == "." || lc == "!" || lc == "?" || lc == ":" || lc == ";") {
				newArray.push(textArray[i].slice(0,textArray[i].length-1));   
				newArray.push(textArray[i].slice(0,textArray[i].length-1)); 
			} else {
				newArray.push(textArray[i]);
			}
		}
		
		// flip array for popping.
		frame = newArray.reverse();
	}
	
	/*
	The display() function will display each element in the array frame and 
	after reading it, the read element will be removed.
	When there is nothing left to be read, blank will be displayed and timer will be reset;
	and the start button will be renabled / stop button disabled
	*/
	function display() {
		if(frame.length > 0) {
			document.getElementById(getSize()).innerHTML = frame.pop();
		} else {
			document.getElementById(getSize()).innerHTML = "";
			startDisabler(false);
			clearInterval(timer);
			timer = null;
		}
	}
	
	/*
	The start() function will start the speed reader.
	*/
	function start() {
		startDisabler(true);
		setText();
		if(timer === null) {
			timer = setInterval(display, readSpeed);
		} else {
			clearInterval(timer);
			timer = null;
		}
	}
	
	/*
	The end() function will end the speed reader.
	*/
	function end() {
		startDisabler(false);
		document.getElementById(getSize()).innerHTML = "";
		clearInterval(timer);
		timer = null;
	}
	
	/*
	The startDisabler() function will disable/enable three control elements.
	@param bool The boolean value to set the disable parameter.
	*/
	function startDisabler(bool) {
		document.getElementById("start").disabled = bool;
		document.getElementById("text").disabled = bool;
		document.getElementById("stop").disabled = !bool;
	}
	
})();