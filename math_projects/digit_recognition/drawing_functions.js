// is num in the range [lower, upper]
function inRange(num, lower, upper)
{
    return (num >= lower && num <= upper);
}

function findGridX(posX)
{
    for (let i = 1; i <= 28; i++)
        if (inRange(posX, box_dim * (i - 1), box_dim * i - 1))
            return i - 1;
    return -1;
}

function findGridY(posY)
{
    for (let i = 1; i <= 28; i++)
        if (inRange(posY, box_dim * (i - 1), box_dim * i - 1))
            return i - 1;
    return -1;
}

// resets the canvas page and grid array
function clearGrid()
{
    context.clearRect(0, 0, width, height);
    grid = Array.from({length: 28}, () => Array.from({length: 28}, () => new Square()));
}

// a helper function for fill3x3(...). Assumes Square currently holds the RGB value for which it will be colored
function fillSquare(gridX, gridY)
{
    if ((gridX < 0 || gridX > 27) || (gridY < 0 || gridY > 27))
        return; // square is out of bounds
    
    const square = grid[gridY][gridX];
    const fillColor = `rgb(${square.rgbNum}, ${square.rgbNum}, ${square.rgbNum})`
    context.fillStyle = fillColor;

    context.fillRect(box_dim * gridX, box_dim * gridY, box_dim, box_dim);
}

// generates a grayscale random color depending on the input speed
function generateAndSetColor(gridX, gridY, speed)
{
    if ((gridX < 0 || gridX > 27) || (gridY < 0 || gridY > 27))
        return; // square is out of bounds
    
    const square = grid[gridY][gridX];
    
    const n = 255 - Math.floor(Math.random() * (255 / 4 * (1 - Math.exp(-speed)) + 1) + 255 * Math.exp(-speed) * Math.atan(speed) * 2 / Math.PI);
    
    square.rgbNum = n;
}

// colors all possible neighbors and targeted square. Includes diagonals
function fill3x3(gridX, gridY, speed)
{
    if (!hasChangedBoard)
        hasChangedBoard = true;
    // only fill squares if the cursor has moved to a new square
    const square = grid[gridY][gridX];
    if (previousSquare == square)
    {
       return;
    }
    
    previousSquare = square;
    // goes through every square
    for (let i = -1; i < 2; i++)
        for (let j = -1; j < 2; j++)
        {
            // colors will set differently depending on the speed
            generateAndSetColor(gridX + i, gridY + j, speed);
            fillSquare(gridX + i, gridY + j);
        }
}

// reads user grid and outputs the number believed to be written
function readUserInput()
{
    if (!hasChangedBoard)
        return;
    startLayer = readGrid(); // convert the grid into the first layer
    hiddenLayer1 = weightedSum(startToHidden1Weights, startLayer, hidden1Biases);
    hiddenLayer2 = weightedSum(hidden1ToHidden2Weights, hiddenLayer1, hidden2Biases);
    outputLayer = weightedSum(hidden2ToOutputWeights, hiddenLayer2, outputBiases);

    answerBox.innerHTML = max(); // display the networkAnswer to the page
}