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

const width = canvas.width;
const height = canvas.height;
const BOX_DIM = 30; // square length: in pixels
const DIVIDER_HEIGHT = 2; // divider thickness: in pixels

const rows = 20; // number of rows
const cols = 20; // number of cols

const start_color = "rgb(99, 102, 106)";
const end_color = "rgb(152, 29, 151)";

let interval; // declared outside to allow clearMaze button to stop the maze process
let SPEED = slider.value; // ms per update
let mazeCopy; // will be used to save maze state
let isComplete = false; // maze is complete

const MAX_SPEED = parseInt(slider.max);
const MIN_SPEED = parseInt(slider.min);

let isSolving = false;
let hasStart = false;
let hasEnd = false;
let type = "wall";
context.fillStyle = "rgb(0, 0, 0)";

initMaze();

// initialize squares
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


// event listeners that do all of the work
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

solve.addEventListener("click", function(press)
{
    solveMaze();
});

// listen for clear maze
clear.addEventListener("click", function(press)
{
    clearMaze();
});

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