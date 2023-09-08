num_winners_input.addEventListener('change', () =>
{
    
});

pick_winners_button.addEventListener('click', () =>
{
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
    totalPoints = 0;
    while (table.children.length > 1)
    {
        table.removeChild(table.children[1]);
    }
    num_winners_input.value = 3;
    membersArray = [];
});

add_row_button.addEventListener('click', () =>
{
    addRow();
});