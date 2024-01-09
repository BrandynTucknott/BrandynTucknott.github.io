#ifndef HEADER_H
#define HEADER_H
#include "header.h"
#endif

// art from this link:
// https://www.patorjk.com/software/taag/#p=display&f=Doom&t=Chemistry%20Program                 
void printHomePage(std::string** element_symbols, const int NUM_ELEMENTS)
{
    std::cout << " _____ _                    _     _               ______                                    " << std::endl;
    std::cout << "/  __ \\ |                  (_)   | |              | ___ \\                                   " << std::endl;
    std::cout << "| /  \\/ |__   ___ _ __ ___  _ ___| |_ _ __ _   _  | |_/ / __ ___   __ _ _ __ __ _ _ __ ___  " << std::endl;
    std::cout << "| |   | '_ \\ / _ \\ '_ ` _ \\| / __| __| '__| | | | |  __/ '__/ _ \\ / _` | '__/ _` | '_ ` _ \\ " << std::endl;
    std::cout << "| \\__/\\ | | |  __/ | | | | | \\__ \\ |_| |  | |_| | | |  | | | (_) | (_| | | | (_| | | | | | |" << std::endl;
    std::cout << " \\____/_| |_|\\___|_| |_| |_|_|___/\\__|_|   \\__, | \\_|  |_|  \\___/ \\__, |_|  \\__,_|_| |_| |_|" << std::endl;
    std::cout << "                                            __/ |                  __/ |                    " << std::endl;
    std::cout << "                                           |___/                  |___/                     " << std::endl;

    std::string current_elements = "";

    int choice = getUserChoice();
    resolveChoice(&current_elements, choice, element_symbols, NUM_ELEMENTS);
}