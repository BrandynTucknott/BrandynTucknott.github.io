function calculateGCD(a, b)
{
    return EEA(a, b, Math.floor(a/b), a % b, 1, 0, 1, 0, 1, 0 - 1 * Math.floor(a/b));
}

function EEA(a, b, q, r, s1, s2, s3, t1, t2, t3)
{
    if (r == 0)
    {
        return b;
    }
    return EEA(b, r, Math.floor(b/r), b % r, s2, s3, s2 - s3 * Math.floor(b/r), t2, t3, t2 - t3 * Math.floor(b/r));
}