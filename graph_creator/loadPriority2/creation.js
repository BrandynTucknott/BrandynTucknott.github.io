/*
 * This file handles creation of verticies and edges by the users
*/

// creates a vertex
function createVertex()
{
    let vertex = new Vertex(''); // create new vertex 
    verticies[verticies.length] = vertex; // add new vertex to array

    
    // =================== create and add html elements to page and vertex class
    let v = document.createElement('div'); // create html vertex
    let input = document.createElement('input'); // for changing the name of vertex

    v.style = 'border: 1px solid black; border-radius: 50%; width: 50px; height: 50px; justify-content: center; align-items: center';
    input.style = 'border: 1px solid black; border-radius: 1%; width: 40px; height: 15px; font-size: 10px; text-align: center; overflow: visible';

    v.appendChild(input); // put input into html vertex
    creation_box.appendChild(v); // put html vertex onto document
    vertex.tag = v; // save html vertex into vertex class
    // ========================== end of html element stuff

    // updates the mouse position: function called into creating and removing an event listener
    function updatePosition(e)
    {
        x = e.clientX;
        y = e.clientY;

        v.style.top = y - 25;
        v.style.left = x - 25;

        console.log(x, y);
    }

    // create event listener for moving vertex
    v.addEventListener('mousedown', (e) =>
    {
        // do the moving
        console.log('newly created vetex selected');

        document.addEventListener('mousemove', updatePosition(e));
    });

    v.addEventListener('mouseup', () =>
    {
        // stop moving
        console.log('unselected');
        document.removeEventListener('mousemove', updatePosition);
    });
    
    // create event listener for renaming vertex
    v.children[0].addEventListener('change', (e) =>
    {
        console.log('value in vertex changed');
        vertex.value = v.children[0].value;
    });
}