#include "header.h"

const int INDEX_OFFSET = 33;
const int SIZE = 222;

int main()
{
    // open the file of words
    std::ifstream readFile("words.txt");
    std::string word;

    // 222 = (254 - 33) + 1; this program recognizes ascii 33 - 254 inclusive
    int* num_letters = (int*) malloc(sizeof(int) * SIZE); // stores num of each letter needed

    for (int i = 0; i < SIZE; i++) // set every instance of letters to 0
    {
        num_letters[i] = 0;
    }

    while (readFile >> word) // read every word in the file
    {
        const int LENGTH = word.length();
        int indicies_index = 0;
        int* indicies = (int*) malloc(sizeof(int) * LENGTH);
        int* temp_vals = (int*) malloc(sizeof(int) * LENGTH);

        for (int i = 0; i < LENGTH; i++) // initialize temp array
            temp_vals[i] = 0;

        // for each word, go thorugh each character
        for (int i = 0; i < LENGTH; i++)
        {
            char letter = word[i];
            bool occurred = false;
            // check if that letter has occurred already
            for (int j = 0; j < indicies_index; j++)
            {
                if (indicies[j] == letter - INDEX_OFFSET) // letter has already occurred
                {
                    temp_vals[j]++;
                    occurred = true;
                    break;
                }
            }
            if (!occurred) // if a letter has not occurred, then store it's data
            {
                indicies[indicies_index] = letter - INDEX_OFFSET;
                temp_vals[indicies_index]++;
                indicies_index++;
            }
        } // end of going through each character

        for (int i = 0; i < indicies_index; i++) // compare temp vals to global vals, and keep the max
        {
            if (temp_vals[i] > num_letters[indicies[i]])
            {
                num_letters[indicies[i]] = temp_vals[i];
            }
        }

        free(temp_vals);
        free(indicies);
    }

    // return the maximum amount of each letter needed to form any one of the given words
    std::cout << "Format: letter [num occurences]" << std::endl;

    for (int i = 0; i < SIZE; i++)
    {
        char letter = i + INDEX_OFFSET;
        int occurences = num_letters[i];
        if (occurences > 0)
            std::cout << letter <<"[" << occurences << "]" << std::endl;
    }

    free(num_letters);

    return 0;
}