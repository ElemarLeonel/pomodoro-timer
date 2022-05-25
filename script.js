const timer = document.querySelector(".timer-time");
const start = document.querySelector(".timer-start");
const stop = document.querySelector(".timer-stop");
const reset = document.querySelector(".timer-reset");
const pomodoro = document.querySelector(".pomodoro");
const shortBreakBtn = document.querySelector(".short-break");
const longBreakBtn = document.querySelector(".long-break");
const current = document.querySelector(".currently-mode");
const container = document.querySelector(".container");

const localStorageKeySeconds = "@@seconds";
const localStorageKeyMinutes = "@@minutes";
const localStorageKeyActive = "@@active";

let secondsStorage = localStorage.getItem(localStorageKeySeconds);
let minutesStorage = localStorage.getItem(localStorageKeyMinutes);

let seconds = 0,
  active = false,
  intervalID;

const startTimer = (mins, start) => {
  clearInterval(intervalID);

  if (!active) {
    timer.textContent = "25:00";
    seconds = mins * 60 || 0;
  }

  active = true;
  current.textContent = "TRABALHANDO";

  localStorage.setItem(localStorageKeyActive, true);

  if (start) intervalID = setInterval(time, 1000);
};

const shortBreakTimer = (mins) => {
  resetTime();
  clearInterval(intervalID);

  if (!active) {
    timer.textContent = "05:00";
    seconds = mins * 60 || 0;
  }

  active = true;
  current.textContent = "PARADA CURTA";
};

const longBreakTimer = (mins) => {
  resetTime();
  clearInterval(intervalID);

  if (!active) {
    timer.textContent = "15:00";
    seconds = mins * 60 || 0;
  }

  current.textContent = "PARADA LONGA";
  active = true;
};

const resetTime = () => {
  clearInterval(intervalID);
  timer.textContent = "25:00";
  active = false;
  current.textContent = "-";
  container.style.backgroundColor = "var(--background-work)";

  localStorage.setItem(localStorageKeyActive, false);
  localStorage.setItem(localStorageKeySeconds, 0);
  localStorage.setItem(localStorageKeyMinutes, 0);
};

const stopTime = () => {
  clearInterval(intervalID);
  current.textContent = "PARADO";
};

const time = () => {
  seconds--;

  montaRelogio();

  if (seconds === 0) {
    clearInterval(intervalID);
    playSound();

    resetTime();
  }
};

const playSound = () => document.getElementById("audio").play();

start.addEventListener(
  "click",
  () => {
    startTimer(25, true);
  },
  false
);

stop.addEventListener("click", stopTime, false);
reset.addEventListener("click", resetTime, false);

pomodoro.addEventListener(
  "click",
  () => {
    resetTime();
    startTimer(25);
  },
  false
);

shortBreakBtn.addEventListener(
  "click",
  () => {
    shortBreakTimer(5);
    container.style.backgroundColor = "var(--background-short-break)";
  },
  false
);

longBreakBtn.addEventListener(
  "click",
  () => {
    longBreakTimer(15);
    container.style.backgroundColor = "var(--background-long-break)";
  },
  false
);

const montaRelogio = () => {
  minutes = Math.floor(seconds / 60);
  sec = seconds % 60;

  if (sec < 10) sec = `0${sec}`;
  if (minutes < 10) minutes = `0${minutes}`;

  timer.textContent = `${minutes}:${sec}`;

  //SALVANDO OS SEGUNDOS NO LOCALSTORAGE
  localStorage.setItem(localStorageKeySeconds, seconds);

  //SALVANDO OS MINUTOS NO LOCALSTORAGE
  localStorage.setItem(localStorageKeyMinutes, minutes);

  if (minutes <= 5) {
    container.style.backgroundColor = "var(--background-short-break)";
  } else if (minutes <= 15) {
    container.style.backgroundColor = "var(--background-long-break)";
  }
};

const loadHistorico = () => {
  const minutesHistorico = Number(localStorage.getItem(localStorageKeyMinutes));
  const secondsHistorico = Number(localStorage.getItem(localStorageKeySeconds));
  const activeHistorico = localStorage.getItem(localStorageKeyActive);

  if (minutesHistorico && secondsHistorico && activeHistorico) {
    console.log(minutesHistorico, secondsHistorico, activeHistorico);

    minutes =
      JSON.parse(minutesHistorico) > 0 ? JSON.parse(minutesHistorico) : 25;
    seconds =
      JSON.parse(secondsHistorico) > 0 ? JSON.parse(secondsHistorico) : 25 * 60;
    active = JSON.parse(activeHistorico);

    montaRelogio();

    if (minutes !== 25) current.textContent = "PAUSADO/RECUPERADO";
  }
};

loadHistorico();
