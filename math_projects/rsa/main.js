document.addEventListener("DOMContentLoaded", () => {
    console.log('DOM loaded.');
    addEventListeners();
    console.log('Listeners added.');
});


const MAX_LISTED_KEYS = 20; // maximum number of printed possible public keys