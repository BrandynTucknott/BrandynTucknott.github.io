function updateP() {
    const err_box = document.getElementById("prime1-err-box")
    document.getElementById("possible-public-keys").textContent = '';

    // try to turn value into int
    let temp_p = prime1.value;
    try {
        temp_p = parseInt(temp_p);
    } catch (e) {
        p = null;
        console.error(`ERROR: updateP: p = ${temp_p}`, e);
        return;
    }

    if (temp_p == 1) {
        err_box.textContent = 'p = 1 is not a valid choice for RSA.'
        return;
    }

    // test if value is prime
    isprime_ret = isPrime(temp_p) // [bool, 'A x B']
    if (!isprime_ret[0]) {
        p = null; // indicate non-prime entry
        err_box.textContent = `p = ${isprime_ret[1]} is not prime`;
        return;
    }
    err_box.textContent = '';

    // assign p
    p = temp_p
    prime1.value = `${p}`;
}

function updateQ() {
    const err_box = document.getElementById("prime2-err-box")
    document.getElementById("possible-public-keys").textContent = '';

    // try to turn value into int
    let temp_q = prime2.value;
    try {
        temp_q = parseInt(temp_q);
    } catch (e) {
        q = null;
        console.error(`ERROR: updateQ: q = ${temp_q}`, e);
        return;
    }

    if (temp_q == 1) {
        err_box.textContent = 'q = 1 is not a valid choice for RSA.'
        return;
    }

    // test if value is prime
    isprime_ret = isPrime(temp_q) // [bool, 'A x B']
    if (!isprime_ret[0]) {
        q = null; // indicate non-prime entry
        err_box.textContent = `q = ${isprime_ret[1]} is not prime`;
        return;
    }
    err_box.textContent = '';

    // assign p
    q = temp_q
    prime2.value = `${q}`;
}