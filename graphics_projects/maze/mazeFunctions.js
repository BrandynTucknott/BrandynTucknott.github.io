function initMaze() // fills dividers
{
    context.fillStyle = "rgb(128, 128, 128)";

    for(let i = 0; i < rows; i++) // iteration loop
    {
        context.fillRect(0, BOX_DIM * (i + 1) + DIVIDER_HEIGHT * i + 1, width, DIVIDER_HEIGHT);
    }

    for (let i = 0; i < cols; i++)
    {
        context.fillRect(BOX_DIM * (i + 1) + DIVIDER_HEIGHT * i + 1, 0, DIVIDER_HEIGHT, height);
    }

    context.fillStyle = "rgb(0, 0, 0)";
    for (let i = 1; i <= rows; i++)
    {
        for (let j = 1; j <= cols; j++)
        {
            context.fillText(`${i - 1} ${j - 1}`, BOX_DIM * (i - 1) + DIVIDER_HEIGHT * i, BOX_DIM * (j) + DIVIDER_HEIGHT * (j - 1), BOX_DIM);
        }
    }
}

// changes the type of the given square to the given type
function changeState(square, type)
{
    square.type = type;
}

// returns true if the num is within [lower, upper]; false if not
function inRange(num, lower, upper)
{
    return (num >= lower && num <= upper);
}

function drawNum(gridX, gridY)
{
    let originalColor = context.fillStyle;
    context.fillStyle = "rgb(0, 0, 0)";
    context.fillText(`${gridX} ${gridY}`, BOX_DIM * (gridX) + DIVIDER_HEIGHT * (gridX + 1), BOX_DIM * (gridY + 1) + DIVIDER_HEIGHT * gridY, BOX_DIM);
    context.fillStyle = originalColor;
}

// fills out maze and draws given square to canvas
function fillSquare(gridX, gridY)
{
    // draw the square
    if (gridX == 0 && gridY == 0)
        context.fillRect((BOX_DIM + DIVIDER_HEIGHT) * gridX, (BOX_DIM + DIVIDER_HEIGHT) * gridY, BOX_DIM + 1, BOX_DIM + 1);
    else if (gridX == 0)
        context.fillRect((BOX_DIM + DIVIDER_HEIGHT) * gridX, (BOX_DIM + DIVIDER_HEIGHT) * gridY + 1, BOX_DIM + 1, BOX_DIM);
    else if (gridY == 0)
        context.fillRect((BOX_DIM + DIVIDER_HEIGHT) * gridX + 1, (BOX_DIM + DIVIDER_HEIGHT) * gridY, BOX_DIM, BOX_DIM + 1);
    else
        context.fillRect((BOX_DIM + DIVIDER_HEIGHT) * gridX + 1, (BOX_DIM + DIVIDER_HEIGHT) * gridY + 1, BOX_DIM, BOX_DIM);

    drawNum(gridX, gridY);
}

// pushes nieghbors of a square into the queue
function pushNeighbors(queue, gridX, gridY)
{
    if (gridY > 0) // there is a square above
    {
        if (maze[gridX][gridY - 1].type != "wall" && maze[gridX][gridY - 1].visited == false) // not complete; add if not a wall and unvisited
        {
            queue.add(maze[gridX][gridY - 1]);
            maze[gridX][gridY - 1].prevSquare = maze[gridX][gridY];
            maze[gridX][gridY - 1].visited = true;
            let row = document.createElement("li");
            row.innerHTML = `${gridX} ${gridY - 1}`;
            queue_display.appendChild(row);
            context.fillStyle = queue_color;
            fillSquare(gridX, gridY - 1);
        }
    }

    if (gridX < cols - 1) // there is a square to the right
    {
        if (maze[gridX + 1][gridY].type != "wall" && maze[gridX + 1][gridY].visited == false) // not complete; add if not a wall and unvisited
        {
            queue.add(maze[gridX + 1][gridY]);
            maze[gridX + 1][gridY].prevSquare = maze[gridX][gridY];
            maze[gridX + 1][gridY].visited = true;
            let row = document.createElement("li");
            row.innerHTML = `${gridX + 1} ${gridY}`;
            queue_display.appendChild(row);
            context.fillStyle = queue_color;
            fillSquare(gridX + 1, gridY);
        }
    }

    if (gridY < rows - 1) // there is a square below
    {
        if (maze[gridX][gridY + 1].type != "wall" && maze[gridX][gridY + 1].visited == false) // not complete; add if not a wall and unvisited
        {
            queue.add(maze[gridX][gridY + 1]);
            maze[gridX][gridY + 1].prevSquare = maze[gridX][gridY];
            maze[gridX][gridY + 1].visited = true;
            let row = document.createElement("li");
            row.innerHTML = `${gridX} ${gridY + 1}`;
            queue_display.appendChild(row);
            context.fillStyle = queue_color;
            fillSquare(gridX, gridY + 1);
        }
    }

    if (gridX > 0) // there is a square to the left
    {
        if (maze[gridX - 1][gridY].type != "wall" && maze[gridX - 1][gridY].visited == false) // not complete; add if not a wall and unvisited
        {
            queue.add(maze[gridX - 1][gridY]);
            maze[gridX - 1][gridY].prevSquare = maze[gridX][gridY];
            maze[gridX - 1][gridY].visited = true;
            let row = document.createElement("li");
            row.innerHTML = `${gridX - 1} ${gridY}`;
            queue_display.appendChild(row);
            context.fillStyle = queue_color;
            fillSquare(gridX - 1, gridY);
        }
    }
}

