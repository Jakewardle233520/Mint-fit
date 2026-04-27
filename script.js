const slides = [
    {
        title: "Light shadow boxing (warm-up)",
        image: "boxing-image.jpeg",
        time: "60"
    },
    {
        title: "arm circles + shoulder mobility",
        image: "",
        time: "60"
    },
    {
        title: "slow push-ups (5 seconds down)",
        image: "pushup-image.jpeg",
        time: "60"
    },
    {
        title: "Shadow boxing (full focus)",
        image: "punch-image.jpeg",
        time: "120"
    },
    {
        title: "Push-ups(slow tempo: 3 sec down)",
        image: "pushup-image.jpeg",
        time: "60"
    },
    {
        title: "Plank",
        image: "plank-image.jpeg",
        time: "60"
    },
    {
        title: "Chest dips (chair or counter)",
        image: "pushup-image.jpeg",
        time: "60"
    },
    {
        title: "Diamond Push-ups",
        image: "",
        time: "60"
    },
    {
        title: "Rest",
        image: "rest-image.jpeg",
        time: "60"
    },
    {
        title: "Boxing combos (speed)",
        image: "boxing-image.jpeg",
        time: "120"
    },
    {
        title: "close-grip push-ups (triceps focus)",
        image: "pushup-image.jpeg",
        time: "60"
    },
    {
        title: "Bicycle crunches",
        image: "bicycle-crunches.png",
        time: "60"
    },
    {
        title: "Rest",
        image: "rest-image.jpeg",
        time: "60"
    },
    {
        title: "Shadow boxing (power)",
        image: "boxing-image.jpeg",
        time: "120"
    },
    {
        title: "Wide push-ups",
        image: "",
        time: "60"
    },
    {
        title: "Slips + counters",
        image: "",
        time: "60"
    },
    {
        title: "Explosive push-ups",
        image: "pushup-image.jpeg",
        time: "60"
    },
    {
        title: "Russian twists",
        image: "",
        time: "60"
    },
    {
        title: "Rest",
        image: "rest-image.jpeg",
        time: "60"
    },
    {
        title: "Punch-out round (max-speed)",
        image: "boxing-image.jpeg",
        time: "120"
    },
    {
        title: "Leg raises",
        image: "",
        time: "60"
    },
    {
        title: "Rest",
        image: "rest-image.jpeg",
        time: "60"
    },
    {
        title: "Hooks + uppercuts (power)",
        image: "",
        time: "120"
    },
    {
        title: "Decline push-ups",
        image: "",
        time: "60"
    },
    {
        title: "Crunch hold",
        image: "",
        time: "60"
    },
    {
        title: "Push-up to plank walk",
        image: "",
        time: "60"
    },
    {
        title: "Slow tricep extensions (floor or chair)",
        image: "",
        time: "60"
    },
    {
        title: "Slow chest squeese push-ups (hands close, squeese chest)",
        image: "",
        time: "60"
    },
    {
        title: "Rest",
        image: "rest-image.jpeg",
        time: "60"
    },
    {
        title: "Max-rep push-up finisher",
        image: "",
        time: "60"
    },
    {
        title: "Deep beathing",
        image: "rest-image.jpeg",
        time: "60"
    },
    {
        title: "Chest + shoulder stretch",
        image: "",
        time: "60"
    },
];

// Global variables
let currentSlide = 0;
let timerInterval;
let wakeLock = null;
let currentPageId = "page-workout";
let pages = {};
let currentMonth, currentYear;
let completedDates = JSON.parse(localStorage.getItem("mintfit_completed") || "[]");

// DOM elements (will be initialized in DOMContentLoaded)
let startScreen, slidescreen, endScreen, slideTitle, slideImage, timerDisplay;
let showWorkoutBtn, closeWorkoutBtn, workoutList, workoutTimeSpan, progressBar;
let workoutListScroll, calendarGrid, calendarMonthYear;

// ============ UTILITY FUNCTIONS ============

