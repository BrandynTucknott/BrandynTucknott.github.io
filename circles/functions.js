// returns [x, y] of the center of the circle. Assumes input tag is a circle(div html)
function getCenterPosition(div)
{
    return [div.left + CIRCLE_DIM / 2, div.right + CIRCLE_DIM / 2];
}

// changes the circle positions after a circle is added
// NOTE: MATH IN THE CARTESIAN PLANE IS FLIPPED, i.e. cos(x) corresponds to the screen y-axis bc the orientation is flipped during display
function editCircles()
{
    // if no circles exist, do nothing
    if (circles.children.length == 0)
        return;

    // if circles have not moved
    if (!hasMoved)
    {
        let center = DISPLAY_SCREEN_DIM / 2; // display screen is a square

        // putting an object at these coords will put them in the center of big circle
        let default_left_shift = DISPLAY_SCREEN_LEFT + center - (CIRCLE_DIM / 2);
        let default_top_shift = DISPLAY_SCREEN_TOP + center - (CIRCLE_DIM / 2);

        // change the position of the rest of the circles
        for (let i = 0; i < circles.children.length; i++)
        {
            // find the radians that should be in between all circles
            let radians = 2 * Math.PI / circles.children.length;
            let radius = RADIUS + big_circle.getBoundingClientRect().width / 2; // radius to move circles around

            // -1 so that they will move in the correct direction from the user POV (i.e. +shiftTop = +y = going down the screen)
            let shiftTop = -radius * Math.cos(i * radians); // how many pixels to shift circle left (relative to "origin")
            let shiftLeft = -radius * Math.sin(i * radians); // how many pixels to shift circle right (relative to "origin")

            // move the smaller circles from the center of the big circle into a larger circle with r = radius and equidistant from each other
            circles.children[i].style.left = `${default_left_shift + shiftLeft}px`;
            circles.children[i].style.top = `${default_top_shift + shiftTop}px`;
        }
    }

    // if circles have moved
    if (hasMoved)
    {

    }
}

// returns the html tag for a circle
function createCircle()
{
    let circle = document.createElement('div');
    circle.style = `border: 3px solid white; 
                    border-radius: ${CIRCLE_DIM}px; 
                    width: ${CIRCLE_DIM}px; 
                    height: ${CIRCLE_DIM}px;
                    position: absolute`;

    return circle;
}

// removes a circle being displayed on the page
function removeCircle()
{
    // remove any child, they are all the same
    if (circles.children.length != 0)
        circles.removeChild(circles.children[0]);

    if (circles.children.length == 0)
        hasMoved = false;
}

// removes all circles
function removeAllCircles()
{
    while(circles.children.length > 0)
        removeCircle();

    hasMoved = false;
}

// moves the circles by given radians around big circle
function moveCircles(radians)
{
    circles.style.transform = `rotate(${rotation_count * radians}rad)`;
    rotation_count++;
}