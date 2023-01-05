const noteTitle = document.querySelector(".note__title");
const noteText = document.querySelector(".note__textarea");
const noteBody = document.querySelector(".note");
const aside1AllNotes = document.querySelector(".aside1__all-notes");
const aside2Menu = document.querySelector(".aside2__menu");
const bodyHTML = document.querySelector("body");
const textAlignMenu = aside2Menu.querySelector("#buttons-group__text-align");
const textAlignButton = aside2Menu.querySelector("#button__text-align");
const colorButton = aside2Menu.querySelector("#button__color");
const colorMenu = aside2Menu.querySelector("#buttons-group__color");
const styles = document.querySelector("#styles");
const burgerAllNotesButton = document.querySelector(".header__burger-all-notes-button");
const aside1 = document.querySelector(".aside1");
const fontStylesMenu = aside2Menu.querySelector("#buttons-group__font-styles");
const fontStylesButton = aside2Menu.querySelector("#button__font-styles");
const fontSizeMenu = aside2Menu.querySelector("#range__font-size");
const fontSizeButton = aside2Menu.querySelector("#button__font-size");
const rangeFontSize = fontSizeMenu.querySelector("#range-font-size");
const rangeNumberFontSize = fontSizeMenu.querySelector(".aside2__range-number");

noteTitle.value = "";
noteText.value = "";
let currentNoteId;
let currentAlign = {text: "left", title: "left",};
let currentFocusTextarea = "text";
let currentColor = "#FFFFFF";
let initialPoint;
let finalPoint;
let currentFontStyles = {title: {bold: false, italic: false, underline: false,}, text: {bold: false, italic: false, underline: false,},};
let currentFontSize = {title: 20, text: 16};


if (localStorage.getItem("notes") == null) {
	localStorage.setItem("notes", JSON.stringify([]));
}
let note = localStorage.getItem("notes");
note = JSON.parse(note);



function errorButton (idButton, errorClass) {
	const button = document.querySelector(`#${idButton}`);
	button.classList.add(errorClass);
	function removeClass () {
		button.classList.remove(errorClass);
	};
	setTimeout(removeClass, 1000);
}



function checkEmptyValue (idButton, errorClass) {
	let title = String(noteTitle.value);
	let text = String(noteText.value);
	if (title == "" && text == "") {
		noteBody.classList.add("_error");
		errorButton (idButton, errorClass);
		function removeError() {
			noteBody.classList.remove('_error');
		};
		setTimeout(removeError, 1000);
		return "empty";
	} else {
		return "notEmpty"
	}
}



function saveNewNoteOrSaveOldNote () {
	closeTextAlignMenu();
	closeColorMenu();
	closeFontStylesMenu();
	closeFontSizeMenu();
	if (currentNoteId != undefined) {
		saveOldNote("button__save", "_error");
	} else {
		saveNewNote("button__save", "_error");
	}
}



function saveOldNote(idButton, errorClass) {
	if (checkEmptyValue(idButton, errorClass) == "notEmpty") {
		let title = String(noteTitle.value);
		let text = String(noteText.value);

		note[currentNoteId] = {title: title, text: text, settings: {align: currentAlign, color: currentColor, fontStyles: currentFontStyles, fontSize: currentFontSize,},};
		localStorage.setItem("notes", JSON.stringify(note));
		refreshSavedNotes();
	}
}



function saveNewNote (idButton, errorClass) {
	if (checkEmptyValue(idButton, errorClass) == "notEmpty") {
		let title = String(noteTitle.value);
		let text = String(noteText.value);
		let minTitle;

		if (title == "") {
			minTitle = cutTitle(text, 18, "..");
		} else {
			minTitle = cutTitle(title, 18, "..");
		}

		if (note.length < 1) {
			aside1AllNotes.innerHTML = "";
		}


		note.push({title: title, text: text, settings: {align: currentAlign, color: currentColor, fontStyles: currentFontStyles, fontSize: currentFontSize,},});
		localStorage.setItem("notes", JSON.stringify(note));
		
		aside1AllNotes.insertAdjacentHTML("afterbegin", `<li class="aside1__all-notes-item">
															<button class="aside1__button"  id="note_${note.length-1}"><svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M21 22H3V2h12v2h2v2h2v2h2v14zM17 6h-2v2h2V6zM5 4v16h14V10h-6V4H5zm8 12H7v2h6v-2zm-6-4h10v2H7v-2zm4-4H7v2h4V8z" /></svg><span>${minTitle}</span></button>
	 													</li>`);
		currentNoteId = note.length-1;

		setColorStyles(currentNoteId);
		markCurrentNote();
	}
}



