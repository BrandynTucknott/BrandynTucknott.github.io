function appendToPage(a, b, q, r, s1, s2, s3, t1, t2, t3)
{
    const arr = [a, b, q, r, s1, s2, s3, t1, t2, t3]; // for convenient adding to page in for loop below (instead of adding everything individually)
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
    if (inputA < inputB)
        EEA(inputB, inputA, Math.floor(inputB/inputA), inputB % inputA, 1, 0, 1, 0, 1, 0 - 1 * Math.floor(inputB/inputA), true);
    else
        EEA(inputA, inputB, Math.floor(inputA/inputB), inputA % inputB, 1, 0, 1, 0, 1, 0 - 1 * Math.floor(inputA/inputB), false);
}

function EEA(a, b, q, r, s1, s2, s3, t1, t2, t3, switched)
{
    appendToPage(a, b, q, r, s1, s2, s3, t1, t2, t3);
    if (r == 0)
    {
        if (switched)
        {
            gcd = document.createElement("span");
            gcd.style.fontSize = "25px";
            gcd.style.position = "relative";
            gcd.innerHTML = `GCD = ${Math.abs(b)} = (${inputA})(${signA * t2}) + (${inputB})(${signB * s2})`;
            table.appendChild(gcd);
            children[children.length] = gcd;
            return;
        }
        gcd = document.createElement("span");
        gcd.style.fontSize = "25px";
        gcd.style.position = "relative";
        gcd.innerHTML = `GCD = ${Math.abs(b)} = (${inputA})(${signA * s2}) + (${inputB})(${signB * t2})`;
        table.appendChild(gcd);
        children[children.length] = gcd;
        return;
    }
    return EEA(b, r, Math.floor(b/r), b % r, s2, s3, s2 - s3 * Math.floor(b/r), t2, t3, t2 - t3 * Math.floor(b/r), switched);
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