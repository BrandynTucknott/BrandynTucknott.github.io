#define _GNU_SOURCE // for 'strcasestr' function
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <stdbool.h>

/* struct for movie information */
struct movie
{
    char* title;
    int year;
    char* languages;
    float rating;
    struct movie* next;
};

// function prototypes
struct movie* createMovie(char*);
struct movie* processFile(char*, int*);
void printMovie(struct movie*);
void printMovieList(struct movie*);
void printMainMenu();
void clearInputBuffer();
int getUserIntInput(const char*);
void resolveOption1(struct movie*);
int containsMovieFromYear(struct movie**, const int, const int);
void resolveOption2(struct movie*);
void toLowerCase(char*);
void resolveOption3(struct movie*);

/* Parse the current line which is space delimited and create a
*  movie struct with the data in this line
*/
struct movie* createMovie(char *currLine)
{
    struct movie* currMovie = malloc(sizeof(struct movie));

    // For use with strtok_r
    char *saveptr;

    // The first token is the ONID
    char* token = strtok_r(currLine, ",", &saveptr);
    currMovie->title = calloc(strlen(token) + 1, sizeof(char));
    strcpy(currMovie->title, token);

    // The next token is the lastName
    token = strtok_r(NULL, ",", &saveptr);
    currMovie->year = atoi(token);

    // The next token is the firstName
    token = strtok_r(NULL, ",", &saveptr);
    currMovie->languages = calloc(strlen(token) + 1, sizeof(char));
    strcpy(currMovie->languages, token);

    // The last token is the major
    token = strtok_r(NULL, "\n", &saveptr);
    currMovie->rating = atof(token);

    // Set the next node to NULL in the newly created movie entry
    currMovie->next = NULL;

    return currMovie;
}

/*
* Return a linked list of movies by parsing data from
* each line of the specified file.
*/
struct movie* processFile(char* filePath, int* numMovies)
{
    // Open the specified file for reading only
    FILE* movieFile = fopen(filePath, "r");

    char* currLine = NULL;
    size_t len = 0;
    ssize_t nread;
    char* token;

    // skip the first line of the file (headers line)
    nread = getline(&currLine, &len, movieFile);

    // The head of the linked list
    struct movie* head = NULL;
    // The tail of the linked list
    struct movie* tail = NULL;

    // Read the file line by line
    while ((nread = getline(&currLine, &len, movieFile)) != -1)
    {
        // Get a new movie node corresponding to the current line
        struct movie *newNode = createMovie(currLine);
        (*numMovies)++;

        // Is this the first node in the linked list?
        if (head == NULL)
        {
            // This is the first node in the linked link
            // Set the head and the tail to this node
            head = newNode;
            tail = newNode;
        }
        else
        {
            // This is not the first node.
            // Add this node to the list and advance the tail
            tail->next = newNode;
            tail = newNode;
        }
    }
    free(currLine);
    fclose(movieFile);
    return head;
}

/*
* Print data for the given movie
*/
void printMovie(struct movie* amovie)
{
  printf("%s, %d %s, %.1f\n", 
        amovie->title,
        amovie->year,
        amovie->languages,
        amovie->rating);
}
/*
* Print the linked list of movie
*/
void printMovieList(struct movie* list)
{
    while (list != NULL)
    {
        printMovie(list);
        list = list->next;
    }
}

/*
* Print the main menu for the user
*/
void printMainMenu()
{
    printf("Only the first word will be processed (everything after a space will be disregarded)\n");
    printf("1. Show movies released in the specified year\n");
    printf("2. Show highest rated movie for each year\n");
    printf("3. Show the title and year of release of all movies in a specified language\n");
    printf("4. Exit Program\n");
}

// clears the input stream
void clearInputBuffer()
{
    while (getchar() != '\n');
}

/*
* gets an integer input from the user
*/
int getUserIntInput(const char* prompt)
{
    int input;
    printf("%s", prompt);
    scanf("%d", &input);
    clearInputBuffer();
    return input;
}

// show movies released in specified year
void resolveOption1(struct movie* list)
{
    // get year from user
    // assume user will enter a year between 1900 and 2021 (given by assignment description)
    bool hasDataFromYear = false;
    int year = getUserIntInput("Enter the year for which you want to see movies: ");

    // go through every movie in the list, print if it was released in given year
    struct movie* currMovie = list;
    while (currMovie != NULL)
    {
        if (currMovie->year == year)
        {
            if (!hasDataFromYear)
                hasDataFromYear = true;
            printf("%s\n", currMovie->title);
        }
        currMovie = currMovie->next;
    }
    if (!hasDataFromYear)
        printf("No data about movies released in the year %d\n", year);
    printf("\n"); // formatting new line
}

