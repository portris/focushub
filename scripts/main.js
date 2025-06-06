// Jahr im Footer
document.getElementById("year").textContent = new Date().getFullYear();

// Darkmode
const themeToggle = document.getElementById("theme-toggle");
if (themeToggle) {
  const body = document.body;

  // Beim Laden prüfen
  if (localStorage.getItem('theme') === 'dark') {
    body.classList.add('dark');
    themeToggle.textContent = '☀️';
  }

  // Klick-Handler
  themeToggle.addEventListener('click', () => {
    body.classList.toggle('dark');
    const isDark = body.classList.contains('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    themeToggle.textContent = isDark ? '☀️' : '🌙';
  });
}

// ToDo-Funktionalität
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



let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let categories = JSON.parse(localStorage.getItem("categories")) || [
  { name: "Allgemein", color: "#6c757d" }
];
let projects = JSON.parse(localStorage.getItem("projects")) || ["Standardprojekt"];

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function saveCategories() {
  localStorage.setItem("categories", JSON.stringify(categories));
}

function saveProjects() {
  localStorage.setItem("projects", JSON.stringify(projects));
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

window.removeProject = function(index) {
  const removed = projects.splice(index, 1)[0];
  tasks = tasks.filter(task => task.project !== removed);
  saveProjects();
  saveTasks();
  renderTasks();
  renderProjectOptions();
  renderProjectList();
};

projectForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = projectNameInput.value.trim();
  if (!name || projects.includes(name)) return;
  projects.push(name);
  saveProjects();
  renderProjectOptions();
  renderProjectList();
  projectForm.reset();
});

function renderCategoryOptions() {
  // Für das Eingabeformular
  categorySelect.innerHTML = "";

  // Für den Filter
  categoryFilter.innerHTML = '<option value="Alle">Alle</option>';

  categories.forEach(cat => {
    const opt1 = document.createElement("option");
    opt1.value = cat.name;
    opt1.textContent = cat.name;
    categorySelect.appendChild(opt1);

    const opt2 = document.createElement("option");
    opt2.value = cat.name;
    opt2.textContent = cat.name;
    categoryFilter.appendChild(opt2);
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

window.removeCategory = function(index) {
  const removed = categories.splice(index, 1)[0];
  tasks = tasks.filter(task => task.category !== removed.name);
  saveCategories();
  saveTasks();
  renderCategoryList();
  renderCategoryOptions();
  renderTasks();
};

function renderTasks() {
  taskList.innerHTML = "";
  const selectedCategory = categoryFilter.value;

  tasks
    .filter(task => selectedCategory === "Alle" || task.category === selectedCategory)
    .forEach((task, index) => {
      const cat = categories.find(c => c.name === task.category);
      const color = cat ? cat.color : "#666";
      const projectName = task.project ? `<em>(${task.project})</em>` : "";

      const li = document.createElement("li");
      li.className = task.done ? "done" : "";
      li.innerHTML = `
        <div class="task-text">
          <span class="task-label">${task.text} ${projectName}</span>
          <span class="badge" style="background:${color}">${task.category}</span>
        </div>
        <div class="task-actions">
          <button onclick="toggleDone(${index})" class="action-btn check"><i class="fas fa-check"></i></button>
          <button onclick="deleteTask(${index})" class="action-btn delete"><i class="fas fa-trash"></i></button>
        </div>
      `;
      taskList.appendChild(li);
    });
}

taskForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const category = document.getElementById("task-category").value;
  const project = projectSelect.value;
  tasks.push({ text: taskInput.value, done: false, category, project });
  taskInput.value = "";
  saveTasks();
  renderTasks();
});

categoryFilter.addEventListener("change", renderTasks);

window.toggleDone = function(index) {
  tasks[index].done = !tasks[index].done;
  saveTasks();
  renderTasks();
};

window.deleteTask = function(index) {
  tasks.splice(index, 1);
  saveTasks();
  renderTasks();
};

renderProjectOptions();
renderProjectList();
renderCategoryOptions(); // Kategorie-Dropdown befüllen
renderCategoryList();    // Kategorieverwaltung anzeigen
renderTasks();           // Aufgabenliste anzeigen
renderTasks();