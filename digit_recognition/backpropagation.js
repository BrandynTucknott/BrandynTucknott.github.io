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
    else if (layerIndex == 1)
        return hiddenLayer1;
    // else layerIndex == 0
    return startLayer;
}

// helper function for propogateBackwards(...). Determines which weights correspond to the current layer
function determineLayerWeights(layerIndex)
{
    if (layerIndex == 2)
        return hidden2ToOutputWeights;
    else if (layerIndex == 1)
        return hidden1ToHidden2Weights;
    // else layerIndex == 0
    return startToHidden1Weights;
}

// helper function for propagateBackwards(...). Determines which biases correspond to the current layer
function determineLayerBiases(layerIndex)
{
    if (layerIndex == 2)
        return outputBiases;
    else if (layerIndex == 1)
        return hidden2Biases;
    // else layerIndex == 0
    return hidden1Biases;
}

// helper function for propagateBackwards(...). Determines the start index of Biases layer in cost_gradient
function determineStartIndexOfBiasesInGradient(layerIndex)
{
    if (layerIndex == 2) // output biases
        return startLayer.length * hiddenLayer1.length + 
        hiddenLayer1.length * hiddenLayer2.length + 
        hiddenLayer2.length * outputLayer.length + 
        hidden1Biases.length + hidden2Biases.length;
    else if (layerIndex == 1) // hidden 2 biases
        return startLayer.length * hiddenLayer1.length + 
        hiddenLayer1.length * hiddenLayer2.length + 
        hiddenLayer2.length * outputLayer.length + 
        hidden1Biases.length;
    // else layerIndex == 0: hidden 1 biases
    return startLayer.length * hiddenLayer1.length + 
    hiddenLayer1.length * hiddenLayer2.length + 
    hiddenLayer2.length * outputLayer.length;

}

// helper function for propagateBackwards(...). Determines the start index of Biases layer in cost_gradient
function determineStartIndexOfWeightsInGradient(layerIndex)
{
    if (layerIndex == 2) // hidden 2 --> output weights
        return startLayer.length * hiddenLayer1.length + 
        hiddenLayer1.length * hiddenLayer2.length;
    else if (layerIndex == 1) // hidden 1 --> hidden 2 weights
        return startLayer.length * hiddenLayer1.length;
    // else layerIndex == 0: start --> hidden 1 weights
    return 0; 
}

