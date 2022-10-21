let cvs = document.getElementById("canvas");
let ctx = cvs.getContext("2d");

let ComplexNum = class
{
    constructor(a, b) 
    {
        this.a = a;
        this.b = b;
    }

    distanceToPoint(x, y) 
    { // finds the distance to another point on the complex plane
        return Math.hypot(this.a - x, this.b - y);
    }

    add(z) 
    { // add complex number
        return new ComplexNum(z.a + this.a, z.b + this.b);
    }

    multiply(z) 
    { // multiply complex number
        return new ComplexNum(z.a * this.a - z.b * this.b, z.a * this.b + z.b * this.a);
    }
}

// let z = new ComplexNum(0, 0);

const height = cvs.height; // as viewed on screen; x value
const width = cvs.width; // as viewed on screen; y value

// top left and bottom right points are used to make a better zoom algorithm
// both points are in the complex plane
let topA = -2; // complex number representing the top left corner of the screen
let topB = 2; // A + Bi

let bottomA = 2; // complex number representing the bottom right corner of the screen
let bottomB = -2; // A + Bi

const MAX_ITERATIONS = 32; // number of times each point is iterated; determines shading and is a huge part is drawing the set

// let zoomFactor = 1;

// calculate standardImageFactor
// let standardImageFactorX = 300;//(height/2)/5; // 2.3 is somewhat arbitrary; choose 2 + a little space to comfortably show the whole set
// let standardImageFactorY = 300;//(width/2)/5;

// let hShift = 0; // used to "recenter" the image
// let vShift = 0;

function writeToPage() // a function to be called that will redraw the mandelbrot set according to zoom scale and center point
{
    console.log("started writeToPage");

    // start calculating points from the complex plane
    // for loops go thorugh the canvas coordinates
    for (let screenX = 0; screenX < width; screenX++)
    {
        for (let screenY = 0; screenY < height; screenY++)
        {
            // normalized space: [0, 1)
            let normX = screenX/width;
            let normY = screenY/height; 

            // converts from normalized to complex coordinates
            let a = (bottomA - topA) * normX + topA;
            let b = (bottomB - topB) * normY + topB;

            let c = new ComplexNum(a, b);
            var func = c.add(c.multiply(c));

            if (Math.abs(func.a) > 2 || Math.abs(func.b) > 2)
            {
                continue;
            }

            // possibly bounded
            var bounded = true;
            for (var i = 0; i < MAX_ITERATIONS; i++) // determine if the point is bounded or not
            {
                if (func.distanceToPoint(0, 0) > 2) // unbounded by the set
                {
                    ctx.fillStyle = `hsl(${Math.floor(11.25 * i)}, 100%, ${Math.floor(-3.1 * i + 100)}%)`
                    ctx.fillRect(screenX, screenY, 1, 1); // draw point
                    bounded = false;
                    break;
                }
                func = c.add(func.multiply(func));
            }

            if (bounded) // color point black if not bounded
            {
                // rgb_to_hsl(r1, g1, b1); // change color
                ctx.fillStyle = "rgb(0, 0, 0)";
                ctx.fillRect(screenX, screenY, 1, 1); // fill point
            }
        }
    }
    console.log("finished writeToPage");
}

writeToPage(); // draws the image

/*
This part of the code will register any calls by the user to zoom in or out
*/
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
cvs.addEventListener("mousedown", function(click)
{
    // let click = window.event; // register a click from a mouse button

    // left click should zoom in the canvas
    // center of the screen is the average of (topA and bottomA) and (topB and bottomB)
    if (click.button == 0) // left click, will also have to look for where to center
    {
        // recenter

        // get the mouse position
        // where we want the center to be; normalized coordinates
        let normX = click.clientX / width;
        let normY = click.clientY / height;

        // change normalized to imaginary coordinates
        let a = (bottomA - topA) * normX + topA;
        let b = (bottomB - topB) * normY + topB;

        let centerA = (topA + bottomA) / 2;
        let centerB = (topB + bottomB) / 2;

        let shiftA = a - centerA; // distance between a and the centerA
        let shiftB = b - centerB; // distance between b and the centerB

        topA += shiftA;
        bottomA += shiftA;

        topB += shiftB;
        bottomB += shiftB;

        // new center
        centerA += shiftA;
        centerB += shiftB;
        // rescale
        // recenter around origin
        topA -= centerA;
        bottomA -= centerA;

        topB -= centerB;
        bottomB -= centerB;
        // make smaller
        topA /= 2;
        bottomA /= 2;

        topB /= 2;
        bottomB /= 2;
        // move back
        topA += centerA;
        bottomA += centerA;

        topB += centerB;
        bottomB += centerB;

        ctx.clearRect(0, 0, cvs.width, cvs.height); // clear the canvas
        writeToPage(); // redraw set with new zoom factor
    }
    // right click should case the canvas to zoom out
    else if (click.button == 2)
    {
        let centerA = (topA + bottomA) / 2;
        let centerB = (topB + bottomB) / 2;

        topA -= centerA;
        bottomA -= centerA;

        topB -= centerB;
        bottomB -= centerB;
        // make larger
        topA *= 2;
        bottomA *= 2;

        topB *= 2;
        bottomB *= 2;
        // move back
        topA += centerA;
        bottomA += centerA;

        topB += centerB;
        bottomB += centerB;

        ctx.clearRect(0, 0, cvs.width, cvs.height); // clear the page
        writeToPage(); // redraw set with new zoom factor
    }
    // prevents context menu
    cvs.addEventListener("contextmenu", e =>
    {
        e.preventDefault(); // stops context menu from popping up
        return false;
    });

    // do nothing if the mouse click is not a left or right click
});