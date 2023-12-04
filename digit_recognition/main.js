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
// startToHidden1Weights = Array.from({length: 16}, () => Array.from({length: 784}, () => Math.random() * 2 - 1));
// hidden1ToHidden2Weights = Array.from({length: 16}, () => Array.from({length: 16}, () => Math.random() * 2 - 1));
// hidden2ToOutputWeights = Array.from({length: 10}, () => Array.from({length: 16}, () => Math.random() * 2 - 1));
// hidden1Biases = Array.from({length: 16}, () => Math.random() * 2 - 1);
// hidden2Biases = Array.from({length: 16}, () => Math.random() * 2 - 1);
// outputBiases = Array.from({length: 10}, () => Math.random() * 2 - 1);

// ==================== input training files ==================
// implement stochastic gradient descent: note 60,000 training data values: read 600 batches
// global variables to make my life easier while trying to implement this for this first time
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

let trainingDataComplete = false;

function drawImage(index)
{
    const offset = index * 784;
    for (let r = 0; r < 28; r++)
    {
        for (let c = 0; c < 28; c++)
        {
            const numToSet = trainingImageArray[offset + 28 * r + c];
            grid[r][c].rgbNum = numToSet;
            fillSquare(c, r);
        }
    }
    console.log('should be ' + trainingLabelArray[index]);
}