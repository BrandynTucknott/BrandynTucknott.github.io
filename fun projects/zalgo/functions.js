function convertToZalgo()
{
    let word = input.value;
    let zalgo = "";

    // initailize array of char while adding on zalgo
    for (let i = 0; i < word.length; i++)
    {
        // initialize
        let letter = word.substring(i, i+1);

        // add zalgo
        let numExtraChar = Math.floor((Math.random() * INTENSITY));
        for (let j = 0; j < numExtraChar; j++)
        {
            letter += uniArray[Math.floor(Math.random() * LENGTH)];
        }
        // add zalgo character to final word
        zalgo += letter;
    }
    // displays the zalgo text
    output.innerHTML = zalgo;
}

// returns the html syntax to print the unicode character corresponding to the decimal -> hexadecimal input
function getUnicode(decimal)
{
    return "&#x" + decimal.toString(16) + ";";
}

// initialize an array of unicode characters in html syntax
function initUniArray()
{
    for (let i = 0; i < LENGTH; i++)
    {
        uniArray[i] = getUnicode(i + 769);
    }
}