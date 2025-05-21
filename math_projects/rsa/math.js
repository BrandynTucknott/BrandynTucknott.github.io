/*
* Extended Euclidean Algorithm
* Input: a, b positive integers
* Output: [s, t, d] where
*   as + bt = gcd(a, b) = d
*/
function EEA(a, b) {
    if (a > b) 
        return _EEA(a, b, 1, 0, 0, 1);
    else
        return swapIndicies(_EEA(b, a, 1, 0, 0, 1), 0, 1);
}

/*
* Helper function for EEA(). Assumes a > b
*/
function _EEA(a, b, s1, s2, t1, t2) {
    const q = Math.floor(a / b);
    const r = a % b;
    const s = s1 - s2 * q;
    const t = t1 - t2 * q;

    // break condition for algorithm
    if (r == 0) {
        return [s2, t2, b];
    }
    return _EEA(b, r, s2, s, t2, t);
}

/*
* Euclidean algorithm to find the gcd. Does not include s,t such that as + bt = gcd
* Input: a, b positive integers
* Output: gcd
*/
function GCD(a, b) {
    if (b > a)
        return _GCD(b, a);
    return _GCD(a, b);
}

/*
* Helper function for gcd. Assumes a > b
*/
function _GCD(a, b) {
    const r = a % b;

    if (r == 0)
        return b;
    return _GCD(b, r);
}

/*
* Returns true if input is prime, false otherwise
* Input: integer
* Output: [bool, factor]
*   - If num is prime:          bool=true, factor=null
*   - If num is not prime:      bool=false, factor='A x B'
            where num = AB
*/
function isPrime(num) {
    if (num == 1)
        return [false, '1 x 1']

    // check for i = 2, ..., sqrt(num). If i divides num, then num is not prime
    for (let i = 2; i <= Math.sqrt(num); i++) {
        if (num % i == 0)
            return [false, `${num / i} x ${i}`]
    }
    return [true, null]
}

/*
* Verify that the given key is a valid key mod phi_n. Returns true if key has multiplicative inverse
*   mod phi_n and that it is not it's own inverse (implies that it can work as a public key)
* Note: - phi_n = (p - 1)(q - 1)
        - This function will never be called with invalid p,q
* Input: key (int), phi_n (int)
* Output: integer
*       -- null:    error on my part, there is a bug somewhere
*       -- > 0:       all good, key has a good multiplicative inverse mod phi_n [this is the inverse]
*       -- -1:       bad, key is not invertible
*       -- -2:       bad, key is it's own inverse mod phi_n
*/
function verifyKey(key) {
    if (p == null || q == null) {
        console.error(`ERROR: verifyKey(${key}): function was called when p,q were invalid.`);
        return null;
    }

    const phi_n = (p - 1) * (q - 1);
    results = EEA(key, phi_n);
    inverse = results[0];
    gcd = results[2];

    // doesn't have an inverse
    if (gcd != 1)
        return -1;
    // is its own inverse
    else if (key**2 % phi_n == 1)
        return -2;

    // all good, return the inverse
    if (inverse < 0) // don't return a negative number, this will be interpretted as an error
        inverse += phi_n;

    return inverse;
}