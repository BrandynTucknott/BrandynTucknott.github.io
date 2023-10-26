const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
const button = document.getElementById("button");
const clear = document.getElementById('clear');
const answerBox = document.getElementById("output");

// makes the whole canvas dependent on the box_dim
const box_dim = 20; // dimension (px) of a single box in the grid
const width = box_dim * 28;
const height = width;
canvas.width = width - 1; // easiest fix to far right and bottom being extended out by 1px
canvas.height = height - 1;

const canvasBoundingBox = canvas.getBoundingClientRect();

// bool array representing each grid and wether it is "filled" or not; initializes everything to false
let grid = [28][28] = Array.from({length: 28}, () => Array.from({length: 28}, () => new Square()));

let previousSquare = null; // last square the cursor was held down over