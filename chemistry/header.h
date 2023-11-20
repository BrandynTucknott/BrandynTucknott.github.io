#include <stdlib.h>
#include <fstream>
#include <string>
#include <iostream>
#include <sstream>
#include <regex>

// main

// homepage
void printHomePage();

// user input
int getUserChoice();
std::string getUserInput();

// resolve
void resolveChoice(std::string*, int);

// read CSV
void readCSV(std::string**, std::string**, float**, const int);