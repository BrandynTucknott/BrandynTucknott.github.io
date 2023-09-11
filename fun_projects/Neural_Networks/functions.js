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
    
    const square = grid[gridX][gridY];
    const fillColor = `rgb(${square.rgbNum}, ${square.rgbNum}, ${square.rgbNum})`
    context.fillStyle = fillColor;

    if (!square.white)
    {
        context.fillRect(box_dim * gridX, box_dim * gridY, box_dim, box_dim);
        if (fillColor == "rgb(255, 255, 255)")
            square.white = true;
    }
}

// generates a grayscale random color depending on the input speed
function generateAndSetColor(gridX, gridY, speed)
{
    if ((gridX < 0 || gridX > 27) || (gridY < 0 || gridY > 27))
        return; // square is out of bounds
    
    const square = grid[gridX][gridY];
    
    const n = 255 - Math.floor(Math.random() * (255 / 4 * (1 - Math.exp(-speed)) + 1) + 255 * Math.exp(-speed) * Math.atan(speed) * 2 / Math.PI);
    
    square.rgbNum = n;
}

// colors all possible neighbors and targeted square. Includes diagonals
function fill3x3(gridX, gridY, speed)
{
    // only fill squares if the cursor has moved to a new square
    const square = grid[gridX][gridY];
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

// ========================== start of neural network functions ==============================================================

// determine the "range of activation" for a particular square on the grid
function activationPercent(square)
{
    return square.rgbNum / 255;
}

// squishes inputs into range from [0, 1) (real number)
function sigmoid(x)
{
    return 1 / (1 + Math.exp(-x));
}

// applies the sigmoid function to all elements in the vector
function vectorSigmoid(vector)
{
    for (let i = 0; i < vector.length; i++)
        vector[i] = sigmoid(vector[i]);
    
    return vector;
}

// calculates M * v. Assumes they can be multiplied
function matrixVectorMultiplication(matrix, vector)
{
    let output = [];
    for (let r = 0; r < matrix.length; r++)
    {
        let sum = 0;
        for (let c = 0; c < vector.length; c++)
        {
            sum += matrix[r][c] * vector[c];
        }
        output[r] = sum;
    }

    return output;
}

// adds vectors a and b. assumes they can be added
function vectorAddition(a, b)
{
    let output = [];
    for (let i = 0; i < a.length; i++)
        output[i] = a[i] + b[i];

    return output;
}

// returns the sigmoid squished weighted sum of a single layer as a vector
function weightedSum(weights, layer, biases)
{
    return vectorSigmoid(vectorAddition(matrixVectorMultiplication(weights, layer), biases));
}

// returns a vector with 784 terms representing the input layer
function readGrid()
{
    let layer = [];
    for (let r = 0; r < 28; r++)
    {
        for (let c = 0; c < 28; c++)
        {
            layer[28 * r + c] = activationPercent(grid[c][r]); // to organize it by rows
        }
    }

    return layer;
}

// helper function for propogateBackwards(...). Determines which layer is being corrected
function determineLayer(layerIndex)
{
    if (layerIndex == 2)
        return outputLayer;
    else if (layerIndex == 1)
        return hiddenLayer2;
    // else layerIndex == 0
    return hiddenLayer1;
}

// helper function for propogateBackwards(...). Determines which layer is previous to the current layer
function determinePreviousLayer(layerIndex)
{
    if (layerIndex == 2)
        return hiddenLayer2;
    // else layerIndex == 1 (will not get to 0)
    return hiddenLayer1;
}

// helper function for propogateBackwards(...). Determines which weights correspond to the layer
function determineLayerWeights(layerIndex)
{
    if (layerIndex == 2)
        return hidden2ToOutputWeights;
    else if (layerIndex == 1)
        return hidden1ToHidden2Weights;
    // else layerIndex == 0
    return startToHidden1Weights;
}

// "learning" part of the neural network. Assumes an networkAnswer has been decided
/*
* layerIndex: used to recusively call propogateBackwards and keep track of which layer is currently being corrected
* desiredChange: vector of desired changes to be applied to current layer
*/
function propogateBackwards(layerIndex, desiredChange)
{
    // select current layer based on layerIndex
    let layer = determineLayer(layerIndex);
    let previousLayer = determinePreviousLayer(layerIndex);
    let weights = determineLayerWeights(layerIndex);

    // *** determine the desired gradient vector for this input ***
    let desiredPreviousLayerChangeVector = Array.from({Length: previousLayer.length}, () => 0);
    let gradient; // holds the vector containing the gradient of the cost function
    
    // PART I: change weights and biases =================
    // TODO: properly change weights
    // for all neurons in this layer
    for (let n = 0; n < layer.length; n++) // n for neuron
    {
        // consider all it's weights
        for (let w = 0; w < previousLayer.length; w++) // w for weight
        {
            gradient = calculateGradient(); // TODO: write this function
        }
    }

    // PART II: change previous layer activation (recursive step)
    // base case: on second layer (first layer is the input layer)
    if (layerIndex == 0)
        return;
    // else we are on at least the second hidden layer
    propogateBackwards(layerIndex - 1, desiredPreviousLayerChangeVector);
}

/*
calculates the gradient of the cost function for a given training input
*/
function calculateGradient()
{
    
}









async function initImageReader()
{
    const promise = await fetch('train-images.idx3-ubyte');
    const blob = await promise.blob();
    const reader = new FileReader();

    let arrayBuffer; // temp variable to store the array buffer and use in callback

    reader.onload = function() { arrayBuffer = this.result };

    return new Promise(function(resolve, reject)
    {
        reader.onloadend = function() 
        {
            readImageData(arrayBuffer);
            resolve();
        }

        reader.readAsArrayBuffer(blob);
    });
}

async function initLabelReader()
{
    const promise = await fetch('train-labels.idx1-ubyte');
    const blob = await promise.blob();
    const reader = new FileReader();

    let arrayBuffer; // temp variable to store the array buffer and use in callback

    reader.onload = function() { arrayBuffer = this.result };

    return new Promise(function(resolve, reject)
    {
        reader.onloadend = function() 
        {
            readLabelData(arrayBuffer);
            resolve();
        }

        reader.readAsArrayBuffer(blob);
    });
}

// label reading happens before image reading
function readLabelData(buffer)
{
    const dataview = new DataView(buffer);
    trainingNumItems = dataview.getInt32(4);

    trainingLabelArray = Array.from({length: trainingNumItems});

    // for all images
    for (let im = 0; im < trainingNumItems; im++)
    {
        // im + 5 = offset
        trainingLabelArray[im] = dataview.getUint8(im + 8);
    }
}

// reads and runs test files
function readImageData(buffer)
{
    const dataview = new DataView(buffer);
    // trainingNumItems = dataview.getInt32(4); // not needed bc image reading happens after label reading

    trainingImageArray = Array.from({length: 28 * 28 /* *trainingNumItems*/});

    let offset = 16;
    // for all images
    for (let im = 0; im < 1/*trainingNumItems*/; im++) // TODO: restore trainingNumItems
    {
        // get all of their pixels
        for (let r = 0; r < 28; r++)
        {
            for (let c = 0; c < 28; c++)
            {
                // store the pixels
                trainingImageArray[28 * r + c] = dataview.getUint8(offset);
                offset++;
            }
        }
    }
}

/*
* This function is used only to initialize the image and label data
* The function is defined and the appropriate functions for init and reading data is passed in
*/
async function processTrainingData(initImageCallback, initLabelCallback)
{
    // intent is for callback1 to happen, then callback2, then rest of this function
    await initImageCallback(); // initImageReader
    await initLabelCallback(); // initLabelReader


    // for each number in the training array
    for (let num = 0; num < 1/*trainingLabelArray.length*/; num++)
    {
        console.log('processing image ' + (num + 1));
        // read all its pixels
        for (let imageArrayIndex = 28 * 28 * num; imageArrayIndex < 28 * 28 * (num + 1); imageArrayIndex++)
        {
            startLayer[imageArrayIndex] = trainingImageArray[imageArrayIndex];
        }
        // calculate all layers
        hiddenLayer1 = weightedSum(startToHidden1Weights, startLayer, hidden1Biases);
        hiddenLayer2 = weightedSum(hidden1ToHidden2Weights, hiddenLayer1, hidden2Biases);
        outputLayer = weightedSum(hidden2ToOutputWeights, hiddenLayer2, outputBiases);

        // propogateBackwards() // TODO: call propogate backwards wtih correct input

        printMax();
    }
}








// helper function for recognize digit: finds the digit that is the networks response. Finds the max index in a 1d array
function max()
{
    let max = -1; // all values in array guaranteed [0, 1)
    let max_index = -1;
    for (let i = 0; i < outputLayer.length; i++)
    {
        if (outputLayer[i] > max)
        {
            max = outputLayer[i];
            max_index = i;
        }
    }

    return max_index;
}
function printMax()
{
    let max = -1; // all values in array guaranteed [0, 1)
    let max_index = -1;
    for (let i = 0; i < outputLayer.length; i++)
    {
        if (outputLayer[i] > max)
        {
            max = outputLayer[i];
            max_index = i;
        }
    }

    console.log(max_index);
}
// reads user grid and outputs the number believed to be written
function readUserInput()
{
    startLayer = readGrid(); // convert the grid into the first layer
    hiddenLayer1 = weightedSum(startToHidden1Weights, startLayer, hidden1Biases);
    hiddenLayer2 = weightedSum(hidden1ToHidden2Weights, hiddenLayer1, hidden2Biases);
    outputLayer = weightedSum(hidden2ToOutputWeights, hiddenLayer2, outputBiases);

    answerBox.innerHTML = max(); // display the networkAnswer to the page
}