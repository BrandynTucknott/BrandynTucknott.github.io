// STEP 1: initialize webgl
const canvas = document.getElementById('canvas');
let gl = canvas.getContext('webgl');

if (!gl) {
    console.log('WebGL not supported, falling back on experimental')
    gl = canvas.getContext('experimental-webgl');
}
if (!gl) {
    alert('Your browser does not support WebGL');
} // STEP 1 complete

// set background color
// gl.clearColor(R, G, B, alpha)
gl.clearColor(0.75, 0.85, 0.8, 1.0); // set color of paint
gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); // draws it

const vertexShaderText = 
`precision mediump float;

attribute vec2 vertPosition;
attribute vec3 vertColor;
varying vec3 fragColor;

void main()
{
    fragColor = vertColor;
    gl_Position = vec4(vertPosition, 0.0, 1.0);
}`;

const fragmentShaderText = 
`precision mediump float;

varying vec3 fragColor;

void main()
{
    gl_FragColor = vec4(fragColor, 1.0);
}`;

// create and compile vertex and fragment shaders above
let vertexShader = gl.createShader(gl.VERTEX_SHADER);
let fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

gl.shaderSource(vertexShader, vertexShaderText);
gl.shaderSource(fragmentShader, fragmentShaderText);

gl.compileShader(vertexShader);
if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
    console.error('ERROR compiling vertex shader', gl.getShaderInfoLog(vertexShader));
}
gl.compileShader(fragmentShader);
if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
    console.error('ERROR compiling fragment shader', gl.getShaderInfoLog(fragmentShader));
}

// create programs for the shaders and tell webgl to use these programs together
let program = gl.createProgram();
gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);
gl.linkProgram(program);
if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.log('ERROR in linking program!', gl.getProgramInfoLog(program));
}
gl.validateProgram(program);
if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
    console.log('ERROR in validating program!', gl.getProgramInfoLog(program));
}

// 
// create buffer
//
let triangleVerticies = 
[ // x,y           r,g,b
    0.0, 0.5,       1.0, 1.0, 0.0,
    -0.5, -0.5,     0.7, 0.0, 1.0,
    0.5, -0.5,      0.1, 1.0, 0.6
];

let triangleVertexBufferObject = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexBufferObject);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangleVerticies), gl.STATIC_DRAW); // Float32Array needed bc webgl expects 32bit nums, but js uses 64bit

let positionAttribLocation = gl.getAttribLocation(program, 'vertPosition');
let colorAttribLocation = gl.getAttribLocation(program, 'vertColor');

gl.vertexAttribPointer(
    positionAttribLocation, // Attribute Location
    2, // number of elements per attribute
    gl.FLOAT, // type of elements
    gl.FALSE, // is the data normalized
    5 * Float32Array.BYTES_PER_ELEMENT,// size of an individual vertex
    0 // offset from the beginning of a single vertex to this attribute
);

gl.vertexAttribPointer(
    colorAttribLocation, // Attribute Location
    3, // number of elements per attribute
    gl.FLOAT, // type of elements
    gl.FALSE, // is the data normalized
    5 * Float32Array.BYTES_PER_ELEMENT,// size of an individual vertex
    2 * Float32Array.BYTES_PER_ELEMENT // offset from the beginning of a single vertex to this attribute
);

gl.enableVertexAttribArray(positionAttribLocation); // enable attribute for use
gl.enableVertexAttribArray(colorAttribLocation); // enable attribute for use

gl.useProgram(program);
gl.drawArrays(
    gl.TRIANGLES, // what are we drawing in
    0, // how many verticies should we skip
    3 // how many verticies do we have to draw
);