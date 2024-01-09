const todo_list = document.getElementById("todo_list");
const remove = document.getElementById("remove");
const task = document.getElementById("task");
const priority = document.getElementById("priority");
const add = document.getElementById("add");
const add_error_message = document.getElementById("add_error_message");
const download = document.getElementById("download");
const file_name = document.getElementById("file_name");
const upload = document.getElementById("upload");
const upload_button = document.getElementById("upload_button");

let pq = [];
let insertIndex = 0;
lastInputPriority = 0;