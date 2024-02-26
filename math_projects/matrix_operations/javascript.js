const row1_input_element = document.getElementById('row1-input');
const column1_input_element = document.getElementById('column1-input');
const row2_input_element = document.getElementById('row2-input');
const column2_input_element = document.getElementById('column2-input');
const product_matrix_description_element = document.getElementById('product-matrix-description');

const matrix_input_box_size = 50;
const matrix1_entries_table = document.getElementById('matrix1-entries');
const matrix2_entries_table = document.getElementById('matrix2-entries');
const product_matrix_entries_table = document.getElementById('product-matrix-entries');

const calculate_button_element = document.getElementById('calculate');

let isCalculating = false;

recreateMatricies();

// take a number in string form and return it's number form
function convertInputTextToNum(input_element)
{
    return parseInt(input_element.value);
}

// return an int >= 1. Floor function applied to decimals. All numbers lower than 1 are set to 1. ALl numbers greater than 20 are set to 20
function convertToValidInput(input_element)
{
    let val = convertInputTextToNum(input_element);
    if (val < 1)
        val = 1;
    if (val > 20)
        val = 20;
    input_element.value = Math.floor(val);
}

// rewrite the dimensions of the resulting matrix
function rewriteProductMatrix()
{
    product_matrix_description_element.innerText = `${row1_input_element.value} x ${column2_input_element.value}`;
}

// delete old matrix and create new matrix
function recreateMatricies()
{
    // Matrix 1
    let numRows = convertInputTextToNum(row1_input_element);
    let numCols = convertInputTextToNum(column1_input_element);

    // delete children
    while (matrix1_entries_table.children.length > 0)
    {
        matrix1_entries_table.removeChild(matrix1_entries_table.children[0]);
    }

    // add children
    for (let r = 0; r < numRows; r++)
    {
        let tr = document.createElement('tr');
        for (let c = 0; c < numCols; c++)
        {
            let td = document.createElement('td');
            let input = document.createElement('input');
            input.type = 'number';
            td.appendChild(input);
            tr.appendChild(td);
        }
        matrix1_entries_table.appendChild(tr);
    }


    // Matrix 2
    numRows = convertInputTextToNum(row2_input_element);
    numCols = convertInputTextToNum(column2_input_element);

    // delete children
    while (matrix2_entries_table.children.length > 0)
    {
        matrix2_entries_table.removeChild(matrix2_entries_table.children[0]);
    }

    // add children
    for (let r = 0; r < numRows; r++)
    {
        let tr = document.createElement('tr');
        for (let c = 0; c < numCols; c++)
        {
            let td = document.createElement('td');
            let input = document.createElement('input');
            input.type = 'number';
            td.appendChild(input);
            tr.appendChild(td);
        }
        matrix2_entries_table.appendChild(tr);
    }

    // product matrix
    numRows = convertInputTextToNum(row1_input_element);
    numCols = convertInputTextToNum(column2_input_element);

    // delete children
    while (product_matrix_entries_table.children.length > 0)
    {
        product_matrix_entries_table.removeChild(product_matrix_entries_table.children[0]);
    }

    // add children
    for (let r = 0; r < numRows; r++)
    {
        let tr = document.createElement('tr');
        for (let c = 0; c < numCols; c++)
        {
            let td = document.createElement('td');
            let input = document.createElement('input');
            input.type = 'number';
            td.appendChild(input);
            tr.appendChild(td);
        }
        product_matrix_entries_table.appendChild(tr);
    }
}




// Matrix 1 rows were changed
row1_input_element.addEventListener('change', () =>
{
    convertToValidInput(row1_input_element);
    rewriteProductMatrix();
    recreateMatricies();
});

// Matrix 1 columns were changed
column1_input_element.addEventListener('change', () =>
{
    convertToValidInput(column1_input_element);
    row2_input_element.value = column1_input_element.value;
    recreateMatricies();
}); // change row2 on column1 change

// Matrix 2 rows were changed
row2_input_element.addEventListener('change', () =>
{
    convertToValidInput(row2_input_element);
    column1_input_element.value = row2_input_element.value;
    recreateMatricies();
}); // change column1 on row2 change

// Matrix 2 columns were changed
column2_input_element.addEventListener('change', () =>
{
    convertToValidInput(column2_input_element);
    rewriteProductMatrix();
    recreateMatricies();
});




// calculate A x B
calculate_button_element.addEventListener('click', () =>
{
    if (isCalculating) // if currently doing a calculation, do nothing
        return;
    isCalculating = true; // remove button functionality to prevent spam

    WebAssembly.Module();
    
    isCalculating = false; // calculation is complete, restore button functionality
});