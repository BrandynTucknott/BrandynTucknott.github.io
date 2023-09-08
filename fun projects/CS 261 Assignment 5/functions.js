// inserts the given value into the priority queue
function insertPQ(value, priority)
{
    let node = new Node(value, priority);

    pq[insertIndex] = node;
    percolateUp(insertIndex);
    insertIndex++;
}

// helper function for insertPQ(...), will put inserted value into it's correct place priority wise
function percolateUp(childIndex)
{
    // child has no parents
    if (childIndex == 0)
        return;
    let parentIndex = Math.floor((childIndex - 1)/2);

    // if the parent is higher priority than child, everything is in the correct location
    if (pq[parentIndex].priority < pq[childIndex].priority)
    {
        return;
    }

    // swap parent and child
    let temp = pq[parentIndex];
    pq[parentIndex] = pq[childIndex];
    pq[childIndex] = temp;

    // continue percolating up
    percolateUp(parentIndex);
}

// remove and its helpers take in more parameters bc they are needed for making the print function easy

// remove the node with the highest priority
function removePQ()
{
    // move most recently added node up and maintain completeness
    insertIndex--;
    pq[0] = pq[insertIndex];
    pq[insertIndex] = null;

    percolateDown(0);
}

// helper function for removePQ(), will move the root node as far down as needed
function percolateDown(index)
{
    let leftChildIndex = 2 * index + 1;
    let rightChildIndex = 2 * index + 2;


    // no left child --> no right child --> no children --> node in correct place
    if (leftChildIndex > insertIndex || pq[leftChildIndex] == null)
        return;

    // no right child
    if (pq[rightChildIndex] == null)
    {
        // check if we want to swap current with left child
        if (pq[leftChildIndex].priority <= pq[index].priority)
        {
            let temp = pq[leftChildIndex];
            pq[leftChildIndex] = pq[index];
            pq[index] = temp;

            percolateDown(leftChildIndex);
        }
        return;
    }
    // there is a right child, find the min value between the two children
    // left child has lowest priority
    if (pq[leftChildIndex].priority < pq[rightChildIndex].priority)
    {
        // check if we want to swap leftChild with current index
        if (pq[leftChildIndex].priority <= pq[index].priority)
        {
            let temp = pq[leftChildIndex];
            pq[leftChildIndex] = pq[index];
            pq[index] = temp;

            percolateDown(leftChildIndex);
        }
        return;
    }

    // right child has equal or lower priority && we want to move it up
    if (pq[rightChildIndex].priority <= pq[index].priority)
    {
        let temp = pq[rightChildIndex];
        pq[rightChildIndex] = pq[index];
        pq[index] = temp;

        percolateDown(rightChildIndex);
    }
}

// prints the to-do list to the page
function printList()
{

    if (insertIndex == 0)
    {
        todo_list.innerHTML = "Empty";
        return;
    }
        
    
    todo_list.innerHTML = "";
    todo_list.replaceChildren();
    let copy = [insertIndex];
    for (let i = 0; i < insertIndex; i++)
        copy[i] = pq[i];
    let insertIndexCopy = insertIndex;

    for (let i = 0; i < insertIndexCopy; i++)
    {
        let element = document.createElement("li");
        element.style.fontSize = "18px";
        element.innerHTML = pq[0].val;
        removePQ();

        todo_list.appendChild(element);
    }

    insertIndex = insertIndexCopy;
    pq = [insertIndex];
    for (let i = 0; i < insertIndex; i++)
        pq[i] = copy[i];
}

function createFile()
{
    if (insertIndex == 0)
        return null;

    let s = JSON.stringify(pq);
    s += insertIndex;
    let array = [s];

    return new File(array, file_name.value, {type: "json"});
}

function downloadList()
{
    let file = createFile();

    if (file == null)
    {
        console.log("there is nothing to do");
        return;
    }

    const link = document.createElement("a");
    const url = URL.createObjectURL(file);

    link.href = url;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
}

async function loadFile()
{
    let file = await upload.files[0].text();
    let queue = JSON.parse(file.substring(0, file.length - 1));
    pq = queue;

    let num = file.substring(file.length - 1);
    insertIndex = parseInt(num);
    printList();
}