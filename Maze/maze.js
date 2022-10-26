const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
const solve = document.getElementById("solve"); // solve => wall are buttons
const clear = document.getElementById("clear");
const start = document.getElementById("start");
const end = document.getElementById("end");
const wall = document.getElementById("wall");
const erase = document.getElementById("erase");
const slider = document.getElementById("slider");
const slider_box = document.getElementById("slider_box");
const reset = document.getElementById("reset");

// make queue
class Node
{
    constructor(val)
    {
        this.val = val; // data type
        this.prev; // both nodes
        this.next;
    }   
}

class Queue
{
    constructor()
    {
        this.head; // both nodes
        this.tail;
        this.size = 0; // integer
    }

    add(val)
    {
        let node = new Node(val);
        if (this.size == 0)
        {
            this.head = node;
            this.tail = node;
            this.size++;
            return;
        }
        node.next = this.tail; // set added node.next to current tail node
        this.tail.prev = node; // set current tail node previous to added node
        this.tail = node; // set new tail node as added node
        this.size++;
    }

    remove()
    {
        let node = this.head;
        if (this.head == this.tail)
        {
            this.size--;
            return node.val;
        }
        this.head = this.head.prev;
        this.size--;

        return node.val;
    }
}

class Square
{
    constructor(x, y)
    {
        this.type = "path"; // path, wall, start, or end
        this.visited = false;
        this.x = x;
        this.y = y;

        this.prevSquare;
    }
}

// canvas maze implementation ==========================================================================================
// functions =================================
const width = canvas.width;
const height = canvas.height;
const BOX_DIM = 30;
const DIVIDER_HEIGHT = 2;

const rows = 20;
const cols = 20;

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

