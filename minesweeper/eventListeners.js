// hides the context menu
document.addEventListener("contextmenu", (e) => e.preventDefault());

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
        // left click a flag: remove the flag
        if (board[r][c].isFlagged)
        {
            drawHiddenSquare(clicked_square.y, clicked_square.x);
            board[r][c].isFlagged = false;
            return; // exit this execution of the listener
        }

        if (board[r][c].isMined) // lost game
        {
            console.log('mine triggered: game lost');
            drawClickedSquare(r * square_size, c * square_size);
            let x_offset = Math.floor(.4 * square_size); // .4
            let y_offset = Math.floor(.64 * square_size); // .65

            context.fillStyle = 'black';
            context.fillText(`M`, board[r][c].x + x_offset, board[r][c].y + y_offset, square_size);
            gameInProgress = false;
            return;
        }
        // else it is not flagged: reveal it
        chainReveal(clicked_square);
        board[r][c].isRevealed = true;
        if (checkForWin())
        {
            console.log('all tiles revealed and all mines defused: player wins');
            gameInProgress = false;
        }
    }
    // right click: only place a flag if it is an unrevealed square
    else if ((e.button == 2 && gameInProgress) && (!board[r][c].isRevealed && !board[r][c].isFlagged))
    {
        if (placedFlags >= numMines)
        {
            console.log('you cannot place more flags than there are mines');
            return;
        }
        drawFlag(clicked_square.y, clicked_square.x);
        board[r][c].isFlagged = true;
        placedFlags++;
        if (checkForWin())
        {
            console.log('all tiles revealed and all mines defused: player wins');
            gameInProgress = false;
        }
    }
});

// restarts the game if the player chooses to do so
restart.addEventListener('click', function()
{
    // clear all info functino goes here
    initializeBoard();
    generateMines();
    assignNumbers();
    gameInProgress = true;
});