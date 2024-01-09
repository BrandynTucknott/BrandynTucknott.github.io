const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
const solve = document.getElementById("solve"); // solve => wall are buttons
const clear = document.getElementById("clear");
const start = document.getElementById("start");
const end = document.getElementById("end");
const wall = document.getElementById("wall");
const erase = document.getElementById("erase");
const slider = document.getElementById("slider");
const slider_box = document.getElementById("slider_box");
const reset = document.getElementById("reset");

const width = canvas.width;
const height = canvas.height;
const BOX_DIM = 30; // square length: in pixels
const DIVIDER_HEIGHT = 2; // divider thickness: in pixels

const rows = 20; // number of rows
const cols = 20; // number of cols

const start_color = "rgb(99, 102, 106)";
const end_color = "rgb(152, 29, 151)";
const queue_color = "rgb(0, 100, 190)";

let interval; // declared outside to allow clearMaze button to stop the maze process
let SPEED = slider.value; // ms per update
let mazeCopy; // will be used to save maze state
let isComplete = false; // maze is complete

const MAX_SPEED = parseInt(slider.max);
const MIN_SPEED = parseInt(slider.min);

let isSolving = false;
let hasStart = false;
let hasEnd = false;
let type = "wall";
context.fillStyle = "rgb(0, 0, 0)";

initMaze();

// initialize squares
let maze = new Array(rows);
for (let i = 0; i < rows; i++)
{
    maze[i] = new Array(cols);
    for (let j = 0; j < cols; j++)
    {
        let square = new Square(i, j);
        maze[i][j] = square;
    }
}