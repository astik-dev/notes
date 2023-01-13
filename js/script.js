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
const lineHeightMenu = aside2Menu.querySelector("#range__line-height");
const lineHeightButton = aside2Menu.querySelector("#button__line-height");
const rangeLineHeight = lineHeightMenu.querySelector("#range-line-height");
const rangeNumberLineHeight = lineHeightMenu.querySelector(".aside2__range-number");
const horizontalScrollButton = aside2Menu.querySelector("#button__horizontal-scroll");
const settingsButton = document.querySelector("#header-menu-settings");
const settingsMinButton = document.querySelector("#header-min-menu-settings");
const wrapper = document.querySelector(".wrapper");
const settingsMenu = document.querySelector(".settings");
const settingsDropdown = document.querySelector(".settings__dropdown");
const settingsDropdownButton = settingsDropdown.querySelector(".settings__dropdown-button");
const rangeSettingsSizeTitle = settingsMenu.querySelector("#range-settings-size-title");
const rangeSettingsSizeText = settingsMenu.querySelector("#range-settings-size-text");
const rangeSettingsLineheightTitle = settingsMenu.querySelector("#range-settings-lineheight-title");
const rangeSettingsLineheightText = settingsMenu.querySelector("#range-settings-lineheight-text");

noteTitle.value = "";
noteText.value = "";

let currentNoteId;
let currentAlign;
let currentFocusTextarea = "text";
let currentColor;
let initialPoint;
let finalPoint;
let currentFontStyles;
let currentFontSize;
let currentLineHeight;
let currentHorizontalScroll;

const defaultSettings = {
	align: {text: "left", title: "left",},
	color: "#FFFFFF",
	fontStyles: {title: {bold: false, italic: false, underline: false,}, text: {bold: false, italic: false, underline: false,},},
	fontSize: {title: 20, text: 16},
	lineHeight: {title: 26, text: 16,},
	horizontalScroll: false,
}


if (localStorage.getItem("notes") == null) {
	localStorage.setItem("notes", JSON.stringify([]));
}
let note = localStorage.getItem("notes");
note = JSON.parse(note);

if (localStorage.getItem("settings") == null) {
	localStorage.setItem("settings", JSON.stringify(defaultSettings));
}
let userSettings = localStorage.getItem("settings");
userSettings = JSON.parse(userSettings);



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
		return "notEmpty";
	}
}



