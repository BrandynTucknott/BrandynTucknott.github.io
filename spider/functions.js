function moveSpiderToMouse()
{
    const TIME_TO_MOVE = 1000; // ms required to move spider to point
    const ITERATIONS_TO_COMPLETE_MOVE = 10;
    // recall currentNormVec stores the previous position
    const deltaX = (x - currentNormVec[0]) / ITERATIONS_TO_COMPLETE_MOVE;
    const deltaY = (y - currentNormVec[1]) / ITERATIONS_TO_COMPLETE_MOVE;
    for (let i = 0; i < ITERATIONS_TO_COMPLETE_MOVE; i++)
    {
        spiderHeadBodyTag.style.left = `${(i + 1) * deltaX - spiderHeadBodyTagWidth / 2}px`;
        spiderHeadBodyTag.style.top = `${(i + 1) * deltaY}px`;
        setTimeout(() => {}, TIME_TO_MOVE / ITERATIONS_TO_COMPLETE_MOVE);
    }
}