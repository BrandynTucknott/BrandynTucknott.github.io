// assumes a >= b
function gcd(a, b)
{
    return EEA(a, b, Math.floor(a/b), a % b, 1, 0, 1, 0, 1, 0 - 1 * Math.floor(a/b))[0];
}

function EEA(a, b)
{
    return EEA(a, b, Math.floor(a/b), a % b, 1, 0, 1, 0, 1, 0 - 1 * Math.floor(a/b));
}

// returns gcd of a,b and s,t ST as + bt = gcd
function EEA(a, b, q, r, s1, s2, s3, t1, t2, t3)
{
    if (r == 0)
    {
        return [b, s2, t2];
    }
    return EEA(b, r, Math.floor(b/r), b % r, s2, s3, s2 - s3 * Math.floor(b/r), t2, t3, t2 - t3 * Math.floor(b/r));
}

// computes x * r_inverse (mod n). Also known as Montomgery Reduction or REDC Algorithm
function reduction(x)
{
    let n_prime = EEA(n, r)[1];

    let q = ((x % r) * n_prime) % r;
    let alpha = (x - q * n) / r;
    if (alpha < 0)
        alpha += n;
    return alpha;
}