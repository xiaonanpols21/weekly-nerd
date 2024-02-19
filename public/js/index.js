/*
    Variables
*/
// Nav buttons
const leftBtn = document.querySelector(".nav-page a:first-of-type");
const rightBtn = document.querySelector(".nav-page a:last-of-type");
const nav1 = document.querySelector(".nav-page p:first-of-type");

// Section in screen?
const heroSec = document.querySelector("#sec-1");
const blogSec = document.querySelector("#sec-2");

// Hero carousel
const carousel1 = document.querySelector(".carousel-hero a:first-of-type");
const carouselArticles = document.querySelectorAll(".carousel-hero a");

// Dark mode
const darkSwitch = document.querySelector("#toggle");
const body = document.querySelector("body");
const logo = document.querySelector("#logo");

/*
    Functions
*/
// Nav buttons
leftBtn.classList.add("disabled");

function changeNavRight() {
    nav1.textContent = "2";
    leftBtn.classList.remove("disabled");
    rightBtn.classList.add("disabled");
}
rightBtn.addEventListener("click", changeNavRight);

function changeNavLeft() {
    nav1.textContent = "1";
    leftBtn.classList.add("disabled");
    rightBtn.classList.remove("disabled");
}
leftBtn.addEventListener("click", changeNavLeft);


// Sections in screen?
// Zie prompts: https://chemical-bunny-323.notion.site/Weekly-Nerd-Chat-GPT-Documentation-6764544211dc42158c23d85eec350fc4#79c01870e6d44bfe99da2de35159c2f7
// FIXME: 
function isScreenUnder992() {
    return window.innerWidth < 992;
}

if (isScreenUnder992()) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                nav1.textContent = "1";
                console.log("In screen");
            } else {
                nav1.textContent = "2";
                console.log("Out of screen");
            }
        });
    }, { threshold: 1 });

    observer.observe(heroSec);

}

// Hero carousel
// Zie prompts: https://chemical-bunny-323.notion.site/Weekly-Nerd-Chat-GPT-Documentation-6764544211dc42158c23d85eec350fc4#501d61b30a2846bdb3f891d521ccc7e0
carousel1.classList.add("active");

function addActive(event) {
    document.querySelector(".carousel-hero a.active").classList.remove("active");
    event.target.classList.add("active");
}

carouselArticles.forEach(carouselArticle => {
    carouselArticle.addEventListener("mouseover", addActive);
});

// Dark mode
function darkMode() {
    body.classList.toggle("dark-mode");
    
    // Dark mode img
    // Zie prompts: https://chemical-bunny-323.notion.site/Weekly-Nerd-Chat-GPT-Documentation-6764544211dc42158c23d85eec350fc4#205f2ab95f4940088aa5ed429c8fc55b
    if (body.classList.contains("dark-mode")) {
        logo.src = './img/logo-wit.svg';
    } else {
        logo.src = './img/logo.svg';
    }
}
darkSwitch.addEventListener("click", darkMode);