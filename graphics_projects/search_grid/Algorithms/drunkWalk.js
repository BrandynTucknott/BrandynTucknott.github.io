class DrunkWalk
{
    constructor(maze, x, y, prevX, prevY)
    {
        let steps = 0;
        const MAX_STEPS = 100000; // the drunk will give up on going home after this many steps

        let square = maze[y][x];

        interval = drawDrunkWalk();

        function drawDrunkWalk()
        {
            // change color of previous square
            if (prevX != -1) // both prevX && prevY will be -1 or not, never just one of them
            {
                if (maze[prevY][prevX].type == "start")
                    context.fillStyle = start_color;
                else if (maze[prevY][prevX].type == "end")
                    context.fillStyle = end_color;
                else
                    context.fillStyle = "rgb(0, 204, 104)"; // orange

                fillSquare(prevX, prevY);

                if (maze[prevY][prevX].type == "end")
                {
                    console.log("got to end");
                    clearTimeout(interval);
                    interval = setTimeout(context.fillStyle = end_color, fillSquare(prevX, prevY), SPEED);
                    return;
                }
            }
            // exit if too many steps
            if (steps == MAX_STEPS)
            {
                console.log("took too long");
                clearTimeout(interval);
                return;
            }

            // show current square
            context.fillStyle = "rgb(230, 230, 0)"; // yellow
            fillSquare(x, y);

            // go to next square
            prevX = x;
            prevY = y;

            square = getRandomAdjacentSquare(x, y);

            if (square == null)
            {
                if (maze[y][x].type == "start")
                    context.fillStyle = start_color;
                else if (maze[y][x].type == "end")
                    context.fillStyle = end_color;
                else
                    context.fillStyle = "rgb(0, 204, 104)"; // orange

                fillSquare(x, y);
                return;
            }

            x = square.x;
            y = square.y;

            steps++;

            // recursive call with delay
            interval = setTimeout(drawDrunkWalk, SPEED);
        }
    }
}