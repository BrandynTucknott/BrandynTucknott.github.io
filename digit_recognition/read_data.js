async function initImageReader()
{
    const promise = await fetch('train-images.idx3-ubyte');
    const blob = await promise.blob();
    const reader = new FileReader();

    reader.onload = function() { img_buffer = this.result };

    return new Promise(function(resolve, reject)
    {
        reader.onloadend = function() 
        {
            // readImageData(img_buffer);
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

    reader.onload = function() { label_buffer = this.result };

    return new Promise(function(resolve, reject)
    {
        reader.onloadend = function() 
        {
            // readLabelData(label_buffer);
            const dataview = new DataView(label_buffer);
            trainingNumItems = dataview.getInt32(4);
            resolve();
        }

        reader.readAsArrayBuffer(blob);
    });
}

// label reading happens before image reading: read one batch at a time
function readLabelData(buffer)
{
    // Int32 from 0 - 3 is magic num, which I do not use
    const dataview = new DataView(buffer);
    trainingNumItems = dataview.getInt32(4);

    trainingLabelArray = Array.from({length: BATCH_SIZE}, () => -100);
    let offset = 8 // 2 4-byte numbers: magic num, num items

    // for all images
    for (let im = 0; im < BATCH_SIZE; im++)
    {
        trainingLabelArray[im] = dataview.getUint8(NUM_BATCHES_READ * BATCH_SIZE + im + offset);
    }
}

// reads and runs test files: read one batch at a time
function readImageData(buffer)
{
    const dataview = new DataView(buffer);
    // trainingNumItems = dataview.getInt32(4); // not needed bc image reading happens after label reading

    trainingImageArray = Array.from({length: 28 * 28 * BATCH_SIZE}, () => -100);

    // [0-3] = magic number: 4 byte integer
    // [4 - 7] = number of items: 4 byte integer
    let offset = 8;
    // for all images
    for (let im = 0; im < BATCH_SIZE; im++) // TODO: restore trainingNumItems
    {
        // get all of their pixels
        for (let r = 0; r < 28; r++)
        {
            for (let c = 0; c < 28; c++)
            {
                // store the pixels
                trainingImageArray[784 * im + 28 * r + c] = dataview.getUint8(NUM_BATCHES_READ * BATCH_SIZE + offset + 28 * r + c);
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

    const NUM_BATCHES_TO_READ = trainingNumItems / BATCH_SIZE;
    // const NUM_BATCHES_TO_READ = 3;

    /*
    784 * 16 start layer --> hidden layer 1
    +
    16 * 16 hidden layer 1 --> hidden layer 2
    +
    16 * 10 hidden layer 2 --> output
    +
    (16 + 16 + 10) biases to layer 1, layer 2, and output
    =
    13,002 "knobs to adjust"
    */
   /*
   START --> HIDDEN_1
   start neuron 1 weights: 0 - 15
   start neuron 2 weights: 16 - 31
   start neuron 3 weights: 32 - 47
   etc.

   HIDDEN_1 --> HIDDEN_2
   hidden layer 1 neuron 1 weights: 784 * 16 - 784 * 16 + 15
   hidden layer 1 neuron 2 weights: 784 * (16 + 1) - 784 * (16 + 1) + 15
   hidden layer 1 neuron 3 weights: 784 * (16 + 2) - 784 * (16 + 2) + 15
   etc.

   HIDDEN_2 --> OUTPUT
   hidden layer 2 neuron 1 weights: 784 * 16 + 16 * 16 - 784 * 16 * 16 + 9
   hidden layer 2 neuron 2 weights: 784 * 16 + 16 * 16 + 10 - 784 * 16 * 16 + 10 + 9
   hidden layer 2 neuron 3 weights: 784 * 16 + 16 * 16 + 10 * 2 - 784 * 16 * 16 + 2 * 10 + 9
   etc.

   HIDDEN_1 BIASES
   hidden 1 neuron 1 bias: 784 * 16 + 16 * 16 + 16 * 10
   hidden 1 neuron 2 bias: 784 * 16 + 16 * 16 + 16 * 10 + 1
   hidden 1 neuron 3 bias: 784 * 16 + 16 * 16 + 16 * 10 + 2
   etc.

   HIDDEN_2 BIASES
   hidden 2 neuron 1 bias: 784 * 16 + 16 * 16 + 16 * 10 + 16
   hidden 2 neuron 2 bias: 784 * 16 + 16 * 16 + 16 * 10 + 16 + 1
   hidden 2 neuron 3 bias: 784 * 16 + 16 * 16 + 16 * 10 + 16 + 2
   etc.

   OUTPUT BIASES
   output neuron 1 bias: 784 * 16 + 16 * 16 + 16 * 10 + 16 + 16
   output neuron 2 bias: 784 * 16 + 16 * 16 + 16 * 10 + 16 + 16 + 1
   output neuron 3 bias: 784 * 16 + 16 * 16 + 16 * 10 + 16 + 16 + 2
   .
   .
   .
   output neuron 10 bias: 784 * 16 + 16 * 16 + 16 * 10 + 16 + 16 + 9

   This means there are 784 * 16 + 16 * 16 + 16 * 10 + 16 + 16 + 10 = 13,002 elements that will be stored in the cost_gradient
   */
    let cost_gradient = Array.from(
        { length: 
            startLayer.length * hiddenLayer1.length + 
            hiddenLayer1.length * hiddenLayer2.length + 
            hiddenLayer2.length * outputLayer.length + 
            hidden1Biases.length + hidden2Biases.length + outputBiases.length
        }, () => 0);
    // ============================================================================================================================
    // ============================================================================================================================
    // redundant code I will fix later: happened as a result of how callback functions work =======================================
    // for (let num = 0; num < BATCH_SIZE; num++)
    // {
    //     // read all pixels in 1 training image
    //     for (let i = 0; i < 28 * 28; i++)
    //     {
    //         startLayer[i] = activationPercent(trainingImageArray[784 * num + i]);
    //     }
    //     // calculate all layers: get an untrained output
    //     hiddenLayer1 = weightedSum(startToHidden1Weights, startLayer, hidden1Biases);
    //     hiddenLayer2 = weightedSum(hidden1ToHidden2Weights, hiddenLayer1, hidden2Biases);
    //     outputLayer = weightedSum(hidden2ToOutputWeights, hiddenLayer2, outputBiases);

    //     // console.log('before backprop');
    //     // testForNaN();

    //     desired_output = Array.from({length: outputLayer.length}, () => 0); // desired output vector; init to all 0
    //     desired_output[trainingLabelArray[num]] = trainingLabelArray[num]; // label what the correct output should have been

    //     // make appropriate changes to the gradient of the cost
    //     propogateBackwards(2, cost_gradient, desired_output) // TODO: call propogate backwards wtih correct input
    //     // console.log('after backprop');
    //     // testForNaN();
    // }
    // // avg the cost_gradient(addition done in loop above; all that remains is division)
    // cost_gradient = cost_gradient.map(val => val / BATCH_SIZE);
    // // error correct the untrained output and modify all the "13,002 knobs" using the cost_gradient
    // modifyWeightsAndBiases(cost_gradient);
    // // console.log('after modification');
    // // testForNaN();
    // NUM_BATCHES_READ = 1;
    // status_update_div.innerText = 'processed batch ' + NUM_BATCHES_READ + ' of ' + NUM_BATCHES_TO_READ;
    // console.log('processed batch ' + NUM_BATCHES_READ + ' of ' + NUM_BATCHES_TO_READ);
    // end of redundant code ============================================================================================
    // ==================================================================================================================
    // ==================================================================================================================






    
    while (NUM_BATCHES_READ < NUM_BATCHES_TO_READ)
    {
        readLabelData(label_buffer);
        readImageData(img_buffer);
        // for each number in the batch
        for (let num = 0; num < BATCH_SIZE; num++)
        {
            // read all its pixels
            for (let i = 0; i < 28 * 28; i++)
            {
                startLayer[i] = activationPercent(trainingImageArray[784 * num + i]);
            }
            // calculate all layers: get an untrained output
            hiddenLayer1 = weightedSum(startToHidden1Weights, startLayer, hidden1Biases);
            hiddenLayer2 = weightedSum(hidden1ToHidden2Weights, hiddenLayer1, hidden2Biases);
            outputLayer = weightedSum(hidden2ToOutputWeights, hiddenLayer2, outputBiases);

            // console.log('before backprop');
            // testForNaN();

            desired_output = Array.from({length: outputLayer.length}, () => 0); // desired output vector; init to all 0
            desired_output[trainingLabelArray[num]] = trainingLabelArray[num]; // label what the correct output should have been

            // make appropriate changes to the gradient of the cost
            propogateBackwards(2, cost_gradient, desired_output) // TODO: call propogate backwards wtih correct input
            // console.log('after backprop');
            // testForNaN();
        }
        // avg the cost_gradient(addition done in loop above; all that remains is division)
        cost_gradient = cost_gradient.map(val => val / BATCH_SIZE);
        // error correct the untrained output and modify all the "13,002 knobs" using the cost_gradient
        modifyWeightsAndBiases(cost_gradient);
        // console.log('after modification');
        // testForNaN();
        NUM_BATCHES_READ++;
        status_update_div.innerText = 'processed batch ' + NUM_BATCHES_READ + ' of ' + NUM_BATCHES_TO_READ;
        console.log('processed batch ' + NUM_BATCHES_READ + ' of ' + NUM_BATCHES_TO_READ);
    }
    trainingDataComplete = true;
    processTestData(initTestImageReader, initTestLabelReader);
}