const structureTag = document.getElementById('structure');
const purposeTag = document.getElementById('purpose');
const locationTag = document.getElementById('location');

// arrays contatining the contents of the txt files
let structures = readTextFile('structures.txt');
let purposes = readTextFile('purposes.txt');
let locations = readTextFile('locations.txt');