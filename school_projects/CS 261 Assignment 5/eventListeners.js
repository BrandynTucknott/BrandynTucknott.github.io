remove.addEventListener("click", function()
{
    removePQ();
    printList();
});

priority.addEventListener("change", function()
{
    if (isNaN(parseInt(priority.value)))
    {
        priority.value = lastInputPriority;
    }

    priority.value = parseInt(priority.value);
});

add.addEventListener("click", function()
{
    // check for correct user input
    if (task.value == "")
    {
        add_error_message.innerHTML = "You must have a task to add";
        return;
    }

    // no input errors
    add_error_message.innerHTML = "";
    insertPQ(task.value, parseInt(priority.value));
    printList();
    task.value = "";
    lastInputPriority = parseInt(priority.value);
});

download.addEventListener("click", function()
{
    downloadList();
});

upload_button.addEventListener("click", function()
{
    loadFile();
});