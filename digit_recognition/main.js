// ==================== create neural network ================
// all layers hold values [0, 1); these represent the activation neurons
let startLayer = Array.from({length: 784}, () => 0); // 784 elements
let hiddenLayer1 = Array.from({length: 16}, () => 0); // 16 elements
let hiddenLayer2 = Array.from({length: 16}, () => 0); // 16 elements
let outputLayer = Array.from({length: 10}, () => 0); // 10 elements

// matrix representations
let startToHidden1Weights = []; // 16 x 784 matrix
let hidden1ToHidden2Weights = []; // 16 x 16 matrix
let hidden2ToOutputWeights = []; // 10 x 16 matrix

// vector representations
let hidden1Biases = []; // 16 elements
let hidden2Biases = []; // 16 elements
let outputBiases = []; // 10 elements

// ==================== initialize weights + biases randomly at creation ==========================
startToHidden1Weights = Array.from({length: 16}, () => Array.from({length: 784}, () => Math.random() * 2 - 1));
hidden1ToHidden2Weights = Array.from({length: 16}, () => Array.from({length: 16}, () => Math.random() * 2 - 1));
hidden2ToOutputWeights = Array.from({length: 10}, () => Array.from({length: 16}, () => Math.random() * 2 - 1));
hidden1Biases = Array.from({length: 16}, () => Math.random() * 2 - 1);
hidden2Biases = Array.from({length: 16}, () => Math.random() * 2 - 1);
outputBiases = Array.from({length: 10}, () => Math.random() * 2 - 1);

// ==================== input training files ==================
// implement stochastic gradient descent: note 60,000 training data values: read 600 batches
const BATCH_SIZE = 100;
let NUM_BATCHES_READ = 0;

let trainingNumItems = -1;
let testNumItems = -1;

let trainingImageArray = [];
let trainingLabelArray = [];

let testImageArray = [];
let testLabelArray = [];

let img_buffer;
let label_buffer;
let saved_data_buffer;

let trainingDataComplete = false;

let networkAccuracy = -1;
initSavedDataReader();

function containsNaN(array)
{
    for (let i = 0; i < array.length; i++)
    {
        if (isNaN(array[i]))
        {
            // console.log('NaN at index ' + i);
            return true;
        }
    }
    return false;
}
function testForNaN()
{
    console.log('BEGIN TEST FOR NaN');
    // test biases
    if (containsNaN(hidden1Biases))
        console.log('hidden 1 biases contain NaN');
    if (containsNaN(hidden2Biases))
        console.log('hidden 2 biases contain NaN');
    if (containsNaN(outputBiases))
        console.log('output biases contain NaN');

    // test weights
    for (let i = 0; i < startToHidden1Weights; i++)
    {
        if (containsNaN(startToHidden1Weights[i]))
        {
            console.log('start --> hidden 1 weights contains NaN');
            break;
        }
    }
    for (let i = 0; i < hidden1ToHidden2Weights; i++)
    {
        if (containsNaN(hidden1ToHidden2Weights[i]))
        {
            console.log('hidden 1 --> hidden 2 weights contains NaN');
            break;
        }
    }
    for (let i = 0; i < hidden2ToOutputWeights; i++)
    {
        if (containsNaN(hidden2ToOutputWeights[i]))
        {
            console.log('hidden 2 --> output weights contains NaN');
            break;
        }
    }

    // test layers
    if (containsNaN(startLayer))
        console.log('start layer contains NaN');
    if (containsNaN(hiddenLayer1))
        console.log('hidden 1 layer contains NaN');
    if (containsNaN(hiddenLayer2))
        console.log('hidden 2 layer contains NaN');
    if (containsNaN(outputLayer))
        console.log('output layer contains NaN');

    if (containsNaN(temp_cost_gradient))
        console.log('cost_gradient contains NaN');

    console.log('END TEST FOR NaN');
}