function saveNewNoteOrSaveOldNote () {
	closeTextAlignMenu();
	closeColorMenu();
	closeFontStylesMenu();
	closeFontSizeMenu();
	closeLineHeightMenu();

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

		note[currentNoteId] = {title: title, text: text, settings: {align: currentAlign, color: currentColor, fontStyles: currentFontStyles, fontSize: currentFontSize, lineHeight: currentLineHeight, horizontalScroll: currentHorizontalScroll,},};
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


		note.push({title: title, text: text, settings: {align: currentAlign, color: currentColor, fontStyles: currentFontStyles, fontSize: currentFontSize, lineHeight: currentLineHeight, horizontalScroll: currentHorizontalScroll,},});
		localStorage.setItem("notes", JSON.stringify(note));
		
		aside1AllNotes.insertAdjacentHTML("afterbegin", `<li class="aside1__all-notes-item">
															<button class="aside1__button"  id="note_${note.length-1}"><svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M21 22H3V2h12v2h2v2h2v2h2v14zM17 6h-2v2h2V6zM5 4v16h14V10h-6V4H5zm8 12H7v2h6v-2zm-6-4h10v2H7v-2zm4-4H7v2h4V8z" /></svg><span></span></button>
	 													</li>`);
		let textSpan = aside1AllNotes.querySelector(`#note_${note.length-1} span`);
		textSpan.textContent = minTitle;
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
																<button class="aside1__button" id="note_${i}"><svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M21 22H3V2h12v2h2v2h2v2h2v14zM17 6h-2v2h2V6zM5 4v16h14V10h-6V4H5zm8 12H7v2h6v-2zm-6-4h10v2H7v-2zm4-4H7v2h4V8z" /></svg><span></span></button>
		 													</li>`);
			let textSpan = aside1AllNotes.querySelector(`#note_${i} span`);
			textSpan.textContent = minTitle;
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
	closeLineHeightMenu();

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
		setUserSettings();
		activateCurrentSettings();
		markCurrentNote();
		noteText.focus();

		localStorage.removeItem("lastOpenedNoteId");
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
		else if (buttonId == "button__line-height") {openAndCloseLineHeightMenu();}
		else if (buttonId == "button__horizontal-scroll") {addOrRemoveHorizontalScroll();}
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



function importNoteIntoEditor (event, openLastOpenedNote) {
	let noteId;
	if (openLastOpenedNote == true) {
		noteId = `note_${currentNoteId}`;
	} else {
		noteId = findIdWithSVG(event.target, "note_");
	}
	if (noteId != undefined) {
		if (noteId.slice(5) == currentNoteId && openLastOpenedNote == undefined) {
			addNewNote();
		} else {
			closeTextAlignMenu();
			closeColorMenu();
			closeFontStylesMenu();
			closeFontSizeMenu();
			closeLineHeightMenu();

			if (openLastOpenedNote == undefined) {
				if (currentNoteId != undefined) {
					if (noteTitle.value == "" && noteText.value == "") {
						errorButton("button__save", "_error");
						noteBody.classList.add("_error");
						function removeError() {
							noteBody.classList.remove('_error');
						};
						setTimeout(removeError, 1000);
						return;
					} else {
						saveOldNote("button__save", "_error");
					}
				} else {
					if (noteTitle.value != "" || noteText.value != "") {
						saveNewNote("button__save", "_error");
					}
				}
			}	

			let notePositionInArray = Number(noteId.substr(5));
			currentNoteId = notePositionInArray;
			noteTitle.value = note[notePositionInArray].title;
			noteText.value = note[notePositionInArray].text;
			currentAlign = {...note[notePositionInArray].settings.align};
			currentFontStyles = {...note[notePositionInArray].settings.fontStyles, title: {...note[notePositionInArray].settings.fontStyles.title}, text: {...note[notePositionInArray].settings.fontStyles.text}};
			currentFontSize = {...note[notePositionInArray].settings.fontSize};
			currentLineHeight = {...note[notePositionInArray].settings.lineHeight};
			currentHorizontalScroll = note[notePositionInArray].settings.horizontalScroll;

			setCurrentAlign("title");
			setCurrentAlign("text");
			setCurrentFontStyles();
			setCurrentFontSize();
			setCurrentLineHeight();
			setHorizontalScroll();
			refreshActiveButtonInAlignMenu();
			refreshActiveButtonInColorMenu();
			refreshActiveButtonInFontStylesMenu();
			refreshRangeInFontSizeMenu();
			refreshRangeInLineHeightMenu();
			titleHeightLimit("on");
			markCurrentNote();
			setColor("import");
			titleHeightLimit("on");

			localStorage.setItem("lastOpenedNoteId", currentNoteId);
		}
	}
}



function deleteNote() {
	if (currentNoteId != undefined) {
		note.splice(currentNoteId, 1);
		localStorage.setItem("notes", JSON.stringify(note));

		noteTitle.value = "";
		noteText.value = "";
		currentNoteId = undefined;
		setUserSettings();
		activateCurrentSettings();
		refreshSavedNotes();
		localStorage.removeItem("lastOpenedNoteId");
	} else {
		noteTitle.value = "";
		noteText.value = "";
		currentNoteId = undefined;
		setUserSettings();
		activateCurrentSettings();
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
	closeLineHeightMenu();

	const textareas = wrapper.getElementsByTagName("textarea");
	const buttons = wrapper.getElementsByTagName("button");
	const inputs = wrapper.getElementsByTagName("input");

	function disableOtherInteractiveElements (trueFalse) {
		for( let i = 0; i < textareas.length; i++ ){
			textareas[i].disabled = trueFalse;
		}
		for( let i = 0; i < buttons.length; i++ ){
			buttons[i].disabled = trueFalse;
		}
		for( let i = 0; i < inputs.length; i++ ){
			inputs[i].disabled = trueFalse;
		}
	}

	disableOtherInteractiveElements(true);

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
		popUpAllElements.removeEventListener("click", popUpClick);
		disableOtherInteractiveElements(false);
	}

	function popUpClick(event) {
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
	}

	popUpAllElements.addEventListener("click", popUpClick);
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
	closeLineHeightMenu();

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
	closeLineHeightMenu();

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
		availableTitleHeight = currentMainHeight - 15 - 10 - (8 + 15) - (currentLineHeight.text * 2);
	} else {
		availableTitleHeight = currentMainHeight - 25 - 10 - (8 + 25) - (currentLineHeight.text * 2);
	}

	function setFullTitleHeight() {
		noteTitle.style.height = currentLineHeight.title + "px";
		let fullTitleHeight = noteTitle.scrollHeight;

	  	if (fullTitleHeight > availableTitleHeight) {
	  		noteTitle.style.height = availableTitleHeight + "px";
	  	} else if ((fullTitleHeight + 1) > availableTitleHeight) {
	  		noteTitle.style.height = availableTitleHeight + "px";
	  	} else {
	  		noteTitle.style.height = fullTitleHeight + 1 + "px";
	  	}
	}

	setFullTitleHeight();

	if (onOff == "on") {
		const extraHeight = {
			12: {12: 2, 14: 1},
			14: {12: 4, 14: 2, 16: 2},
			16: {12: 5, 14: 4, 16: 3, 18: 2, 20: 1,},
			18: {12: 6, 14: 5, 16: 4, 18: 3, 20: 2, 22: 1,},
			20: {12: 7, 14: 6, 16: 5, 18: 4, 20: 3, 22: 2, 24: 1,},
			22: {12: 8, 14: 8, 16: 6, 18: 6, 20: 4, 22: 4, 24: 2, 26: 2,},
			24: {12: 10, 14: 9, 16: 9, 18: 7, 20: 6, 22: 5, 24: 4, 26: 3, 28: 2, 30: 1,},
			26: {12: 11, 14: 10, 16: 9, 18: 8, 20: 7, 22: 6, 24: 5, 26: 4, 28: 3, 30: 2, 32: 1,},
			28: {12: 12, 14: 12, 16: 10, 18: 10, 20: 8, 22: 8, 24: 6, 26: 6, 28: 4, 30: 4, 32: 2, 34: 2,},
		};

		let threeLinesHeight;

		if (extraHeight[currentFontSize.title][currentLineHeight.title] == undefined) {
			threeLinesHeight = currentLineHeight.title * 3 + 1;
		} else {
			threeLinesHeight = (currentLineHeight.title * 3) + extraHeight[currentFontSize.title][currentLineHeight.title] + 1;
		}

		if ((noteTitle.scrollHeight - 1) >= threeLinesHeight) {
			if (availableTitleHeight > threeLinesHeight) {
				noteTitle.style.height = threeLinesHeight + "px";
				noteTitle.scrollTop = 0;
			}
		}
	}
}



