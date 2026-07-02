/* =========================================
   TASKFLOW PRO v4
   PART 1
========================================= */
const productivityScore = document.getElementById("productivityScore");
const todayTasks2 = document.getElementById("todayTasks2");
const completedTasks2 = document.getElementById("completedTasks2");
const overdueTasks2 = document.getElementById("overdueTasks2");
const todoCount = document.getElementById("todoCount");
const progressCount = document.getElementById("progressCount");
const doneCount = document.getElementById("doneCount");
const exportBtn = document.getElementById("exportBtn");
const exportMenu = document.getElementById("exportMenu");
const exportJSONBtn =
document.getElementById("exportJSONBtn");
const modal = document.getElementById("taskModal");
const addBtn = document.getElementById("addTaskBtn");
const closeBtn = document.querySelector(".close-btn");
const taskForm = document.getElementById("taskForm");

const taskTitle = document.getElementById("taskTitle");
const taskDescription = document.getElementById("taskDescription");
const taskDate = document.getElementById("taskDate");
const taskPriority = document.getElementById("taskPriority");

const searchInput = document.getElementById("searchTask");
const filterBtn = document.getElementById("filterBtn");
const filterMenu = document.getElementById("filterMenu");
const filterText = document.getElementById("filterText");

let selectedFilter = "all";

const exportCSVBtn =
document.getElementById("exportCSVBtn");

const todo = document.getElementById("todo");
const progress = document.getElementById("progress");
const done = document.getElementById("done");

const totalTasks = document.getElementById("totalTasks");
const completedTasks = document.getElementById("completedTasks");
const overdueTasks = document.getElementById("overdueTasks");
const todayTasks = document.getElementById("todayTasks");
const progressPercent = document.getElementById("progressPercent");
const progressFill = document.getElementById("progressFill");

const deleteModal = document.getElementById("deleteModal");
const confirmDelete = document.getElementById("confirmDelete");
const cancelDelete = document.getElementById("cancelDelete");

let tasks =
JSON.parse(localStorage.getItem("tasks")) || [];

let editingId = null;
let deleteId = null;

/* ===========================
OPEN MODAL
=========================== */

addBtn.onclick = function(){

    editingId = null;

    taskForm.reset();

    document.querySelector(".modal-content h2").textContent =
    "Add New Task";

    document.querySelector(".saveTaskBtn").textContent =
    "Add Task";

    modal.style.display = "flex";

}

closeBtn.onclick = function(){

    modal.style.display = "none";

}

window.onclick = function(e){

    if(e.target===modal){

        modal.style.display="none";

    }

    if(e.target===deleteModal){

        deleteModal.style.display="none";

    }

}

/* ===========================
SAVE TASK
=========================== */

taskForm.addEventListener("submit",function(e){

    e.preventDefault();

    if(editingId===null){

        const newTask={

            id:Date.now(),

            title:taskTitle.value.trim(),

            description:taskDescription.value.trim(),

            date:taskDate.value,

            priority:taskPriority.value,

            status:"todo",

            created:new Date().toLocaleString("en-MY",{
                day:"2-digit",
                month:"short",
                year:"numeric"
})

        };

        tasks.push(newTask);

        showToast("✅ Task Added");

    }

    else{

        const task=
        tasks.find(t=>t.id===editingId);

        task.title=taskTitle.value.trim();

        task.description=taskDescription.value.trim();

        task.date=taskDate.value;

        task.priority=taskPriority.value;

        showToast("✏️ Task Updated");

    }

    saveTasks();

    renderTasks();

    taskForm.reset();

    modal.style.display="none";

});

/* ===========================
RENDER TASKS
=========================== */

