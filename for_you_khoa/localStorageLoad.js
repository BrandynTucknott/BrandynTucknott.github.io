// numWinners
if (localStorage.getItem('numWinners') != null)
{
    num_winners_input.value = localStorage.getItem('numWinners');
}

// totalPoints
if (localStorage.getItem('totalPoints') != null)
{
    totalPoints = parseInt(localStorage.getItem('totalPoints'));
}

// members
if (localStorage.getItem('members') != null)
{
    const tempArray = structuredClone(JSON.parse(localStorage.getItem('members')));

    for (let i = 0; i < tempArray.length; i++)
    {
        const INDEX = table.children.length - 1;
        addRow(
        tempArray[i].name, // change name value in row
        tempArray[i].points, // change points value in row
        tempArray[i].indexPosition); // change index value in row
    }
}

evaluatePickPercentages();