const themeToggle = document.getElementById("theme-toggle");

if (themeToggle) {
  const body = document.body;

  // Theme beim Laden anwenden
  if (localStorage.getItem("theme") === "dark") {
    body.classList.add("dark");
    themeToggle.textContent = "☀️";
  }

  // Theme-Toggle
  themeToggle.addEventListener("click", () => {
    body.classList.toggle("dark");
    const isDark = body.classList.contains("dark");
    localStorage.setItem("theme", isDark ? "dark" : "light");
    themeToggle.textContent = isDark ? "☀️" : "🌙";
  });
}

let timer;
let isRunning = false;
let remainingTime = 25 * 60;

// Elemente holen
const display = document.getElementById("timer-display");
const startBtn = document.getElementById("start-btn");
const pauseBtn = document.getElementById("pause-btn");
const resetBtn = document.getElementById("reset-btn");
const sessionButtons = document.querySelectorAll(".session-types button");

// Zeit aktualisieren
function updateDisplay() {
  const minutes = Math.floor(remainingTime / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (remainingTime % 60).toString().padStart(2, "0");
  display.textContent = `${minutes}:${seconds}`;
}

// Timer starten
function startTimer() {
  if (isRunning) return;
  isRunning = true;
  timer = setInterval(() => {
    if (remainingTime > 0) {
      remainingTime--;
      updateDisplay();
    } else {
      clearInterval(timer);
      isRunning = false;
      alert("Zeit ist um! 🎉");
    }
  }, 1000);
}

// Timer pausieren
function pauseTimer() {
  clearInterval(timer);
  isRunning = false;
}

// Timer zurücksetzen
function resetTimer() {
  pauseTimer();
  updateDisplay();
}

// Zeit durch Session-Buttons ändern
sessionButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    pauseTimer();
    remainingTime = parseInt(btn.dataset.time) * 60;
    updateDisplay();
  });
});

// Event-Listener
startBtn.addEventListener("click", startTimer);
pauseBtn.addEventListener("click", pauseTimer);
resetBtn.addEventListener("click", () => {
  remainingTime = 25 * 60; // Standard auf Fokuszeit
  resetTimer();
});

// Initialanzeige setzen
updateDisplay();