function showSavedNotes () {
	if (note.length > 0) {
		let noteLength = note.length - 1;
		for (i = 0; i <= noteLength; i++) {
			let minTitle;
			if (note[i].title == "") {
				minTitle = cutTitle(note[i].text, 18, "..");
			} else {
				minTitle = cutTitle(note[i].title, 18, "..");
			}
			aside1AllNotes.insertAdjacentHTML("afterbegin", `<li class="aside1__all-notes-item">
																<button class="aside1__button" id="note_${i}"><svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M21 22H3V2h12v2h2v2h2v2h2v14zM17 6h-2v2h2V6zM5 4v16h14V10h-6V4H5zm8 12H7v2h6v-2zm-6-4h10v2H7v-2zm4-4H7v2h4V8z" /></svg><span>${minTitle}</span></button>
		 													</li>`);
			setColorStyles(i);
		}
	} else {
		aside1AllNotes.innerHTML = "<span class='aside1__empty'>You don't have any notes yet.</span>";
	}
}



function refreshSavedNotes () {
	aside1AllNotes.innerHTML = "";
	styles.innerHTML = "";
	showSavedNotes();
	markCurrentNote();
}



function addNewNote() {
	closeTextAlignMenu();
	closeColorMenu();
	closeFontStylesMenu();
	closeFontSizeMenu();

	let create;
	let title = String(noteTitle.value);
	let text = String(noteText.value);
	if (title == "" && text == "") {
		if (currentNoteId != undefined) {
			saveOldNote("button__new-file", "_error");
		} else {
			create = true;
		}
	} else {
		if (currentNoteId != undefined) {
			saveOldNote("button__new-file", "_error");
			create = true;
		} else {
			saveNewNote("button__new-file", "_error");
			create = true;
		}
	}
	
	if (create == true) {
		noteTitle.value = "";
		noteText.value = "";
		currentNoteId = undefined;
		currentAlign = {text: "left", title: "left",};
		currentFontStyles = {title: {bold: false, italic: false, underline: false,}, text: {bold: false, italic: false, underline: false,},};
		currentFontSize = {title: 20, text: 16};
		setCurrentFontStyles();
		setCurrentAlign("title");
		setCurrentAlign("text");
		setCurrentFontSize();
		refreshActiveButtonInAlignMenu();
		refreshActiveButtonInFontStylesMenu();
		refreshRangeInFontSizeMenu();
		titleHeightLimit("off");
		markCurrentNote();
		currentColor = "#FFFFFF";
		setColor("new");
		noteText.focus();
	}
}



function aside2MenuButtons(event) {
	let buttonId;

	buttonId = findIdWithSVG(event.target, "button__");

	if (buttonId != undefined) {
		if (buttonId == "button__save") {saveNewNoteOrSaveOldNote();}
		else if (buttonId == "button__new-file") {addNewNote();}
		else if (buttonId == "button__trash") {popUp("Delete note", "This note will be permanently deleted", {text: "Cancel", function(){errorButton ("button__trash", "_error")}}, {text: "Delete", function(){deleteNote(); errorButton("button__trash", "_successful")}}, function(){errorButton ("button__trash", "_error");});}
		else if (buttonId == "button__text-align") {openAndCloseAlignMenu();}
		else if (buttonId == "button__color") {openAndCloseColorMenu();}
		else if (buttonId == "button__font-styles") {openAndCloseFontStylesMenu();}
		else if (buttonId == "button__font-size") {openAndCloseFontSizeMenu();}
	}
}



function cutTitle (title, maxLength, endSymbol) {
	if (title.length > maxLength) {
		let textLength = maxLength - endSymbol.length;
		let minTitle = title.substr(0, textLength) + endSymbol;
		return minTitle;
	}
	return title;
}



