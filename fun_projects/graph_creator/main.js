// adds a new vertex to the screen with no value
add_vertex.addEventListener('click', () => 
{
    createVertex();
});

// adds a new directed edge to the screen with no weight
add_dir_edge.addEventListener('click', () =>
{
    console.log('adding a directed edge');
});

// adds a new undirected edge to the screen with no weight
undirected_edge.addEventListener('click', () =>
{
    console.log('adding an undirected edge');
});

// stop the context menu from appearing
document.addEventListener('contextmenu', (e) =>
{
    e.preventDefault();
});