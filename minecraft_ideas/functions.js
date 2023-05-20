// takes in the file (url)? as a string and returns the contents of that file in an array
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