function importNoteIntoEditor (event) {
	let noteId;

	noteId = findIdWithSVG(event.target, "note_");

	if (noteId != undefined) {
		closeTextAlignMenu();
		closeColorMenu();
		closeFontStylesMenu();
		closeFontSizeMenu();
		let notePositionInArray = Number(noteId.substr(5));
		currentNoteId = notePositionInArray;
		noteTitle.value = note[notePositionInArray].title;
		noteText.value = note[notePositionInArray].text;
		currentAlign = {...note[notePositionInArray].settings.align};
		currentFontStyles = {...note[notePositionInArray].settings.fontStyles, title: {...note[notePositionInArray].settings.fontStyles.title}, text: {...note[notePositionInArray].settings.fontStyles.text}};
		currentFontSize = {...note[notePositionInArray].settings.fontSize};
		setCurrentAlign("title");
		setCurrentAlign("text");
		setCurrentFontStyles();
		setCurrentFontSize();
		refreshActiveButtonInAlignMenu();
		refreshActiveButtonInColorMenu();
		refreshActiveButtonInFontStylesMenu();
		refreshRangeInFontSizeMenu();
		titleHeightLimit("on");
		markCurrentNote();
		setColor("import");
		titleHeightLimit("on");
	}
}



function deleteNote() {
	if (currentNoteId != undefined) {
		note.splice(currentNoteId, 1);
		localStorage.setItem("notes", JSON.stringify(note));

		noteTitle.value = "";
		noteText.value = "";
		currentNoteId = undefined;
		currentAlign = {text: "left", title: "left",};
		currentFontStyles = {title: {bold: false, italic: false, underline: false,}, text: {bold: false, italic: false, underline: false,},};
		currentFontSize = {title: 20, text: 16};
		setCurrentFontStyles();
		setCurrentAlign("title");
		setCurrentAlign("text");
		setCurrentFontSize();
		refreshActiveButtonInAlignMenu();
		refreshActiveButtonInFontStylesMenu();
		refreshRangeInFontSizeMenu();
		titleHeightLimit("off");
		currentColor = "#FFFFFF";
		setColor("new");
		refreshSavedNotes();
	} else {
		noteTitle.value = "";
		noteText.value = "";
		currentNoteId = undefined;
		currentAlign = {text: "left", title: "left",};
		currentFontStyles = {title: {bold: false, italic: false, underline: false,}, text: {bold: false, italic: false, underline: false,},};
		currentFontSize = {title: 20, text: 16};
		setCurrentFontStyles();
		setCurrentFontSize();
		setCurrentAlign("title");
		setCurrentAlign("text");
		refreshActiveButtonInAlignMenu();
		refreshActiveButtonInFontStylesMenu();
		refreshRangeInFontSizeMenu();
		titleHeightLimit("off");
		currentColor = "#FFFFFF";
		setColor("new");
	}
}



function markCurrentNote() {
	if (currentNoteId != undefined) {
		let activeNote = aside1AllNotes.querySelector("._active");
		let currentNoteButton = aside1AllNotes.querySelector(`#note_${currentNoteId}`);

		if (activeNote == null) {
			currentNoteButton.classList.add("_active");
			setColor("new");
		} else {
			activeNote.classList.remove("_active");
			activeNote.style.cssText = '';
			const svgIcon = activeNote.querySelector("svg");
			svgIcon.style.fill = '';
			currentNoteButton.classList.add("_active");
			setColor("new");
		}
	} else {
		let activeNote = aside1AllNotes.querySelector("._active");
		if (activeNote != null) {
			refreshSavedNotes();
		} 
	}
}



// popUp(title, text, {text: button1, function() {function()}, {text: button2, function() {function()}},);
function popUp(title, text, button1Object, button2Object, popUpEmptyPlaceFunction) {
	closeTextAlignMenu();
	closeColorMenu();
	closeFontStylesMenu();
	closeFontSizeMenu();

	const popUpAllElements = document.querySelector(".pop-up");
	const popUpBody = document.querySelector(".pop-up__body");
	const popUpTitle = document.querySelector(".pop-up__title");
	const popUpText = document.querySelector(".pop-up__text");
	const popUpButton1 = popUpAllElements.querySelector("#pop-up__button1");
	const popUpButton2 = popUpAllElements.querySelector("#pop-up__button2");

	popUpTitle.innerHTML = title;
	popUpText.innerHTML = text;
	popUpButton1.innerHTML = button1Object.text;
	popUpButton2.innerHTML = button2Object.text;

	popUpAllElements.style.top = `${window.pageYOffset}px`;
	popUpAllElements.style.visibility = "visible";
	popUpAllElements.style.opacity = 1;

	popUpBody.style.opacity = 1;
	popUpBody.style.transform = "scale(1, 1)";


	function closePopUp() {
		popUpAllElements.style.visibility = "";
		popUpAllElements.style.opacity = "";

		popUpBody.removeAttribute("style");
	}


	popUpAllElements.addEventListener("click", function (event) {
		if (event.target.getAttribute("class") == "pop-up__button") {
			if (event.target.id == "pop-up__button1") {
				button1Object.function();
				closePopUp();
			} else {
				button2Object.function();
				closePopUp();
			}	
		} else if (event.target.getAttribute("class") == "pop-up") {
			popUpEmptyPlaceFunction();
			closePopUp();
		}
	});
}



