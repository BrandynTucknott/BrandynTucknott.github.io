#ifndef HEADER_H
#define HEADER_H
#include "header.h"
#endif

void readCSV(std::string** element_names, std::string** element_symbols, float** atomic_masses, const int NUM_ELEMENTS)
{
    std::ifstream readFile("elements.csv");
    std::string input = "";

    for (int i = 0; i < NUM_ELEMENTS; i++)
    {
        getline(readFile, input, ','); // get element name
        (*element_names)[i] = input;

        getline(readFile, input, ','); // get element symbol
        (*element_symbols)[i] = input;

        getline(readFile, input); // get atomic mass
        (*atomic_masses)[i] = std::stof(input);
    }

    readFile.close();
}