function applyThemeByTime() {
    const now = new Date();
    const hour = now.getHours();
    const darkStart = 19;
    const darkEnd = 6;
    const isDarkTime = hour >= darkStart || hour < darkEnd;

    if (isDarkTime) {
        document.body.classList.add("dark-mode");
    } else {
        document.body.classList.remove("dark-mode");
    }
}

function calculateTotalTime() {
    let totalSeconds = 0;
    slides.forEach(slide => {
        totalSeconds += parseInt(slide.time);
    });

    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    let timeString = "Total Time: ";
    if (hours > 0) {
        timeString += `${hours}h ${minutes}m`;
    } else if (minutes > 0) {
        timeString += `${minutes}m ${seconds}s`;
    } else {
        timeString += `${seconds}s`;
    }

    return timeString;
}

function populateWorkoutList() {
    workoutListScroll.innerHTML = "";
    
    slides.forEach(slide => {
        const workoutItem = document.createElement("div");
        workoutItem.className = "workout-item";
        
        workoutItem.innerHTML = `
            <div class="workoutLeft">
                <img src="${slide.image}" alt="${slide.title}">
            </div>
            <div class="workoutCenter">
                <h3>${slide.title}</h3>
            </div>
            <div class="workoutRight">
                <p>${slide.time}s</p>
            </div>
        `;
        
        workoutListScroll.appendChild(workoutItem);
    });
}

// ============ WORKOUT FUNCTIONS ============

async function requestWakeLock() {
    try {
        wakeLock = await navigator.wakeLock.request("screen");
        console.log("Wake Lock active");

        wakeLock.addEventListener("release", () => {
            console.log("wake lock released");
        });
    } catch (err) {
        console.error(`${err.name}, ${err.message}`);
    }
}

async function startSlideshow() {
    await requestWakeLock();
    startScreen.classList.add("hidden");
    slidescreen.classList.remove("hidden");
    document.querySelector(".bottom-nav").classList.add("hidden");
    currentSlide = 0;
    showSlide();
}

function showSlide() {
    if (currentSlide >= slides.length) {
        slidescreen.classList.add("hidden");
        endScreen.classList.remove("hidden");
        markTodayAsCompleted();
        return;
    }

    const progressPercentage = (currentSlide / slides.length) * 100;
    progressBar.style.width = progressPercentage + "%";

    const slide = slides[currentSlide];
    slideTitle.textContent = slide.title;
    slideImage.src = slide.image;

    let timeLeft = slide.time;
    timerDisplay.textContent = `Time: ${timeLeft}s`;

    timerInterval = setInterval(() => {
        timeLeft--;
        timerDisplay.textContent = `Time: ${timeLeft}s`;

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            currentSlide++;
            showSlide();
        }
    }, 1000);
}

function restartSlideshow() {
    endScreen.classList.add("hidden");
    startScreen.classList.remove("hidden");
    document.querySelector(".bottom-nav").classList.remove("hidden");

    if (wakeLock) {
        wakeLock.release();
        wakeLock = null;
    }
}

function markTodayAsCompleted() {
    const now = new Date();
    const key = `${now.getFullYear()}-${now.getMonth()+1}-${now.getDate()}`;

    if (!completedDates.includes(key)) {
        completedDates.push(key);
        localStorage.setItem("mintfit_completed", JSON.stringify(completedDates));
    }
}

// ============ CALENDAR FUNCTIONS ============

function formatDate(y, m, d) {
    return `${y}-${m+1}-${d}`;
}

function renderCalendar(month, year) {
    calendarGrid.innerHTML = "";

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    dayNames.forEach(n => {
        const div = document.createElement("div");
        div.className = "calendar-day-name";
        div.textContent = n;
        calendarGrid.appendChild(div);
    });

    for (let i = 0; i < firstDay; i++) {
        const div = document.createElement("div");
        div.className = "calendar-day inactive";
        calendarGrid.appendChild(div);
    }

    for (let d = 1; d <= daysInMonth; d++) {
        const div = document.createElement("div");
        div.className = "calendar-day";

        const key = `${year}-${month+1}-${d}`;
        if (completedDates.includes(key)) {
            div.classList.add("completed");
        }

        div.textContent = d;
        calendarGrid.appendChild(div);
    }

    calendarMonthYear.textContent = `${year} - ${month+1}`;
}