function setVH() {
	let vh100 = window.innerHeight;
	let vh1 = window.innerHeight * 0.01;
	document.documentElement.style.setProperty('--vh100', `${vh100}px`);
	document.documentElement.style.setProperty('--vh1', `${vh1}px`);
};



function openAndCloseAlignMenu() {
	closeColorMenu();
	closeFontStylesMenu();
	closeFontSizeMenu();

	textAlignMenu.classList.toggle("_open-text-align");
	textAlignButton.classList.toggle("_active");

	refreshActiveButtonInAlignMenu();

	textAlignMenu.addEventListener("click", function (event) {
		let clickedButton = findIdWithSVG(event.target, "button__text-align");
		
		if (clickedButton != undefined) {
			clickedButton = clickedButton.slice(19);

			currentAlign[currentFocusTextarea] = clickedButton;

			refreshActiveButtonInAlignMenu();	
			closeTextAlignMenu()	
		}
	});
}



function refreshActiveButtonInAlignMenu() {
	const oldActiveButton = textAlignMenu.querySelector("._active");
	if (oldActiveButton != undefined) {
		oldActiveButton.classList.remove("_active");
	}

	activeButtonId = setCurrentAlign(currentFocusTextarea);
	const activeButton = aside2Menu.querySelector(activeButtonId);
	activeButton.classList.add("_active");
}



function setCurrentAlign(value) {

	let element;

	if (value == "title") {
		element = noteTitle;
	} else if (value == "text") {
		element = noteText;
	} else {
		return;
	}

	if (currentAlign[value] == "left") {
			element.style.textAlign = "left";
			textAlignButton.innerHTML = `<svg viewBox="0 0 8 8" xmlns="http://www.w3.org/2000/svg"><path d="M0 0v1h8v-1h-8zm0 2v1h6v-1h-6zm0 2v1h8v-1h-8zm0 2v1h6v-1h-6z" /></svg>`;
			return "#button__text-align-left";
		} else if (currentAlign[value] == "center") {
			element.style.textAlign = "center";
			textAlignButton.innerHTML = `<svg viewBox="0 0 8 8" xmlns="http://www.w3.org/2000/svg"><path d="M0 0v1h8v-1h-8zm1 2v1h6v-1h-6zm-1 2v1h8v-1h-8zm1 2v1h6v-1h-6z" /></svg>`;
			return "#button__text-align-center";
		} else if (currentAlign[value] == "right") {
			element.style.textAlign = "right";
			textAlignButton.innerHTML = `<svg viewBox="0 0 8 8" xmlns="http://www.w3.org/2000/svg"><path d="M0 0v1h8v-1h-8zm2 2v1h6v-1h-6zm-2 2v1h8v-1h-8zm2 2v1h6v-1h-6z" /></svg>`;
			return "#button__text-align-right";
		} else if (currentAlign[value] == "justify") {
			element.style.textAlign = "justify";
			textAlignButton.innerHTML = `<svg viewBox="0 0 8 8" xmlns="http://www.w3.org/2000/svg"><path d="M0 0v1h8v-1h-8zm0 2v1h8v-1h-6zm-0 2v1h8v-1h-8zm0 2v1h8v-1h-6z" /></svg>`;
			return "#button__text-align-justify";
		} else {
			currentAlign[value] = "left";
			element.style.textAlign = "left";
			return "#button__text-align-left";
		}
}



function closeTextAlignMenu() {
	textAlignMenu.classList.remove("_open-text-align");
	textAlignButton.classList.remove("_active");
}



function findIdWithSVG(element, includesText) {
	if (element.id.includes(includesText)) {
		return element.id;
	} else if (element.parentNode.id.includes(includesText)) {
		return element.parentNode.id;
	} else if (element.parentNode.parentNode.id.includes(includesText)) {
		return element.parentNode.parentNode.id;
	}
}



