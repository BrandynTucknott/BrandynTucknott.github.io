// update mouse position logic: does not update so fast as to lag the webpage ===========================
// let interval = setInterval(() =>
// {
//     locked = false;
//     setTimeout(() => {locked = true}, 2);
// }, positionUpdateTimeInterval);

document.addEventListener('mousemove', (e) =>
{
    if (!locked)
    {
        x = e.pageX;
        y = e.pageY;
        moveSpiderToMouse();
        // spiderHeadBodyTag.style.transform = `rotate(${Math.PI / 2}rad)`;
    }
}); // ================= End of update mouse position logic ========================