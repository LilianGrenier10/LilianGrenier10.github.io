const messages = [
    "T'es sûre?",
    "T'es vraiment sûre?",
    "Certaine?",
    "S'il te plait...",
    "Tant pis pour toi...",
    "En + j'avais un cadeau...",
    "T'es sûre que tu veux pas le voir?",
    "T'as juste à cliquer sur oui...",
    "J'abandonne...",
    "MA BITE t'as pas le choix ❤️"
];

let messageIndex = 0;

function handleNoClick() {
    const noButton = document.querySelector('.no-button');
    const yesButton = document.querySelector('.yes-button');
    noButton.textContent = messages[messageIndex];
    messageIndex = (messageIndex + 1) % messages.length;
    const currentSize = parseFloat(window.getComputedStyle(yesButton).fontSize);
    yesButton.style.fontSize = `${currentSize * 1.40}px`;
}

function handleYesClick() {
    window.location.href = "yes_page.html";
}