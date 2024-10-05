// =========== AUDIO PORTION ======================
const erika = document.getElementById('erika');
erika.volume = 0.03;

// document.getElementById('erika').play().then(() => console.log('autoplay success!')).catch(e => console.log(e))

// ============ CLOCK PORTION =======================
const clock = document.getElementById('clock-body');
const html_date = document.getElementById('date');
let date = new Date();

let day = date.getDate();
let month = date.getMonth();
let year = date.getFullYear();

let hours = date.getHours();
let mins = date.getMinutes();
let secs = date.getSeconds();

const month_lookup = 
[
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
]

function updateTime()
{
    let strHours = `${hours}`;
    let strMins = `${mins}`;
    let strSecs = `${secs}`;

    if (hours < 10)
        strHours = 0 + strHours;
    if (mins < 10)
        strMins = 0 + strMins;
    if (secs < 10)
        strSecs = 0 + strSecs;
    
    clock.innerHTML = strHours + " : " + strMins + " : " + strSecs;
    secs++;
    if (secs == 60)
    {
        mins++;
        secs = 0;
    }
    if (mins == 60)
    {
        hours++;
        mins = 0;
    }
    if (hours == 24)
    {
        hours = 0;
        day++;
        date = new Date();
        day = date.getDate();
        month = date.getMonth();
        year = date.getFullYear();
        html_date.innerHTML = `${day}   ${month_lookup[month]}   ${year}`;
    }    
}

html_date.innerHTML = `${day}   ${month_lookup[month]}   ${year}`;
updateTime() // calling this function outside the interval allows for instant load of clock
let clock_interval = setInterval(updateTime, 1000);
let song_interval = setInterval(() => {erika.currentTime = 0; erika.play()}, 180000); // replay song every 3 minutes