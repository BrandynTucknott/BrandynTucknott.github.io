// returns a random norm vector (array [x, y])
function generateRandomNormVector()
{
    // generate a random x value [0, 1]
    let x = Math.random();
    let isNegative = Math.random();
    if (isNegative < 0.5) // turn x negative
        x *= -1;

    // generate y
    let y = Math.sqrt(1 - x**2);
    isNegative = Math.random();
    if (isNegative < 0.5) // turn y negative
        y *= -1;

    return [x, y];
}

function initializeProgram()
{
    // create particles equal to NUM_PARTICLES
    // put them on the screen
    // create their random norm vectors
}