const input = document.getElementById("input");
const output = document.getElementById("output");
const slider = document.getElementById("slider");

/*
UNICODE CHARCTERS TO USE:
decimal values from 769 -> 879: 111 characters to use
*/
const LENGTH = 111;
let uniArray = [LENGTH];
let INTENSITY = 20; // 1 - INTENSITY extra characters per character in input

initUniArray(uniArray);