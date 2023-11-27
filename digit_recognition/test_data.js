async function initTestImageReader()
{
    const promise = await fetch('t10k-images.idx3-ubyte');
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

async function initTestLabelReader()
{
    const promise = await fetch('t10k-labels.idx1-ubyte');
    const blob = await promise.blob();
    const reader = new FileReader();

    reader.onload = function() { label_buffer = this.result };

    return new Promise(function(resolve, reject)
    {
        reader.onloadend = function() 
        {
            // readLabelData(label_buffer);
            const dataview = new DataView(label_buffer);
            testNumItems = dataview.getInt32(4);
            resolve();
        }

        reader.readAsArrayBuffer(blob);
    });
}

// label reading happens before image reading: read one batch at a time
function readTestLabelData(buffer)
{
    const dataview = new DataView(buffer);
    // testNumItems = dataview.getInt32(4);

    testLabelArray = Array.from({length: BATCH_SIZE}, () => -100);
    let offset = 8; // 2 4-byte nums: magic num, num items

    // for all images
    for (let im = 0; im < BATCH_SIZE; im++)
    {
        // im + 5 = offset
        testLabelArray[im] = dataview.getUint8(NUM_BATCHES_READ * BATCH_SIZE + im + offset);
    }
}

// reads and runs test files: read one batch at a time
function readTestImageData(buffer)
{
    const dataview = new DataView(buffer);
    // trainingNumItems = dataview.getInt32(4); // not needed bc image reading happens after label reading

    testImageArray = Array.from({length: 28 * 28 * BATCH_SIZE}, () => -100);

    // 2 4-byte nums at beginning: magic num, num of items
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
                testImageArray[784 * im + 28 * r + c] = dataview.getUint8(NUM_BATCHES_READ * BATCH_SIZE + offset + 28 * r + c);
                offset++;
            }
        }
    }
}





async function processTestData(initImageCallback, initLabelCallback)
{
    await initImageCallback();
    await initLabelCallback();

    const NUM_BATCHES_TO_READ = testNumItems / BATCH_SIZE;
    // const NUM_BATCHES_TO_READ = 3;
    NUM_BATCHES_READ = 0;

    let num_correct = 0;

    // ============================================================================================================================
    // ============================================================================================================================
    // redundant code I will fix later: happened as a result of how callback functions work =======================================
    // for (let num = 0; num < BATCH_SIZE; num++)
    // {
    //     // read all pixels in 1 training image
    //     for (let i = 0; i < 28 * 28; i++)
    //     {
    //         startLayer[i] = activationPercent(testImageArray[784 * num + i]);
    //     }
    //     // calculate all layers: get an untrained output
    //     hiddenLayer1 = weightedSum(startToHidden1Weights, startLayer, hidden1Biases);
    //     hiddenLayer2 = weightedSum(hidden1ToHidden2Weights, hiddenLayer1, hidden2Biases);
    //     outputLayer = weightedSum(hidden2ToOutputWeights, hiddenLayer2, outputBiases);

    //     if (testLabelArray[num] == max())
    //     {
    //         num_correct++;
    //     }
    // }
    // NUM_BATCHES_READ++;
    // console.log('processed test batch ' + NUM_BATCHES_READ + ' of ' + NUM_BATCHES_TO_READ);
    // end of redundant code ============================================================================================
    // ==================================================================================================================
    // ==================================================================================================================

    while (NUM_BATCHES_READ < NUM_BATCHES_TO_READ)
    {
        readTestLabelData(label_buffer);
        readTestImageData(img_buffer);
        // for each number in the batch
        for (let num = 0; num < BATCH_SIZE; num++)
        {
            // read all its pixels
            for (let i = 0; i < 28 * 28; i++)
            {
                startLayer[i] = activationPercent(testImageArray[784 * num + i]);
            }
            // calculate all layers: get an untrained output
            hiddenLayer1 = weightedSum(startToHidden1Weights, startLayer, hidden1Biases);
            hiddenLayer2 = weightedSum(hidden1ToHidden2Weights, hiddenLayer1, hidden2Biases);
            outputLayer = weightedSum(hidden2ToOutputWeights, hiddenLayer2, outputBiases);

            if (testLabelArray[num] == max())
            {
                num_correct++;
            }
        }
        NUM_BATCHES_READ++;
        console.log('processed test batch ' + NUM_BATCHES_READ + ' of ' + NUM_BATCHES_TO_READ);
    }
    let accuracy = num_correct / testNumItems * 100;

    console.log('Network has a ' + accuracy + '% accuracy');
    if (accuracy > networkAccuracy)
        overrideSavedData(accuracy)
}

function overrideSavedData(accuracy)
{
    return; // remove this eventually
    const fs = require('fs');
    const content = 'test content';
    fs.writeFile('network_info.txt', content, (err) =>
    {
        if (err)
        {
            console.error(err);
            return;
        }
    });
}