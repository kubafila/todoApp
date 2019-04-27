    let editGroupVisibilityState = false;
    let tagsSidebarVisibilityState = true;
    let editTagMode = false;
    let newTagMode = false;
    const mainTaskList = document.getElementById("main-task-list");
    const tagsSidebar = document.getElementById("tag-panel");
    const editGroup = document.getElementById("edit-group");
    const tagName = document.getElementById("tag-name");
    const tagColor = document.getElementById("tag-color");
    const dropdownTagSelect = document.getElementById("dropdown-tag-select");

    const showTagPanelButton = document.getElementById("btn-show-tags");
    const addTagButton = document.getElementById("add-tag");
    const editTagButton = document.getElementById("btn-edit-tag");
    const removeTagButton = document.getElementById("btn-remove-tag");
    const approveChangesButton = document.getElementById("btn-approve-tag-changes");


    //Czekam nad endpointy
    const allTagsEndpoint = "";
    const idTagEndpoint = ""

    function changeEditGroupVisibility() {
    	editGroupVisibilityState = !editGroupVisibilityState;
    	editGroup.hidden = editGroupVisibilityState;
    }

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

    function editTag(id) {
    	fetch(idTagEndpoint.concat(id), {
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

    function removeTag(id) {
    	fetch(idTagEndpoint.concat(id), {
    		method: 'delete',
    		headers: {
    			'Accept': 'application/json',
    			'Content-Type': 'application/json'
    		}
    	})
    }
    changeEditGroupVisibility();
    changeTagsSidebarVisibility();
    showTagPanelButton.addEventListener("click", changeTagsSidebarVisibility);
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
    approveChangesButton.addEventListener("click", () => {
    	changeEditGroupVisibility();
    	if (editTagMode) {
    		addTag();
    		console.log(`Edytowano tag o nazwie: ${tagName.value} i kolorze: ${tagColor.value}`);
    	}
    	if (newTagMode) {
    		editTag();
    		console.log(`Dodano nowy tag o nazwie: ${tagName.value} i kolorze: ${tagColor.value}`);
    	}
    	newTagMode = false;
    	editTagMode = false;
    })