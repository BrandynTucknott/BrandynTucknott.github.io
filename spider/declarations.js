const feetTags = document.getElementsByClassName('foot');
const headTag = document.getElementsByClassName('head')[0];
const bodyTag = document.getElementsByClassName('body')[0];
const spiderHeadBodyTag = document.getElementById('spider-head-body');

const positionUpdateTimeInterval = 10; // ms before mouse position is updated
let x = -1; // values to let me know if x,y were untouched
let y = -1;
let locked = true;

let txtFile = new XMLHttpRequest();
let lines;
txtFile.open("GET", "style.css", false);
txtFile.onreadystatechange = function() 
{
  if (txtFile.readyState === 4) // Makes sure the document is ready to parse.
  {
    if (txtFile.status === 200) // Makes sure it's found the file.
    {
    //   allText = txtFile.responseText; 
      lines = txtFile.responseText.split("\n"); // Will separate each line into an array
    }
  }
}
txtFile.send(null);

function findNumberInCssLine(string)
{
    let re = /(\d+)/;
    let reaction = re.exec(string);
    return parseInt(reaction[0]);
}

const feetTagLen = findNumberInCssLine(lines[3]);
const headTagLen = findNumberInCssLine(lines[4]);
const bodyTagLen = findNumberInCssLine(lines[5]);

const spiderHeadBodyTagHeight = headTagLen + bodyTagLen;
const spiderHeadBodyTagWidth = bodyTagLen;

let currentVec = [x, y]; // used in determining how to rotate the spider