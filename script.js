const slides = [
    {
        title: "Shadow Boxing (Power Focus)",
        image: "https://cdn.pixabay.com/photo/2026/03/16/20/58/20-58-26-102_1280.png",
        time: "120"
    },
    {
        title: "Push-ups",
        image: "https://cdn.pixabay.com/photo/2016/02/16/19/28/burpee-1203906_1280.jpg",
        time: "60"
    },
    {
        title: "Plank",
        image: "https://cdn.pixabay.com/photo/2016/02/16/19/28/burpee-1203906_1280.jpg",
        time: "60"
    },
    {
        title: "Rest",
        image: "https://cdn.pixabay.com/photo/2016/02/16/19/28/burpee-1203906_1280.jpg",
        time: "60"
    },
    {
        title: "Boxing Combos (speed Focus)",
        image: "https://cdn.pixabay.com/photo/2016/02/16/19/28/burpee-1203906_1280.jpg",
        time: "120"
    },
    {
        title: "Diamond Push-ups",
        image: "https://cdn.pixabay.com/photo/2016/02/16/19/28/burpee-1203906_1280.jpg",
        time: "60"
    },
    {
        title: "Bicycle Crunches",
        image: "https://cdn.pixabay.com/photo/2016/02/16/19/28/burpee-1203906_1280.jpg",
        time: "60"
    },
    {
        title: "Rest",
        image: "https://cdn.pixabay.com/photo/2016/02/16/19/28/burpee-1203906_1280.jpg",
        time: "60"
    },
    {
        title: "Shadow Boxing (Power Focus)",
        image: "https://cdn.pixabay.com/photo/2016/02/16/19/28/burpee-1203906_1280.jpg",
        time: "120"
    },
    {
        title: "Wide Push-ups",
        image: "https://cdn.pixabay.com/photo/2016/02/16/19/28/burpee-1203906_1280.jpg",
        time: "60"
    },
    {
        title: "Leg Raises",
        image: "https://cdn.pixabay.com/photo/2016/02/16/19/28/burpee-1203906_1280.jpg",
        time: "60"
    },
    {
        title: "Rest",
        image: "https://cdn.pixabay.com/photo/2016/02/16/19/28/burpee-1203906_1280.jpg",
        time: "60"
    },
    {
        title: "Boxing Slips + Counters",
        image: "https://cdn.pixabay.com/photo/2016/02/16/19/28/burpee-1203906_1280.jpg",
        time: "120"
    },
    {
        title: "Explosive Push-ups",
        image: "https://cdn.pixabay.com/photo/2016/02/16/19/28/burpee-1203906_1280.jpg",
        time: "60"
    },
    {
        title: "Russian Twists",
        image: "https://cdn.pixabay.com/photo/2016/02/16/19/28/burpee-1203906_1280.jpg",
        time: "60"
    },
    {
        title: "Rest",
        image: "https://cdn.pixabay.com/photo/2016/02/16/19/28/burpee-1203906_1280.jpg",
        time: "60"
    },
    {
        title: "Punch Out Round (Max Speed)",
        image: "https://cdn.pixabay.com/photo/2016/02/16/19/28/burpee-1203906_1280.jpg",
        time: "120"
    },
    {
        title: "Decline Push-ups (Feet Elevated)",
        image: "https://cdn.pixabay.com/photo/2016/02/16/19/28/burpee-1203906_1280.jpg",
        time: "60"
    },
    {
        title: "Crunch Hold",
        image: "https://cdn.pixabay.com/photo/2016/02/16/19/28/burpee-1203906_1280.jpg",
        time: "60"
    },
    {
        title: "Rest",
        image: "https://cdn.pixabay.com/photo/2016/02/16/19/28/burpee-1203906_1280.jpg",
        time: "60"
    },
    {
        title: "Final Burnout: Hooks + Uppercuts",
        image: "https://cdn.pixabay.com/photo/2016/02/16/19/28/burpee-1203906_1280.jpg",
        time: "120"
    },
    {
        title: "Push-up to Plank Walk",
        image: "https://cdn.pixabay.com/photo/2016/02/16/19/28/burpee-1203906_1280.jpg",
        time: "60"
    },
    {
        title: "Cool Down (deep breathing)",
        image: "https://cdn.pixabay.com/photo/2016/02/16/19/28/burpee-1203906_1280.jpg",
        time: "60"
    },
];

let currentSlide = 0;
let timerIntrerval;

const startScreen = document.getElementById("start-screen");
const slidescreen = document.getElementById("slide-screen");
const endScreen = document.getElementById("end-screen");

const slideTitle = document.getElementById("slide-title");
const slideImage = document.getElementById("slide-image");
const timerDisplay = document.getElementById("timer");

document.getElementById("startBtn").addEventListener("click", startSlideshow);
document.getElementById("restartBtn").addEventListener("click", restartSlideshow);

const progressBar = document.getElementById("progress-bar")

function startSlideshow() {
    startScreen.classList.add("hidden");
    slidescreen.classList.remove("hidden");
    currentSlide = 0;
    showSlide();
}

function showSlide() {
    if (currentSlide >= slides.length) {
        slidescreen.classList.add("hidden");
        endScreen.classList.remove("hidden");
        return;
    }

    // Update progress bar
    const progressPercentage = (currentSlide / slides.length) * 100;
    progressBar.style.width = progressPercentage + "%";

    const slide = slides[currentSlide];
    slideTitle.textContent = slide.title;
    slideImage.src = slide.image;

    let timeLeft = slide.time;
    timerDisplay.textContent = `Time: ${timeLeft}s`;

    timerIntrerval = setInterval(() => {
        timeLeft--;
        timerDisplay.textContent = `Time: ${timeLeft}s`;

        if (timeLeft <= 0) {
            clearInterval(timerIntrerval);
            currentSlide++;
            showSlide();
        }
    }, 1000);
}

function restartSlideshow() {
    endScreen.classList.add("hidden");
    startScreen.classList.remove("hidden");
}