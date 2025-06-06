// Jahr im Footer
document.getElementById("year").textContent = new Date().getFullYear();

// Darkmode
const themeToggle = document.getElementById("theme-toggle");
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  localStorage.setItem("theme", document.body.classList.contains("dark") ? "dark" : "light");
});
if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark");
}

// ToDo-Funktionalität
const taskForm = document.getElementById("task-form");
const taskInput = document.getElementById("task-input");
const taskList = document.getElementById("task-list");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTasks() {
  taskList.innerHTML = "";
  tasks.forEach((task, index) => {
    const li = document.createElement("li");
    li.className = task.done ? "done" : "";
    li.innerHTML = `
      <span>${task.text}</span>
      <div>
        <button onclick="toggleDone(${index})"><i class="fas fa-check"></i></button>
        <button onclick="deleteTask(${index})"><i class="fas fa-trash"></i></button>
      </div>
    `;
    taskList.appendChild(li);
  });
}

taskForm.addEventListener("submit", (e) => {
  e.preventDefault();
  tasks.push({ text: taskInput.value, done: false });
  taskInput.value = "";
  saveTasks();
  renderTasks();
});

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

renderTasks();