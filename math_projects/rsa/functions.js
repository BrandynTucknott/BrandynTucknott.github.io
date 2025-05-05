/*
* Swap the indicies for a given array and return it. Assumes the given indicies are in bounds.
*/
function swapIndicies(array, i, j) {
    let tmp = array[i];
    array[i] = array[j];
    array[j] = tmp;

    return array;
}

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
* given two primes p, q, lists up to MAX_LISTED_KEYS possible public keys to use
*/
function getPossiblePublicKeys(p, q) {
    const phi_n = (p - 1) * (q - 1);

    let possibleKeys = [];      // list of all possible public keys (keeps up to MAX_LISTED_KEYS keys)
    let ownInverse = [];        // list of all checked keys which are their own inverse
    let key = 3;                // key being checked
    let gcd = 0;                // gcd(key, phi_n)
    let inverseFlag = false;    // is set to true if phi_n - 1 is its own inverse mod phi_n
    for (let i = 0; i < MAX_LISTED_KEYS; i++) {
        gcd = GCD(key, phi_n);
        while (gcd != 1) {
            key += 2;
            gcd = GCD(key, phi_n);

            // check that the key is not it's own inverse (if it was, it would be a terrible public key)
            if (key**2 % phi_n == 1) { // don't continue, immediately generate a new key (continuing would exit the loop, which we do not want)
                ownInverse[ownInverse.length] = key;
                // if phi_n - 1 is its own inverse modulo phi_n, then terminate
                if (key == phi_n - 1) {
                    inverseFlag = true;
                    break;
                }

                // else key < phi_n: no concern
                key += 2;
                gcd = GCD(key, phi_n)
            }
        }

        // we went up to key = phi_n - 1, there are no more keys to check
        if (inverseFlag) {
            console.log(`Checked keys where they are their own inverse mod ${phi_n}: ${ownInverse}`);
            return possibleKeys;
        }

        // we have a valid possible public key at this point
        possibleKeys[i] = key;


        // is it possible to list more?
        //  - the last possible number with gcd(key, phi_n) = 1 is key = phi_n - 1
        if (key == phi_n - 1)
            break;

        key += 2;
    }

    console.log(`Checked keys where they are their own inverse mod ${phi_n}: ${ownInverse}`);
    return possibleKeys;
}

function arrayToStr(array) {
    if (array.length == 0)
        return "";

    let str = `${array[0]}`;
    for (let i = 1; i < array.length; i++)
        str += `, ${array[i]}`;

    return str;
}