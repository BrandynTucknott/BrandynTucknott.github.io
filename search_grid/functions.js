function initMaze() // fills dividers
{
    context.fillStyle = "rgb(128, 128, 128)"; // gray

    for(let i = 0; i < rows; i++) // iteration loop
    { // fill horizontal dividers
        context.fillRect(0, BOX_DIM * (i + 1) + DIVIDER_HEIGHT * i + 1, width, DIVIDER_HEIGHT);
    }

    for (let i = 0; i < cols; i++)
    { // fill vertical dividers
        context.fillRect(BOX_DIM * (i + 1) + DIVIDER_HEIGHT * i + 1, 0, DIVIDER_HEIGHT, height);
    }
}

function initSquares()
{
    let maze = new Array(rows);
    for (let i = 0; i < rows; i++)
    {
        maze[i] = new Array(cols);
        for (let j = 0; j < cols; j++)
        {
            let square = new Square(j, i);
            maze[i][j] = square;
        }
    }

    return maze;
}

function initCanvas(canvas)
{
    let width = window.innerWidth;
    let height = window.innerHeight;

    // top menu bar appx 1/7 of screen
    canvas.style.top = 1/7 * height;
    canvas.width = width;
    canvas.height = 6/7 * height;
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

// fills out maze and draws given square to canvas
function fillSquare(gridX, gridY)
{
    // (row, col)
    // draw the square
    if (gridX == 0 && gridY == 0) // top corner
        context.fillRect((BOX_DIM + DIVIDER_HEIGHT) * gridX, (BOX_DIM + DIVIDER_HEIGHT) * gridY, BOX_DIM + 1, BOX_DIM + 1);
    else if (gridX == 0) // left side of screen
        context.fillRect((BOX_DIM + DIVIDER_HEIGHT) * gridX, (BOX_DIM + DIVIDER_HEIGHT) * gridY + 1, BOX_DIM + 1, BOX_DIM);
    else if (gridY == 0) // top of screen
        context.fillRect((BOX_DIM + DIVIDER_HEIGHT) * gridX + 1, (BOX_DIM + DIVIDER_HEIGHT) * gridY, BOX_DIM, BOX_DIM + 1);
    else
        context.fillRect((BOX_DIM + DIVIDER_HEIGHT) * gridX + 1, (BOX_DIM + DIVIDER_HEIGHT) * gridY + 1, BOX_DIM, BOX_DIM);
}

// pushes neighbors of a square into an ADT
function pushNeighbors(ADT, gridX, gridY)
{
    if (gridY > 0) // there is a square above
    {
        if (maze[gridY - 1][gridX].type != "wall" && maze[gridY - 1][gridX].visited == false) // not complete; add if not a wall and unvisited
        {
            ADT.add(maze[gridY - 1][gridX]);
            maze[gridY - 1][gridX].prevSquare = maze[gridY][gridX];
            maze[gridY - 1][gridX].visited = true;
        }
    }

    if (gridX < cols - 1) // there is a square to the right
    {
        if (maze[gridY][gridX + 1].type != "wall" && maze[gridY][gridX + 1].visited == false) // not complete; add if not a wall and unvisited
        {
            ADT.add(maze[gridY][gridX + 1]);
            maze[gridY][gridX + 1].prevSquare = maze[gridY][gridX];
            maze[gridY][gridX + 1].visited = true;
        }
    }

    if (gridY < rows - 1) // there is a square below
    {
        if (maze[gridY + 1][gridX].type != "wall" && maze[gridY + 1][gridX].visited == false) // not complete; add if not a wall and unvisited
        {
            ADT.add(maze[gridY + 1][gridX]);
            maze[gridY + 1][gridX].prevSquare = maze[gridY][gridX];
            maze[gridY + 1][gridX].visited = true;
        }
    }

    if (gridX > 0) // there is a square to the left
    {
        if (maze[gridY][gridX - 1].type != "wall" && maze[gridY][gridX - 1].visited == false) // not complete; add if not a wall and unvisited
        {
            ADT.add(maze[gridY][gridX - 1]);
            maze[gridY][gridX - 1].prevSquare = maze[gridY][gridX];
            maze[gridY][gridX - 1].visited = true;
        }
    }
}

// returns a random adjacent square
function getRandomAdjacentSquare(x, y)
{
    let possibleMoves = [];

    if (y > 0 && maze[y - 1][x].type != "wall")
        possibleMoves[possibleMoves.length] = "up";
    if (x < cols - 1 && maze[y][x + 1].type != "wall")
        possibleMoves[possibleMoves.length] = "right";
    if (y < rows - 1 && maze[y + 1][x].type != "wall")
        possibleMoves[possibleMoves.length] = "down";
    if (x > 0 && maze[y][x - 1].type != "wall")
        possibleMoves[possibleMoves.length] = "left";

    if (possibleMoves.length == 0)
        return null;
    
    let choice = possibleMoves[Math.floor(Math.random() * possibleMoves.length)]; // random element in array of possibleMoves

    if (choice == "up")
    {
        return maze[y - 1][x];
    }

    else if (choice == "right")
    {
        return maze[y][x + 1];
    }

    else if (choice == "down")
    {
        return maze[y + 1][x];
    }

    else // choice == left
    {
        return maze[y][x - 1];
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
    clearMaze();
    maze = structuredClone(mazeCopy);   
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
                fillSquare(j, i);
            }

            else if (square.type == "start") // there can only be one start square
            {
                context.fillStyle = start_color;
                fillSquare(j, i);
            }

            else if (square.type == "end") // there can only be one start square
            {
                context.fillStyle = end_color;
                fillSquare(j, i);
            }
        }
    }
    context.fillStyle = originalColor;
}

function solveMaze()
{
    if (!hasStart || !hasEnd)
    {
        console.log("You must have a start and end square to solve the maze");
        return;
    }
    
    if (isSolving || isComplete)
    {
        resetMaze();
        solveMaze();
        return;
    }
    isSolving = true;
    mazeCopy = structuredClone(maze); // copy of maze state upon solve

    let x = -1;
    let y = -1;

    // find start square
    let prevX = -1;
    let prevY = -1;
    for (let i = 0; i < rows; i++)
    {
        for (let j = 0; j < cols; j++)
        {
            if (maze[i][j].type == "start")
            {
                x = j;
                y = i;
            }
        }
    } // start square index is found, (x, y) = start

    // ============= end of general solve ====================
    let solveVar; // never needs to be used, only initialized since constructor of search algorithm will solve maze
    if (algorithm == "bfs")
        solveVar = new BFS(maze, x, y, prevX, prevY);
    else if (algorithm == "dfs")
        solveVar = new DFS(maze, x, y, prevX, prevY);
    else if (algorithm == "drunkWalk")
        solveVar = new DrunkWalk(maze, x, y, prevX, prevY);
} // end of solve maze function =======================================================

function clearMaze()
{
    // reset canvas
    clearTimeout(interval);
    context.clearRect(0, 0, width, height);
    initMaze();
    hasStart = false;
    hasEnd = false;
    isSolving = false;
    isComplete = false;
    
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