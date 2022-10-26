// make queue
class Node
{
    constructor(val)
    {
        this.val = val; // data type
        this.prev; // both nodes
        this.next;
    }   
}

class Queue
{
    constructor()
    {
        this.head; // both nodes
        this.tail;
        this.size = 0; // integer
    }

    add(val)
    {
        let node = new Node(val);
        if (this.size == 0)
        {
            this.head = node;
            this.tail = node;
            this.size++;
            return;
        }
        node.next = this.tail; // set added node.next to current tail node
        this.tail.prev = node; // set current tail node previous to added node
        this.tail = node; // set new tail node as added node
        this.size++;
    }

    remove()
    {
        let node = this.head;
        if (this.head == this.tail)
        {
            this.size--;
            return node.val;
        }
        this.head = this.head.prev;
        this.size--;

        return node.val;
    }
}

class Square
{
    constructor(x, y)
    {
        this.type = "path"; // path, wall, start, or end
        this.visited = false;
        this.x = x;
        this.y = y;

        this.prevSquare;
    }
}