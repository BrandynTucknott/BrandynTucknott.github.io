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

    v.style = 'border: 1px solid white; border-radius: 50%; width: 50px; height: 50px; justify-content: center; align-items: center; position: static; z-index: 999999';
    input.style = 'color: white; background-color: black; border: 1px solid white; border-radius: 1%; width: 40px; height: 15px; font-size: 10px; text-align: center; overflow: visible; z-index: 999999';

    v.appendChild(input); // put input into html vertex
    creation_box.appendChild(v); // put html vertex onto document
    vertex.tag = v; // save html vertex into vertex class
    // ========================== end of html element stuff

    // helper function for resolveMouseDown: changes the location on the page of the vertex
    function updatePosition(e)
    {
        if (v.style.position == 'static')
        {
            creation_box.removeChild(v);
            document.body.appendChild(v);
            v.style.position = 'absolute';
        }

        x = e.clientX;
        y = e.clientY;

        // do not move the vertex off screen
        if (y >= 25)
            v.style.top = `${y - 25}px`; // used because it relates positively with y
        if (x >= 25)
            v.style.left = `${x - 25}px`; // used because it relates positvely with x
    }

    // helper function for resolveMouseDown: adds a directed edge from starting edge to ending edge
    function prepDirectedEdgeAdd()
    {
        v.style.border = '3px solid blue';
        sourceVertex = vertex; // store the information for resolution later
    }

    // helper function for adding a directed edge called in mouseup event listener
    function addDirectedEdge()
    {
        // the head and tail of the arrow go into the arrow_box, forming a full arrow, and allowing easier rotation of the arrow
        // the arrow_box goes behind the edge_input, allowing for an easy experience in changing the edge weight (inside the tag element)
        // create all necessary html tags
        let tag = document.createElement('div'); // stores the arrow and input box
        let edge_input = document.createElement('input'); // allows the weight of the edge to be changed
        let arrow_box = document.createElement('div'); // stores the arrow
        let arrow_tail = document.createElement('div'); // tail of the arrow
        let arrow_head = document.createElement('div'); // head of the arrow

        // source vertex coords
        let x1 = parseFloat(sourceVertex.tag.style.left) + 25;
        let y1 = parseFloat(sourceVertex.tag.style.top) + 25;

        // ending vertex coords
        let x2 = parseFloat(v.style.left) + 25;
        let y2 = parseFloat(v.style.top) + 25;

        let arrow_head_length = 14 * Math.sqrt(3);
        let tail_length = Math.sqrt((x2 - x1)**2 + (y2 - y1)**2) - arrow_head_length - 50;

        // rotation angle
        // let theta = Math.atan2(y2 - y1, x2 - x1);

        // create the arrow pieces
        tag.style = `position: absolute;
                    left: ${x1}px;
                    top: ${y1 - 20}px;
                    transform-origin: 0px 15px; 
                    transform: rotate(${Math.atan2(y2 - y1, x2 - x1)}rad)`;
        edge_input.style = `z-index: 0; 
                            color: white; 
                            background-color: black; 
                            width: 40px;
                            height: 30px;
                            transform: rotate(${-Math.atan2(y2 - y1, x2 - x1)}rad);
                            type: number`;
        arrow_box.style = `flex-flow: row; 
                            z-index: -10000`;
        arrow_tail.style = `border: 11px solid gray; 
                            width: ${tail_length}px; 
                            height: 0px; 
                            margin-top: 9px;
                            display: flex;
                            justify-content: center;
                            align-items: center`;
        arrow_head.style = `width: 0px; 
                            height: 0px; 
                            border-left: 30px solid gray; 
                            border-top: 20px solid transparent; 
                            border-bottom: 20px solid transparent`;

        // improve user UI when editing edge weights
        // edge_input.addEventListener()
        // {

        // }

        // listen for chanegs in the connected vertex position and change accordindly

        

        // connect the arrow pieces together
        arrow_box.appendChild(arrow_tail);
        arrow_box.appendChild(arrow_head);
        tag.appendChild(arrow_box);
        arrow_tail.appendChild(edge_input);

        // add edge to page (visual html side)
        document.body.appendChild(tag);

        // create functional edge
        let edge = new Edge(sourceVertex, v, 0); // create edge
        edge.tag = tag; // store html reference
        edges[edges.length] = edge; // store it in general edges
        sourceVertex.out[sourceVertex.out.length] = edge; // store where its coming from
        vertex.in[vertex.in.length] = edge; // store where its going

        // unhighlight source vertex
        sourceVertex.tag.style.border = '1px solid white';
    }

    // detects if the user clicks the vertex
    v.addEventListener('mousedown', (e) =>
    {
        // left click
        if (e.button == 0)
            document.addEventListener('mousemove', updatePosition);

        // right click
        if (e.button == 2)
            prepDirectedEdgeAdd();
    });

    // detects if the user is done with the vertex
    v.addEventListener('mouseup', (e) =>
    {
        document.removeEventListener('mousemove', updatePosition);

        if (e.button == 2 && sourceVertex != null) // this vertex was the destination of a directed edge creation
            addDirectedEdge();

        sourceVertex = null; // prevents creating a vertex from a previous (invalid) source to a target vertex
    });

    // clears the source vertex if the user did not create a directed edge to a valid point
    document.addEventListener('mouseup', () =>
    {
        if (sourceVertex != null)
        {
            sourceVertex.tag.style.border = '1px solid white';
            sourceVertex = null;
        }
    });
    
    // create event listener for renaming vertex
    v.children[0].addEventListener('change', () =>
    {
        vertex.value = v.children[0].value;
    });
}