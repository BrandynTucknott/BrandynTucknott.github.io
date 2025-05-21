document.addEventListener("DOMContentLoaded", () => {
    console.log('DOM loaded.');
    addEventListeners();
    console.log('Listeners added.');
});

let p = null
let q = null
let public_key = null
let private_key = null

const MAX_LISTED_KEYS = 20; // maximum number of printed possible public keys
const MAX_ITER = 50_000; // max number of iterations for any loop

// declared here for convenience b/c they are referenced multiple times
const prime1 = document.getElementById('prime1');
const prime2 = document.getElementById('prime2');
const public_key_box = document.getElementById('public-key');
const private_key_box = document.getElementById('private-key');