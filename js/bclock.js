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
    if (sec === '00') {
      updateCalendar();
    }
  }
  container.style.textShadow = shadow;
}

const wakeButton = document.querySelector('[data-status]');
const changeUI = (status = 'acquired' ) => {
  const acquired = status == 'acquired' ? true : false;
  wakeButton.dataset.status = acquired ? 'on' : 'off';
  //wakeButton.textContent = `Turn Wake Lock ${acquired ? 'OFF' : 'ON'}`;
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
      //wakeButton.textContent = 'Turn Wake Lock ON';
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
  setInterval(bclock, 1000);
}
