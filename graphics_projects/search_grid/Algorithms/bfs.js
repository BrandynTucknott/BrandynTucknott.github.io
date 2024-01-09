class BFS
{
    constructor(maze, x, y, prevX, prevY)
    {
    let queue = new Queue(); // queue of squares

    // queue the start square and mark as visited
    queue.add(maze[y][x]);
    maze[y][x].visited = true;

    function drawBFS()
    {
        if (queue.size == 0) // end condition: nothing to deque
        {
            console.log("no solution");
            clearTimeout(interval);
            context.fillStyle = "rgb(255, 103, 15)"; // orange
            fillSquare(x, y);
            return;
        }


        // get square to use
        let square = queue.remove();

        // change color and check for end square
        context.fillStyle = "rgb(230, 230, 0)"; // yellow
        //starst square has no previous square
        if (square.type != "start")
        {
            prevX = x;
            prevY = y;

            x = square.x;
            y = square.y;

            if (square.type == "end")
            {
                // fill end square
                fillSquare(x, y);
                isComplete = true;

                // update previous square
                if (maze[prevY][prevX].type == "start") // previous square is start, fill it in with a different color
                {
                    context.fillStyle = start_color;    
                    fillSquare(prevX, prevY);
                }

                else // previous square was a normal square
                {
                    context.fillStyle = "rgb(255, 103, 15)"; // orange
                    fillSquare(prevX, prevY);
                }

                context.fillStyle = end_color;

                // delay recoloring end to make it flow better
                setTimeout(function()
                {
                    // change end square back to end color
                    fillSquare(x, y);

                    context.fillStyle = "rgb(0, 204, 104)"; // green
                    
                    let square = maze[y][x]; // go back and color path green
                    while (square.prevSquare.type != "start")
                    {
                        x = square.prevSquare.x;
                        y = square.prevSquare.y;
                        fillSquare(x, y);
                        square = maze[y][x];
                    }
                    isSolving = false;
                    console.log("maze solved");
                }, SPEED); // end of timeout

                clearTimeout(interval);
                return;
            }
        }
        fillSquare(x, y);
        // note squares marked as visited when added to prevent adding same square multiple times (in pushNeighbors())

        // change previous square color from yellow to orange
        if (square.type != "start") // start has no previous square to color in
        {
            if (maze[prevY][prevX].type == "start") // previous square is start, fill it in with a different color
            {
                context.fillStyle = start_color;    
                fillSquare(prevX, prevY);
            }

            else // previous square was a normal square
            {
                context.fillStyle = "rgb(255, 103, 15)"; // orange
                fillSquare(prevX, prevY);
            }
        }
        // add neighbors to queue
        pushNeighbors(queue, x, y);
        interval = setTimeout(drawBFS, SPEED);
    }

    interval = drawBFS();
    }
}