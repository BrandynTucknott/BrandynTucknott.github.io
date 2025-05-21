function addEventListeners() {

    // listen for button press to generate possible public key choices
    document.getElementById("gen-choice-btn").addEventListener("click", () => {
        const err_box = document.getElementById('gen-public-key-err-box');
        if (p == null || q == null) {
            err_box.textContent = 'Both p and q must be chosen before private keys can be generated.';
            return;
        }
        err_box.textContent = '';

        // get and print a list of possible values for public key based on p,q
        const possiblePublicKeys = getPossiblePublicKeys(p, q);
        if (possiblePublicKeys == null) {
            console.warn(`WARNING: In listener for Generate Public Key Choices: returned keys are null.`)
            document.getElementById("possible-public-keys").textContent  = '';
            return;
        }

        const array_str = arrayToStr(possiblePublicKeys);
        if (array_str == null) {
            console.warn(`WARNING: In listener for Generate Public Key Choices: returned array string is null.`)
            document.getElementById("possible-public-keys").textContent  = '';
            return;
        }

        document.getElementById("possible-public-keys").textContent  = `${array_str}`;
    });

    // listen for changes in public key
    document.getElementById('public-key').addEventListener('change', () => {
        const err_box = document.getElementById('public-key-err-box');

        // if insufficient info, let user know
        if (p == null || q == null) {
            public_key = null; // invalid p,q --> invalid public key
            private_key = null;
            err_box.textContent = 'Both p and q must be valid primes.';
            return;
        }

        // input is an integer?
        temp_key = document.getElementById('public-key').value
        if (temp_key == '') {
            public_key = null;
            private_key = null;
            err_box.textContent = 'Public key cannot be empty.';
            private_key_box.textContent = '';
            return;
        }
        try {
            temp_key = parseInt(temp_key);
        } catch (e) {
            err_box.textContent = 'Invalid public key. Remember it must be an integer.'
            public_key = null;
            private_key = null;
            return;
        }

        // input works as a valid key?
        inv = verifyKey(temp_key);
        if (inv == null) { // prob a bug somewhere in my code
            public_key = null;
            private_key = null;
            private_key_box.textContent = '';
            err_box.textContent = 'There is a bug on my end, maybe try a different public key?';
            return;
        }
        else if (inv == -1) {
            public_key = null;
            private_key = null;
            private_key_box.textContent = '';
            err_box.textContent = `public key ${temp_key} is not multiplicatively invertible mod ${(p - 1) * (q - 1)}.`;
            return;
        }
        else if (inv == -2) {
            public_key = temp_key
            private_key = public_key;
            private_key_box.textContent = `${private_key}`;
            err_box.textContent = `public key ${temp_key} is its own multiplicative inverse mod ${(p - 1) * (q - 1)}, and probably a bad choice.`;
            return;
        }

        // inv is actually the inverse of public key
        // update info
        err_box.textContent = '';
        public_key = temp_key
        private_key = inv;
        private_key_box.textContent = `${private_key}`;
    });

    // listen for changes in either p or q
    prime1.addEventListener("change", () => {
        updateP();
    })

    prime2.addEventListener("change", () => {
        updateQ();
    })
}