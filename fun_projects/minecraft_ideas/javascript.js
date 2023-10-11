const new_idea_button = document.getElementById('new-idea-button');

const structureTag = document.getElementById('structure');
const purposeTag = document.getElementById('purpose');
const locationTag = document.getElementById('location');

function readTextFile(file)
{
    let rawFile = new XMLHttpRequest();
    let array = [];

    rawFile.open('GET', file, false);   
    rawFile.onreadystatechange = function()
    {
        if (rawFile.readyState === 4) // readyState == done
        {
            if (rawFile.status === 200 || rawFile.status == 0)
            {
                // rawFile.send(null);
                array = rawFile.responseText.split('\n');
            }
        }
    }
    rawFile.send(null);
    return array;
}

// arrays contatining the contents of the txt files
const structuresArray = readTextFile('structures.txt');
const purposesArray = readTextFile('purposes.txt');
const locationsArray = readTextFile('locations.txt');

// generates a random integer between 0 and max (inclusive). Assumes max is an integer
function generateRandomNumber(max)
{
    return Math.floor(Math.random() * max);
}

new_idea_button.addEventListener('click', () =>
{
    const structuresRandIndex = generateRandomNumber(structuresArray.length);
    const purposesRandIndex = generateRandomNumber(purposesArray.length);
    const locationsRandIndex = generateRandomNumber(locationsArray.length);

    structureTag.innerText = `Build a ${structuresArray[structuresRandIndex]}`;
    purposeTag.innerText = `With a ${purposesArray[purposesRandIndex]}`;
    locationTag.innerText = `Location: ${locationsArray[locationsRandIndex]}`;
});