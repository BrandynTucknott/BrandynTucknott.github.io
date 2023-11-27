// ========================== start of neural network functions ==============================================================

// determine the "range of activation" for a particular square on the grid
function activationPercent(num)
{
    return num / 255;
}

// squishes inputs into range from (0, 1) (real number)
function sigmoid(x)
{
    return 1 / (1 + Math.exp(-x));
}

// derivative of the sigmoid function
function sigmoidDerivative(x)
{
    return Math.exp(-x) / Math.pow(1 + Math.exp(-x), 2);
}

// applies the sigmoid function to all elements in the vector
function vectorSigmoid(vector)
{
    let v = [];
    for (let i = 0; i < vector.length; i++)
        v[i] = sigmoid(vector[i]);
    
    return v;
}

// applies the derivative of the sigmoid function to all elements in vector
function vectorSigmoidDerivative(vector)
{
    let v = []
    for (let i = 0; i < vector.length; i++)
        v[i] = sigmoidDerivative(vector[i]);

    return v;
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
            layer[28 * r + c] = activationPercent(grid[c][r].rgbNum); // to organize it by rows
        }
    }

    return layer;
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

async function initSavedDataReader()
{
    const promise = await fetch('network_info.txt');
    const blob = await promise.blob();
    const reader = new FileReader();
    
    reader.onload = function() { saved_data_buffer = this.result }

    return new Promise(function(resolve, reject)
    {
        reader.onloadend = function(e)
        {
            readSavedData(saved_data_buffer);
            resolve();
        };
        reader.readAsText(blob);
    });
}

function readSavedData(buffer)
{
    const array = buffer.split(/\r\n|\n/); // array of strings
    let vals = []; // stores the 13002 weights and biases

    // read the data from the .txt file and use it in program
    if (isNaN(parseFloat(array[0]))) // no data in .txt
        return;
    networkAccuracy = parseFloat(array[0]);

    for (let i = 1; i < array.length; i++)
    {
        vals[i - 1] = parseInt(array[i]);
    }

    modifyWeightsAndBiases(vals);
}

