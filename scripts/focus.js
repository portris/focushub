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
let secondsLeft = 1500; // 25 min default
let isRunning = false;
let cycleCount = 0;
let currentSession = "focus";

// Elemente holen
const display = document.getElementById("timer-display");
const startBtn = document.getElementById("start-btn");
const pauseBtn = document.getElementById("pause-btn");
const resetBtn = document.getElementById("reset-btn");
const sessionButtons = document.querySelectorAll(".session-types button");

const times = {
  focus: 0.5 * 60,
  short: 5 * 60,
  long:  15 * 60
};

// Zeit aktualisieren
function updateDisplay() {
  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  display.textContent = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function updateCycleDisplay() {
  const indicator = document.getElementById("cycle-indicator");
  indicator.textContent = `Pomodoro-Zyklus: ${cycleCount % 4} / 4`;
}

function updateSessionStatus(type) {
  const statusText = {
    focus: "Fokuszeit",
    short: "Kurze Pause",
    long: "Lange Pause"
  };
  document.getElementById("session-status").textContent = `Aktuell: ${statusText[type] || "Fokuszeit"}`;
    const sessionDiv = document.getElementById("session-status");
  sessionDiv.textContent = `Aktuell: ${statusText[type] || "Fokuszeit"}`;

  // Alte Klassen entfernen, neue setzen
  sessionDiv.classList.remove("focus", "short", "long");
  sessionDiv.classList.add(type);
}

function switchSession(type) {
  playNotificationSound();
  currentSession = type;
  secondsLeft = times[type];
  updateDisplay();
  updateSessionStatus(type);
  updateCycleDisplay();
}


// Timer starten
function startTimer() {
  if (isRunning) return;
  isRunning = true;
  timer = setInterval(() => {
    secondsLeft--;
    updateDisplay();

    if (secondsLeft <= 0) {
      clearInterval(timer);
      isRunning = false;

      if (currentSession === "focus") {
        cycleCount++;
        updateCycleDisplay();
        if (cycleCount % 4 === 0) {
          switchSession("long");
        } else {
          switchSession("short");
        }
      } else {
        switchSession("focus");
      }

      startTimer(); // automatisch weitermachen
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
  switchSession(currentSession);
}

// Notification Sound für Benachrichtigugn bei Timerende
function playNotificationSound() {
  const audio = document.getElementById("notification-sound");
  if (audio) {
    audio.currentTime = 0;
    audio.play();
  }
}

// Buttons für Session-Wechsel manuell
sessionButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    const type = btn.dataset.time === "25" ? "focus" : btn.dataset.time === "5" ? "short" : "long";
    cycleCount = 0; // Reset Zyklus bei manuellem Wechsel
    updateCycleDisplay();
    switchSession(type);
    pauseTimer();
  });
});

// Event-Listener
startBtn.addEventListener("click", startTimer);
pauseBtn.addEventListener("click", pauseTimer);
resetBtn.addEventListener("click", resetTimer);

// Initialanzeige setzen
updateDisplay();
updateCycleDisplay();

