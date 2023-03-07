const start_button = document.getElementById('start_button');
const stop_button = document.getElementById('stop_button');
const add_button = document.getElementById('add_button');
const remove_button = document.getElementById('remove_button');
const clear_button = document.getElementById('clear_button');
const big_circle = document.getElementById('big_circle');

const display_screen = document.getElementById('display_screen');
const circles = document.getElementById('circles');

const CIRCLE_DIM = 50; // width and height css properties of div to turn into circles
const DISPLAY_SCREEN_DIM = 600; // viewing port display
const DISTANCE_FROM_CENTER = 150; // pixels from center of the display screen

const DISPLAY_SCREEN_LEFT = display_screen.getBoundingClientRect().left;
const DISPLAY_SCREEN_TOP = display_screen.getBoundingClientRect().top;
const DISPLAY_SCREEN_HEIGHT = display_screen.getBoundingClientRect().height;

const RADIUS = 50; // px value; stores the distance added circles are from the center circle

let hasMoved = false; // tracks if the model has moved or not
let interval = 0;
let running = false;

const FPS = 60;
let angular_velocity = 0.5 * Math.PI; // move once around the circle in one second
let rotation_count = 1; // used to easily rotate html elements