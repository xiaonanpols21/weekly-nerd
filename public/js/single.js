// Logo dark mode
const logoImg = document.querySelector('#logo');

// Logo darkmode
// Zie prompts: https://chemical-bunny-323.notion.site/Weekly-Nerd-Chat-GPT-Documentation-6764544211dc42158c23d85eec350fc4#66351f4c31994abc8ee8e25f3268f01e
function isDarkMode() {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
}

function toggleDarkModeImage() {
    if (isDarkMode()) {
        logoImg.src = './img/logo-wit.svg';
        logoImg.alt = 'Xiao Logo Wit';
    } else {
        logoImg.src = './img/logo.svg';
        logoImg.alt = 'Xiao Logo';
    }
}
toggleDarkModeImage();

window.matchMedia('(prefers-color-scheme: dark)').addListener(toggleDarkModeImage);