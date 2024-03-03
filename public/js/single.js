/*
    Variables
*/
// Dark mode
const darkSwitch = document.querySelector("#toggle");
const body = document.querySelector(".body-single");
const logo = document.querySelector("#logo");

// Back btn
// Bron: https://www.w3schools.com/jsref/met_his_back.asp
const backBtn = document.querySelector("#backBtn");

/*
    Functions
*/
// Dark mode
function darkMode() {
    body.classList.toggle("dark-mode");

    // Dark mode img
    // Zie prompts: https://chemical-bunny-323.notion.site/Weekly-Nerd-Chat-GPT-Documentation-6764544211dc42158c23d85eec350fc4#205f2ab95f4940088aa5ed429c8fc55b
    if (body.classList.contains("dark-mode")) {
        logo.src = '../img/logo-wit.svg';
    } else {
        logo.src = '../img/logo.svg';
    }
}
darkSwitch.addEventListener("click", darkMode);

// Back btn
function back() {
    history.back()
}
backBtn.addEventListener("click", back);