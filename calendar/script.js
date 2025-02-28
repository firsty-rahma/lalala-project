/**
 * Most of this code is taken from 
 * https://www.geeksforgeeks.org/how-to-design-a-simple-calendar-using-javascript/
 * with some adjustment
 */

import { fetchHoliday } from "./api.js";

const monthNameElement = document.getElementById("month-name");
const yearNameElement = document.getElementById("year-name");
const dateElement = document.getElementById("cal-dates");
const calNav = document.querySelector(".cal-nav");

let currentDate = new Date();

// Function to update the calendar
async function updateCalendar() {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay(); // Day of the week for the first day of the month
    const lastDate = new Date(year, month + 1, 0).getDate(); // Last date of the month
    
    // Update month and year
    monthNameElement.textContent = currentDate.toLocaleString("default", { month: "long" });
    yearNameElement.textContent = year;

    // Clear previous dates
    dateElement.innerHTML = "";

    // Fetch holiday data for the current month and year
    const holidays = await fetchHoliday(month, year);

    // Add inactive dates before the first day
    for (let i = 0; i < firstDay; i++) {
        const span = document.createElement("span");
        span.className = "date-box inactive";
        dateElement.appendChild(span);
    }

    // Add active dates for the current month
    for (let i = 1; i <= lastDate; i++) {
        const span = document.createElement("span");
        span.className = "date-box";
        span.textContent = i;

        // Highlight today's date
        const currentDate = new Date(year, month, i);
        if (
            currentDate.getDate() === new Date().getDate() &&
            currentDate.getMonth() === new Date().getMonth() &&
            currentDate.getFullYear() === new Date().getFullYear()
        ) {
            span.classList.add("todayDate");
        }

        // Check if the date is a holiday
        if (holidays) {
            // isHoliday is a boolean variable
            const isHoliday = holidays.some(holiday => {
                const holidayDate = new Date(holiday.tanggal);
                return (
                    holidayDate.getDate() === currentDate.getDate() &&
                    holidayDate.getMonth() === currentDate.getMonth() &&
                    holidayDate.getFullYear() === currentDate.getFullYear()
                );
            });

            if (isHoliday) {
                span.classList.add("holiday");
                const holiday = holidays.find(holiday => {
                    const holidayDate = new Date(holiday.tanggal);
                    return (
                        holidayDate.getDate() === currentDate.getDate() &&
                        holidayDate.getMonth() === currentDate.getMonth() &&
                        holidayDate.getFullYear() === currentDate.getFullYear()
                    );
                });

                if (holiday.is_cuti) {
                    span.classList.add("cuti");
                }
                
                span.title = holiday.keterangan; // Add a tooltip with the holiday description
            }
        }

        dateElement.appendChild(span);
    }
}

// Function to handle month navigation
function navigateCalendar(event) {
    if (event.target.tagName !== "BUTTON") return; // Ensure only buttons are handled

    // Add slide animation
    dateElement.classList.add(event.target.id === "cal-prev" ? "slide-right" : "slide-left");

    setTimeout(() => {
        // Update the current date
        if (event.target.id === "cal-prev") {
            currentDate.setMonth(currentDate.getMonth() - 1);
        } else if (event.target.id === "cal-next") {
            currentDate.setMonth(currentDate.getMonth() + 1);
        }

        // Update the calendar
        updateCalendar();

        // Remove animation classes
        dateElement.classList.remove("slide-left", "slide-right");
    }, 500); // Match the duration of the CSS transition
}

// Function to populate weekdays
function populateWeekdays() {
    const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const daysElement = document.getElementById("cal-days");
    daysElement.innerHTML = weekdays.map(day => `<span>${day}</span>`).join("");
}

// Initialize the calendar
populateWeekdays();
updateCalendar();

// Add event listener for navigation buttons
calNav.addEventListener("click", navigateCalendar);
