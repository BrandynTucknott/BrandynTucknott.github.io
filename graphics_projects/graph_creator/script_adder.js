/*
 * This file adds all required .js files to index.html. This file was created bc I did not want to individually add all the files
*/

// adds all files in the files array (containing strings of file names) to the index.html document
function addToDocument(files)
{
    for (let i = 0; i < files.length; i++)
    {
        let script = document.createElement('script');
        script.src = files[i];
        document.body.appendChild(script);
    }
}

addToDocument(filePri1);
addToDocument(filePri2);