// import || new
function setColor(value) {
	let color;
	if (value == "import") {
		color = note[currentNoteId].settings.color;
		currentColor = color;
	} else if (value == "new") {
		color = currentColor;
	}
	const colorIcon = aside2Menu.querySelector(".aside2__color-icon");

	noteTitle.style.color = color;
	noteBody.querySelector(".note__line").style.backgroundColor = color;
	noteText.style.color = color;
	colorIcon.style.backgroundColor = color;

	const activeNoteColor = aside1AllNotes.querySelector("._active");
	if (activeNoteColor != undefined) {
		const svgIcon = activeNoteColor.querySelector("svg");
		activeNoteColor.style.cssText = `color: ${color}; border: 1px solid ${color}; background-color: #333;`;
		svgIcon.style.fill = color;
	}
}



function setColorStyles(i) {
	let iColor = note[i].settings.color;
	styles.innerHTML += `#note_${i}{background-color: ${iColor}; border: 1px solid ${iColor}} #note_${i}:hover{background-color: #333; color: ${iColor};} #note_${i}:hover svg{fill: ${iColor}}\n`;
}



function openAndCloseColorMenu() {
	closeTextAlignMenu();
	closeFontStylesMenu();
	closeFontSizeMenu();

	colorMenu.classList.toggle("_open-color");
	colorButton.classList.toggle("_active");

	refreshActiveButtonInColorMenu();

	colorMenu.addEventListener("click", function (event) {
		let clickedButton = findIdWithSVG(event.target, "button__color-");
		
		if (clickedButton != undefined) {
			clickedButton = clickedButton.slice(14);

			currentColor = "#" + clickedButton;

			refreshActiveButtonInColorMenu();
			setColor("new");
			refreshSavedNotes ();
		}
	});
}



function refreshActiveButtonInColorMenu() {
	const oldActiveButton = colorMenu.querySelector("._active");
	if (oldActiveButton != undefined) {
		oldActiveButton.classList.remove("_active");
	}
	
	const activeButton = colorMenu.querySelector(`#button__color-${currentColor.slice(1)}`);
	activeButton.classList.add("_active");
}



function closeColorMenu() {
	colorMenu.classList.remove("_open-color");
	colorButton.classList.remove("_active");
}



function openClassForAside1(addRemoveToggle) {
	if (addRemoveToggle == "add") {
		aside1AllNotes.classList.add("_open767");
		aside1.classList.add("_open575");
		burgerAllNotesButton.classList.add("_open-burger");
	} else if (addRemoveToggle == "remove") {
		aside1AllNotes.classList.remove("_open767");
		aside1.classList.remove("_open575");
		burgerAllNotesButton.classList.remove("_open-burger");
	} else if (addRemoveToggle == "toggle") {
		aside1AllNotes.classList.toggle("_open767");
		aside1.classList.toggle("_open575");
		burgerAllNotesButton.classList.toggle("_open-burger");
	}
}



// on or off
function titleHeightLimit(onOff) {
	const currentMainHeight = document.querySelector(".main").clientHeight;
	let availableTitleHeight;

	if (document.documentElement.clientWidth <= 767) {
						  // = currentMainHeight - title.margin - line.margin - textarea.margin - (textarea.lineheight * 2)
		availableTitleHeight = currentMainHeight - 15 - 10 - (8 + 15) - (22 * 2);
	} else {
		availableTitleHeight = currentMainHeight - 25 - 10 - (8 + 25) - (22 * 2);
	}

	function setFullTitleHeight() {
		noteTitle.style.height = "26px";
		let fullTitleHeight = noteTitle.scrollHeight;

	  	if (fullTitleHeight > availableTitleHeight) {
	  		noteTitle.style.height = availableTitleHeight + "px";
	  	} else {
	  		noteTitle.style.height = fullTitleHeight + "px";
	  	}
	}

	setFullTitleHeight();
	if (onOff == "on") {
		let amountOfString = (noteTitle.scrollHeight) / 26;
		if (amountOfString > 3) {
			let newHeight = 3 * 26;
			noteTitle.style.height = newHeight + 'px';
			noteTitle.scrollTop = 0;
		}
	}
}



function openAndCloseFontStylesMenu() {
	closeTextAlignMenu();
	closeColorMenu();
	closeFontSizeMenu();

	fontStylesMenu.classList.toggle("_open-font-styles");
	fontStylesButton.classList.toggle("_active");

	refreshActiveButtonInFontStylesMenu();
}