// "learning" part of the neural network. Assumes an networkAnswer has been decided
/*
* layerIndex: used to recusively call propogateBackwards and keep track of which layer is currently being corrected
*/
function propogateBackwards(layerIndex, cost_gradient, desired_output)
{
    if (layerIndex == -1) // nothing more to do
        return;
    /*
    layerIndex cheat sheet
    0: hidden 1 --> start layer
    1: hidden 2 --> hidden 1
    2: output --> hidden 2
    */
    // select current layer based on layerIndex
    let layer = determineLayer(layerIndex); // current later activation
    let previousLayer = determinePreviousLayer(layerIndex); // prev layer activation
    let weights = determineLayerWeights(layerIndex); // weights connecting previous to current layer
    let biases = determineLayerBiases(layerIndex); // biases on the current layer

    const BIASES_START_INDEX = determineStartIndexOfBiasesInGradient(layerIndex);
    const WEIGHTS_START_INDEX = determineStartIndexOfWeightsInGradient(layerIndex);

    // partial derivative of cost with respect to activation neuron for all neurons in this layer

    let partialCost_partialActivation = Array.from({length: layer.length}, () => 0);
    // partial derivative of activation neurons with respect to weighted sum of previous layer feeding into current neuron
    let partialActivation_partialZ = Array.from({length: layer.length}, () => 0);
    let z = biases.map(bias => bias);

    // fill in the arrays with partial derivatives
    for (let j = 0; j < layer.length; j++)
    {
        partialCost_partialActivation = 2 * (layer[j] - desired_output[j]);
        if (isNaN(partialCost_partialActivation))
        {
            console.log('partialCost_partialActivation is NaN: layer ' + layerIndex);
            return;
        }

        for (let k = 0; k < previousLayer.length; k++)
        {
            z[j] += previousLayer[k] * weights[j][k];
            if (isNaN(z[j]))
            {
                console.log('z[' + j + '] at k = ' + k + ' is NaN: layer ' + layerIndex);
                return;
            }
        }
        partialActivation_partialZ[j] = sigmoidDerivative(z[j]);
        if (isNaN(partialActivation_partialZ[j]))
        {
            console.log('partialActivation_partialZ[' + j + '] is NaN: layer ' + layerIndex);
            return;
        }
    } // end of filling arrays

    
    // PART I: add to gradient for weights and biases =================
    // go through and mark a change in the cost_gradient for each bias
    desired_output = [];
    for (let j = 0; j < biases.length; j++)
    {
        // mark down change to each bias
        let partialCost_partialBias = partialCost_partialActivation * partialActivation_partialZ[j]
        cost_gradient[BIASES_START_INDEX + j] += partialCost_partialBias;
        if (isNaN(cost_gradient[BIASES_START_INDEX + j]))
        {
            console.log('B: cost_gradient[' + (BIASES_START_INDEX + j) + '] is NaN: tried to add ' + (partialCost_partialActivation * partialActivation_partialZ[j]));
            return;
        }

        // mark down change to each weight
        for (let k = 0; k < previousLayer.length; k++)
        {
            // effectively partialCost_partialWeight
            cost_gradient[WEIGHTS_START_INDEX + j * previousLayer.length + k] += partialCost_partialActivation * partialActivation_partialZ[j] * previousLayer[k];
            if (isNaN(cost_gradient[WEIGHTS_START_INDEX + j * previousLayer.length + k]))
            {
                console.log('W: cost_gradient[' + (WEIGHTS_START_INDEX + j * previousLayer.length + k) + '] is NaN: tried to add ' + partialCost_partialActivation + ' * ' + partialActivation_partialZ[j] + ' * ' + previousLayer[k]);
            }
            let partialCost_partialPreviousLayerActivation = 0;
            for (let temp_j = 0; temp_j < layer.length; temp_j++)
            {
                partialCost_partialPreviousLayerActivation += partialCost_partialActivation * partialActivation_partialZ[temp_j] * weights[temp_j][k];
            }
            desired_output[k] = partialCost_partialPreviousLayerActivation;
        }
    }

    // PART II: change previous layer activation (recursive step)
    propogateBackwards(layerIndex - 1, cost_gradient, desired_output);
}

// modifies the weights and biases after each training batch
function modifyWeightsAndBiases(cost_gradient)
{
    let cost_gradient_index = 0;
    // change all weights from start layer --> hidden 1
    for (let j = 0; j < startToHidden1Weights.length; j++)
    {
        for (let k = 0; k < startToHidden1Weights[j].length; k++)
        {
            startToHidden1Weights[j][k] += cost_gradient[cost_gradient_index];
            cost_gradient_index++;
        }
    }

    // change all weights from hidden 1 --> hidden 2
    for (let j = 0; j < hidden1ToHidden2Weights.length; j++)
    {
        for (let k = 0; k < hidden1ToHidden2Weights[j].length; k++)
        {
            hidden1ToHidden2Weights[j][k] += cost_gradient[cost_gradient_index];
            cost_gradient_index++;
        }
    }

    // change all weights from hidden 2 --> output layer
    for (let j = 0; j < hidden2ToOutputWeights.length; j++)
    {
        for (let k = 0; k < hidden2ToOutputWeights[j].length; k++)
        {
            hidden2ToOutputWeights[j][k] += cost_gradient[cost_gradient_index];
            cost_gradient_index++;
        }
    }
    // change all biases from start --> hidden 1
    for (let j = 0; j < hidden1Biases.length; j++)
    {
        hidden1Biases[j] += cost_gradient[cost_gradient_index];
        cost_gradient_index++;
    }

    // change all biases from hidden 1 --> hidden 2
    for (let j = 0; j < hidden2Biases.length; j++)
    {
        hidden2Biases[j] += cost_gradient[cost_gradient_index];
        cost_gradient_index++;
    }

    // change all biases from hidden 2 --> output
    for (let bias = 0; bias < outputBiases.length; bias++)
    {
        outputBiases[bias] += cost_gradient[cost_gradient_index];
        cost_gradient_index++;
    }
}