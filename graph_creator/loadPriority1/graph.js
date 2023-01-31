/*
 * This file contains the implementation of the functional side of graphs (and only graphs).
*/


// TODO:
//  design a method that allows for easy adding and removing of weights

class Vertex
{
    constructor(v)
    {
        // node value (often a name)
        this.value = v;

        // array of all edges going into this node
        this.in = [];

        // array of all edges going out of this node
        this.out = [];

        // html tag
        this.tag;

        // sum of all weights going into the vertex
        this.inWeight = 0;

        // sum of all weights coming from the vertex
        this.outWeight = 0;
    }
}

// seperate Edge class?

class Edge
{
    constructor(a, b, w)
    {
        this.start = a; // starts at this vertex
        this.end = b;   // ends at this vertex
        this.weight = w; // weight of the edge
        this.tag; // html tag
    }
}