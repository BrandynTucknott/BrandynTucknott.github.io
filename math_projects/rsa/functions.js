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
* given two primes p, q, lists up to MAX_LISTED_KEYS possible public keys to use
*/
function getPossiblePublicKeys() {
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

        if (i > MAX_ITER) {
            console.error(`ERROR: getPossibleKeys(${p}, ${q}): MAX_ITER exceeded.`);
            return null
        }
    }

    console.log(`Checked keys where they are their own inverse mod ${phi_n}: ${ownInverse}`);
    return possibleKeys;
}

function arrayToStr(array) {
    if (array.length == 0)
        return "";

    let str = `${array[0]}`;
    for (let i = 1; i < array.length; i++) {
        str += `, ${array[i]}`;

        if (i > MAX_ITER) { // should never trigger
            console.error(`ERROR: arrayToStr(${array}): MAX_ITER exceeded`);
            return null;
        }
    }

    return str;
}