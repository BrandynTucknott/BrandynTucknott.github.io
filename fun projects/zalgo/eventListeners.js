input.addEventListener("input", function()
{
    convertToZalgo();
});

slider.addEventListener("input", function()
{
    INTENSITY = slider.value;
    convertToZalgo();
});