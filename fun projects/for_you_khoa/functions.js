function addRow()
{
    let member = new Member();
    membersArray.push(member);
    member.indexPosition = membersArray.length - 1;
    
    let remove_button_td = document.createElement('td');
    let remove_button = document.createElement('button');
    remove_button.classList.add('remove-button-box');
    remove_button.innerText = 'remove';
    remove_button_td.appendChild(remove_button);

    let name_td = document.createElement('td');
    let name = document.createElement('input');
    name.classList.add('name');
    name.value = '-';
    name_td.appendChild(name);

    let points_td = document.createElement('td');
    let points = document.createElement('input');
    points.classList.add('score-input');
    points.type = 'number';
    points.value = 0;
    points.min = 0;
    points_td.appendChild(points);

    let pickPercentage_td = document.createElement('td');
    pickPercentage_td.classList.add('percent-box');
    pickPercentage_td.innerText = '0%';

    let tr = document.createElement('tr');
    tr.appendChild(remove_button_td);
    tr.appendChild(name_td);
    tr.appendChild(points_td);
    tr.appendChild(pickPercentage_td);

    table.appendChild(tr);

    let initVal = parseInt(points.value);

    points.addEventListener('change', () =>
    {
        let currentVal = parseInt(points.value);
        totalPoints += currentVal - initVal;
        initVal = currentVal; // incase arrows are used to change the val

        evaluatePickPercentages();
        member.points = initVal;
    });

    remove_button.addEventListener('click', () =>
    {
        totalPoints -= initVal;
        table.removeChild(tr);
        evaluatePickPercentages();
        membersArray.splice(member.indexPosition, 1);
        updateHigherIndexMembers(member.indexPosition);
    });

    name.addEventListener('change', () =>
    {
        member.name = name.value;
    });
}

function evaluatePickPercentages()
{
    let points = document.getElementsByClassName('score-input');
    let percents = document.getElementsByClassName('percent-box');

    for (let i = 0; i < points.length; i++)
    {
        if (totalPoints == 0)
        {
            percents[i].innerText = '0%';
            continue;
        }
        chance = 100 * parseInt(points[i].value) / totalPoints; // get a percent
        chance = Math.trunc(chance * 1000) / 1000; // percent to 3 decimal places
        percents[i].innerText = `${chance}%`;
    }
}

function updateHigherIndexMembers(deletedIndex)
{
    for (let i = deletedIndex; i < membersArray.length; i++)
    {
        membersArray[i].indexPosition = i;
    }
}