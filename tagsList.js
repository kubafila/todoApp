let editGroupVisibilityState = false;
let tagsSidebarVisibilityState = true;
let editTagMode = false;
let newTagMode = false;

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


//Czekam nad endpointy, chwilowo używam zadań zamiast tagów
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
approveChangesButton.hidden=true;

let tagSelected = false;
let taskSelected = false;



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

function getData() {

	dropdownTagsItems.innerText = "";
	fetch(allTagsEndpoint)
		.then(res => res.json())
		.then(res => {
			if(res.length >0){


				for (let tagObject of res)
					addToDropdown(tagObject.name, tagObject._id, tagObject.color)

				selectDropdownItem();

					
			}
			else{
				editTagButton.hidden= true;
				removeTagButton.hidden = true;
				
			}
		})

}

function addToDropdown(text, id,color) {
	let tagItem = document.createElement("a");
	tagItem.className = ("dropdown-item tag-item");
	tagItem.href = "#";
	tagItem.text = text;
	tagItem.dataset.id = id;
	tagItem.style.backgroundColor=color;
	dropdownTagsItems.appendChild(tagItem);


}

function selectDropdownItem(){
	for (let item of document.getElementsByClassName("tag-item"))
		item.addEventListener("click", (e) =>{
			dropdownTagsButton.innerText = e.target.text
			tagID = e.target.dataset.id;
			editTagButton.hidden = false;
			removeTagButton.hidden = false;
		
		} )
}
function getTaskData() {

	dropdownTasksItems.innerText = "";
	fetch(allTasksEndpoint)
		.then(res => res.json())
		.then(res => {

			if (res.length > 0) {


				for (let taskObject of res)
					addToTasksDropdown(taskObject.name, taskObject._id)

				selectDropdownTaskItem();


			} else {
				approveChangesButton.hidden = true;
			}

		
		})

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
			approveChangesButton.hidden = false;
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
}

function removeTag() {
	
	fetch(idTagEndpoint.concat(tagID),{
		method: 'delete',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		}
	})

}

function assignTagToTask(){
	
fetch(`http://localhost:3000/api/tasks/${taskID}/tags/${tagID}`, {
	method: 'post',
	headers: {
		'Accept': 'application/json',
		'Content-Type': 'application/json'
	}
})
.then(x => x.json())
.then(x => console.log(x));
}

changeEditGroupVisibility();
changeTagsSidebarVisibility();

showTagPanelButton.addEventListener("click", changeTagsSidebarVisibility);
dropdownTagsButton.addEventListener("click", () =>{
	getData();

})
dropdownTasksButton.addEventListener("click", () => {
	getTaskData()
})

addTagButton.addEventListener("click", () => {
	newTagMode = true;
	editTagMode = false;
	dropdownTasks.hidden = true;
	approveChangesButton.hidden=false;
	changeEditGroupVisibility()

});

editTagButton.addEventListener("click", () => {
	editTagMode = true;
	newTagMode = false;
	dropdownTasks.hidden = false;
	changeEditGroupVisibility()
});


approveChangesButton.addEventListener("click", () => {
	changeEditGroupVisibility();
	console.log(tagID,taskID);
	if(tagName.value){
		if (editTagMode) {
			editTag();

			assignTagToTask();
			console.log(`Edytowano tag o nazwie: ${tagName.value} i kolorze: ${tagColor.value}`);
		}
		if (newTagMode) {
			addTag();
			console.log(`Dodano nowy tag o nazwie: ${tagName.value} i kolorze: ${tagColor.value}`);
			approveChangesButton.hidden = true;
		}
	}
		
		

	newTagMode = false;
	editTagMode = false;
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
