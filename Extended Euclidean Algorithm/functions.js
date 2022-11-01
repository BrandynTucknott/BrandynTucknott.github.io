function appendToPage(a, b, q, r, s1, s2, s3, t1, t2, t3)
{
    const arr = [a, b, q, r, s1, s2, s3, t1, t2, t3];
    // create and style div
    const div = document.createElement("div");
    div.style.display = "flex";
    div.style.flexFlow = "row";
    div.style.height = "40px";

    // create, style, and append to div
    for (let i = 0; i < 10; i++)
    {
        const span = document.createElement("span");
        span.style.border = "1px solid black";
        span.style.width = "200px";
        span.style.display = "flex";
        span.style.alignItems = "center";
        span.style.justifyContent = "center";

        span.innerHTML = arr[i];
        div.appendChild(span);
    }

    // append div to body
    table.appendChild(div);
    children[children.length] = div;
}

function calculateGCD()
{
    EEA(inputA, inputB, Math.floor(inputA/inputB), inputA % inputB, 1, 0, 1, 0, 1, 0 - 1 * Math.floor(inputA/inputB));
}

function EEA(a, b, q, r, s1, s2, s3, t1, t2, t3)
{
    appendToPage(a, b, q, r, s1, s2, s3, t1, t2, t3);
    if (r == 0)
    {
        gcd = document.createElement("span");
        gcd.style.fontSize = "25px";
        gcd.style.position = "relative";
        gcd.innerHTML = `GCD = ${b} = (${inputA})(${s2}) + (${inputB})(${t2})`; // •
        table.appendChild(gcd);
        children[children.length] = gcd;
        return;
    }
    return EEA(b, r, Math.floor(b/r), b % r, s2, s3, s2 - s3 * Math.floor(b/r), t2, t3, t2 - t3 * Math.floor(b/r));
}

function clearPage()
{
    // remove children
    for (let i = 0; i < children.length; i++)
        table.removeChild(children[i]);
    // reset variables
    children = [];
    gcd = null;
}