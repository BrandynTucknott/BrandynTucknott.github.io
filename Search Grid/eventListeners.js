// disable context menu
document.addEventListener("contextmenu", e => 
{
    e.preventDefault();
    return false;
});

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
    if (menuOpen)
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
            if (posX < width && posY < height + SHIFTY)
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
                    
                    for (let i = 1; i <= cols; i++)
                    {
                        if (inRange(x, (BOX_DIM + DIVIDER_HEIGHT) * (i - 1), (BOX_DIM + DIVIDER_HEIGHT) * i))
                        {
                            gridX = i - 1;
                            break;
                        }
                    }

                    for (let i = 1; i <= rows; i++)
                    {
                        if (inRange(y - SHIFTY, (BOX_DIM + DIVIDER_HEIGHT) * (i - 1), (BOX_DIM + DIVIDER_HEIGHT) * i))
                        {
                            gridY = i - 1;
                            break;
                        }
                    }
                    // row = gridY, col = gridX, maze[row][col]

                    // fill the square
                    let square = maze[gridY][gridX];

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

dropdown_button.addEventListener("click", function() 
{
    // display algorithms
    dropdown_content.style.display = "flex";
    dropdown_content.style.flexFlow = "column";
    menuOpen = true;

    bfs.addEventListener("click", function()
    {
        algorithm = "bfs";
        dropdown_button.innerHTML = "BFS";
        dropdown_content.style.display = "none";
        menuOpen = false;
    });

    dfs.addEventListener("click", function()
    {
        algorithm = "dfs";
        dropdown_button.innerHTML = "DFS";
        dropdown_content.style.display = "none";
        menuOpen = false;
    });

    drunkWalk.addEventListener("click", function()
    {
        algorithm = "drunkWalk";
        dropdown_button.innerHTML = "Drunkard's Walk";
        dropdown_content.style.display = "none";
        menuOpen = false;
    });

    // close menu after another left click
    cancel.addEventListener("click", function() 
    {
        dropdown_content.style.display = "none";
        menuOpen = false;
    });
});