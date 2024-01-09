/* HEADER COMMENT
 * GROUP MEMBERS: Brandyn Tucknott
 */

const tileTags = document.getElementsByTagName('td');
const operations = document.getElementById('operations').children; // [*, +, -]
const goal = document.getElementById('goal');
const wins = document.getElementById('wins');
const losses = document.getElementById('losses');
const workspace = document.getElementById('workspace-output');
const message = document.getElementById('message');
const restartButton = document.getElementById('restart');
const correctPathHeader = document.getElementById('correct-path-header');
const correctPath = document.getElementById('correct-path');

/* Method to determine what to output to the workspace:
0 - waiting for the first number to be input
1 - waiting for the operation to be input
2 - waiting for the second number to be input
*/
let target = 0;
let waitingFor = 0;
let total = 0; // current value the user has
let currentOperation = -1; // operation the user has selected: -1 means the user has not chosen
let nums = []; // hold numbers associated with each tile
let picked = []; // numbers the user has picked
let totalUncheckedTiles = tileTags.length;
let totalWins = 0;
let totalLosses = 0;
let path = ''; // path of the solution to prove each combination  was possible
let currentTile = 0; // tile that the user last clicked (will display their current total)
let gameEnd = false; // gameEnd = false: game is still going

// reset the board with new numbers when called
function newGame()
{
    generateNumbers();
    path = generateGoal();
    goal.innerText = `Goal: ${target}`;
    workspace.innerText = '';
    waitingFor = 0;
    totalUncheckedTiles = tileTags.length;
    total = 0;
    currentOperation = -1;
    message.innerText = "Let's Play!";
    correctPath.innerText = '';
    correctPathHeader.innerText = '';
    currentTile = 0;
    gameEnd = false;
}

// generates a positive digit for each of the tiles
function generateNumbers()
{
    for (let i = 0; i < tileTags.length; i++)
    {
        // generate a random integer between 1-9
        nums[i] = Math.floor(Math.random() * 9) + 1;
        picked[i] = false; // in a new game, no tiles have been picked
        tileTags[i].innerText = `${nums[i]}`;
    }
}

// does random operations on the generated numbers to get a goal
function generateGoal()
{
    let numsCopy = structuredClone(nums); // copy array so that elements can be removed from copy
    let randIndex = Math.floor(Math.random() * numsCopy.length); // get a random number to be the first number
    let goal = numsCopy.pop(randIndex);

    let path = '';

    while (numsCopy.length > 0)
    {
        // get a random number
        randIndex = Math.floor(Math.random() * numsCopy);
        let val = numsCopy.pop(randIndex);

        // get a random operation
        let operation = Math.floor((Math.random() * 3));
        switch(operation)
        {
            case 0:
                path += `${goal}`;
                goal *= val;
                path += ` * ${val} = ${goal}\n`;
                break;
            case 1:
                path += `${goal}`;
                goal += val;
                path += ` + ${val} = ${goal}\n`;
                break;
            case 2:
                path += `${goal}`;
                goal -= val;
                path += ` - ${val} = ${goal}\n`;
                break;
        }
    }

    target = goal;
    return path;
}

// updates the current user number; called after all numbers and operations have been selected
function updateTotal(n)
{
    switch (currentOperation)
    { // considered adding a break to each statement with one return at the end, but it would end up being more lines of code
        case 0: // user chose multiplication
            total *= n;
            return total;
        case 1: // user chose addition
            total += n;
            return total;
        case 2: // user chose subtraction
            total -= n;
            return total;
    }
}

document.addEventListener('DOMContentLoaded', newGame); // make a new game as soon as the page can load
restartButton.addEventListener('click', newGame); // make a new game if the user presses the restart button

// add event listeners for numbers
for (let i = 0; i < tileTags.length; i++)
{
    tileTags[i].addEventListener('click', () =>
    {
        if (picked[i]) // this tile has already been selected, do nothing
            return;
        
        switch (waitingFor)
        {
            case 1: // waiting for an operation, so do nothing
                return;
            case 0: // num1
                workspace.innerText += `${nums[i]}`;
                waitingFor++;
                total = nums[i];
                picked[i] = true;
                tileTags[i].innerText = ''; // make it clear to the user that this number is not selectable
                totalUncheckedTiles--;
                message.innerText = 'Choose an Operator';
                return;
            case 2: // num2
                workspace.innerText += ` ${nums[i]} = ${updateTotal(nums[i])}`;
                waitingFor = 1; // the total will be reset as their num1, they need to choose an operation now
                picked[i] = true;
                if (currentTile != 0)
                    currentTile.innerText = ''; // clear the former last tile the user selected
                currentTile = tileTags[i];
                tileTags[i].innerText = `Total:\n${total}`; // make it clear to the user that this number is not selectable
                totalUncheckedTiles--;
                message.innerText = 'Choose an Operator';

                // start next line if viable
                if (totalUncheckedTiles > 0)
                    workspace.innerText += `\n${total}`;
                else
                    resolveEndGame();
                return;
        } 
    });
}

// add event listeneres for operations
for (let i = 0; i < operations.length; i++)
{
    operations[i].addEventListener('click', () =>
    {
        if (gameEnd) // don't print stuff out if the game is over
            return;
        switch (waitingFor)
        {
            case 1: // waiting for an operation
            // add the correct symbol to the workspace
                switch (i)
                {
                    case 0:
                        workspace.innerText += ' *';
                        break;
                    case 1:
                        workspace.innerText += ' +';
                        break;
                    case 2:
                        workspace.innerText += ' -';
                        break;
                }
                currentOperation = i;
                waitingFor++;
                message.innerText = 'Choose a Number';
        }
    });
}

function resolveEndGame()
{
    if (total == target) // user win
    {
        message.innerText = 'You Win!';
        totalWins++;
        wins.innerText = `Wins: ${totalWins}`;
    }
    else // user loss
    {
        message.innerText = 'Better Luck Next Time...'
        correctPathHeader.innerText = 'A Correct Path was:'
        correctPath.innerText = `${path}`;
        totalLosses++;
        losses.innerText = `Losses: ${totalLosses}`;
    }
    gameEnd = true;

}