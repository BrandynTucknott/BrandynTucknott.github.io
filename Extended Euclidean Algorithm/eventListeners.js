numA.addEventListener("change", function()
{
    let num = parseInt(numA.value);
    numA.value = num;
    inputA = num;
});

numB.addEventListener("change", function()
{
    let num = parseInt(numB.value);
    if (num == 0)
        return;
    numB.value = num;
    inputB = num;
});

solve.addEventListener("click", function()
{
    if (inputB > inputA)
        return;
    clearPage();
    calculateGCD();
});