function openAndCloseFontStylesMenu() {
	closeTextAlignMenu();
	closeColorMenu();
	closeFontSizeMenu();
	closeLineHeightMenu();

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
	if (currentFontStyles.title.underline) {noteTitle.style.textDecoration = "underline"; noteTitle.classList.add("_underline-placeholder");} else {noteTitle.style.textDecoration = ""; noteTitle.classList.remove("_underline-placeholder");}

	if (currentFontStyles.text.bold) {noteText.style.fontWeight = 700;} else {noteText.style.fontWeight = "";}
	if (currentFontStyles.text.italic) {noteText.style.fontStyle = "italic";} else {noteText.style.fontStyle = "";}
	if (currentFontStyles.text.underline) {noteText.style.textDecoration = "underline"; noteText.classList.add("_underline-placeholder");} else {noteText.style.textDecoration = ""; noteText.classList.remove("_underline-placeholder");}
}



function closeFontStylesMenu() {
	fontStylesMenu.classList.remove("_open-font-styles");
	fontStylesButton.classList.remove("_active");
}



function openAndCloseFontSizeMenu() {
	closeTextAlignMenu();
	closeColorMenu();
	closeFontStylesMenu();
	closeLineHeightMenu();

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



function openAndCloseLineHeightMenu() {
	closeTextAlignMenu();
	closeColorMenu();
	closeFontStylesMenu();
	closeFontSizeMenu();

	lineHeightMenu.classList.toggle("_open-font-size");
	lineHeightButton.classList.toggle("_active");

	refreshRangeInLineHeightMenu()
}



function refreshRangeInLineHeightMenu() {
	rangeLineHeight.value = currentLineHeight[currentFocusTextarea];
	rangeNumberLineHeight.innerHTML = `${rangeLineHeight.value}`;
}



function setCurrentLineHeight() {
	noteTitle.style.lineHeight = currentLineHeight.title + "px";
	noteText.style.lineHeight = currentLineHeight.text + "px";
}



function closeLineHeightMenu() {
	lineHeightMenu.classList.remove("_open-font-size");
	lineHeightButton.classList.remove("_active");
}



function setHorizontalScroll () {
	if (currentHorizontalScroll) {
		noteText.setAttribute("wrap", "off");
		horizontalScrollButton.classList.add("_active");
	} else {
		noteText.removeAttribute("wrap");
		horizontalScrollButton.classList.remove("_active");
	}
}



function addOrRemoveHorizontalScroll () {
	closeTextAlignMenu();
	closeColorMenu();
	closeFontStylesMenu();
	closeFontSizeMenu();
	closeLineHeightMenu();

	if (currentHorizontalScroll) {
		currentHorizontalScroll = false;

	} else {
		currentHorizontalScroll = true;
	}

	setHorizontalScroll();
}



function openAndCloseSettings() {

	if (!wrapper.classList.contains("_open-settings")) {
		toggleClasses();
	} else {
		let oldUserSettings = localStorage.getItem("settings");
		let changedUserSettings = JSON.stringify(userSettings);
		if (oldUserSettings != changedUserSettings) {
			popUp("Settings not saved", "Are you sure you want to exit without saving?", {text: "Cancel", function(){}}, {text: "Exit", function(){toggleClasses(); resetChangedSettings();}}, function(){});
		} else {
			toggleClasses();
			titleHeightLimit("off");
		}
	}

	function toggleClasses() {
		wrapper.classList.toggle("_open-settings");
		settingsButton.classList.toggle("_active");
		burgerAllNotesButton.parentNode.classList.toggle("_hide-burger");
		settingsMinButton.classList.toggle("_open-min-menu");
	}
	function resetChangedSettings() {
		userSettings = localStorage.getItem("settings");
		userSettings = JSON.parse(userSettings);
		setValuesInSettingsMenu();
	}
}



function rangeInSettingsMenu (event) {
	let valueText = event.target.parentNode.parentNode.querySelector(".settings__range-value-text");
	valueText.textContent = event.target.value + "px";
	if (event.target.id.includes("range-settings-size-")) {
		let txt = event.target.id.slice(20);
		userSettings.fontSize[txt] = Number(event.target.value);
	} else if (event.target.id.includes("range-settings-lineheight-")) {
		let txt = event.target.id.slice(26);
		userSettings.lineHeight[txt] = Number(event.target.value);
	}
}



function setUserSettings() {
	currentLineHeight = {...userSettings.lineHeight};
	currentAlign = {...userSettings.align};
	currentColor = userSettings.color;
	currentFontStyles = {...userSettings.fontStyles, title: {...userSettings.fontStyles.title}, text: {...userSettings.fontStyles.text}};
	currentFontSize = {...userSettings.fontSize};
	currentHorizontalScroll = userSettings.horizontalScroll;
}



function activateCurrentSettings () {
	setCurrentFontStyles();
	setCurrentAlign("title");
	setCurrentAlign("text");
	setCurrentFontSize();
	setCurrentLineHeight();
	setHorizontalScroll();
	refreshActiveButtonInAlignMenu();
	refreshActiveButtonInFontStylesMenu();
	refreshRangeInFontSizeMenu();
	refreshRangeInLineHeightMenu();
	setColor("new");
	titleHeightLimit("off");
}



function setValuesInSettingsMenu () {	
	const alignTitleElem = settingsMenu.querySelector("#dropdown-title-align");
	if (alignTitleElem.querySelector("._dropdown-item-active") != undefined) {alignTitleElem.querySelector("._dropdown-item-active").classList.remove("_dropdown-item-active");}
	alignTitleElem.querySelector(`li[data-value="${userSettings.align.title}"]`).classList.add("_dropdown-item-active");
	alignTitleElem.querySelector("#dropdown-button-title-align").textContent = alignTitleElem.querySelector(`li[data-value="${userSettings.align.title}"]`).textContent;
	
	const alignTextElem = settingsMenu.querySelector("#dropdown-text-align");
	if (alignTextElem.querySelector("._dropdown-item-active") != undefined) {alignTextElem.querySelector("._dropdown-item-active").classList.remove("_dropdown-item-active");}
	alignTextElem.querySelector(`li[data-value="${userSettings.align.text}"]`).classList.add("_dropdown-item-active");
	alignTextElem.querySelector("#dropdown-button-text-align").textContent = alignTextElem.querySelector(`li[data-value="${userSettings.align.text}"]`).textContent;

	const colorElem = settingsMenu.querySelector("#dropdown-color");
	if (colorElem.querySelector("._dropdown-item-active") != undefined) {colorElem.querySelector("._dropdown-item-active").classList.remove("_dropdown-item-active");}
	colorElem.querySelector(`li[data-value="${userSettings.color}"]`).classList.add("_dropdown-item-active");
	colorElem.querySelector("#dropdown-button-color").innerHTML = `<div style="background-color: ${userSettings.color};"></div>${colorElem.querySelector(`li[data-value="${userSettings.color}"]`).textContent}`;

	const styleTitleElem = settingsMenu.querySelector("#settings-checkboxes-title");
	if (userSettings.fontStyles.title.bold) {styleTitleElem.querySelector("button:nth-child(2)").classList.add("_active-checkbox");} else {styleTitleElem.querySelector("button:nth-child(2)").classList.remove("_active-checkbox");}
	if (userSettings.fontStyles.title.italic) {styleTitleElem.querySelector("button:nth-child(3)").classList.add("_active-checkbox");} else {styleTitleElem.querySelector("button:nth-child(3)").classList.remove("_active-checkbox");}
	if (userSettings.fontStyles.title.underline) {styleTitleElem.querySelector("button:nth-child(4)").classList.add("_active-checkbox");} else {styleTitleElem.querySelector("button:nth-child(4)").classList.remove("_active-checkbox");}

	const styleTextElem = settingsMenu.querySelector("#settings-checkboxes-text");
	if (userSettings.fontStyles.text.bold) {styleTextElem.querySelector("button:nth-child(2)").classList.add("_active-checkbox");} else {styleTextElem.querySelector("button:nth-child(2)").classList.remove("_active-checkbox");}
	if (userSettings.fontStyles.text.italic) {styleTextElem.querySelector("button:nth-child(3)").classList.add("_active-checkbox");} else {styleTextElem.querySelector("button:nth-child(3)").classList.remove("_active-checkbox");}
	if (userSettings.fontStyles.text.underline) {styleTextElem.querySelector("button:nth-child(4)").classList.add("_active-checkbox");} else {styleTextElem.querySelector("button:nth-child(4)").classList.remove("_active-checkbox");}

	rangeSettingsSizeTitle.value = userSettings.fontSize.title;
	rangeSettingsSizeTitle.parentNode.parentNode.querySelector(".settings__range-value-text").textContent = userSettings.fontSize.title + "px";

	rangeSettingsSizeText.value = userSettings.fontSize.text;
	rangeSettingsSizeText.parentNode.parentNode.querySelector(".settings__range-value-text").textContent = userSettings.fontSize.text + "px";

	rangeSettingsLineheightTitle.value = userSettings.lineHeight.title;
	rangeSettingsLineheightTitle.parentNode.parentNode.querySelector(".settings__range-value-text").textContent = userSettings.lineHeight.title + "px";

	rangeSettingsLineheightText.value = userSettings.lineHeight.text;
	rangeSettingsLineheightText.parentNode.parentNode.querySelector(".settings__range-value-text").textContent = userSettings.lineHeight.text + "px";

	const scrollElem = settingsMenu.querySelector("#checkbox-settings-horizontal-scroll");
	if (userSettings.horizontalScroll) {scrollElem.classList.add("_active-checkbox");} else {scrollElem.classList.remove("_active-checkbox");}
}



function checkChanges(object) {
	if (
		currentAlign.title != object.align.title ||
		currentAlign.text != object.align.text ||
		currentFontSize.title != object.fontSize.title ||
		currentFontSize.text != object.fontSize.text ||
		currentLineHeight.title != object.lineHeight.title ||
		currentLineHeight.text != object.lineHeight.text ||
		currentHorizontalScroll != object.horizontalScroll ||
		currentColor != object.color ||
		currentFontStyles.title.bold != object.fontStyles.title.bold ||
		currentFontStyles.title.italic != object.fontStyles.title.italic ||
		currentFontStyles.title.underline != object.fontStyles.title.underline ||
		currentFontStyles.text.bold != object.fontStyles.text.bold ||
		currentFontStyles.text.italic != object.fontStyles.text.italic ||
		currentFontStyles.text.underline != object.fontStyles.text.underline
		) {
		return true;
	} else {
		return false;
	}
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
	refreshRangeInLineHeightMenu();
	closeColorMenu();
});
noteText.addEventListener("focus", function (event) {
	currentFocusTextarea = "text";
	refreshActiveButtonInAlignMenu();
	refreshActiveButtonInFontStylesMenu();
	refreshRangeInFontSizeMenu();
	refreshRangeInLineHeightMenu();
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
	if (currentFocusTextarea == "title") {titleHeightLimit("off");}
});

