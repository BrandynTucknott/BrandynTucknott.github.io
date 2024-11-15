num_winners_input.addEventListener('change', () =>
{
    localStorage.setItem('numWinners', num_winners_input.value);
});

pick_winners_button.addEventListener('click', () =>
{
    // table.length >= 1 bc 1st row (child) is the header row
    if (table.children.length == 1)
    {
        return;
    }
    winners_list.style.display = 'block';
    // erase current winners
    while (winners_list.children.length > 0)
    {
        winners_list.removeChild(winners_list.children[0]);
    }

    // copy to freely remove members from
    let membersArrayCopy = structuredClone(membersArray);
    let totalPointsCopy = totalPoints;
    const numWinners = parseInt(num_winners_input.value);

    // weighted random winners
    function pickRandomWeightedWinner()
    {
        let randNum = Math.random() * (totalPointsCopy);
        let currentUpperBound = 0;

        for (let i = 0; i < membersArrayCopy.length; i++)
        {
            currentUpperBound += membersArrayCopy[i].points;
            if (randNum <= currentUpperBound)
            {
                return i;
            }
        }
    }

    for (let i = 0; i < numWinners; i++) // go through and pick winners one by one without repeats
    {
        if (membersArrayCopy.length == 1) // only one possible pick
        {
            let li = document.createElement('li');
            winners_list.appendChild(li);
            li.innerText = membersArrayCopy[0].name;
            return;
        }
        // pick a random winner
        let winnersIndex = pickRandomWeightedWinner();

        // attach winner to winners_list
        let li = document.createElement('li');
        winners_list.appendChild(li);
        li.innerText = membersArrayCopy[winnersIndex].name;
        
        // remove winner from possible winners
        totalPointsCopy -= membersArrayCopy[winnersIndex].points;
        membersArrayCopy.splice(winnersIndex, 1);
    }
}); // end of picking winners event handler

clear_button.addEventListener('click', () =>
{
    localStorage.clear(); // clear memory
    totalPoints = 0;
    while (table.children.length > 1) // remove everything except the header row
    {
        table.removeChild(table.children[1]);
    }
    num_winners_input.value = 3;
    membersArray = [];

    while (winners_list.children.length > 0)
    {
        winners_list.removeChild(winners_list.children[0]);
    }
});

add_row_button.addEventListener('click', () =>
{
    addRow('-', 0, membersArray.length - 1);
});