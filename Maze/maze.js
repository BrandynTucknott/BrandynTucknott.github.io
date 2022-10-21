const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
const solve = document.getElementById("solve"); // solve => wall are buttons
const clear = document.getElementById("clear");
const start = document.getElementById("start");
const end = document.getElementById("end");
const wall = document.getElementById("wall");
const current = document.getElementById("current");

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

function initMaze() // fills dividers
{
    context.fillStyle = "rgb(128, 128, 128)";
    const BOX_DIM = 100;
    const DIVIDER_HEIGHT = 5;

    for(let i = 0; i < 4; i++) // iteration loop
    {
        context.fillRect(0, BOX_DIM * (i + 1) + DIVIDER_HEIGHT * i + 1, width, DIVIDER_HEIGHT);
        context.fillRect(BOX_DIM * (i + 1) + DIVIDER_HEIGHT * i + 1, 0, DIVIDER_HEIGHT, height);
    }
}

// implementation ================================
let maze = new Array(5);
for (let i = 0; i < 5; i++)
{
    maze[i] = new Array(5);
    for (let j = 0; j < 5; j++)
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

// fills out maze and draws given square to canvas
function fillSquare(gridX, gridY)
{
    let square = maze[gridX][gridY];
    // figure out what type of square it is replacing and adjust appropriately
    if (square.type == "start")
    {
        hasStart = false; // it is being replaced
    }
    if (square.type == "end")
    {
        hasEnd = false; // it is being replaced
    }

    if (type == "wall") //
    {
        changeState(square, "wall");
        context.fillRect(105 * gridX, 105 * gridY, 101, 101);
    }

    else if (type == "start" && !hasStart) // there can only be one start square
    {
        changeState(square, "start");
        context.fillRect(105 * gridX, 105 * gridY, 101, 101);
        hasStart = true;
    }

    else if (type == "end" && !hasEnd) // there can only be one start square
    {
        changeState(square, "end");
        context.fillRect(105 * gridX, 105 * gridY, 101, 101);
        hasEnd = true;
    }
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
        }
    }

    if (gridX < 4) // there is a square to the right
    {
        if (maze[gridX + 1][gridY].type != "wall" && maze[gridX + 1][gridY].visited == false) // not complete; add if not a wall and unvisited
        {
            queue.add(maze[gridX + 1][gridY]);
            maze[gridX + 1][gridY].prevSquare = maze[gridX][gridY];
            maze[gridX + 1][gridY].visited = true;
        }
    }

    if (gridY < 4) // there is a square below
    {
        if (maze[gridX][gridY + 1].type != "wall" && maze[gridX][gridY + 1].visited == false) // not complete; add if not a wall and unvisited
        {
            queue.add(maze[gridX][gridY + 1]);
            maze[gridX][gridY + 1].prevSquare = maze[gridX][gridY];
            maze[gridX][gridY + 1].visited = true;
        }
    }

    if (gridX > 0) // there is a square to the left
    {
        if (maze[gridX - 1][gridY].type != "wall" && maze[gridX - 1][gridY].visited == false) // not complete; add if not a wall and unvisited
        {
            queue.add(maze[gridX - 1][gridY]);
            maze[gridX - 1][gridY].prevSquare = maze[gridX][gridY];
            maze[gridX - 1][gridY].visited = true;
        }
    }
}

// code starts here ============================================================================================================
initMaze();
// listen for maze coloring
let isComplete = false;
let isSolvingMaze = false; // prevent button spamming
let hasStart = false;
let hasEnd = false;
let type = "wall";
context.fillStyle = "rgb(0, 0, 0)";

start.addEventListener("click", function(press)
{
    current.innerHTML = "Start";
    type = "start";
    context.fillStyle = "rgb(99, 102, 106)";
});

end.addEventListener("click", function(press)
{
    current.innerHTML = "End";
    type = "end";
    context.fillStyle = "rgb(152, 29, 151)";
});

wall.addEventListener("click", function(press)
{
    current.innerHTML = "Wall";
    type = "wall";
    context.fillStyle = "rgb(0, 0, 0)";
});