function refreshActiveButtonInFontStylesMenu() {
	const boldButton = fontStylesMenu.querySelector("#button__font-style-bold");
	const italicButton = fontStylesMenu.querySelector("#button__font-style-italic");
	const underlineButton = fontStylesMenu.querySelector("#button__font-style-underline");
	
	if (currentFontStyles[currentFocusTextarea].bold) {boldButton.classList.add("_active");} else {boldButton.classList.remove("_active");}
	if (currentFontStyles[currentFocusTextarea].italic) {italicButton.classList.add("_active");} else {italicButton.classList.remove("_active");}
	if (currentFontStyles[currentFocusTextarea].underline) {underlineButton.classList.add("_active");} else {underlineButton.classList.remove("_active");}
}



function setCurrentFontStyles() {
	if (currentFontStyles.title.bold) {noteTitle.style.fontWeight = 700;} else {noteTitle.style.fontWeight = "";}
	if (currentFontStyles.title.italic) {noteTitle.style.fontStyle = "italic";} else {noteTitle.style.fontStyle = "";}
	if (currentFontStyles.title.underline) {noteTitle.style.textDecoration = "underline";} else {noteTitle.style.textDecoration = "";}

	if (currentFontStyles.text.bold) {noteText.style.fontWeight = 700;} else {noteText.style.fontWeight = "";}
	if (currentFontStyles.text.italic) {noteText.style.fontStyle = "italic";} else {noteText.style.fontStyle = "";}
	if (currentFontStyles.text.underline) {noteText.style.textDecoration = "underline";} else {noteText.style.textDecoration = "";}
}



function closeFontStylesMenu() {
	fontStylesMenu.classList.remove("_open-font-styles");
	fontStylesButton.classList.remove("_active");
}



function openAndCloseFontSizeMenu() {
	closeTextAlignMenu();
	closeColorMenu();
	closeFontStylesMenu();

	fontSizeMenu.classList.toggle("_open-font-size");
	fontSizeButton.classList.toggle("_active");

	refreshRangeInFontSizeMenu();
}



function refreshRangeInFontSizeMenu() {
	rangeFontSize.value = currentFontSize[currentFocusTextarea];
	rangeNumberFontSize.innerHTML = `${rangeFontSize.value}`;
}



function setCurrentFontSize() {
	noteTitle.style.fontSize = currentFontSize.title + "px";
	noteText.style.fontSize = currentFontSize.text + "px";
}



function closeFontSizeMenu() {
	fontSizeMenu.classList.remove("_open-font-size");
	fontSizeButton.classList.remove("_active");
}






noteTitle.addEventListener('input', function (event) {
	titleHeightLimit("off");
});
noteTitle.addEventListener('click', function (event) {
	titleHeightLimit("off");
});

aside2Menu.addEventListener("click", aside2MenuButtons);

aside1AllNotes.addEventListener("click", importNoteIntoEditor);

window.addEventListener('resize', setVH);

noteTitle.addEventListener("focus", function (event) {
	currentFocusTextarea = "title";
	refreshActiveButtonInAlignMenu();
	refreshActiveButtonInFontStylesMenu();
	refreshRangeInFontSizeMenu();
	closeColorMenu();
});
noteText.addEventListener("focus", function (event) {
	currentFocusTextarea = "text";
	refreshActiveButtonInAlignMenu();
	refreshActiveButtonInFontStylesMenu();
	refreshRangeInFontSizeMenu();
	closeColorMenu();
	titleHeightLimit("on");
});

burgerAllNotesButton.addEventListener("click", function(event){
	openClassForAside1("toggle");
});

window.addEventListener("click", function (event) {
	if (!event.target.closest(".aside1") && !event.target.closest(".header__burger-all-notes-button")) {
		openClassForAside1("remove");
	}
});

fontStylesMenu.addEventListener("click", function (event) {
	let clickedButton = findIdWithSVG(event.target, "button__font-style-");
	
	if (clickedButton != undefined) {
		clickedButton = clickedButton.slice(19);

		if (currentFontStyles[currentFocusTextarea][clickedButton] == true) {
			currentFontStyles[currentFocusTextarea][clickedButton] = false;
		} else {
			currentFontStyles[currentFocusTextarea][clickedButton] = true;
		}

		refreshActiveButtonInFontStylesMenu();
		setCurrentFontStyles();
	}
});

rangeFontSize.addEventListener("input", function (event) {
	currentFontSize[currentFocusTextarea] = rangeFontSize.value;
	refreshRangeInFontSizeMenu();
	setCurrentFontSize();
});



showSavedNotes();
setVH();