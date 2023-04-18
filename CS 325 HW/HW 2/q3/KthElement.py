import math
import array

# merge sort algorithm
def mergesort(arr):
    end = len(arr) - 1 # index of last element in arr
    middle = (end) // 2 # index of middle element in arr
    # array of length 1
    if (end == 0):
        return arr
    
    left_half = mergesort(arr[0 : middle + 1])
    right_half = mergesort(arr[middle + 1 : end + 1])
    
    return merge(left_half, right_half)

# given two sorted arrays, combine them into one array and return it
def merge(arr1, arr2):
    i = 0
    j = 0
    # not sure how to initialize an empty array right now, so it is an array filled with 0's for now
    newArr = [0] * (len(arr1) + len(arr2))
    # add the lowest values from arr1 and arr2 in ascending order
    while i < len(arr1) and j < len(arr2):
        if (arr1[i] < arr2[j]):
            newArr[i + j] = arr1[i]
            i += 1
        else:
            newArr[i + j] = arr2[j]
            j += 1
    # there are still elements left to add in arr2, add them all now
    if (i == len(arr1)):
        for j in range(j, len(arr2)):
            newArr[i + j] = arr2[j]
    # there are still elements left to add in arr1, add then all now
    else:
        for i in range(i, len(arr1)):
            newArr[i + j] = arr1[i]

    return newArr

def kthelement(arr1, arr2, k):
    arr = [0] * (len(arr1) + len(arr2))
    for i in range(0, len(arr1)):
        print(i)
        arr[i] = arr1[i]

    for i in range(len(arr1), len(arr1) + len(arr2)):
        print(i)
        arr[i] = arr2[i - len(arr1)]
    # by now arr is the combination of both arr1 and arr2
    arr = mergesort(arr)
    return arr[k - 1] # kth element is at index (k - 1)

# example test case:
ele = kthelement([1, 2, 3, 5, 6], [3, 4, 5, 6, 7], 5)
print("expected 4; got", ele)