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
const dropdown_button = document.getElementById("drop_button");
const dropdown_content = document.getElementById("dropdown_content");
const bfs = document.getElementById("bfs");
const dfs = document.getElementById("dfs");
const drunkWalk = document.getElementById("drunkards_walk");
const cancel = document.getElementById("cancel");

initCanvas(canvas);

const width = canvas.width;
const height = canvas.height;

const rows = 20; // number of rows
const cols = 48; // number of cols

const BOX_DIM = 30; // square length: in pixels
const DIVIDER_HEIGHT = 2; // divider thickness: in pixels

const start_color = "rgb(117, 255, 251)";
const end_color = "rgb(152, 29, 151)";

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
let algorithm = "bfs";
context.fillStyle = "rgb(0, 0, 0)";

initMaze();
let maze = initSquares();

let menuOpen = false;