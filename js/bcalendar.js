const display = document.querySelector(".display");
const previous = document.querySelector(".left");
const next = document.querySelector(".right");
const days = document.querySelector(".days");
const selected = document.querySelector(".selected");

let date = new Date();

let year = date.getFullYear();
let month = date.getMonth();
let tomorrow = new Date(year, month, date.getDate()+1);


function updateDate() {
    date = new Date();
    year = date.getFullYear();
    month = date.getMonth(); 
    tomorrow = new Date(year, month, date.getDate()+1);
    displayCalendar();
}

function displayCalendar() {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const firstDayIndex = firstDay.getDay(); //4
    const numberOfDays = lastDay.getDate(); //31
    let formattedDate = date.toLocaleString("en-US", {
        month: "long",
        year: "numeric",
    });
    display.innerHTML = `${formattedDate}`;

    /* cleaning days */
    days.textContent = "";

    /* head spacing */
    for (let x = 0; x < firstDayIndex; x++) {
        const div = document.createElement("div");
        div.innerHTML += "";
        days.appendChild(div);
    }

    /* body */
    for (let i = 1; i <= numberOfDays; i++) {
        let div = document.createElement("div");
        let currentDate = new Date(year, month, i);
        div.dataset.date = currentDate.toDateString();
        div.innerHTML += i;
        days.appendChild(div);
        if (
            currentDate.getFullYear() === new Date().getFullYear()
            && currentDate.getMonth() === new Date().getMonth()
            && currentDate.getDate() === new Date().getDate()
        ) {
            div.classList.add("current-date");
        }
        let today = `${currentDate.getFullYear()}/${currentDate.getMonth()+1}/${currentDate.getDate()}`;
        if (today in HOLIDAYS) {
            div.classList.add("holiday");
        }
    }
}

displayCalendar();
setTimeout(() => { // first time
    updateDate();
    setInterval(updateDate, 24*60*60*1000); // next time
}, tomorrow.getTime() - date.getTime());

let otherMonth = null;
function returnToThisMonth() {
    if (otherMonth !== null) {
        clearTimeout(otherMonth);
    }
    otherMonth = setTimeout(updateDate, 3*60*1000);
}

previous.addEventListener("click", () => {
    days.innerHTML = "";
    selected.innerHTML = "";

    if (month == 0) {
        month = 11;
        year = year - 1;
    }
    else {
        month = month - 1;
    }
    date.setFullYear(year);
    date.setMonth(month);
    displayCalendar();
    returnToThisMonth();
})

next.addEventListener("click", () => {
    days.innerHTML = "";
    selected.innerHTML = "";

    if (month == 11) {
        month = 0;
        year = year + 1;
    }
    else {
        month = month + 1;
    }
    date.setFullYear(year);
    date.setMonth(month);
    displayCalendar();
    returnToThisMonth();
})
