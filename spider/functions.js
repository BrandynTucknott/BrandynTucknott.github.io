function moveSpiderToMouse()
{
    const TIME_TO_MOVE = 1000; // ms required to move spider to point
    const ITERATIONS_TO_COMPLETE_MOVE = 10;
    // recall currentVec stores the previous position
    const deltaX = (x - currentVec[0]) / ITERATIONS_TO_COMPLETE_MOVE;
    const deltaY = (y - currentVec[1]) / ITERATIONS_TO_COMPLETE_MOVE;
    for (let i = 0; i < ITERATIONS_TO_COMPLETE_MOVE; i++)
    {
        let newX = (i + 1) * deltaX - spiderHeadBodyTagWidth / 2;
        let newY = (i + 1) * deltaY;
        spiderHeadBodyTag.style.left = `${newX}px`;
        spiderHeadBodyTag.style.top = `${newY}px`;

        let theta = Math.acos((newX * newY) / (1 * magnitude(newX, newY)));

        spiderHeadBodyTag.style.transform = `rotate(${theta}rad)`;

        setTimeout(() => {}, TIME_TO_MOVE / ITERATIONS_TO_COMPLETE_MOVE);
    }
}

function magnitude(x, y)
{
    return Math.pow(Math.pow(x,2) + Math.pow(y,2), 0.5);
}