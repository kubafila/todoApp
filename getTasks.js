window.onload = function () {
    const form = document.getElementById("form");
    const input = document.getElementById("input");
    const btn = document.getElementById("btn");
    const btnAll = document.getElementById('btn-all')
    const btnTodo = document.getElementById('btn-todo')
    const btnDone = document.getElementById('btn-done')
    const list = document.getElementById("list");
    let id = 1;

    let allTasks = []

    fetch("http://localhost:3000/api/tasks").then(tasks => tasks.json()).then(tasks => {
        tasks.forEach(task => {
            allTasks.push(task);
            const item = createItem(task._id, task.name, task.isDone);
            list.insertAdjacentHTML('beforeend', item);

        })
    })


    btn.addEventListener('click', addToDoItem);

    list.addEventListener("click", listenToElementChanges);
    btnDone.addEventListener("click", filterByDone);
    btnTodo.addEventListener('click', filterNotDone)
    btnAll.addEventListener('click', displayAll)

    function filterByDone(e) {
        btnAll.className = "btn btn-sm btn-dark";
        btnTodo.className = "btn btn-sm btn-dark";
        btnDone.className = "btn btn-sm btn-primary active";
        
        list.innerHTML = '';

        const tasks = allTasks.filter(el => el.isDone);
        tasks.forEach(task => {
            const item = createItem(task._id, task.name, task.isDone);
            list.insertAdjacentHTML('beforeend', item);


        });
    }

    const createItem = (id, name, isDone) => {
        return `<li class="${isDone?'li-done':'' }" id="${id}">${name}
        <input id="box-${id}" class="checkbox" ${isDone ? 'checked ' : ''} type="checkbox"> <input  type="button" class='btn btn-danger' value="X"></input> </li>`;
    }

    function filterNotDone(e) {
        btnAll.className = "btn btn-sm btn-dark";
        btnTodo.className = "btn btn-sm btn-primary active";
        btnDone.className = "btn btn-sm btn-dark ";
        list.innerHTML = '';

        const tasks = allTasks.filter(el => el.isDone === false);
        tasks.forEach(task => {
            const item = createItem(task._id, task.name, task.isDone);
            list.insertAdjacentHTML('beforeend', item);

        });
    }

    function displayAll(e) {
        btnAll.className = "btn btn-sm btn-primary active";
        btnTodo.className = "btn btn-sm btn-dark";
        btnDone.className = "btn btn-sm btn-dark ";
        list.innerHTML = '';
        allTasks.forEach(task => {
            const item = createItem(task._id, task.name, task.isDone);

            list.insertAdjacentHTML('beforeend', item);

        });
    }

    function addToDoItem(e) {
        e.preventDefault()
        if (input.value.length <= 3) {
            alert('Value is too short! Enter value that has more than 3 characters')
        } else {
            fetch('http://localhost:3000/api/tasks', {
                method: 'POST',
                body: JSON.stringify({
                    name: input.value,
                    isDone: false,
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(res => res.json()).then(task => {
                if (list.style.borderTop === "") {
                    list.style.borderTop = "2px solid white";
                }
                const item = createItem(task._id, task.name, task.isDone);

                list.insertAdjacentHTML('beforeend', item);
                id++;
                form.reset();
                allTasks.push(task)
            })

        }
    }

    function listenToElementChanges(event) {
        const element = event.target;
        if (element.type === "checkbox") {
            if (element.checked) {
                console.log('if')
                element.parentNode.style.textDecoration = "line-through"

            } else {
                console.log('else')
                element.parentNode.style.textDecoration = "none"
            }
            fetch(`http://localhost:3000/api/tasks/${element.parentNode.id}`, {
                method: 'PUT',
                body: JSON.stringify({
                    name: element.parentNode.innerText,
                    isDone: element.checked,
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(res => res.json()).then(res => allTasks = allTasks.map(el => el._id === res._id ? res : el))

        }

        if (element.type === "button") {
            fetch(`http://localhost:3000/api/tasks/${element.parentNode.id}`, {
                method: 'DELETE',
            }).then(res => res.json()).then(res => {
                const child = document.getElementById(res._id);
                list.removeChild(child)
            })
        }

    }
}