// fill in boxes
document.addEventListener("mousedown", function(click)
{
    if (isSolvingMaze)
        console.log("you cannot fill squares while solving the maze");
    else
    {
        // get coords
        let posX = click.pageX;
        let posY = click.pageY;

        const SHIFTY = 222; // based off of buttons above canvas

        if (posX < width && (posY > SHIFTY && posY < height + SHIFTY)) // do nothing if not on canvas
        {
            // check and fill whatever box it is in
            let gridX = -1;
            let gridY = -1;

            // find the square the point is in
            for (let i = 0; i < 5; i++)
            {
                if (inRange(posX, 105 * i, 105 * (i + 1)))
                {
                    gridX = i;
                }

                if (inRange(posY - SHIFTY, 105 * i, 105 * (i + 1)))
                {
                    gridY = i;
                }
            }

            // fill the square
            fillSquare(gridX, gridY);
        }
    }
});




// create maze on canvas =====================================================================================================================
// solve maze: after button press
let interval; // declared outside to allow clearMaze button to stop the maze process
const SPEED = 1000; // ms per update
solve.addEventListener("click", function(press)
{
    if (isSolvingMaze)
        console.log("you must wait for the maze to complete");
    else // is not solving maze: solve maze
    {
        if (!hasStart || !hasEnd)
            console.log("You must have a start and end square to solve the maze");
        else if (isComplete)
            console.log("\nMaze Is Complete");
        else // complete the maze if not complete
        {
            isSolvingMaze = true;
            let queue = new Queue(); // queue of squares

            // find start square
            let x = -1;
            let y = -1;

            let prevX = -1;
            let prevY = -1;
            for (let i = 0; i < 5; i++)
            {
                for (let j = 0; j < 5; j++)
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

            interval = setInterval(function()
            {
                if (queue.size == 0) // end condition: nothing to deque
                {
                    clearInterval(interval);
                }



                // get square to use
                let square = queue.remove();
                const start_color = "rgb(99, 102, 106)";
                const end_color = "rgb(152, 29, 151)";

                // edge cases 
                if (square.type == "start") // change color differently
                {
                    context.fillStyle = "rgb(230, 230, 0)"; // yellow
                } // no previous square if the current square is start square
                else if (square.type == "end") // change color differently
                {
                    isComplete = true;
                    context.fillStyle = "rgb(230, 230, 0)"; // yellow
                    prevX = x;
                    prevY = y;

                    x = square.x;
                    y = square.y; // get coords

                    clearInterval(interval);
                }
                else // fill yellow to show it is being considered: normal case
                {
                    context.fillStyle = "rgb(230, 230, 0)"; // yellow
                    prevX = x;
                    prevY = y;

                    x = square.x;
                    y = square.y; // get coords
                }
                // squares are marked as visited when added to prevent adding same square multiple times
                
                context.fillRect(105 * x, 105 * y, 101, 101);

                // change previous square color from yellow to orange
                if (square.type != "start") // start has no previous square to color in
                {
                    if (maze[prevX][prevY].type == "start") // previous square is start, fill it in with a different color
                    {
                        context.fillStyle = start_color;
                        context.fillRect(105 * prevX, 105 * prevY, 101, 101);
                    }

                    else // previous square was a normal square
                    {
                        context.fillStyle = "rgb(255, 103, 15)"; // orange
                        context.fillRect(105 * prevX, 105 * prevY, 101, 101);
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
                        context.fillRect(105 * x, 105 * y, 101, 101); // fill in end appropriate color
                        context.fillStyle = "rgb(0, 204, 104)"; // green
                        
                        let square = maze[x][y]; // go back and color path green
                        while (square.prevSquare.type != "start")
                        {
                            x = square.prevSquare.x;
                            y = square.prevSquare.y;
                            context.fillRect(105 * x, 105 * y, 101, 101);
                            square = maze[x][y];
                        }
                        isSolvingMaze = false;
                        console.log("\nFinished Maze");
                    }, SPEED); // end of timeout
                }
            }, SPEED); // end of interval
        }
    }
});

// listen for clear maze
clear.addEventListener("click", function(press)
{
    // reset canvas
    clearInterval(interval);
    context.clearRect(0, 0, width, height);
    initMaze();
    hasStart = false;
    hasEnd = false;
    isComplete = false;
    isSolvingMaze = false;
    
    // reset all squares
    for (let i = 0; i < 5; i++)
    {
        for (let j = 0; j < 5; j++)
        {
            maze[i][j].type = "path";
            maze[i][j].visited = false;
        }
    }

    // set currently placing to wall
    current.innerHTML = "Wall";
    type = "wall";
    context.fillStyle = "rgb(0, 0, 0)";
});