#include <stdlib.h>
#include <fstream>
#include <string>
#include <iostream>
#include <sstream>
#include <regex>

// main

// homepage
void printHomePage(std::string**, const int);

// user input
int getUserChoice();
std::string getUserElements(std::string**, const int);
bool is_valid_input(std::string, std::string**, const int);

// resolve
void resolveChoice(std::string*, int, std::string**, const int);

// read CSV
void readCSV(std::string**, std::string**, float**, const int);