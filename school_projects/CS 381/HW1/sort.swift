func swap(arr: inout [Int], i: Int, j: Int)
{
    let temp = arr[i]
    arr[i] = arr[j]
    arr[j] = temp
}

func sortInts(arr: inout [Int])
{
    if (arr.count == 1) // nothing to sort
        {return}
    
    for i in 0..<arr.count
    {
        for j in (i + 1)..<arr.count
        {
            if (arr[j] <= arr[i])
            {
                swap(arr: &arr, i: i, j: j)
            }
        }
    }
}

// define an array here
var arr = [45, 75, 27, 829, 43, 75, 547, 636, 356, 6, 265]
print("unsorted array:",arr)

// sort
sortInts(arr: &arr)
print("sorted array:",arr)