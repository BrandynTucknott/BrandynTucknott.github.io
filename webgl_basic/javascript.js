const row1_input_element = document.getElementById('row1-input');
const column1_input_element = document.getElementById('column1-input');
const row2_input_element = document.getElementById('row2-input');
const column2_input_element = document.getElementById('column2-input');
const product_matrix_description_element = document.getElementById('product-matrix-description');

const matrix_input_box_size = 50;
const matrix1_entries_table = document.getElementById('matrix1-entries');
const matrix2_entries_table = document.getElementById('matrix2-entries');

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

// Matrix 1 rows were changed
row1_input_element.addEventListener('change', () =>
{
    convertToValidInput(row1_input_element);
    rewriteProductMatrix();
});

// Matrix 1 columns were changed
column1_input_element.addEventListener('change', () =>
{
    convertToValidInput(column1_input_element);
    row2_input_element.value = column1_input_element.value;
}); // change row2 on column1 change

// Matrix 2 rows were changed
row2_input_element.addEventListener('change', () =>
{
    convertToValidInput(row2_input_element);
    column1_input_element.value = row2_input_element.value;
}); // change column1 on row2 change

// Matrix 2 columns were changed
column2_input_element.addEventListener('change', () =>
{
    convertToValidInput(column2_input_element);
    rewriteProductMatrix();
});