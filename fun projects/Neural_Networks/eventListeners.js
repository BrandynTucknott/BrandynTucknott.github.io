// colors the grid
document.addEventListener("mousedown", function(down)
{
    let posX = down.pageX - canvasBoundingBox.left; // position X and Y
    let posY = down.pageY - canvasBoundingBox.top;

    let prevX = -1; // previous X and Y
    let prevY = -1;

    // context.lineWidth = 10;

    let gridX = findGridX(posX);
    let gridY = findGridY(posY);

    // if not colored
    if (gridX != -1 && gridY != -1)
        fill3x3(gridX, gridY, 4);

    const interval = setInterval(function()
    {
        // do nothing if the given coords are out of bounds
        if (prevX != -1 && (posX <= width && posY <= height)) // it is not possible for only one of prevX/prevY to be -1. Thus we only check one
        {
            // fill boxes the "line" passes through
            const STEP_INTERVAL = 15; // check this many times per line
            const DELTA_X = (posX - prevX) / STEP_INTERVAL;
            const DELTA_Y = (posY - prevY) / STEP_INTERVAL;

            for (let i = 0; i < STEP_INTERVAL; i++)
            {
                let x = Math.floor(prevX + i * DELTA_X);
                let y = Math.floor(prevY + i * DELTA_Y);

                gridX = findGridX(x);
                gridY = findGridY(y);

                const speed = Math.sqrt(Math.pow(posX - prevX, 2) + Math.pow(posY - prevY, 2));

                // if not colored
                fill3x3(gridX, gridY, Math.round(speed));
            }
        }   
    }, 1); // end of setInterval

    // update mouse position
    document.onmousemove = function(move)
    {
        // console.log("updated coords");
        prevX = posX;
        prevY = posY;

        posX = move.pageX - canvasBoundingBox.left;
        posY = move.pageY - canvasBoundingBox.top;
    };

    // listen for mouse up [stop drawing]
    document.addEventListener("mouseup", function(up)
    {
        clearInterval(interval);
    });
});

// registers if a button has been pressed
button.addEventListener("click", function(click)
{
    readUserInput();
});

clear.addEventListener('click', () =>
{
    clearGrid();
    answerBox.innerText = "N/A";
});