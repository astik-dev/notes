const noteTitle = document.querySelector(".note__title");
const noteText = document.querySelector(".note__textarea");
const noteBody = document.querySelector(".note");
const aside1AllNotes = document.querySelector(".aside1__all-notes");
const aside2Menu = document.querySelector(".aside2__menu");
const bodyHTML = document.querySelector("body");

let currentNoteId;


if (localStorage.getItem("notes") == null) {
	localStorage.setItem("notes", JSON.stringify([]));
}
let note = localStorage.getItem("notes");
note = JSON.parse(note);



function setNoteTitleHeight() {
	noteTitle.style.height = "37px";
  	noteTitle.style.height = (noteTitle.scrollHeight) + 1 + 'px';
}



function errorButton (idButton, errorClass, onlyAside2Button) {
	if (onlyAside2Button != true) {
		let noteButton;
		if (currentNoteId != undefined) {
			noteButton = document.querySelector(`#note_${currentNoteId}`);
		};
		if (noteButton != undefined) {
			noteButton.classList.add(errorClass);
			function removeClassNote () {
				noteButton.classList.remove(errorClass);
			};
			setTimeout(removeClassNote, 1000);
		}
	} 
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

		note[currentNoteId] = {title: title, text: text,};
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

		note.push({title: title, text: text,});
		localStorage.setItem("notes", JSON.stringify(note));
		
		aside1AllNotes.insertAdjacentHTML("afterbegin", `<li class="aside1__all-notes-item">
															<button class="aside1__button"  id="note_${note.length-1}"><svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M21 22H3V2h12v2h2v2h2v2h2v14zM17 6h-2v2h2V6zM5 4v16h14V10h-6V4H5zm8 12H7v2h6v-2zm-6-4h10v2H7v-2zm4-4H7v2h4V8z" /></svg>${minTitle}</button>
	 													</li>`);
		currentNoteId = note.length-1;

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
																<button class="aside1__button" id="note_${i}"><svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M21 22H3V2h12v2h2v2h2v2h2v14zM17 6h-2v2h2V6zM5 4v16h14V10h-6V4H5zm8 12H7v2h6v-2zm-6-4h10v2H7v-2zm4-4H7v2h4V8z" /></svg>${minTitle}</button>
		 													</li>`);
		}
	} else {
		aside1AllNotes.innerHTML = "<span class='aside1__empty'>You don't have any notes yet.</span>";
	}
}



function refreshSavedNotes () {
	aside1AllNotes.innerHTML = "";
	showSavedNotes();
	markCurrentNote();
}



function addNewNote() {

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
		setNoteTitleHeight();
		markCurrentNote();
		noteText.focus();
	}
}



function aside2MenuButtons(event) {
	let buttonId;

	if (event.target.id.includes("button__")) {
		buttonId = event.target.id;
	} else if (event.target.parentNode.id.includes("button__")) {
		buttonId = event.target.parentNode.id;
	} else if (event.target.parentNode.parentNode.id.includes("button__")) {
		buttonId = event.target.parentNode.parentNode.id;
	}

	if (buttonId != undefined) {
		if (buttonId == "button__save") {saveNewNoteOrSaveOldNote();}
		else if (buttonId == "button__new-file") {addNewNote();}
		else if (buttonId == "button__trash") {popUp("Delete note", "This note will be permanently deleted", {text: "Cancel", function(){errorButton ("button__trash", "_error", true)}}, {text: "Delete", function(){deleteNote(); errorButton("button__trash", "_successful", true)}}, function(){errorButton ("button__trash", "_error", true);});}
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

	if (event.target.id.includes("note_")) {
		noteId = event.target.id;
	} else if (event.target.parentNode.id.includes("note_")) {
		noteId = event.target.parentNode.id;
	} else if (event.target.parentNode.parentNode.id.includes("note_")) {
		noteId = event.target.parentNode.parentNode.id;
	}

	if (noteId != undefined) {
		let notePositionInArray = Number(noteId.substr(5));
		currentNoteId = notePositionInArray;
		noteTitle.value = note[notePositionInArray].title;
		noteText.value = note[notePositionInArray].text;
		setNoteTitleHeight();
		markCurrentNote();
	}
}



function deleteNote() {
	if (currentNoteId != undefined) {
		note.splice(currentNoteId, 1);
		localStorage.setItem("notes", JSON.stringify(note));

		noteTitle.value = "";
		noteText.value = "";
		currentNoteId = undefined;
		setNoteTitleHeight();
		refreshSavedNotes();
	} else {
		noteTitle.value = "";
		noteText.value = "";
		currentNoteId = undefined;
		setNoteTitleHeight();
	}
}



function markCurrentNote() {
	if (currentNoteId != undefined) {
		let activeNote = aside1AllNotes.querySelector("._active");
		let currentNoteButton = aside1AllNotes.querySelector(`#note_${currentNoteId}`);

		if (activeNote == null) {
			currentNoteButton.classList.add("_active");
		} else {
			activeNote.classList.remove("_active");
			currentNoteButton.classList.add("_active");
		}
	} else {
		let activeNote = aside1AllNotes.querySelector("._active");
		if (activeNote != null) {
			activeNote.classList.remove("_active");
		} 
	}
}



// popUp(title, text, {text: button1, function() {function()}, {text: button2, function() {function()}},);
function popUp(title, text, button1Object, button2Object, popUpEmptyPlaceFunction) {
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







showSavedNotes();
setVH();

noteTitle.addEventListener('input', setNoteTitleHeight);
aside2Menu.addEventListener("click", aside2MenuButtons);
aside1AllNotes.addEventListener("click", importNoteIntoEditor);
window.addEventListener('resize', setVH);






