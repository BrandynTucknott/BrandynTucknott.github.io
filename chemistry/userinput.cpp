#ifndef HEADER_H
#define HEADER_H
#include "header.h"
#endif

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

// gets a string from the user. Used to determine the elements they wish to operate on
std::string getUserInput()
{
    std::cout << "\nSubstance: " << std::endl;

    std::string input = "";
    // loop to check input here
    return "REPLACE THIS VALUE";
}