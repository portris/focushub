// ==============================
// Grundeinstellungen und Theme
// ==============================
// Jahr im Footer
document.getElementById("year").textContent = new Date().getFullYear();

// Darkmode
const themeToggle = document.getElementById("theme-toggle");
if (themeToggle) {
  const body = document.body;
  if (localStorage.getItem('theme') === 'dark') {
    body.classList.add('dark');
    themeToggle.textContent = '☀️';
  }
  themeToggle.addEventListener('click', () => {
    body.classList.toggle('dark');
    const isDark = body.classList.contains('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    themeToggle.textContent = isDark ? '☀️' : '🌙';
  });
}

// ==============================
// DOM-Elemente definieren
// ==============================
const taskForm = document.getElementById("task-form");
const taskInput = document.getElementById("task-input");
const taskList = document.getElementById("task-list");

const categoryForm = document.getElementById("category-form");
const categoryNameInput = document.getElementById("new-category-name");
const categoryColorInput = document.getElementById("new-category-color");
const categoryList = document.getElementById("category-list");
const categorySelect = document.getElementById("task-category");
const categoryFilter = document.getElementById("category-filter");

const projectForm = document.getElementById("project-form");
const projectNameInput = document.getElementById("new-project-name");
const projectList = document.getElementById("project-list");
const projectSelect = document.getElementById("task-project");
const projectFilter = document.getElementById("project-filter");

const todoContainer = document.getElementById("todo-tasks");
const inprogressContainer = document.getElementById("inprogress-tasks");
const doneContainer = document.getElementById("done-tasks");

const projectSwitcher = document.getElementById("project-switcher");

const formProjectName = document.getElementById("form-project-name");
const boardTaskForm = document.getElementById("board-task-form");
const boardTaskInput = document.getElementById("board-task-input");
const boardCategorySelect = document.getElementById("board-task-category");
const boardStatusSelect = document.getElementById("board-task-status");

const adminSwitcher = document.getElementById("admin-switcher");
const formSections = {
  task: document.getElementById("task-form-section"),
  category: document.getElementById("category-form-section"),
  project: document.getElementById("project-form-section")
};

// ==============================
// Lokale Daten (localStorage)
// ==============================
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let categories = JSON.parse(localStorage.getItem("categories")) || [
  { name: "Allgemein", color: "#6c757d" }
];
let projects = JSON.parse(localStorage.getItem("projects")) || ["Standardprojekt"];

function getActiveProject() {
  return localStorage.getItem("activeProject") || "Standardprojekt";
}

// ==============================
// Event-Handler
// ==============================
function activateAdminForm(target) {
  Object.values(formSections).forEach(div => {
    div.classList.remove("active");
    div.style.maxHeight = "0px";
  });

  const selected = formSections[target];
  if (selected) {
    selected.classList.add("active");
    selected.style.maxHeight = selected.scrollHeight + "px";
    window.scrollTo({ top: document.querySelector(".todo-app-admin").offsetTop, behavior: "smooth" });
  }
}

categoryForm.addEventListener("submit", e => {
  e.preventDefault();
  const name = categoryNameInput.value.trim();
  const color = categoryColorInput.value;
  if (!name || categories.find(c => c.name.toLowerCase() === name.toLowerCase())) return;
  categories.push({ name, color });
  saveCategories();
  renderCategoryOptions();
  renderCategoryList();
  categoryForm.reset();
});

categoryFilter.addEventListener("change", renderTasks);
projectFilter.addEventListener("change", renderTasks);

projectForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = projectNameInput.value.trim();
  if (!name || projects.includes(name)) return;
  projects.push(name);
  saveProjects();
  renderProjectOptions();
  renderProjectList();
  projectForm.reset();
  renderProjectSwitcher();
  renderKanban();
});

taskForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const category = document.getElementById("task-category").value;
  const project = projectSelect.value;
  tasks.push({ text: taskInput.value, status: "todo", category, project });
  taskInput.value = "";
  saveTasks();
  renderTasks();
  renderKanban();
  renderProjectSwitcher();
});

projectSwitcher.addEventListener("change", () => {
  localStorage.setItem("activeProject", projectSwitcher.value);
  renderKanban();
  renderTasks();
  renderProjectSwitcher();
});

boardTaskForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const newTask = {
    text: boardTaskInput.value.trim(),
    done: boardStatusSelect.value === "done",
    status: boardStatusSelect.value,
    category: boardCategorySelect.value,
    project: getActiveProject()
  };

  tasks.push(newTask);
  saveTasks();
  localStorage.setItem("tasks", JSON.stringify(tasks));
  boardTaskForm.reset();
  renderTasks();
  renderKanban();
  renderProjectSwitcher();
});

