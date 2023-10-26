// hides the context menu
document.addEventListener("contextmenu", (e) => 
{
    // force right click
    e.preventDefault();

    const clickedX = e.offsetX; // get relative coords in canvas
    const clickedY = e.offsetY;

    let clicked_square = getSquare(clickedY, clickedX); // get square which corresponds to those coords
    let r = clicked_square.y / square_size; // get the position in the board array in which the square sits
    let c = clicked_square.x / square_size;

    if (gameInProgress && (!board[r][c].isRevealed && !board[r][c].isFlagged))
    {
        if (placedFlags >= numMines)
        {
            message_box.innerHTML = 'you cannot place more flags than there are mines';
            return;
        }
        drawFlag(clicked_square.y, clicked_square.x);
        board[r][c].isFlagged = true;
        placedFlags++;
        flag_count.innerHTML = `${placedFlags} / ${numMines}`;
        if (checkForWin())
        {
            message_box.innerHTML = 'all tiles revealed and all mines defused: player wins';
            gameInProgress = false;
            endTimer();
        }
    }
});

// reveals/flags squares the player chooses
canvas.addEventListener("mousedown", (e) => 
{
    const clickedX = e.offsetX; // get relative coords in canvas
    const clickedY = e.offsetY;

    let clicked_square = getSquare(clickedY, clickedX); // get square which corresponds to those coords
    let r = clicked_square.y / square_size; // get the position in the board array in which the square sits
    let c = clicked_square.x / square_size;

    // left click
    if (e.button == 0 && gameInProgress)
    {
        if (!gameHasStarted)
        {
            gameHasStarted = true;
            startTimer();
        }
        // left click a flag: remove the flag
        if (board[r][c].isFlagged)
        {
            drawHiddenSquare(clicked_square.y, clicked_square.x);
            board[r][c].isFlagged = false;
            placedFlags--;
            flag_count.innerHTML = `${placedFlags} / ${numMines}`;
            return; // exit this execution of the listener
        }

        if (board[r][c].isMined) // lost game
        {
            message_box.innerHTML = 'mine triggered: game lost';
            drawClickedSquare(r * square_size, c * square_size);
            let x_offset = Math.floor(.4 * square_size); // .4
            let y_offset = Math.floor(.64 * square_size); // .65

            context.fillStyle = 'black';
            context.fillText(`M`, board[r][c].x + x_offset, board[r][c].y + y_offset, square_size);
            gameInProgress = false;
            endTimer();
            return;
        }
        // else it is not flagged: reveal it
        chainReveal(clicked_square);
        board[r][c].isRevealed = true;
        if (checkForWin())
        {
            message_box.innerHTML = 'all tiles revealed and all mines defused: player wins';
            gameInProgress = false;
            endTimer();
        }
    }
    // right click: only place a flag if it is an unrevealed square
    else if ((e.button == 2 && gameInProgress) && (!board[r][c].isRevealed && !board[r][c].isFlagged))
    {
        if (placedFlags >= numMines)
        {
            message_box.innerHTML = 'you cannot place more flags than there are mines';
            return;
        }
        drawFlag(clicked_square.y, clicked_square.x);
        board[r][c].isFlagged = true;
        placedFlags++;
        flag_count.innerHTML = `${placedFlags} / ${numMines}`;
        if (checkForWin())
        {
            message_box.innerHTML = 'all tiles revealed and all mines defused: player wins';
            gameInProgress = false;
            endTimer();
        }
    }
});

// restarts the game if the player chooses to do so
restart.addEventListener('click', function()
{
    restartGame();
});

range_box.addEventListener('change', () => 
{
    let num = parseInt(range_box.value);
    if (isNaN(num) || !(num >= slider.min && num <= slider.max))
    {
        updateNumMines(numMines);
        return;
    }
    updateNumMines(num);
});

slider.addEventListener('input', () => 
{
    let num = parseInt(slider.value);
    updateNumMines(num);
});

viewmode.addEventListener('click', () =>
{
    flipViewmode();
});