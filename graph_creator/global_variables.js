/*
 * FILES TO ADD ======================
*/
// A lower file priority number means it is higher on the priority list (i.e. files of priority 1 should be added before files of priority 4).
//      Files of the same priority can be added in any order

let filePri1 = ['loadPriority1/graph.js']; // all files of priority 1
let filePri2 = ['loadPriority2/creation.js']; // all files of priority 2

// constants
const add_vertex = document.getElementById('add_vertex');
const add_dir_edge = document.getElementById('add_dir_edge');
const undirected_edge = document.getElementById('undirected_edge');

const creation_box = document.getElementById('creation_box');


/*
 * This section contains lists of variables added by the user
*/
let verticies = []; // list of verticies

let x = 0; // mouse x position
let y = 0; // mouse y position