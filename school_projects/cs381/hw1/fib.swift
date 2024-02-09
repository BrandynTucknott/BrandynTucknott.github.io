// get user input
print("Which fibonacci number would you like to see?")
var userInput = ""

if let s = readLine()
{
    userInput = s
} else {
    print("user input failed") // for debugging
}

// assume valid user input: convert to int
var index = -1
if let i = Int(userInput)
{
    index = i
} else {
    print("bad input") // debugging purposes
}


func fib()
{
    // declare array and start iterative fibonacci process
    var series: [Int] = [1, 1]
    let output_str = "The number you want to see is"

    if (index == 1 || index == 2)
    {
        print(output_str, 1)
        return
    }

    for i in 2..<index
    {
        series.append(-1)
        series[i] = series[i - 1] + series[i - 2]
    }

    print(output_str, series[index - 1])
}

// find and print desired fibonacci number from "main"

fib()