// ==============================
// Daten speichern (localStorage)
// ==============================
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function saveCategories() {
  localStorage.setItem("categories", JSON.stringify(categories));
}

function saveProjects() {
  localStorage.setItem("projects", JSON.stringify(projects));
}

// ==============================
// Rendering-Funktionen
// ==============================
function renderCategoryOptions() {
  categorySelect.innerHTML = "";
  categoryFilter.innerHTML = '<option value="Alle">Alle</option>';
  boardCategorySelect.innerHTML = '<option value="" disabled selected>Kategorie wählen</option>';
  categories.forEach(cat => {
    const opt1 = document.createElement("option");
    opt1.value = cat.name;
    opt1.textContent = cat.name;
    categorySelect.appendChild(opt1);

    const opt2 = document.createElement("option");
    opt2.value = cat.name;
    opt2.textContent = cat.name;
    categoryFilter.appendChild(opt2);

    const opt3 = document.createElement("option");
    opt3.value = cat.name;
    opt3.textContent = cat.name;
    boardCategorySelect.appendChild(opt3);
  });
}

function renderProjectFilterOptions() {
  projectFilter.innerHTML = '<option value="Alle">Alle</option>';
  projects.forEach(name => {
    const opt = document.createElement("option");
    opt.value = name;
    opt.textContent = name;
    projectFilter.appendChild(opt);
  });
}

function renderCategoryList() {
  categoryList.innerHTML = "";
  categories.forEach((cat, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <span class="category-badge" style="background:${cat.color}">${cat.name}</span>
      <button onclick="removeCategory(${index})" class="action-btn delete"><i class="fas fa-trash"></i></button>
    `;
    categoryList.appendChild(li);
  });
}

function renderProjectOptions() {
  projectSelect.innerHTML = '<option value="" disabled selected>Projekt wählen</option>';
  projects.forEach(name => {
    const opt = document.createElement("option");
    opt.value = name;
    opt.textContent = name;
    projectSelect.appendChild(opt);
  });
}

function renderProjectList() {
  projectList.innerHTML = "";
  projects.forEach((name, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <span>${name}</span>
      <button onclick="removeProject(${index})" class="action-btn delete"><i class="fas fa-trash"></i></button>
    `;
    projectList.appendChild(li);
  });
}

function renderProjectSwitcher() {
  projectSwitcher.innerHTML = "";

  projects.forEach(project => {
    const opt = document.createElement("option");
    opt.value = project;
    opt.textContent = project;
    if (project === getActiveProject()) {
      opt.selected = true;
    }
    projectSwitcher.appendChild(opt);
  });
}

function renderTasks() {
  taskList.innerHTML = "";
  const selectedCategory = categoryFilter.value;
  const selectedProject = projectFilter.value;

  tasks
    .filter(task => (selectedCategory === "Alle" || task.category === selectedCategory) &&
      (selectedProject === "Alle" || task.project === selectedProject)
    )
    .forEach((task, index) => {
      const cat = categories.find(c => c.name === task.category);
      const color = cat ? cat.color : "#666";
      const projectName = task.project ? `<em>(${task.project})</em>` : "";

      const li = document.createElement("li");
      if (task.status === "done") {
        li.style.opacity = 0.6;
      }
      li.innerHTML = `
        <div class="task-text">
          <span class="task-label">${task.text} ${projectName}</span>
          <span class="badge" style="background:${color}">${task.category}</span>
        </div>
        <div class="task-actions">
          <button onclick="deleteTask(${index})" class="action-btn delete"><i class="fas fa-trash"></i></button>
        </div>
      `;
      taskList.appendChild(li);
    });
}

