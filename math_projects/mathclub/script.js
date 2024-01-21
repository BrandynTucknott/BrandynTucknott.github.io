function roll()
{
    return Math.floor(Math.random() * 6) + 1
}

// roll 3 times, keep the sum
const NUM_ROLLS = 3
const TARGET = 3
const NUM_TESTS = 10000

let num_success = 0

for (let j = 0; j < NUM_TESTS; j++)
{
    let sum = 0;
    for (let i = 0; i < NUM_ROLLS; i++)
    {
        sum += roll()
        if (sum == TARGET)
        {
            // console.log('HIT TARGET')
            num_success++;
            break
        }
        if (sum > TARGET)
            break;
    }
}

console.log(num_success / NUM_TESTS)