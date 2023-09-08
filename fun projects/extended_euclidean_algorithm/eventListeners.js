numA.addEventListener("change", function()
{
    let num = parseInt(numA.value);
    numA.value = num;
    inputA = num;
    if (inputA >= 0)
        signA = 1;
    else
        signA = -1;
});

numB.addEventListener("change", function()
{
    let num = parseInt(numB.value);
    if (num == 0)
        return;
    numB.value = num;
    inputB = num;
    if (inputB >= 0)
        signB = 1;
    else
        signB = -1;
});

solve.addEventListener("click", function()
{
    clearPage();
    calculateGCD();
});