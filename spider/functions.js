function moveSpiderToMouse()
{
    // const TIME_TO_MOVE = 100; // ms required to move spider to point
    const ITERATIONS_TO_COMPLETE_MOVE = 1;
    // recall lastPosVec stores the previous position
    for (let i = 0; i < ITERATIONS_TO_COMPLETE_MOVE; i++)
    {
        // ==================== SECTION TO ROTATE =====================
        // normalize and convert to cartesian
        const normX = x / WIDTH;
        const normY = y / HEIGHT;
        const normPrevX = lastPosVec[0] / WIDTH;
        const normPrevY = lastPosVec[1] / HEIGHT;

        const cartesianNormX = normX;
        const cartesianNormY = 1 - normY;
        const cartesianNormPrevX = normPrevX;
        const cartesianNormPrevY = 1 - normPrevY;

        const deltaX = cartesianNormX - cartesianNormPrevX;
        const deltaY = cartesianNormY - cartesianNormPrevY;

        if (deltaX == 0 | deltaY == 0)
            continue; // don't rotate
        

        let theta = Math.atan(deltaY / deltaX);

        // logic to find theta; idk how I made this
        if (deltaX < 0 && deltaY < 0) // bottom left
        {
            // console.log('bottom left');
            theta += Math.PI / 2;
            theta = -theta;
        }

        else if (deltaX < 0 && deltaY > 0) // top left
        {
            // console.log('top left');
            theta = Math.PI / 2 - theta;
            theta += Math.PI;
        }

        else if (deltaX > 0 && deltaY < 0) // bottom right
        {
            // console.log('bottom right');
            theta += Math.PI / 2;
            theta = -theta;
            theta += Math.PI;
        }

        else if (deltaX > 0 && deltaY > 0) // top right
        {
            // console.log('top right');
            theta = Math.PI / 2 - theta;
        }

        spiderHeadBodyTag.style.transform = `rotate(${theta}rad)`; // ========== END OF ROTATE ===========

        // ==================== SECTION TO MOVE =======================
        spiderHeadBodyTag.style.left = `${x - spiderHeadBodyTagWidth / 2}px`;
        spiderHeadBodyTag.style.top = `${y}px`;
        
        // setTimeout(null, TIME_TO_MOVE / ITERATIONS_TO_COMPLETE_MOVE);
    }
}

function magnitude(x, y)
{
    return Math.pow(Math.pow(x,2) + Math.pow(y,2), 0.5);
}