// implementation ================================
let maze = new Array(rows);
for (let i = 0; i < rows; i++)
{
    maze[i] = new Array(cols);
    for (let j = 0; j < cols; j++)
    {
        let square = new Square(i, j);
        maze[i][j] = square;
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

// code starts here ============================================================================================================
initMaze();
// listen for maze coloring
let isSolving = false;
let hasStart = false;
let hasEnd = false;
let type = "wall";
context.fillStyle = "rgb(0, 0, 0)";

start.addEventListener("click", function()
{
    if (isSolving)
        return;
    setButtonColors(start, end, wall, erase);
    type = "start";
    context.fillStyle = "rgb(99, 102, 106)";
});

end.addEventListener("click", function()
{
    if (isSolving)
        return;
    setButtonColors(end, start, wall, erase);
    type = "end";
    context.fillStyle = "rgb(152, 29, 151)";
});

wall.addEventListener("click", function()
{
    if (isSolving)
        return;
    setButtonColors(wall, start, end, erase);
    type = "wall";
    context.fillStyle = "rgb(0, 0, 0)";
});

erase.addEventListener("click", function()
{
    if (isSolving)
        return;
    setButtonColors(erase, start, end, wall);
    type = "path";
    context.fillStyle = "rgb(255, 255, 255)";
});

// fill in desired box on canvas
document.addEventListener("mousedown", function(click)
{
    if (isSolving)
        return;
    // get coords
    let posX = click.pageX;
    let posY = click.pageY;

    let prevX = posX;
    let prevY = posY;
    let boundingRect = canvas.getBoundingClientRect();

    const SHIFTY = boundingRect.top; // based off of buttons above canvas

    if (posX < width && inRange(posY, SHIFTY, height + SHIFTY)) // do nothing if not on canvas
    {
        // check and fill whatever box it is in
        let gridX = -1;
        let gridY = -1;

        // find the square the point is in
        for (let i = 0; i < rows; i++)
        {
            if (inRange(posX, (BOX_DIM + DIVIDER_HEIGHT) * i, (BOX_DIM + DIVIDER_HEIGHT) * (i + 1)))
            {
                gridX = i;
            }
        }

        for (let i = 0; i < cols; i++)
        {
            if (inRange(posY - SHIFTY, (BOX_DIM + DIVIDER_HEIGHT) * i, (BOX_DIM + DIVIDER_HEIGHT) * (i + 1)))
            {
                gridY = i;
            }
        }

        // allows for smooth drawing to be possible
        const drawInterval = setInterval(function()
        {
            // do nothing if the given coords are out of bounds
            if (posX < canvas.width && posY < canvas.height + SHIFTY)
            {
                // fill boxes the "line" passes through
                const STEP_INTERVAL = 15; // check this many times per "line"
                const DELTA_X = (posX - prevX) / STEP_INTERVAL;
                const DELTA_Y = (posY - prevY) / STEP_INTERVAL;

                for (let i = 0; i < STEP_INTERVAL; i++)
                {
                    let x = Math.floor(prevX + i * DELTA_X);
                    let y = Math.floor(prevY + i * DELTA_Y);

                    gridX = -1;
                    gridY = -1;

                    for (let i = 1; i <= rows; i++)
                    {
                        if (inRange(x, (BOX_DIM + DIVIDER_HEIGHT) * (i - 1), (BOX_DIM + DIVIDER_HEIGHT) * i))
                        {
                            gridX = i - 1;
                        }
                    }

                    for (let i = 1; i <= cols; i++)
                    {
                        if (inRange(y - SHIFTY, (BOX_DIM + DIVIDER_HEIGHT) * (i - 1), (BOX_DIM + DIVIDER_HEIGHT) * i))
                        {
                            gridY = i - 1;
                        }
                    }

                    // fill the square
                    let square = maze[gridX][gridY];

                    // do not draw more than one start/end square
                    if (hasStart && type == "start")
                        continue;
                    else if (hasEnd && type == "end")
                        continue;
                    
                    // figure out what type of square it is replacing and adjust appropriately
                    if (square.type == "start") { hasStart = false; } // it is being replaced
                    else if (square.type == "end") { hasEnd = false; } // it is being replaced

                    // change square type
                    if (type == "wall")
                    {
                        changeState(square, "wall");
                        context.fillStyle = "rgb(0, 0, 0)";
                    }

                    else if (type == "path") 
                    { 
                        changeState(square, "path"); 
                        context.fillStyle = "rgb(255, 255, 255)";
                    }

                    else if (type == "start")
                    {
                        changeState(square, "start");
                        context.fillStyle = start_color;
                        hasStart = true;
                    }

                    else if (type == "end") // there can only be one start square
                    {
                        changeState(square, "end");
                        context.fillStyle = end_color;
                        hasEnd = true;
                    }

                    fillSquare(gridX, gridY);
                }
            }   
        }, 15); // end of setInterval: 15ms is the fastest it will go (i think)

        // update mouse position 
        document.onmousemove = function(move)
        {
            // console.log("updated coords");
            prevX = posX;
            prevY = posY;

            posX = move.pageX;
            posY = move.pageY;
        };

        // stop drawing
        document.addEventListener("mouseup", function()
        {
            clearInterval(drawInterval);
        });
    }
}); // end of drawing event listener




// create maze on canvas =====================================================================================================================
// solve maze: after button press
let interval; // declared outside to allow clearMaze button to stop the maze process
let SPEED = slider.value; // ms per update
let mazeCopy; // will be used to save maze state
let isComplete = false;
const MAX_SPEED = parseInt(slider.max);
const MIN_SPEED = parseInt(slider.min);
const start_color = "rgb(99, 102, 106)";
const end_color = "rgb(152, 29, 151)";

slider.addEventListener("input", function()
{
    SPEED = slider.value;
    slider_box.value = slider.value;
});

slider_box.addEventListener("change", function()
{
    let value = parseInt(slider_box.value);
    if (value > MAX_SPEED)
    {
        slider_box.value = MAX_SPEED;
    }

    else if (value < MIN_SPEED)
    {
        slider_box.value = MIN_SPEED;
    }
        
    else if (value % slider.step != 0) // makes it a multiple of 5
    {
        slider_box.value = slider.step * Math.round(value / slider.step);
    }

    SPEED = parseInt(slider_box.value);
    slider.value = SPEED;
});

reset.addEventListener("click", function()
{
    resetMaze();
});

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
    if (isSolving || isComplete)
    {
        resetMaze();
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

solve.addEventListener("click", function(press)
{
    solveMaze();
});

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

// listen for clear maze
clear.addEventListener("click", function(press)
{
    clearMaze();
});