rangeLineHeight.addEventListener("input", function (event) {
	currentLineHeight[currentFocusTextarea] = rangeLineHeight.value;
	refreshRangeInLineHeightMenu();
	setCurrentLineHeight();
	if (currentFocusTextarea == "title") {titleHeightLimit("off");}
});

settingsButton.addEventListener("click", openAndCloseSettings);
settingsMinButton.addEventListener("click", openAndCloseSettings);

settingsMenu.addEventListener("click", function (event) {
	let activeDropdown = document.querySelector("._open-dropdown");
	if (activeDropdown != undefined && event.target.id != activeDropdown.firstElementChild.id) {
		activeDropdown.classList.remove("_open-dropdown");
	}

	if (event.target.id.includes("dropdown")) {
		event.target.parentNode.classList.toggle("_open-dropdown");
	}
	if (event.target.classList.contains("settings__dropdown-item")) {
		let activeItem = event.target.parentNode.querySelector("._dropdown-item-active");
		if (activeItem != null) {
			activeItem.classList.remove("_dropdown-item-active");
		}

		event.target.parentNode.parentNode.firstElementChild.textContent = event.target.textContent;

		if (event.target.parentNode.parentNode.firstElementChild.id.includes("dropdown-button-color")) {
			event.target.parentNode.parentNode.firstElementChild.innerHTML = `<div style="background-color: ${event.target.dataset.value};"></div>${event.target.textContent}`;
		}

		event.target.classList.add("_dropdown-item-active");

		if (event.target.parentNode.parentNode.id == "dropdown-title-align") {
			userSettings.align.title = event.target.dataset.value;
		} else if (event.target.parentNode.parentNode.id == "dropdown-text-align") {
			userSettings.align.text = event.target.dataset.value;
		} else if (event.target.parentNode.parentNode.id == "dropdown-color") {
			userSettings.color = event.target.dataset.value;
		}
	}

	if (event.target.classList.contains("settings__checkbox")) {
		event.target.classList.toggle("_active-checkbox");
		
		let checkboxValue = false;
		if (event.target.classList.contains("_active-checkbox")) {
			checkboxValue = true;
		}

		function newSettingStyle() {
			let txt = event.target.parentNode.id.slice(20);
			let styleType = event.target.textContent.toLowerCase();
			userSettings.fontStyles[txt][styleType] = checkboxValue;
		}
		if (event.target.parentNode.id == "settings-checkboxes-title" || event.target.parentNode.id == "settings-checkboxes-text") {
			newSettingStyle();
		} else if (event.target.id == "checkbox-settings-horizontal-scroll") {
			userSettings.horizontalScroll = checkboxValue;
		}
	}

	if (event.target.classList.contains("settings__control-button")) {
		if (event.target.textContent == "Cancel") {
			userSettings = localStorage.getItem("settings");
			userSettings = JSON.parse(userSettings);
			setValuesInSettingsMenu();
		} else if (event.target.textContent == "Save") {
			localStorage.setItem("settings", JSON.stringify(userSettings));
			if (currentNoteId == undefined && noteTitle.value == "" && noteText.value == "") {
				setUserSettings();
				activateCurrentSettings();
			}

			event.target.style.borderColor = "#02d102";
			event.target.style.color = "#02d102";
			function removeStyle() {
				event.target.style.borderColor = "";
				event.target.style.color = "";
			};
			setTimeout(removeStyle, 500);
		}
	}

	if (event.target.classList.contains("settings__additional-button")) {

		function setDefaultSettings() {
			localStorage.setItem("settings", JSON.stringify(defaultSettings));
			userSettings = localStorage.getItem("settings");
			userSettings = JSON.parse(userSettings);
			setValuesInSettingsMenu();
			if (currentNoteId == undefined && noteTitle.value == "" && noteText.value == "") {
				setUserSettings();
				activateCurrentSettings();
			}
		}

		function deleteAllNotes() {
			localStorage.setItem("notes", JSON.stringify([]));
			note = localStorage.getItem("notes");
			note = JSON.parse(note);
			showSavedNotes();
			deleteNote();
		}

		if (event.target.textContent == "Set default settings") {

			popUp("Set default settings", "Default settings will be set", {text: "Cancel", function(){}}, {text: "Set", function(){setDefaultSettings();}}, function(){});

		} else if (event.target.textContent == "Delete all notes") {

			popUp("Delete all notes", "All notes will be deleted", {text: "Cancel", function(){}}, {text: "Delete", function(){deleteAllNotes();}}, function(){});

		} else if (event.target.textContent == "Delete all data") {

			popUp("Delete all data", "All data (notes and settings) will be deleted", {text: "Cancel", function(){}}, {text: "Delete", function(){setDefaultSettings(); deleteAllNotes();}}, function(){});

		}
	}
});

