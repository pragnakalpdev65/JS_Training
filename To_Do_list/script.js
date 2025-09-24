
const input = document.getElementById("task");
const pri = document.getElementById("prio");
const taskList = document.getElementById("task_list");
const addBtn = document.getElementById("addbtn");
const stts = document.getElementById("status");
const priorty = document.getElementById("priority");
const complete_task = document.getElementById("complete_task_list");
const filterList = document.getElementById("all");
let listItemCounter = 0;

let tasks = [];
SavedTasks();

addBtn.addEventListener("click", addTask);
input.addEventListener("keypress", function (event) {
    if (event.key === "Enter") addBtn.click();
});



function addTask() {

    let task = input.value.trim();

    if (task !== "") {

        if (/[a-zA-Z]/.test(task)) {
            let a = tasks.find(a => a.text == task);
            if (a) {
                alert("This task is already added.");
            }
            else {
                if (confirm("Confirm to add a task?")) {
                    let listItem = createTaskElement(task, pri.value, listItemCounter);
                    taskList.appendChild(listItem);

                    tasks.push({
                        id: listItemCounter,
                        text: task,
                        priority: pri.value,
                        completed: false
                    });
                    localStorage.setItem("tasks", JSON.stringify(tasks));

                    listItemCounter++;
                    input.value = "";
                    filterTasks();
                }
            }
        }
        else{
            alert("Enter words not only numbers or special character.");
            input.value = "";
        }
    }
    else {
        alert("Enter task..!");
    }
}



function createTaskElement(taskText, priority, id, completed = false) {
    let listItem = document.createElement("li");
    listItem.id = id;

    let chkbox = document.createElement("input");
    chkbox.type = "checkbox";
    chkbox.checked = completed;

    let taskSpan = document.createElement("span");
    taskSpan.textContent = taskText;

    if (completed) {
        taskSpan.style.textDecoration = "line-through";
        taskSpan.style.color = "gray";
        complete_task.appendChild(listItem);
    }

    chkbox.addEventListener("change", function () {
        updateTaskStatus(listItem.id, chkbox.checked);
        if (chkbox.checked) {
            taskSpan.style.textDecoration = "line-through";
            taskSpan.style.color = "gray";
            complete_task.appendChild(listItem);
        }
        else {
            taskSpan.style.textDecoration = "none";
            taskSpan.style.color = "black";
            taskList.appendChild(listItem);
        }
        filterTasks();
    });

    let delBtn = document.createElement("button");
    delBtn.textContent = "x";
    delBtn.addEventListener("click", function () {
        if (confirm("Do you want to delete this task?")) {
            listItem.remove();
            tasks = tasks.filter(t => t.id != listItem.id);
            localStorage.setItem("tasks", JSON.stringify(tasks));
            filterTasks();
        }
    });

    taskSpan.addEventListener("dblclick", function () {
        let editInput = document.createElement("input");
        editInput.type = "text";
        editInput.value = taskSpan.textContent;
        listItem.replaceChild(editInput, taskSpan);

        editInput.addEventListener("keypress", function (event) {
            if (event.key == "Enter") {
                taskSpan.textContent = editInput.value;
                listItem.replaceChild(taskSpan, editInput);

                let t = tasks.find(t => t.id == listItem.id);
                if (t) {
                    t.text = editInput.value;
                    localStorage.setItem("tasks", JSON.stringify(tasks));
                }
                filterTasks();
            }
        });
    });

    listItem.append(chkbox, taskSpan, delBtn);
    return listItem;
}

function updateTaskStatus(id, completed) {
    let t = tasks.find(t => t.id == id);
    if (t) {
        t.completed = completed;
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }
}

function filterTasks() {
    filterList.innerHTML = "";
    let statusVal = stts.value;
    let priorityVal = priorty.value;

    tasks.forEach(task => {
        let matchStatus = statusVal == "All" || (statusVal == "Completed" && task.completed) || (statusVal === "Pending" && !task.completed);

        let matchPriority = priorityVal == "All" || task.priority == priorityVal;

        if (matchStatus && matchPriority) {
            let li = document.createElement("li");
            li.textContent = task.text + " (" + task.priority + ")";
            filterList.appendChild(li);
        }
        else{

            document.getElementById("nofound").innerHTML="There is no task that match your filter."
            
        }
    });
}

function SavedTasks() {
    tasks.forEach(task => {
        let listItem = createTaskElement(task.text, task.priority, task.id, task.completed);
        if (task.completed) {
            complete_task.appendChild(listItem);
        } else {
            taskList.appendChild(listItem);
        }
        
    });
    filterTasks();
}


stts.addEventListener("change", filterTasks);
priorty.addEventListener("change", filterTasks);

function myfunction() {
    document.body.classList.toggle("dark-mode");
}