function renderTasks(){

    todo.innerHTML="";
    progress.innerHTML="";
    done.innerHTML="";

    const keyword=searchInput.value.toLowerCase();

    const priorityFilter = selectedFilter;

    const filteredTasks=tasks.filter(task=>{

        const searchMatch=

        task.title.toLowerCase().includes(keyword) ||

        task.description.toLowerCase().includes(keyword);

        const priorityMatch=

        priorityFilter==="all" ||

        task.priority===priorityFilter;

        return searchMatch && priorityMatch;

    });

    filteredTasks.forEach(task=>{

        const card=document.createElement("div");

        card.className="task-card fade-up";

        card.draggable=true;

        card.dataset.id=task.id;

        card.innerHTML=`

        <div class="task-header">

            <h3>${task.title}</h3>

        </div>

        <div class="task-description">

            <i class="fa-solid fa-align-left"></i>

            <p>${task.description || "No description added."}</p>

        </div>

        <div class="task-meta">

            <span class="${getDueClass(task.date)}">

                ${getDueText(task.date)}

            </span>

            <span class="priority ${task.priority}">

                ${task.priority} Priority

            </span>

        </div>

        <div class="task-created">

            Created: ${task.created || "Today"}

        </div>

        <div class="task-divider"></div>

        <div class="task-actions">

            <button
            class="edit-btn"
            onclick="editTask(${task.id})">

                <i class="fa-solid fa-pen"></i>

            </button>

            <button
            class="delete-btn"
            onclick="deleteTask(${task.id})">

                <i class="fa-solid fa-trash"></i>

            </button>

        </div>

        `;

        enableDrag(card);

        if(task.status==="todo"){

            todo.appendChild(card);

        }

        else if(task.status==="progress"){

            progress.appendChild(card);

        }

        else{

            done.appendChild(card);

        }

    });

    emptyState(todo);

    emptyState(progress);

    emptyState(done);

    updateDashboard();
    updateChart();

}

/* ===========================
EMPTY STATE
=========================== */

function emptyState(column){

    if(column.children.length===0){

        column.innerHTML=`

        <div class="empty-state">

            <div>📋</div>

            <h4>No Tasks</h4>

            <p>Add or move a task here.</p>

        </div>

        `;

    }

}

/* ===========================
DUE DATE
=========================== */

function getDueText(date){

    if(!date) return "📅 No Due Date";

    const today = new Date();
    today.setHours(0,0,0,0);

    const due = new Date(date);
    due.setHours(0,0,0,0);

    const diff = (due - today) / (1000 * 60 * 60 * 24);

    if(diff < 0){
        return "🔴 Overdue";
    }

    if(diff === 0){
        return "🟡 Today";
    }

    if(diff === 1){
        return "🟢 Tomorrow";
    }

    const formattedDate = due.toLocaleDateString("en-MY",{
        day:"numeric",
        month:"short",
        year:"numeric"
    });

    return `📅 ${formattedDate}`;

}

function getDueClass(date){

    if(!date) return "due";

    const today=new Date();

    today.setHours(0,0,0,0);

    const due=new Date(date);

    due.setHours(0,0,0,0);

    const diff=(due-today)/(1000*60*60*24);

    if(diff<0){

        return "due overdue";

    }

    if(diff===0){

        return "due today";

    }

    return "due upcoming";

}

/* ===========================
DRAG & DROP
=========================== */

function enableDrag(card){

    card.addEventListener("dragstart",function(){

        card.classList.add("dragging");

    });

    card.addEventListener("dragend",function(){

        card.classList.remove("dragging");

    });

}

document.querySelectorAll(".task-list").forEach(column=>{

    column.addEventListener("dragover",function(e){

        e.preventDefault();

        column.classList.add("drag-over");

    });

    column.addEventListener("dragleave",function(){

        column.classList.remove("drag-over");

    });

    column.addEventListener("drop",function(){

        const dragging=document.querySelector(".dragging");

        if(!dragging) return;

        const id=Number(dragging.dataset.id);

        const task=tasks.find(t=>t.id===id);

        task.status=column.id;

        saveTasks();

        renderTasks();

        showToast("📦 Task Moved");

        column.classList.remove("drag-over");

    });

});

/* ===========================
EDIT
=========================== */

function editTask(id){

    const task=tasks.find(t=>t.id===id);

    editingId=id;

    taskTitle.value=task.title;

    taskDescription.value=task.description;

    taskDate.value=task.date;

    taskPriority.value=task.priority;

    document.querySelector(".modal-content h2").textContent="Edit Task";

    document.querySelector(".saveTaskBtn").textContent="Update Task";

    modal.style.display="flex";

}

/* ===========================
DELETE
=========================== */

function deleteTask(id){

    deleteId=id;

    deleteModal.style.display="flex";

}

confirmDelete.onclick=function(){

    tasks=tasks.filter(task=>task.id!==deleteId);

    saveTasks();

    renderTasks();

    deleteModal.style.display="none";

    showToast("🗑️ Task Deleted");

}

cancelDelete.onclick=function(){

    deleteModal.style.display="none";

}

/* ===========================
DASHBOARD
=========================== */