// ============ PAGE NAVIGATION ============

function setActiveNav(navItems, active) {
    navItems.forEach(i => i.classList.remove("nav-active"));
    active.classList.add("nav-active");
}

function switchPage(targetId) {
    const current = pages[currentPageId];
    const next = pages[targetId];

    const order = ["page-workout", "page-calendar", "page-profile"];
    const dir = order.indexOf(targetId) > order.indexOf(currentPageId) ? "left" : "right";

    Object.values(pages).forEach(p => {
        p.classList.remove("page-active", "page-slide-left", "page-slide-right");
    });

    current.classList.add(dir === "left" ? "page-slide-left" : "page-slide-right");
    next.classList.add("page-active");

    currentPageId = targetId;

    if (targetId === "page-calendar") {
        renderCalendar(currentMonth, currentYear);
    }
}

// ============ DOM CONTENT LOADED ============

document.addEventListener("DOMContentLoaded", () => {
    // Initialize DOM elements
    startScreen = document.getElementById("start-screen");
    slidescreen = document.getElementById("slide-screen");
    endScreen = document.getElementById("end-screen");
    slideTitle = document.getElementById("slide-title");
    slideImage = document.getElementById("slide-image");
    timerDisplay = document.getElementById("timer");
    showWorkoutBtn = document.getElementById("show-workout");
    closeWorkoutBtn = document.getElementById("closeWorkout");
    workoutList = document.getElementById("workoutList");
    workoutTimeSpan = document.getElementById("workoutTime");
    progressBar = document.getElementById("progress-bar");
    workoutListScroll = document.getElementById("workoutListScroll");
    calendarGrid = document.getElementById("calendarGrid");
    calendarMonthYear = document.getElementById("calendarMonthYear");

    // Initialize pages
    pages = {
        "page-workout": document.getElementById("page-workout"),
        "page-calendar": document.getElementById("page-calendar"),
        "page-profile": document.getElementById("page-profile"),
    };

    // Initialize calendar variables
    const today = new Date();
    currentMonth = today.getMonth();
    currentYear = today.getFullYear();

    // Mark April 18-26 as completed (for display purposes)
    for (let day = 18; day <= 26; day++) {
        const key = `2026-4-${day}`;
        if (!completedDates.includes(key)) {
            completedDates.push(key);
        }
    }
    localStorage.setItem("mintfit_completed", JSON.stringify(completedDates));

    // Apply theme
    applyThemeByTime();
    
    // Populate workout list
    populateWorkoutList();

    // ============ EVENT LISTENERS ============

    // Workout buttons
    document.getElementById("startBtn").addEventListener("click", startSlideshow);
    document.getElementById("restartBtn").addEventListener("click", restartSlideshow);

    // Workout list
    showWorkoutBtn.addEventListener("click", () => {
        workoutList.classList.add("active");
        workoutTimeSpan.textContent = calculateTotalTime();
    });

    closeWorkoutBtn.addEventListener("click", () => {
        workoutList.classList.remove("active");
    });

    workoutList.addEventListener("click", (e) => {
        if (e.target === workoutList || e.target.classList.contains("workout-list")) {
            workoutList.classList.remove("active");
        }
    });

    // Calendar navigation
    document.getElementById("prevMonthBtn").addEventListener("click", () => {
        currentMonth--;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        }
        renderCalendar(currentMonth, currentYear);
    });

    document.getElementById("nextMonthBtn").addEventListener("click", () => {
        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        renderCalendar(currentMonth, currentYear);
    });

    // Page navigation
    const navItems = document.querySelectorAll(".nav-item");
    navItems.forEach(item => {
        item.addEventListener("click", () => {
            const target = item.getAttribute("data-target");
            switchPage(target);
            setActiveNav(navItems, item);
        });
    });

    // Initial calendar render
    renderCalendar(currentMonth, currentYear);

    // Hide loading screen
    const loadingScreen = document.getElementById("loading-screen");
    setTimeout(() => {
        loadingScreen.classList.add("hidden");
    }, 500);
});

