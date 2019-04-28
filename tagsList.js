let editGroupVisibilityState = false;
let tagsSidebarVisibilityState = true;
let editTagMode = false;
let newTagMode = false;
const logData = true;

const mainTaskList = document.getElementById("main-task-list");
const tagsSidebar = document.getElementById("tag-panel");
const editGroup = document.getElementById("edit-group");
const tagName = document.getElementById("tag-name");
const tagColor = document.getElementById("tag-color");

const dropdownTags= document.getElementById("dropdown-tags");
const dropdownTagsItems = document.getElementById("dropdown-tags-items");
const dropdownTagsButton = document.getElementById("dropdown-button-tags");

const dropdownTasks= document.getElementById("dropdown-tasks");
const dropdownTasksItems = document.getElementById("dropdown-tasks-items");
const dropdownTasksButton = document.getElementById("dropdown-button-tasks");


const showTagPanelButton = document.getElementById("btn-show-tags");
const addTagButton = document.getElementById("add-tag");
const editTagButton = document.getElementById("btn-edit-tag");
const removeTagButton = document.getElementById("btn-remove-tag");
const approveChangesButton = document.getElementById("btn-approve-tag-changes");



const allTagsEndpoint = "http://localhost:3000/api/tags";
const allTasksEndpoint = "http://localhost:3000/api/tasks";
const idTagEndpoint = "http://localhost:3000/api/tags/"
const assignTagToTaskEndpoint = "http://localhost:3000/api/tasks";

//dostaje wartośc w selectDropdownItem()
let tagID ="";
let taskID ="";


//schowanie przycisków przed wyborem tagu
editTagButton.hidden = true;
removeTagButton.hidden = true;

let tagSelected = false;
let taskSelected = false;
//uktyrwa panel tagów
function changeTagsSidebarVisibility() {
	tagsSidebarVisibilityState = !tagsSidebarVisibilityState;
	if (tagsSidebarVisibilityState == true) {
		tagsSidebar.hidden = false;
		mainTaskList.className = "col-md-9"
		showTagPanelButton.innerHTML = ` <i class="fas fa-times"></i> Zamknij tagi`
		showTagPanelButton.className = "btn btn-sm btn-danger active"

	} else {
		tagsSidebar.hidden = true;
		mainTaskList.className = "col-md-12"
		showTagPanelButton.innerText = "Tagi"
		showTagPanelButton.className = "btn btn-sm btn-dark"
	}
}

function changeEditGroupVisibility() {
	editGroupVisibilityState = !editGroupVisibilityState;
	editGroup.hidden = editGroupVisibilityState;
}

function clearInput(){
	tagName.value="";
	tagName.placeholder="Podaj nazwę tagu";
	tagColor.value = "#f6b73c";
	
	
}
function getData() {

	dropdownTagsItems.innerText = "";
	
	fetch(allTagsEndpoint)
		.then(res => res.json())
		.then(res => {

			if(logData)
				console.log(arguments.callee.name, res)

			if(res.length >0){
				dropdownTagsItems.innerText = "";
				for (let tagObject of res)
					addToDropdown(tagObject.name, tagObject._id, tagObject.color)

				selectDropdownItem();
			}
			else{
				editTagButton.hidden= true;
				removeTagButton.hidden = true;
				dropdownTagsItems.innerText = "Brak tagów";
			}
		})
		.catch(dropdownTagsItems.innerText = "Błąd przy łączeniu się z bazą tagów");

}

function addToDropdown(text, id,color) {
	let tagItem = document.createElement("a");
	
	//kółeczko w kolorze wybarnego tagu
	let dotItem = document.createElement("div");
	tagItem.className = "dropdown-item tag-item";
	dotItem.className="dot";
	tagItem.appendChild(dotItem);

	let tagName = document.createTextNode(text);
	tagItem.href = "#";
	dotItem.style.backgroundColor = color;
	tagItem.dataset.id = id;
	tagItem.appendChild(tagName);
	dropdownTagsItems.appendChild(tagItem);
}