function renderKanban() {
  todoContainer.innerHTML = "";
  inprogressContainer.innerHTML = "";
  doneContainer.innerHTML = "";

  const activeProject = getActiveProject();

  // Projektname im UI aktualisieren
  document.getElementById("active-project-name").textContent = activeProject;
  document.getElementById("form-project-name").textContent = activeProject;
  document.getElementById("header-project-name").textContent = activeProject;
  tasks.forEach((task, taskIndex) => {
    if (task.project !== activeProject) return;

    const taskElement = document.createElement("div");
    taskElement.className = "kanban-task";
    taskElement.setAttribute("draggable", "true");
    taskElement.dataset.index = taskIndex;

    // Drag Start
    taskElement.addEventListener("dragstart", e => {
      e.dataTransfer.setData("text/plain", taskIndex.toString());
    });

    const cat = categories.find(c => c.name === task.category);
    const catColor = cat ? cat.color : "#666";

    taskElement.innerHTML = `
      <div class="kanban-text">
        ${task.text}
        <span class="badge" style="background:${catColor}">${task.category}</span>
      </div>
      <div class="kanban-controls">
        <button class="status-btn" data-status="todo">📝</button>
        <button class="status-btn" data-status="inprogress">🔄</button>
        <button class="status-btn" data-status="done">✅</button>
      </div>
    `;

    // Status-Buttons
    taskElement.querySelectorAll(".status-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const newStatus = btn.dataset.status;
        setStatus(taskIndex, newStatus);
      });
    });

    // In richtige Spalte einfügen
    const targetContainer =
    task.status === "done" ? doneContainer :
    task.status === "inprogress" ? inprogressContainer :
    todoContainer;

    targetContainer.appendChild(taskElement);

    // Kleine Verzögerung, damit CSS-Transition greift
    requestAnimationFrame(() => {
      taskElement.classList.add("show");
    });
  });

  setupDropZones(); // Drop-Zonen neu aktivieren
}

// ==============================
// Drag & Drop
// ==============================
function setupDropZones() {
  const statuses = ["todo", "inprogress", "done"];

  statuses.forEach(status => {
    const dropZone = document.getElementById(`${status}-tasks`);
    if (!dropZone) return;

    dropZone.ondragover = e => {
      e.preventDefault();
      dropZone.classList.add("drag-over");
    };

    dropZone.ondragleave = () => {
      dropZone.classList.remove("drag-over");
    };

    dropZone.ondrop = e => {
      e.preventDefault();
      dropZone.classList.remove("drag-over");

      const taskIndex = parseInt(e.dataTransfer.getData("text/plain"));
      if (!isNaN(taskIndex)) {
        tasks[taskIndex].status = status;
        saveTasks();
        renderKanban();
      }
    };
  });
}

// ==============================
// Status setzen & entfernen
// ==============================

window.removeProject = function(index) {
  const removed = projects.splice(index, 1)[0];
  tasks = tasks.filter(task => task.project !== removed);
  saveProjects();
  saveTasks();
  renderTasks();
  renderProjectOptions();
  renderProjectList();
  renderProjectSwitcher();
  renderKanban();
};



window.removeCategory = function(index) {
  const removed = categories.splice(index, 1)[0];
  tasks = tasks.filter(task => task.category !== removed.name);
  saveCategories();
  saveTasks();
  renderCategoryList();
  renderCategoryOptions();
  renderTasks();
  renderProjectSwitcher();
  renderKanban();
};

window.deleteTask = function(index) {
  tasks.splice(index, 1);
  saveTasks();
  renderTasks();
  renderKanban();
  renderProjectSwitcher();
};

function setStatus(index, status) {
  tasks[index].status = status;
  saveTasks();
  renderKanban();
}

window.setStatus = function(index, status) {
  tasks[index].status = status;
  localStorage.setItem("tasks", JSON.stringify(tasks));
  renderTasks();
  renderKanban();
  renderProjectSwitcher();
};


document.querySelectorAll(".nav-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const target = btn.dataset.target;
    if (target === "board") {
      window.scrollTo({ top: document.querySelector("main").offsetTop, behavior: "smooth" });
    } else {
      activateAdminForm(target);
    }
  });
});

// ==============================
// Initialisierung
// ==============================
renderProjectOptions();
renderProjectList();
renderCategoryOptions(); // Kategorie-Dropdown befüllen
renderProjectFilterOptions();
renderCategoryList();    // Kategorieverwaltung anzeigen
renderTasks();           // Aufgabenliste anzeigen
renderProjectSwitcher();
renderKanban();
setupDropZones();
   ["todo", "inprogress", "done"].forEach(status => {
  const column = document.querySelector(`.board-column[data-status="${status}"]`);

  column.addEventListener("dragover", e => {
    e.preventDefault();
    column.classList.add("drag-over");
  });

  column.addEventListener("dragleave", () => {
    column.classList.remove("drag-over");
  });

  column.addEventListener("drop", e => {
    e.preventDefault();
    column.classList.remove("drag-over");

    const taskIndex = e.dataTransfer.getData("text/plain");
    tasks[taskIndex].status = status;
    localStorage.setItem("tasks", JSON.stringify(tasks));
    renderKanban();
  });
});