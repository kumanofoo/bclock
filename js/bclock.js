const bclock = () => {
  const d = new Date();
  let year = d.getFullYear();
  let month = ('00' + (d.getMonth()+1)).slice(-2);
  let date = ('00' + d.getDate()).slice(-2);
  let day = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"][d.getDay()];
  let hour = ('00' + d.getHours()).slice(-2);
  let min = ('00' + d.getMinutes()).slice(-2);
  let sec = ('00' + d.getSeconds()).slice(-2);

  let today = `${year}.${month}.${date} ${day}`;
  let time = `${hour}:${min}:${sec}`;

  document.querySelector(".bclock-date").innerText = today;
  document.querySelector(".bclock-time").innerText = time;
  let container = document.querySelector(".container");

  // Events
  let shadow = getComputedStyle(container).getPropertyValue("--shadow");
  if (min === '00') {
    shadow = getComputedStyle(container).getPropertyValue("--shadow-accent");
  }
  if (sec === '00') {  // update per minute
    updateAirQuality();
    if (min === '00') {  // update per hour
      updateCalendar();
      updatePeak();
    }
  }
  container.style.textShadow = shadow;
}

const wakeButton = document.querySelector('[data-status]');
const changeUI = (status = 'acquired' ) => {
  const acquired = status == 'acquired' ? true : false;
  wakeButton.dataset.status = acquired ? 'on' : 'off';
}

if ('wakeLock' in navigator) {
  let wakeLock = null;
  const requestWakeLock = async () => {
    try {
      wakeLock = await navigator.wakeLock.request('screen');
      changeUI();
      wakeLock.addEventListener('release', () => {
        changeUI('released');
      });
    } catch {
      wakeButton.dataset.status = 'off';
    }
  } // requestWakeLock()

  wakeButton.addEventListener('click', () => {
    if (wakeButton.dataset.status === 'off') {
      requestWakeLock();
      wakeButton.style.color="#daf6ff";
      wakeButton.style.textShadow="0 0 20px $0aafe6";
    } else {
      wakeLock.release()
      .then(() => {
        wakeLock = null;
        wakeButton.style.color="#618686";
        wakeButton.style.textShadow="";
        })
    }
  })

  document.addEventListener('visibilitychange', () => {
    if (wakeLock !== null && document.visibilityState === 'visible') {
      requestWakeLock();
    }
  })
}

const toPercent = (minimum, maximum, value) => {
  let v = Math.max(minimum, value);
  v = Math.min(maximum, value);
  return parseInt((v - minimum)*100/(maximum - minimum));
}

const airContainer = document.querySelector("#air-container");
const temperature = document.querySelector("#air-temperature");
temperature.graph = document.querySelector("#air-temperature-graph");
temperature.minimum = 15;
temperature.maximum = 35;
temperature.unitName = "℃";
temperature.jsonKey = "temperature_deg_c";
temperature.container = document.querySelector("#temperature-container");
const humidity = document.querySelector("#air-humidity");
humidity.graph = document.querySelector("#air-humidity-graph");
humidity.minimum = 0;
humidity.maximum = 100;
humidity.unitName = "%";
humidity.jsonKey = "humidity_percent";
humidity.container = document.querySelector("#humidity-container");
const co2 = document.querySelector("#air-co2");
co2.graph = document.querySelector("#air-co2-graph");
co2.minimum = 300;
co2.maximum = 1300;
co2.unitName = "ppm";
co2.jsonKey = "co2_ppm";
co2.container = document.querySelector("#co2-container");
const airQualityItem = [temperature, humidity, co2];
const updateAirQuality = async () => {
  const cfg = bclockConfig.bClock.air; // from js/config.js
  if (airContainer.dataset.air === "disable") return;
  try {
    const response = await fetch(cfg.url, {cache: "no-store"});
    if (response.ok) {
      const json = await response.json();
      airQualityItem.forEach((element) => {
        let v = element.jsonKey in json ? json[element.jsonKey] : null;
        if (v !== null) {
          element.container.style.display = "";
            const p = toPercent(element.minimum, element.maximum, v);
          const graph = (element.graph.innerText + String.fromCharCode(0x100 + p)).slice(-60);
          element.innerText = v + element.unitName;
          element.graph.innerText = graph;  
        }
        else {
          temperature.innerText = "";
          temperature.graph.innerText = "";  
          element.container.style.display = "none";
        }  
      });
      airContainer.dataset.air = "enable";
    }
    else {
      airQualityItem.forEach((element) => {
        element.innerText = "";
        element.graph.innerText = "";
        element.container.style.display = "none";
      })
      if (airContainer.dataset.air === "") {
        airContainer.dataset.air = "disable";
        console.log("Air quality is disabled.");
      }
    }
  }
  catch (error) {
    console.log(error);
  }
}

const bclockContainter = document.querySelector(".bclock-container");
const updatePeak = async () => {
  const cfg = bclockConfig.bClock.peak; // from js/config.js

  if (bclockContainter.dataset.peak === "disable") return;
  try {
    const response = await fetch(cfg.url, {cache: "no-store"});
    if (response.ok) {
      const peak = await response.json();
      bclockContainter.classList.remove("lava");
      if ("highest" in peak) {
        if (peak["highest"] >= cfg.highest) {
          bclockContainter.classList.add("lava");
        }
      }
      bclockContainter.classList.remove("frost");
      if ("lowest" in peak) {
        if (peak["lowest"] <= cfg.lowest) {
          bclockContainter.classList.add("frost");
        }
      }
      bclockContainter.dataset.peak = "enable";
    } else {
      bclockContainter.classList.remove("lava");
      bclockContainter.classList.remove("frost");
      if (bclockContainter.dataset.peak === "") {
        bclockContainter.dataset.peak = "disable";
        console.log("Peak is disabled.");
      }
    }
  }
  catch (error) {
    console.log(error);
  }
}

window.onload = () => {
  let displayArea = document.querySelector("#display-area");
  displayArea.addEventListener('dblclick', () => {
    console.log("dblclick");
    if (document.fullscreenElement) {
      document.exitFullscreen();
    }
    else {
      document.documentElement.requestFullscreen();
    }
  });

  bclock();
  updateAirQuality();
  updatePeak();
  setInterval(bclock, 1000);
}
