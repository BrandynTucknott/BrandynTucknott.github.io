#ifndef HEADER_H
#define HEADER_H
#include "header.h"
#endif

void resolveChoice(std::string* current_value, int choice)
{
    // not currently working with a value
    if (*current_value == "")
        *current_value = getUserInput();
}