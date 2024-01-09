#include "homepage.cpp"
#include "userinput.cpp"
#include "resolve.cpp"
#include "readCSV.cpp"

#ifndef HEADER_H
#define HEADER_H
#include "header.h"
#endif

int main()
{
    const int NUM_ELEMENTS = 118;
    // Atomic Number = index + 1, Element, Symbol, Atmoic Mass
    std::string* element_names = (std::string*) malloc(sizeof(std::string) * NUM_ELEMENTS);
    std::string* element_symbols = (std::string*) malloc(sizeof(std::string) * NUM_ELEMENTS);
    float* atomic_masses = (float*) malloc(sizeof(float) * NUM_ELEMENTS);

    readCSV(&element_names, &element_symbols, &atomic_masses, NUM_ELEMENTS);

    printHomePage(&element_symbols, NUM_ELEMENTS);
    return 0;
}