function setButtonColors(selected, other1, other2, other3)
{
    selected.style.backgroundColor = "rgb(0, 160, 0)";
    other1.style.backgroundColor = "lightgray";
    other2.style.backgroundColor = "lightgray";
    other3.style.backgroundColor = "lightgray";
}

function resetMaze()
{
    if (mazeCopy == null)
        return;
    let temp = mazeCopy;
    clearMaze();
    maze = temp;
    hasStart = true;
    hasEnd = true;
    isSolving = false;
    isComplete = false;

    let originalColor = context.fillStyle;
    for (let i = 0; i < rows; i++)
    {
        for (let j = 0; j < cols; j++)
        {
            let square = maze[i][j];

            if (square.type == "wall")
            {
                context.fillStyle = "rgb(0, 0, 0)";
                fillSquare(i, j);
            }

            else if (square.type == "start") // there can only be one start square
            {
                context.fillStyle = "rgb(99, 102, 106)";
                fillSquare(i, j);
            }

            else if (square.type == "end") // there can only be one start square
            {
                context.fillStyle = "rgb(152, 29, 151)";
                fillSquare(i, j);
            }
        }
    }
    context.fillStyle = originalColor;
}

function solveMaze()
{
    resetMaze();
    if (isSolving || isComplete)
    {
        solveMaze();
        return;
    }
    isSolving = true;
    mazeCopy = structuredClone(maze); // copy of maze state upon solve

    if (!hasStart || !hasEnd)
    {
        console.log("You must have a start and end square to solve the maze");
        return;
    }
    let queue = new Queue(); // queue of squares

    // find start square
    let x = -1;
    let y = -1;

    let prevX = -1;
    let prevY = -1;
    for (let i = 0; i < rows; i++)
    {
        for (let j = 0; j < cols; j++)
        {
            if (maze[i][j].type == "start")
            {
                x = i;
                y = j;
            }
        }
    } // start square index is found, (x, y) = start
    queue.add(maze[x][y]);
    maze[x][y].visited = true;

    let tableRow = document.createElement("li");
    let empty = document.createElement("li"); // temp calue to add to popped_display
    tableRow.innerHTML = `${x} ${y}`;
    queue_display.appendChild(tableRow);
    popped_display.appendChild(empty);

    function draw()
    {
        if (queue.size == 0) // end condition: nothing to deque
        {
            clearTimeout(interval);
            context.fillStyle = "rgb(255, 103, 15)"; // orange
            fillSquare(x, y);

            drawNum(x, y);
            
            return;
        }


        // get square to use
        let square = queue.remove();

        queue_display.removeChild(queue_display.children[0]);

        popped_display.removeChild(popped_display.children[0]);
        tableRow = document.createElement("li");
        tableRow.innerHTML = `${square.x} ${square.y}`;
        popped_display.appendChild(tableRow);

        // change color and check for end square
        context.fillStyle = "rgb(230, 230, 0)"; // yellow
        if (square.type != "start")
        {
            prevX = x;
            prevY = y;

            x = square.x;
            y = square.y;

            if (square.type == "end")
            {
                isComplete = true;
                clearTimeout(interval);
            }
        }
        // squares are marked as visited when added to prevent adding same square multiple times
        fillSquare(x, y);
        // context.fillRect((BOX_DIM + DIVIDER_HEIGHT) * x + 1, (BOX_DIM + DIVIDER_HEIGHT) * y + 1, BOX_DIM, BOX_DIM);
        // drawNum(x, y);

        // change previous square color from yellow to orange
        if (square.type != "start") // start has no previous square to color in
        {
            if (maze[prevX][prevY].type == "start") // previous square is start, fill it in with a different color
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

        // backtrace if complete and color a correct path green
        if (isComplete) // (x, y) correspond to end
        {
            context.fillStyle = end_color;

            // delay recoloring end to make it flow better
            setTimeout(function()
            {
                fillSquare(x, y);

                context.fillStyle = "rgb(0, 204, 104)"; // green
                
                let square = maze[x][y]; // go back and color path green
                while (square.prevSquare.type != "start")
                {
                    x = square.prevSquare.x;
                    y = square.prevSquare.y;
                    fillSquare(x, y);
                    square = maze[x][y];
                }
                isSolving = false;
            }, SPEED); // end of timeout
        }
        if (!isComplete)
            interval = setTimeout(draw, SPEED);
    }

    interval = draw();
}

function clearMaze()
{
    // reset canvas
    clearTimeout(interval);
    mazeCopy = null;
    context.clearRect(0, 0, width, height);
    initMaze();
    hasStart = false;
    hasEnd = false;
    isSolving = false;
    isComplete = false;

    queue_display.replaceChildren();
    popped_display.replaceChildren();
    
    // reset all squares
    for (let i = 0; i < rows; i++)
    {
        for (let j = 0; j < cols; j++)
        {
            maze[i][j].type = "path";
            maze[i][j].visited = false;
        }
    }

    // set currently placing to wall
    type = "wall";
    setButtonColors(wall, start, end, erase);
    context.fillStyle = "rgb(0, 0, 0)";
    wall.style.backgroundColor = "rgb(0, 160, 0)";
}