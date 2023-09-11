const num_winners_input = document.getElementById('pick-num-winners');
const pick_winners_button = document.getElementById('pick-winners');
const clear_button = document.getElementById('clear');

const winners_list = document.getElementById('winners-list');

const table = document.getElementById('table');
const add_row_button = document.getElementById('add-row-button');

let totalPoints = 0;
let membersArray = [] // array of all members in the table

/*
LOCAL STORAGE FORMAT

'numWinners'
'totalPoints'
'members'

*/

class Member
{
    constructor()
    {
        let name = '-';
        let indexPosition = -1;
        let points = 0;
    }
}