function updateDashboard(){

    const total = tasks.length;

    const completed =
    tasks.filter(t => t.status === "done").length;

    const today = new Date();
    today.setHours(0,0,0,0);

    const overdue =
    tasks.filter(t => {
        if(!t.date || t.status === "done") return false;

        const due = new Date(t.date);
        due.setHours(0,0,0,0);

        return due < today;
    }).length;

    const dueToday =
    tasks.filter(t => {
        if(!t.date || t.status === "done") return false;

        const due = new Date(t.date);
        due.setHours(0,0,0,0);

        return due.getTime() === today.getTime();
    }).length;

    totalTasks.textContent = total;
    completedTasks.textContent = completed;
    overdueTasks.textContent = overdue;
    todayTasks.textContent = dueToday;

    const percent =
    total === 0 ? 0 : Math.round((completed / total) * 100);

    progressPercent.textContent = percent + "%";
    progressFill.style.width = percent + "%";

    todoCount.textContent =
tasks.filter(t => t.status === "todo").length;

progressCount.textContent =
tasks.filter(t => t.status === "progress").length;

doneCount.textContent =
tasks.filter(t => t.status === "done").length;

productivityScore.textContent = percent + "%";
todayTasks2.textContent = dueToday;
completedTasks2.textContent = completed;
overdueTasks2.textContent = overdue;

}

/* ===========================
LOCAL STORAGE
=========================== */

function saveTasks(){

    localStorage.setItem(
        "tasks",
        JSON.stringify(tasks)
    );

}

/* ===========================
SEARCH
=========================== */

searchInput.addEventListener("input",function(){

    renderTasks();

});

/* ===========================
FILTER
=========================== */

filterBtn.addEventListener("click",function(){

    filterMenu.classList.toggle("show");

    filterBtn.classList.toggle("active");

});

document.querySelectorAll(".filter-menu button").forEach(button=>{

    button.addEventListener("click",function(){

        selectedFilter = this.dataset.value;

        filterText.textContent = this.textContent;

        document.querySelectorAll(".filter-menu button").forEach(btn=>{
            btn.classList.remove("active");
        });

        this.classList.add("active");

        filterMenu.classList.remove("show");

        filterBtn.classList.remove("active");

        renderTasks();

    });

});

window.addEventListener("click",function(e){

    if(!filterBtn.contains(e.target) && !filterMenu.contains(e.target)){

        filterMenu.classList.remove("show");

        filterBtn.classList.remove("active");

    }

});

/* ===========================
KEYBOARD SHORTCUT
=========================== */

document.addEventListener("keydown",function(e){

    if(e.key==="Escape"){

        modal.style.display="none";

        deleteModal.style.display="none";

    }

});

/* ===========================
AUTO SAVE
=========================== */

window.addEventListener("beforeunload",function(){

    saveTasks();

});

/* ===========================
INITIALIZE
=========================== */

renderTasks();

showToast("🚀 TaskFlow Pro Ready");

/* ===========================
EXPORT CSV
=========================== */

exportCSVBtn.addEventListener("click",exportCSV);

function exportCSV(){

    if(tasks.length===0){

        showToast("⚠️ No tasks to export");

        return;

    }

    let csv=
"Title,Description,Due Date,Priority,Status,Created\n";

    tasks.forEach(task=>{

        csv+=`"${task.title}","${task.description}","${task.date}","${task.priority}","${task.status}","${task.created}"\n`;

    });

    const blob=
    new Blob([csv],{type:"text/csv"});

    const url=
    URL.createObjectURL(blob);

    const a=
    document.createElement("a");

    a.href=url;

    a.download="TaskFlow_Tasks.csv";

    a.click();

    URL.revokeObjectURL(url);

    showToast("📄 CSV Exported");

}

/* ===========================
EXPORT JSON
=========================== */

exportJSONBtn.addEventListener("click", exportJSON);

function exportJSON(){

    if(tasks.length===0){

        showToast("⚠️ No tasks to export");

        return;

    }

    const json =
    JSON.stringify(tasks,null,4);

    const blob =
    new Blob([json],{
        type:"application/json"
    });

    const url =
    URL.createObjectURL(blob);

    const a =
    document.createElement("a");

    a.href = url;

    a.download = "TaskFlow_Tasks.json";

    a.click();

    URL.revokeObjectURL(url);

    showToast("📁 JSON Exported");

}

exportBtn.addEventListener("click", function(){

    exportMenu.classList.toggle("show");

    exportBtn.classList.toggle("active");

});

window.addEventListener("click", function(e){

    if(!exportBtn.contains(e.target) && !exportMenu.contains(e.target)){

        exportMenu.classList.remove("show");

    }

});