rangeSettingsSizeTitle.addEventListener("input", rangeInSettingsMenu);
rangeSettingsSizeText.addEventListener("input", rangeInSettingsMenu);
rangeSettingsLineheightTitle.addEventListener("input", rangeInSettingsMenu);
rangeSettingsLineheightText.addEventListener("input", rangeInSettingsMenu);

window.addEventListener("load", function (event) {
	setTimeout(titleHeightLimit, 500);
});

window.addEventListener("beforeunload", function (event) {
	if (currentNoteId != undefined) {
		if (noteTitle.value != note[currentNoteId].title || noteText.value != note[currentNoteId].text) {
			event.preventDefault();
			event.returnValue = "";
		} 
	} else {
		if (noteTitle.value != "" || noteText.value != "" || checkChanges(userSettings)) {
			event.preventDefault();
			event.returnValue = "";
		}
	}

	if (JSON.stringify(userSettings) != localStorage.getItem("settings")) {
		event.preventDefault();
		event.returnValue = "";
	}
});



setUserSettings();
showSavedNotes();
setVH();
setValuesInSettingsMenu();
activateCurrentSettings();

if (localStorage.getItem("lastOpenedNoteId") != null) {
	currentNoteId = localStorage.getItem("lastOpenedNoteId");
	importNoteIntoEditor(false, true);
}