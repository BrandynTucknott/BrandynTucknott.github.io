// ==================== create neural network ================
// all layers hold values [0, 1)
let startLayer = []; // 784 elements
let hiddenLayer1 = []; // 16 elements
let hiddenLayer2 = []; // 16 elements
let outputLayer = []; // 10 elements

// matrix representations
// let startToHidden1Weights = []; // 16 x 784 matrix
let hidden1ToHidden2Weights = []; // 16 x 16 matrix
let hidden2ToOutputWeights = []; // 10 x 16 matrix

// vector representations
let hidden1Biases = []; // 16 elements
let hidden2Biases = []; // 16 elements
let outputBiases = []; // 10 elements

// ==================== initialize weights + biases randomly at creation ==========================
startToHidden1Weights = Array.from({length: 16}, () => Array.from({length: 784}, () => Math.random()));
hidden1ToHidden2Weights = Array.from({length: 16}, () => Array.from({length: 16}, () => Math.random()));
hidden2ToOutputWeights = Array.from({length: 10}, () => Array.from({length: 16}, () => Math.random()));
hidden1Biases = Array.from({length: 16}, () => Math.random());
hidden2Biases = Array.from({length: 16}, () => Math.random());
outputBiases = Array.from({length: 10}, () => Math.random());

// network correction variables
let correctOutput = []; // 10 elements
let costFunctionGradient = []; // 13002 dimension vector holding the "gradient" of the costFunction

/* 
computing the gradient of the cost function is backpropagation

costFunction = vector of 
      startToHidden1Weights + hidden1ToHidden2Weights + hidden2ToOutputWeights + hidden1Biases + hidden2Biases + outputBiases 
*/

// ==================== input training files ==================
// implement stochastic gradient descent

let trainingNumItems;

let trainingImageArray = [];
let trainingLabelArray = [];

// initImageReader(readImageData);
// initLabelReader(readLabelData);

processTrainingData(initImageReader, initLabelReader);

// ==================== input testing files ===============================