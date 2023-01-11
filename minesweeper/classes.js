class Square
{
    constructor(y, x)
    {
        this.x = x; // position of the top left corner of the square
        this.y = y;
        this.adjacentMines = 0; // number of mined squares adjacent (including diagonals) to this one
        this.isMined = false; // does this square have a mine on it
        this.isFlagged = false; // has the player flagged this square
        this.isRevealed = false; // has the player revealed this square
    }
};
// the Node + Stack class are used to make revealing easier
class Node
{
    constructor(val)
    {
        this.val = val;
        this.next = null;
        this.prev = null;
    }
}

class Stack
{
    constructor()
    {
        this.top = null;
        this.size = 0;
    }

    pop()
    {
        let node = this.top; // hold top node
        this.top = this.top.prev; // replace it with the one before
        this.size--;
        return node;
    }

    push(val)
    {
        let node = new Node(val)
        node.prev = this.top;
        this.top = node;
        this.size++;
    }

    isEmpty()
    {
        return this.size == 0;
    }
}