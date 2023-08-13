const feetTags = document.getElementsByClassName('foot');
const headTag = document.getElementsByClassName('head')[0];
const bodyTag = document.getElementsByClassName('body')[0];
const spiderHeadBodyTag = document.getElementById('spider-head-body');

const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight;

const positionUpdateTimeInterval = 50; // ms before mouse position is updated
let x = WIDTH / 2;
let y = HEIGHT / 2;
let locked = false;

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

let lastPosVec = [x, y]; // used in determining how to rotate the spider

spiderHeadBodyTag.style.left = `${WIDTH / 2}px`;
spiderHeadBodyTag.style.top = `${HEIGHT / 2}px`;
spiderHeadBodyTag.style.border = `2px solid yellow`;