function selectDropdownItem(){
	for (let item of document.getElementsByClassName("tag-item"))
		item.addEventListener("click", (e) =>{
			dropdownTagsButton.innerText = e.target.text
			tagID = e.target.dataset.id;
			editTagButton.hidden = false;
			removeTagButton.hidden = false;
			tagSelected = true;
		} )
}
function getTaskData() {

	dropdownTasksItems.innerText = "";
	fetch(allTasksEndpoint)
		.then(res => res.json())
		.then(res => {
				dropdownTasksItems.innerText = "";

			if (logData)
				console.log(res)

			if (res.length > 0) {
				for (let taskObject of res)
					addToTasksDropdown(taskObject.name, taskObject._id)

				selectDropdownTaskItem();


			} else {
				approveChangesButton.hidden = true;
				dropdownTasksItems.innerText = "Brak zadań";
			}
		})
		.catch(dropdownTasksItems.innerText = "Błąd przy łączeniu się z bazą zadań")

}

function addToTasksDropdown(text, id) {
	let tagItem = document.createElement("a");
	tagItem.className = ("dropdown-item task-item");
	tagItem.href = "#";
	tagItem.text = text;
	tagItem.dataset.id = id;
	dropdownTasksItems.appendChild(tagItem);

}

function selectDropdownTaskItem(){
	for (let item of document.getElementsByClassName("task-item")) 
		item.addEventListener("click", (e) =>{
			dropdownTasksButton.innerText = e.target.text
			taskID = e.target.dataset.id;
			taskSelected=true;
		} )
}

function addTag() {

	fetch(allTagsEndpoint, {
		method: 'post',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			name: tagName.value,
			color: tagColor.value
		})
	})
	.then(res =>res.json()).then(res => {if(logData) console.log(arguments.callee.name,res)});
	
}

function editTag() {
	fetch(idTagEndpoint.concat(tagID), {
		method: 'put',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			name: tagName.value,
			color: tagColor.value
		})
	})
	.then(res =>res.json()).then(res => {if(logData) console.log(arguments.callee.name,res)});
}

function removeTag() {
	
	fetch(idTagEndpoint.concat(tagID),{
		method: 'delete',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		}
	})
	.then(res =>res.json()).then(res => {if(logData) console.log(arguments.callee.name,res)});

}

function assignTagToTask(){
	
fetch(`http://localhost:3000/api/tasks/${taskID}/tags/${tagID}`, {
	method: 'post',
	headers: {
		'Accept': 'application/json',
		'Content-Type': 'application/json'
	}
})
	.then(res =>res.json()).then(res => {if(logData) console.log(arguments.callee.name,res)});
}


showTagPanelButton.addEventListener("click", changeTagsSidebarVisibility);
dropdownTagsButton.addEventListener("click", () =>{
	editGroup.hidden="true";
	getData();

})
dropdownTasksButton.addEventListener("click", () => {
	getTaskData()
})

addTagButton.addEventListener("click", () => {
	newTagMode = true;
	editTagMode = false;
	dropdownTasks.hidden = true;
	editGroup.hidden=false;
	clearInput();
});

editTagButton.addEventListener("click", () => {
	editTagMode = true;
	newTagMode = false;
	dropdownTasks.hidden = false;
	editGroup.hidden=false;
	tagName.value=dropdownTagsButton.innerText;
});


approveChangesButton.addEventListener("click", () => {

	if(tagName.value){
		if (editTagMode) {
			editTag();
			if(taskSelected)
			assignTagToTask();
		}
		if (newTagMode) 
			addTag();
		
		
	}
	clearInput();
	newTagMode = false;
	editTagMode = false;
	taskSelected=false;
	editGroup.hidden=true;
	editTagButton.hidden=true;
	removeTagButton.hidden=true;
	dropdownTagsButton.innerText = "Wybierz tag";
	dropdownTasksButton.innerText = "Do jakiego zadania przypisać ?"
})

removeTagButton.addEventListener("click", () => {
	removeTag();
	getData();
	editTagButton.hidden = true;
	removeTagButton.hidden = true;
	dropdownTagsButton.innerText = "Wybierz tag";
});



changeEditGroupVisibility();
changeTagsSidebarVisibility();