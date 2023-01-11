const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
const restart = document.getElementById('restart');

const background_color = "rgb(210, 210, 210)";
const top_square_color = "white";
const bottom_square_color = "rgb(180, 180, 180)";

// 1 = blue
const oneAdjacentMine = "blue";
// 2 = green
const twoAdjacentMine = "green";
// 3 = red
const threeAdjacentMine = "red";
// 4 = navy blue
const fourAdjacentMine = "rgb(32, 42, 68)";
// 5 = maroon
const fiveAdjacentMine = "maroon";
// 6 = teal
const sixAdjacentMine = "teal";
// 7 = black
const sevenAdjacentMine = "black";
// 8 = gray
const eightAdjacentMine = "gray";

const width = 720;
const height = 720;

const board_size = 30;
const square_size = width / board_size;

let numMines = 150;
let placedFlags = 0;

let gameInProgress = true;