/*
* helper function for resolveOption2()
* returns index of movie from year if array contains such a movie
* returns -1 otherwise
*/
int containsMovieFromYear(struct movie** movies, const int SIZE, const int targetYear)
{
    for (int i = 0; i < SIZE; i++)
    {
        struct movie* currMovie = movies[i];
        if (currMovie->year == targetYear)
            return i;
    }

    return -1;
}

// show highest rated movies for each year
void resolveOption2(struct movie* list)
{
    struct movie* currMovie = list;
    int SIZE = 100;
    int numElements = 0;

    struct movie** highestRatings = malloc(sizeof(struct movie) * SIZE);

    // find all highest scores per year and "save" the movie
    while (currMovie != NULL)
    {
        // check for resizing
        if (numElements == SIZE)
        {
            // resize the array
            SIZE *= 2;
            currMovie = realloc(currMovie, sizeof(struct movie) * SIZE);
        }

        // check if the current movie has a higher rating than any movie in array (of same year)
        int movieInArrayIndex = containsMovieFromYear(highestRatings, numElements, currMovie->year);
        switch (movieInArrayIndex)
        {
            case -1: // the list does not contain a movie from the year of the current movies year
                highestRatings[numElements] = currMovie;
                numElements++;
                break;
            default: // compare movie scores and keep the highest one
                struct movie* movieInList = highestRatings[movieInArrayIndex];
                if (currMovie->rating > movieInList->rating) {
                    highestRatings[movieInArrayIndex] = currMovie;
                }
        }
        currMovie = currMovie->next;
    } // end of movie iteration while loop

    // print all the movies with the highest scores
    for (int i = 0; i < numElements; i++)
    {
        struct movie* cmovie = highestRatings[i];
        printf("%d %.1f %s\n", cmovie->year, cmovie->rating, cmovie->title);
    }

    free(highestRatings); // do not free each individual element, it will erase the original array (break the program)

    printf("\n"); // formatting new line
}

// helper function for option3: turns an input string to all lowercase
void toLowerCase(char* str)
{
    int i = 0; // index
    while (str[i] != 0) // while the string has not ended
    {
        if (str[i] >= 65 && str[i] <= 90)
            str[i] += 32;
        i++;
    }
}

// show movies + year of release for a specified language
void resolveOption3(struct movie* list)
{
    // get language from user
    bool hasDataOnLanguage = false;
    char input[64];
    printf("Enter the language for which you want to see movies: ");
    scanf("%s", input);
    clearInputBuffer();
    toLowerCase(input);
    
    // print all movies with the input language
    struct movie* currMovie = list;
    while (currMovie != NULL)
    {
        char* substr = strcasestr(currMovie->languages, input);
        if (substr != NULL)
        {
            if (!hasDataOnLanguage)
                hasDataOnLanguage = true;
            printf("%d %s\n",currMovie->year, currMovie->title);
        }

        currMovie = currMovie->next;
    }
    if (!hasDataOnLanguage)
        printf("No data about movies released in %s\n", input);

    printf("\n"); // formatting new line
}






/*
*   Process the file provided as an argument to the program to
*   create a linked list of movie structs and print out the list.
*   Compile the program as follows:
*       gcc --std=gnu99 -o movies main.c
*/

int main(int argc, char *argv[])
{
    // if (argc < 2) // check cmd line arguments for file name
    // {
    //     printf("You must provide the name of the file to process\n");
    //     printf("Example usage: ./movies movies_sample_1.txt\n");
    //     return EXIT_FAILURE;
    // }

    // process movies from file
    // int numMovies = 0;
    // struct movie* list = processFile(argv[1], &numMovies);
    // printf("Processed file %s and parsed data for %d movies.\n\n", argv[1], numMovies);

    // main execution loop
    // bool doMainExec = false;
    /*do 
    {
        // get user menu choice - what did they choose to do?
        // 1 - show movies in a specified year
        // 2 - show highest rated movies for a year
        // 3 - show movies and release year for a language
        // 4 - exit
        printMainMenu();
        int menuChoice = getUserIntInput("\nEnter a choice from 1 to 4: ");

        // process choices
        /*switch (menuChoice)
        {
            case 1:
                resolveOption1(list);
                break;
            case 2:
                resolveOption2(list);
                break;
            case 3:
                resolveOption3(list);
                break;
            case 4:
                doMainExec = false;
                break;
            default:
                printf("Invalid input. Input must be an integer between 1 and 4.\n\n");
                break;
        }

    } while (doMainExec);*/

    // free used memory
    // while (list != NULL)
    // {
    //     struct movie* tempMovie = list;
    //     list = list->next;
    //     // free(tempMovie->title);
    //     // free(tempMovie->languages);
    //     free(tempMovie);
    // }
    return 0;
}
