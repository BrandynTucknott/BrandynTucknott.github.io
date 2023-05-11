const piecesParent = document.getElementById('display-pieces'); // where all the pieces are listed in html document
const pieces = document.getElementsByClassName('piece'); // list of all pieces I want to learn
const toPlayParent = document.getElementById('piece-to-play'); // where the chosen piece will be displayed
const button = document.getElementById('getPiece'); // button to get a piece
const message = document.getElementById('message'); // paragraph element for messages to user

let hasPiece = false;

// return a random child of pieces to play
function getPiece()
{
    return pieces[Math.floor(Math.random() * pieces.length)];
}

button.addEventListener('click', () =>
{
    if (!hasPiece) // a piece has not been selected yet
    {
        let toPlay = getPiece();
        hasPiece = true;
        toPlayParent.appendChild(toPlay);
        // toPlay.getElementsByClassName.backgroundImage = 'radial-gradient(circle, green, black)';
    }
    else // a piece has already been selected
    {
        message.innerHTML = "You need to practice this piece first!";
    }
});