const themeToggle = document.getElementById("theme-toggle");

if (themeToggle) {
  const body = document.body;

  if (localStorage.getItem("theme") === "dark") {
    body.classList.add("dark");
    themeToggle.textContent = "☀️";
  }

  themeToggle.addEventListener("click", () => {
    body.classList.toggle("dark");
    const isDark = body.classList.contains("dark");
    localStorage.setItem("theme", isDark ? "dark" : "light");
    themeToggle.textContent = isDark ? "☀️" : "🌙";
  });
}

let timer;
let isRunning = false;
let cycleCount = 0;
let currentSession = "focus";

let startTime = null;
let endTime = null;
let remainingSeconds = 25 * 60;

const defaultTimes = {
  focus: parseInt(localStorage.getItem("focusTime")) || 25,
  short: parseInt(localStorage.getItem("shortBreak")) || 5,
  long:  parseInt(localStorage.getItem("longBreak")) || 15
};

let times = {
  focus: defaultTimes.focus * 60,
  short: defaultTimes.short * 60,
  long:  defaultTimes.long * 60
};

const display = document.getElementById("timer-display");
const startBtn = document.getElementById("start-btn");
const pauseBtn = document.getElementById("pause-btn");
const resetBtn = document.getElementById("reset-btn");
const sessionButtons = document.querySelectorAll(".session-types button");

const burgerToggle = document.getElementById("burger-toggle");
const burgerNav = document.getElementById("burger-nav");

const settingsForm = document.getElementById("timer-settings-form");
const focusInput = document.getElementById("focus-duration");
const shortInput = document.getElementById("short-break-duration");
const longInput = document.getElementById("long-break-duration");

const settingsToggle = document.getElementById("settings-toggle");
const settingsContent = document.getElementById("settings-content");
const toggleIcon = settingsToggle.querySelector(".toggle-icon");

// Werte in UI setzen
focusInput.value = defaultTimes.focus;
shortInput.value = defaultTimes.short;
longInput.value = defaultTimes.long;

// Anzeige aktualisieren
function updateDisplay(seconds = remainingSeconds) {
  const min = Math.floor(seconds / 60);
  const sec = seconds % 60;
  display.textContent = `${String(min).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
}

// Zyklus anzeigen
function updateCycleDisplay() {
  const indicator = document.getElementById("cycle-indicator");
  indicator.textContent = `Pomodoro-Zyklus: ${cycleCount % 4} / 4`;
}

// Session-Status anzeigen
function updateSessionStatus(type) {
  const statusText = {
    focus: "Fokuszeit",
    short: "Kurze Pause",
    long: "Lange Pause"
  };

  const sessionDiv = document.getElementById("session-status");
  sessionDiv.textContent = `Aktuell: ${statusText[type] || "Fokuszeit"}`;
  sessionDiv.classList.remove("focus", "short", "long");
  sessionDiv.classList.add(type);
}

// Session wechseln
function switchSession(type) {
  playNotificationSound();
  currentSession = type;
  remainingSeconds = times[type];
  updateSessionStatus(type);
  updateCycleDisplay();
  updateDisplay();    
}

// Timer starten
function startTimer() {
  if (isRunning) return;
  isRunning = true;

  // Starte mit dem aktuellen Wert in remainingSeconds
  startTime = Date.now();
  endTime = startTime + remainingSeconds * 1000;

  timer = setInterval(() => {
    const now = Date.now();
    const secondsLeft = Math.max(0, Math.round((endTime - now) / 1000));
    updateDisplay(secondsLeft);

    if (secondsLeft <= 0) {
      clearInterval(timer);
      isRunning = false;

      if (currentSession === "focus") {
        cycleCount++;
        updateCycleDisplay();
        switchSession(cycleCount % 4 === 0 ? "long" : "short");
      } else {
        switchSession("focus");
      }

      startTimer(); // Starte nächste Session automatisch
    }

    remainingSeconds = secondsLeft; // Laufzeit-Zwischenspeicher
  }, 1000);
}

// Timer pausieren
function pauseTimer() {
  clearInterval(timer);
  isRunning = false;
  const now = Date.now();
  remainingSeconds = Math.max(0, Math.round((endTime - now) / 1000));
}

// Timer zurücksetzen
function resetTimer() {
  pauseTimer();
  switchSession(currentSession);
}

// Sound abspielen
function playNotificationSound() {
  const audio = document.getElementById("notification-sound");
  if (audio) {
    audio.currentTime = 0;
    audio.play();
  }
}

// Session Buttons
sessionButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    const type = btn.dataset.time === "25" ? "focus" : btn.dataset.time === "5" ? "short" : "long";
    cycleCount = 0;
    pauseTimer();
    switchSession(type);
    updateCycleDisplay();
    updateDisplay();
  });
});

// Event-Listener
startBtn.addEventListener("click", startTimer);
pauseBtn.addEventListener("click", pauseTimer);
resetBtn.addEventListener("click", resetTimer);

burgerToggle.addEventListener("click", () => {
  burgerNav.classList.toggle("show");
});

settingsForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const focus = parseInt(focusInput.value);
  const short = parseInt(shortInput.value);
  const long = parseInt(longInput.value);

  if (focus > 0 && short > 0 && long > 0) {
    // Speichern
    localStorage.setItem("focusTime", focus);
    localStorage.setItem("shortBreak", short);
    localStorage.setItem("longBreak", long);

    // Update Times-Objekt
    times.focus = focus * 60;
    times.short = short * 60;
    times.long = long * 60;

    // Optional: aktuelles Session-Zeit aktualisieren
    if (!isRunning) {
      switchSession(currentSession);
    }

    alert("Timer-Einstellungen gespeichert!");
  } else {
    alert("Bitte nur positive Zahlen eingeben.");
  }
});

settingsToggle.addEventListener("click", () => {
  const collapsed = settingsContent.classList.toggle("collapsed");
  toggleIcon.classList.toggle("rotate", !collapsed);
});

// Initialzustand
switchSession("focus");
updateCycleDisplay();
updateDisplay();
