// ===============================
// DOM Elements
// ===============================

const display = document.getElementById("display");
const startBtn = document.getElementById("start");
const pauseBtn = document.getElementById("pause");
const resetBtn = document.getElementById("reset");
const lapBtn = document.getElementById("lap");
const clearLapBtn = document.getElementById("clearLap");

const laps = document.getElementById("laps");

const lapCount = document.getElementById("lapCount");
const fastLap = document.getElementById("fastLap");
const slowLap = document.getElementById("slowLap");

const themeBtn = document.getElementById("themeBtn");

// ===============================
// Variables
// ===============================

let startTime = 0;
let elapsedTime = 0;
let timer = null;
let running = false;
let lapTimes = [];

// ===============================
// Format Time
// ===============================

function formatTime(time){

    const hours = Math.floor(time / 3600000);

    const minutes = Math.floor((time % 3600000) / 60000);

    const seconds = Math.floor((time % 60000) / 1000);

    const milliseconds = time % 1000;

    return `${String(hours).padStart(2,'0')} :
${String(minutes).padStart(2,'0')} :
${String(seconds).padStart(2,'0')} :
${String(milliseconds).padStart(3,'0')}`;

}

// ===============================
// Update Timer
// ===============================

function updateDisplay(){

    display.textContent = formatTime(elapsedTime);

}
// ===============================
// START
// ===============================

startBtn.addEventListener("click", () => {

    if(running) return;

    running = true;

    startTime = Date.now() - elapsedTime;

    timer = setInterval(() => {

        elapsedTime = Date.now() - startTime;

        updateDisplay();

    },30);

});

// ===============================
// PAUSE
// ===============================

pauseBtn.addEventListener("click", () => {

    clearInterval(timer);

    running = false;

});

// ===============================
// RESET
// ===============================

resetBtn.addEventListener("click", () => {

    clearInterval(timer);

    running = false;

    elapsedTime = 0;

    lapTimes = [];

    updateDisplay();

    laps.innerHTML = "";

    lapCount.textContent = "0";

    fastLap.textContent = "--";

    slowLap.textContent = "--";

});

// ===============================
// LAP
// ===============================

lapBtn.addEventListener("click", () => {

    if(!running) return;

    lapTimes.push(elapsedTime);

    const li = document.createElement("li");

    li.innerHTML = `
        <span>Lap ${lapTimes.length}</span>
        <span>${formatTime(elapsedTime)}</span>
    `;

    laps.prepend(li);

    lapCount.textContent = lapTimes.length;

    const fastest = Math.min(...lapTimes);

    const slowest = Math.max(...lapTimes);

    fastLap.textContent = formatTime(fastest);

    slowLap.textContent = formatTime(slowest);

});
// ===============================
// CLEAR LAP BUTTON
// ===============================

clearLapBtn.addEventListener("click", () => {

    lapTimes = [];

    laps.innerHTML = "";

    lapCount.textContent = "0";

    fastLap.textContent = "--";

    slowLap.textContent = "--";

    localStorage.removeItem("laps");

});

// ===============================
// THEME TOGGLE
// ===============================

themeBtn.addEventListener("click", () => {

    document.body.classList.toggle("dark");

    if(document.body.classList.contains("dark")){

        themeBtn.innerHTML =
        '<i class="fa-solid fa-sun"></i>';

        localStorage.setItem("theme","dark");

    }else{

        themeBtn.innerHTML =
        '<i class="fa-solid fa-moon"></i>';

        localStorage.setItem("theme","light");

    }

});

// ===============================
// KEYBOARD SHORTCUTS
// ===============================

document.addEventListener("keydown",(e)=>{

    if(e.code==="Space"){

        e.preventDefault();

        if(running){

            pauseBtn.click();

        }else{

            startBtn.click();

        }

    }

    if(e.key==="r" || e.key==="R"){

        resetBtn.click();

    }

    if(e.key==="l" || e.key==="L"){

        lapBtn.click();

    }

});

// ===============================
// SAVE LAPS
// ===============================

function saveLaps(){

    localStorage.setItem("laps",JSON.stringify(lapTimes));

}

lapBtn.addEventListener("click",saveLaps);

// ===============================
// LOAD DATA
// ===============================

window.onload=()=>{

    updateDisplay();

    const savedTheme=localStorage.getItem("theme");

    if(savedTheme==="dark"){

        document.body.classList.add("dark");

        themeBtn.innerHTML=
        '<i class="fa-solid fa-sun"></i>';

    }

    const savedLaps=
    JSON.parse(localStorage.getItem("laps"));

    if(savedLaps){

        lapTimes=savedLaps;

        lapCount.textContent=lapTimes.length;

        lapTimes.forEach((lap,index)=>{

            const li=document.createElement("li");

            li.innerHTML=`
            <span>Lap ${index+1}</span>
            <span>${formatTime(lap)}</span>
            `;

            laps.prepend(li);

        });

        if(lapTimes.length){

            fastLap.textContent=
            formatTime(Math.min(...lapTimes));

            slowLap.textContent=
            formatTime(Math.max(...lapTimes));

        }

    }

};