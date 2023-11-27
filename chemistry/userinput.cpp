#ifndef HEADER_H
#define HEADER_H
#include "header.h"
#endif
void printMatches(std::string str, std::regex reg) // TODO: delete this
{
    std::sregex_iterator currentMatch(str.begin(), str.end(), reg);
    std::sregex_iterator lastMatch;
    
    while (currentMatch != lastMatch)
    {
        std::smatch match = *currentMatch;
        std::cout << match.str() << std::endl;
        currentMatch++;
        std::cout << std::endl;
    }
}

// gets a number from the user. Used to determine the operation they wish to use
int getUserChoice()
{
    std::cout << "1. mass --> moles" << std::endl;
    std::cout << "2. moles --> atoms" << std::endl;
    std::cout << "3. atoms --> moles" << std::endl;
    std::cout << "4. moles --> mass" << std::endl;

    std::string input = "";
    while (true) // until a valid input is given ()
    {
        std::cout << "\nChoice: ";
        
        getline(std::cin, input);

        std::regex r("[1-4]");

        if (regex_match(input, r)) // regex handler
            break;
    }
    

    return stoi(input);
}

// helper function for getUserElements(); checks that the input is valid
bool is_valid_input(std::string input, std::string** element_symbols, const int NUM_ELEMENTS)
{
    // element symbol [1-2 letters: uppercase; uppercase-lowercase] - mandatory
    // subscript [number 1-2 digits] - optional
    /*
    ([A-Z]) :: checks for a capital letter
    ([a-z]?) :: proceeding optional lowercase letter
    (_([1-9]+))? :: optional _[NUMBER] such as _1, _12, _6 proceeding the letter(s)
    */
    std::regex reg("([A-Z])([a-z]?)([1-9]+)?"); // implied subscript
    // we know want to check if all input elements are indeed elements

    // printMatches(input, reg);
    
    std::sregex_iterator currentMatch(input.begin(), input.end(), reg);
    std::sregex_iterator lastMatch;

    while (currentMatch != lastMatch) // iterate through all matches
    {
        std::smatch match = *currentMatch; // current element

        // currentMatch++;

        // currentMatch++;
        for (int i = 0; i < NUM_ELEMENTS; i++) // check all the elements to see if input was valid element
        {
            // create a regex look for element in list of element symbols
            std::string element_symbol = (*element_symbols)[i]; // get element symbol
            std::string element_regex_str = (std::string)"(" + element_symbol + ")([1-9]+)?"; // create a new regex with it
            std::regex element_reg(element_regex_str); // set the regex

            if (regex_match(match.str(), element_reg)) // regex match, no problems
            {
                currentMatch++;
                break; // stop looking to match elements; this element has already been identified
            }

            else if (i == NUM_ELEMENTS - 1)
            {
                return false;
            }
        } // end of element iteration for-loop
    } // end of while loop
    return true;
}

// gets a string from the user. Used to determine the elements they wish to operate on
std::string getUserElements(std::string** element_symbols, const int NUM_ELEMENTS)
{
    std::string input = "";
    // loop to check input here

    while (true)
    {
        std::cout << "\nEnter a Substance: ";
        getline(std::cin, input);

        if (is_valid_input(input, element_symbols, NUM_ELEMENTS))
            break;
    }

    return input;
}