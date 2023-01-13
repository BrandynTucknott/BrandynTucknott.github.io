// const { range } = require("express/lib/request");

function initializeBoard()
{
    canvas.width = width;
    canvas.height = height;

    initializeSquares();
    for (let i = 0; i < board_size; i++)
    {
        board[i] = [];
    }
    // fill the board array with all the squares
    for (let r = 0; r < board_size; r++)
    {
        for (let c = 0; c < board_size; c++)
        {
            board[r][c] = new Square(square_size * r, square_size * c);
        }
    }
}

function initializeSquares()
{
    for (let y = 0; y < height; y += square_size)
    {
        for (let x = 0; x < width; x += square_size)
        {
            drawHiddenSquare(y, x);
        }
    }
}

function drawHiddenSquare(y, x)
{
    // make top part of square
    context.fillStyle = top_square_color;
    context.beginPath();
    context.moveTo(x, y);
    context.lineTo(x + square_size, y);
    context.lineTo(x, y + square_size);
    context.closePath();
    context.fill();

    // make bottom part of square
    context.fillStyle = bottom_square_color;
    context.beginPath();
    context.moveTo(x + square_size, y + square_size);
    context.lineTo(x, y + square_size);
    context.lineTo(x + square_size, y);
    context.closePath();
    context.fill();
    
    // make center of square
    context.fillStyle = background_color;
    let small_square_size = Math.floor(0.8 * square_size);
    let small_square_starting_offset = Math.floor(0.1 * square_size);
    context.fillRect(small_square_starting_offset + x, small_square_starting_offset + y, small_square_size, small_square_size);
}

// given y, x coords on canvas, returns the square they sit in
function getSquare(y, x)
{
    let r = Math.floor(y / square_size);
    let c = Math.floor(x / square_size);

    return board[r][c];
}

function drawClickedSquare(y, x)
{
    // context.fillStyle = 'black';
    // context.fillRect(x, y, square_size, square_size);
    context.fillStyle = background_color;
    context.fillRect(x + 1, y + 1, square_size - 2, square_size - 2);
}

function drawFlag(y, x)
{
    // draw base + pole
    context.fillStyle = "black";
    let bottom_rect_x_offset = Math.floor(0.25 * square_size); // 0.245 is magic number stuff
    let bottom_rect_y_offset = Math.floor(0.8 * square_size);
    let bottom_rect_length = Math.floor(0.5 * square_size); // appx. half way

    // let top_rect_x_offset = Math.floor(0.4 * square_size);
    // let top_rect_y_offset = Math.floor(0.55 * square_size);
    // let top_rect_length = Math.floor(0.4 * square_size);
    let rect_height = Math.floor(0.1 * square_size); // appx. 10% down 

    context.fillRect(bottom_rect_x_offset + x, bottom_rect_y_offset + y, bottom_rect_length, rect_height);
    // context.fillRect(top_rect_x_offset + x, top_rect_y_offset + y, top_rect_length, rect_height);

    let pole_x_offset = Math.floor(0.48 * square_size);
    let pole_y_offset = Math.floor(0.4 * square_size);
    let pole_length = Math.floor(0.1 * square_size);
    let pole_height = Math.floor(0.5 * square_size);
    context.fillRect(pole_x_offset + x, pole_y_offset + y, pole_length, pole_height);
    // creating and drawing the flag
    // get the flag tip
    context.fillStyle = 'red';
    context.beginPath();
    let flag_x_offset = Math.floor(0.2 * square_size);
    let flag_y_offset = Math.floor(0.4 * square_size);
    context.moveTo(x + flag_x_offset, y + flag_y_offset);

    // get the first point
    let point1_x_offset = Math.floor(0.55 * square_size);
    let point1_y_offset = Math.floor(0.2 * square_size);
    context.lineTo(point1_x_offset + x, point1_y_offset + y);

    // get the second point
    let point2_x_offset = Math.floor(0.55 * square_size);
    let point2_y_offset = Math.floor(0.6 * square_size);
    context.lineTo(point2_x_offset + x, point2_y_offset + y);

    // draw the flag
    context.closePath();
    context.fill();
}

function shouldBePushed(square)
{
    if (square.isRevealed)
        return false;

    if (square.isMined)
        return false;

    if (square.isFlagged)
        return false;

    return true;
}

