/**
 * Most of this code is taken from 
 * https://www.geeksforgeeks.org/how-to-design-a-simple-calendar-using-javascript/
 * with some adjustment
 */

const monthNameElement = document.getElementById("month-name");
const yearNameElement = document.getElementById("year-name");
const dateElement = document.getElementById("cal-dates");
const calNavElement = document.querySelectorAll("#cal-nav span");

let dateData = new Date();
let yearData = dateData.getFullYear();
let monthData = dateData.getMonth();
let monthDataString = dateData.toLocaleDateString('default', {month: 'long'});

monthNameElement.textContent = monthDataString;
yearNameElement.textContent = yearData;

function manipulateDate() {
    dateElement.innerHTML = "";

    let dayOne = new Date(yearData, monthData, 1).getDay();
    let lastDate = new Date(yearData, monthData + 1, 0).getDate();
    let dayEnd = new Date(yearData, monthData, lastDate).getDay();
    let monthLastDate = new Date(yearData, monthData, 0).getDate();

    for (let index = dayOne; index > 0; index--) {
        let dateBoxElement = document.createElement('span');
        dateBoxElement.classList.add("date-box", "inactive");
        dateBoxElement.innerHTML = monthLastDate - index + 1;
    
        dateElement.appendChild(dateBoxElement);
    }
    
    for (let index = 1; index <= lastDate; index++) {
        let dateBoxElement = document.createElement('span');
        let isToday = 
            index == dateData.getDate() 
            && monthData == new Date().getMonth()
            && yearData == new Date().getFullYear()
            ? "todayDate"
            : "otherDate";
    
        dateBoxElement.classList.add("date-box", isToday);
        dateBoxElement.innerHTML = index;
    
        dateElement.appendChild(dateBoxElement);
    }
    
    for (let index = dayEnd; index < 6; index++) {
        let dateBoxElement = document.createElement('span');
        dateBoxElement.classList.add("date-box", "inactive");
        dateBoxElement.innerHTML = index - dayEnd + 1;
    
        dateElement.appendChild(dateBoxElement);
    }
}

manipulateDate();

calNavElement.forEach((icon) => {
    icon.addEventListener("click", () => {
        monthData = icon.id === "cal-prev" ? monthData - 1 : monthData + 1;

        if (monthData < 0 || monthData > 11) {
            dateData = new Date(yearData, monthData, new Date().getDate());
            yearData = dateData.getFullYear();
            monthData = dateData.getMonth();
        } else {
            dateData = new Date(yearData, monthData, new Date().getDate());
        }

        monthNameElement.textContent = dateData.toLocaleDateString("default", {
            month: "long"
        });
        yearNameElement.textContent = yearData;
        manipulateDate();
    });
});