#include <iostream>
#include <vector>
#include <iterator>
#include <stdlib.h>
#include <string.h>

// lower and upper are indicies for lowest index and highest index in nums
std::vector<int> merge_helper(std::vector<int> nums) {
    // base case of 1 element
    if (nums.size() == 1) {
        return nums;
    }

    // sort left half
    // sort right half
    const int mid = nums.size() / 2;
    std::vector<int> lower(mid); // ======================== POSSIBLE HEAP CORRUPTION CAUSE HERE ================================
    std::vector<int> upper(nums.size() - mid);

    for (int i = 0; i < mid; i++)
        lower[i] = nums[i];
    for (int i = mid; i < nums.size(); i++)
        upper[i - mid] = nums[i];

    lower = merge_helper(lower);
    upper = merge_helper(upper);

    // merge sorted halves
    int i = 0; // lower index
    int j = 0; // upper index
    std::vector<int> sorted(nums.size());
    while (i + j < nums.size()) {
        // lower all gone
        if (i >= mid) {
            sorted[i + j] = upper[j];
            j++;
        }
        // upper all gone
        else if (j >= nums.size() - mid) {
            sorted[i + j] = lower[i];
            i++;
        }
        // both have elements
        else if (lower[i] <= upper[j]) {
            sorted[i + j] = lower[i];
            i++;
        }
        else {
            sorted[i + j] = upper[j];
            j++;
        }
        
    }
    // return merged array
    return sorted;
} // end of merge_helper

std::vector<int> mergeSort(std::vector<int> nums) {
    return merge_helper(nums);
}

class Solution {
public:
std::vector<int> twoSum(std::vector<int>& nums, int target) {
    // merge sort
    std::vector<int> sorted_array = mergeSort(nums);
    // double "pointer" method to narrow in on indicies 
    // might have to reset pointer to lower num after moving upper one down
    int lower = 0;
    int upper = nums.size() - 1;
    while (lower < nums.size() && upper > 0) {
        if (sorted_array[lower] + sorted_array[upper] == target) {
            return (std::vector<int>) {lower, upper};
        }
        else if (sorted_array[lower] + sorted_array[upper] < target) {
            lower++;
            continue;
        }

        else if (sorted_array[lower] + sorted_array[upper] > target) {
            upper--;
            // lower = 0;
            continue;
        }
    }
    return (std::vector<int>) {-1}; // this line should never be reached
}   
};


int main() {
    std::vector<int> vec = {4, 3, 2, 7, 5, 6, 9, 1, 8, 10};
    std::vector<int>::iterator it;

    printf("before sort:\n");
    for (it = vec.begin(); it != vec.end(); it++) {
        printf("%d ", *it);
    }
    printf("\n");

    Solution sol = Solution();

    vec = mergeSort(vec);

    printf("after sort:\n");
    for (it = vec.begin(); it != vec.end(); it++) {
        printf("%d ", *it);
    }
    printf("\n");

    return 0;
}