function chainReveal(targetSquare)
{
    let stack = new Stack();
    if (targetSquare.isRevealed) // do nothing if the square has already been revealed
        return;
    stack.push(targetSquare);

    while(!stack.isEmpty())
    {
        let node = stack.pop(); // get the square
        let square = node.val;
        drawClickedSquare(square.y, square.x); // draw the square

        // push the viable neighbors
        // if square has any adjacent mines: do not push neighbors + display how many adjacent mines
        if (square.adjacentMines > 0) // display the num of adjacent mines if any
        {
            let x_offset = Math.floor(.4 * square_size); // .4
            let y_offset = Math.floor(.64 * square_size); // .65

            // gets the color to fill the number
            switch (square.adjacentMines)
            {
                case 1:
                    context.fillStyle = oneAdjacentMine;
                    break;
                case 2:
                    context.fillStyle = twoAdjacentMine;
                    break;
                case 3:
                    context.fillStyle = threeAdjacentMine;
                    break;
                case 4:
                    context.fillStyle = fourAdjacentMine;
                    break;
                case 5:
                    context.fillStyle = fiveAdjacentMine;
                    break;
                case 6:
                    context.fillStyle = sixAdjacentMine;
                    break;
                case 7:
                    context.fillStyle = sevenAdjacentMine;
                    break;
                case 8:
                    context.fillStyle = eightAdjacentMine;
                    break;
                default:
                    console.log('This should not have gotten here');
            }
            // puts the number on the canvas
            context.fillText(`${square.adjacentMines}`, square.x + x_offset, square.y + y_offset, square_size);
            continue; // do not reveal more if the current square is a number
        }
        // add adjacent squares not flagged, mined, or have adjacent mines
        let r = Math.floor(square.y / square_size);
        let c = Math.floor(square.x / square_size);

        // pushes to stack
        if ((r > 0 && c > 0) && shouldBePushed(board[r - 1][c - 1])) // top left
        {
            stack.push(board[r - 1][c - 1]);
            board[r - 1][c - 1].isRevealed = true;
        }
        if (r > 0 && shouldBePushed(board[r - 1][c])) // top
        {
            stack.push(board[r - 1][c]);
            board[r - 1][c].isRevealed = true;
        }
        if ((r > 0 && c < board_size - 1) && shouldBePushed(board[r - 1][c + 1])) // top right
        {
            stack.push(board[r - 1][c + 1]);
            board[r - 1][c + 1].isRevealed = true;
        }
        if (c > 0 && shouldBePushed(board[r][c - 1])) // left
        {
            stack.push(board[r][c - 1]);
            board[r][c - 1].isRevealed = true;
        }
        if (c < board_size - 1 && shouldBePushed(board[r][c + 1])) // right
        {
            stack.push(board[r][c + 1]);
            board[r][c + 1].isRevealed = true;
        }
        if ((r < board_size - 1 && c > 0) && shouldBePushed(board[r + 1][c - 1])) // bottom left
        {
            stack.push(board[r + 1][c - 1]);
            board[r + 1][c - 1].isRevealed = true;
        }   
        if (r < board_size - 1 && shouldBePushed(board[r + 1][c])) // bottom
        {
            stack.push(board[r + 1][c]);
            board[r + 1][c].isRevealed = true;
        }
        if ((r < board_size - 1 && c < board_size - 1) && shouldBePushed(board[r + 1][c + 1])) // bottom right
        {
            stack.push(board[r + 1][c + 1]);
            board[r + 1][c + 1].isRevealed = true;
        }
    }
}
let minedSquares = [];
function generateMines()
{
    let minesGenerated = 0;
    while (minesGenerated < numMines)
    {
        let rand_r = Math.floor(Math.random() * board_size);
        let rand_c = Math.floor(Math.random() * board_size);

        if (board[rand_r][rand_c].isMined) // if we try to place a mine on a square that already has a mine, generate another mine
            continue;

        board[rand_r][rand_c].isMined = true;
        minedSquares[minesGenerated] = board[rand_r][rand_c];
        minesGenerated++;
    }
}

function assignNumbers()
{
    for (let n = 0; n < numMines; n++)
    {
        let r = minedSquares[n].y / square_size;
        let c = minedSquares[n].x / square_size;

        if (r > 0 && c > 0) // top left
            board[r - 1][c - 1].adjacentMines++;
        if (r > 0) // top
            board[r - 1][c].adjacentMines++;
        if (r > 0 && c < board_size - 1) // top right
            board[r - 1][c + 1].adjacentMines++
        if (c > 0) // left
            board[r][c - 1].adjacentMines++;
        if (c < board_size - 1) // right
            board[r][c + 1].adjacentMines++;
        if (r < board_size - 1 && c > 0) // bottom left
            board[r + 1][c - 1].adjacentMines++;
        if (r < board_size - 1) // bottom
            board[r + 1][c].adjacentMines++;
        if (r < board_size - 1 && c < board_size - 1) // bottom right
            board[r + 1][c + 1].adjacentMines++;
    }
}

function checkForWin()
{
    for (let r = 0; r < board_size; r++)
    {
        for (let c = 0; c < board_size; c++)
        {
            if (!board[r][c].isRevealed && !board[r][c].isMined)
                return false;
            if (board[r][c].isMined && !board[r][c].isFlagged)
                return false;
        }
    }
    return true;
}

// restarts the game
function restartGame()
{
    initializeBoard();
    generateMines();
    assignNumbers();
    gameInProgress = true;
    message_box.innerHTML = '';
    flag_count.innerHTML = `0 / ${numMines}`;
    placedFlags = 0;
    endTimer();
    startTimer();
}

function updateNumMines(newNumMines)
{
    prevNumMines = numMines;
    numMines = newNumMines;
    slider.value = numMines;
    range_box.value = numMines;

    restartGame();
}

function updateTimer()
{
    if (ones_seconds == 10)
    {
        ones_seconds = 0;
        tens_seconds++;
    }

    if (tens_seconds == 6)
    {
        tens_seconds = 0;
        minutes++;
    }

    clock.innerHTML = `${minutes} : ${tens_seconds}${ones_seconds}`;
}

function startTimer()
{
    minutes = 0;
    ones_seconds = 0;
    tens_seconds = 0;

    timer = setInterval(() =>
    {
        ones_seconds++;
        updateTimer();
    }, dt);

    updateTimer();
}

function endTimer()
{
    clearInterval(timer);
}