let editGroupVisibilityState = false;
let tagsSidebarVisibilityState = true;
let editTagMode = false;
let newTagMode = false;

const mainTaskList = document.getElementById("main-task-list");
const tagsSidebar = document.getElementById("tag-panel");
const editGroup = document.getElementById("edit-group");
const tagName = document.getElementById("tag-name");
const tagColor = document.getElementById("tag-color");
const dropdownMenuItems = document.getElementById("dropdown-menu-items");

const showTagPanelButton = document.getElementById("btn-show-tags");
const dropdownButton = document.getElementById("dropdown-button");
const addTagButton = document.getElementById("add-tag");
const editTagButton = document.getElementById("btn-edit-tag");
const removeTagButton = document.getElementById("btn-remove-tag");
const approveChangesButton = document.getElementById("btn-approve-tag-changes");


//Czekam nad endpointy, chwilowo używam zadań zamiast tagów
const allTagsEndpoint = "http://localhost:3000/api/tasks";
const idTagEndpoint = "http://localhost:3000/api/tasks/"

//dostaje wartośc w selectDropdownItem()
let tagID ="";

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

	dropdownMenuItems.innerText = "";
	fetch(allTagsEndpoint)
		.then(res => res.json())
		.then(res => {
			for (let tagObject of res)
				addToDropdown(tagObject.name, tagObject._id)

			selectDropdownItem();
		})

}

function selectDropdownItem(){
	for (let item of document.getElementsByClassName("dropdown-item")) 
		item.addEventListener("click", (e) =>{
			dropdownButton.innerText = e.target.text
			tagID = e.target.dataset.id;
			console.log(e.target.text,e.target.dataset.id);
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
			// color: "#ffffff"
		})
	})
	.then(res =>res.json())
	.then(m => console.log(m));
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
			// color: tagColor.value
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
	.then(x =>x.json())
	.then(x => console.log(x))
}

function addToDropdown(text,id){
	let tagItem = document.createElement("a");
	tagItem.className=("dropdown-item");
	tagItem.href="#";
	tagItem.text = text;
	tagItem.dataset.id=id;
	dropdownMenuItems.appendChild(tagItem);

}

changeEditGroupVisibility();
changeTagsSidebarVisibility();

showTagPanelButton.addEventListener("click", changeTagsSidebarVisibility);
dropdownButton.addEventListener("click", getData)

addTagButton.addEventListener("click", () => {
	newTagMode = true;
	editTagMode = false;
	changeEditGroupVisibility()

});

editTagButton.addEventListener("click", () => {
	editTagMode = true;
	newTagMode = false;
	changeEditGroupVisibility()
});

removeTagButton.addEventListener("click", removeTag);

approveChangesButton.addEventListener("click", () => {
	changeEditGroupVisibility();
	if (editTagMode) {
		editTag();
		console.log(`Edytowano tag o nazwie: ${tagName.value} i kolorze: ${tagColor.value}`);
	}
	if (newTagMode) {
		addTag();
		console.log(`Dodano nowy tag o nazwie: ${tagName.value} i kolorze: ${tagColor.value}`);
	}
	newTagMode = false;
	editTagMode = false;
})

