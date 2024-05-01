#define _GNU_SOURCE
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <stdbool.h>
#include <time.h>
#include <dirent.h>
#include <sys/stat.h>
#include <limits.h>
#include <unistd.h>

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
void clearInputBuffer();
int getUserIntInput(const char*);
int getHomeOption();
int randInt(const int, const int);
int getFileOption();
char* getFile(const int);
struct movie* processFile(char*);
void createMovieFiles(struct movie*, const char*);
char* createDir();



/*
* input: movie data as a string
* output: movie* object containing movie info as a struct
* Description: Parse the current line which is space delimited and create a
*              movie struct with the data in this line
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
* input: file path as a string, number of movies in the file
* output: a linked list of all the movies in the file
* Description: Return a linked list of movies by parsing data from
*              each line of the specified file.
*/
struct movie* processFile(char* filePath)
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
* input: none
* output: none
* description: clears the input buffer
*/
void clearInputBuffer()
{
    while (getchar() != '\n');
}

/*
* input: prompt to print (const char*)
* output: returns the integer the user integered (int)
* description: given a prompt, this function will print the prompt and return the integer entered by the user.
*/
int getUserIntInput(const char* prompt)
{
    // get user input
    int input = -1;
    printf("%s", prompt);
    scanf("%d", &input);
    clearInputBuffer();

    return input;
}

/*
* input: none
* output: returns either 1 (to process a file) or 0 (to exit the program)
* description: prints the home screen and obtains user choice
*/
int getHomeOption()
{
    printf("1. Select file to process\n");
    printf("2. Exit the program\n");
    return getUserIntInput("Enter a choice 1 or 2: ");
}

/*
* input: lower bound, upper bound
* output: random integer within the range[lower bound, upper bound]
* description: given a range lower bound, upperbound, this function will generate
*               a random integer in the range (inclusive) and return it
*/
int randInt(const int lower, const int upper)
{
    return (rand() % (upper - lower + 1) + lower);
}

/*
* input: none
* output: returns either 1 (to process a file) or 0 (to exit the program)
* description: prints the file select screen and obtains user choice
*/
int getFileOption()
{
    printf("\n1. Pick the largest file\n");
    printf("2. Pick the smallest file\n");
    printf("3. Specify a file name\n");
    int choice = getUserIntInput("Enter a choice 1, 2, or 3: ");
    
    while (choice != 1 && choice != 2 && choice != 3)
    {
        printf("\033[31mInvalid input, must be either 1, 2, or 3\033[0m\n\n");
        printf("1. Pick the largest file\n");
        printf("2. Pick the smallest file\n");
        printf("3. Specify a file name\n");
        choice = getUserIntInput("Enter a choice 1, 2, or 3: ");
    }

    return choice;
}

/*
* input: largest file (1), smallest file (2), specific file (3)
* output: returns a FILE* object (the file to use)
* description: given a file choice 1, 2, or 3, this function returns a FILE* object of the appropriate file
*/
char* getFile(const int fileChoice)
{
    DIR* dir = opendir(".");
    char* fileName = calloc(256, sizeof(char));  // file name
    unsigned long int size;                     // number of bytes the file takes up
    struct dirent* entry;
    struct stat file_stat;

    switch (fileChoice)
    {
        case 1: // largest file
            size = 0;
            while ((entry = readdir(dir)) != NULL)
            {
                // find a file with movies_ in the name
                if (entry->d_type == DT_REG && strstr(entry->d_name, "movies_") == entry->d_name)
                {
                    char* extension = strrchr(entry->d_name, '.'); // get string starting at the last '.'
                    if (extension != NULL && (strcmp(extension, ".csv") == 0)) // check that out file ends with '.csv'
                    {
                        char filepath[256];
                        sprintf(filepath, "%s", entry->d_name); // copy entry name into filepath
                        if (stat(filepath, &file_stat) == 0 && file_stat.st_size > size)
                        {
                            size = file_stat.st_size;
                            strcpy(fileName, entry->d_name);
                        }
                    }
                }
            }
            break;
        case 2: // smallest file
            size = LONG_MAX;    // largest number a long int can be
            while ((entry = readdir(dir)) != NULL)
            {
                // find a file that starts with 'movies_'
                if (entry->d_type == DT_REG && strstr(entry->d_name, "movies_") == entry->d_name)
                {
                    char* extension = strrchr(entry->d_name, '.'); // get string starting at the last '.'
                    if (extension != NULL && (strcmp(extension, ".csv") == 0)) // check that out file ends with '.csv'
                    {
                        char filepath[256];
                        sprintf(filepath, "%s", entry->d_name); // copy entry name into filepath
                        if (stat(filepath, &file_stat) == 0 && file_stat.st_size < size)
                        {
                            size = file_stat.st_size;
                            strcpy(fileName, entry->d_name);
                        }
                    }
                }
            }
            break;
        default: // case 3: file by specific name
            bool fileFound = false;
            // get file name from user
            printf("Enter the complete file name: ");
            scanf("%s", fileName);

            // attempt to open the a file using the given name
            while ((entry = readdir(dir)) != NULL && !fileFound)
            {
                if (entry->d_type == DT_REG && (strcmp(entry->d_name, fileName) == 0))
                {   // file found, break loop and return the file name
                    fileFound = true;
                    break;
                }
            }
            if (!fileFound)
            {
                printf("\033[31mFile not found, try again.\033[0m\n");
                free(fileName); // free memeory before returning
                closedir(dir);
                return NULL;
            }
    }

    printf("Now processing the chosen file named \033[1;34m%s\033[0m\n", fileName);
    closedir(dir);

    return fileName;
}

/*
* input: none
* output: none
* description: creates a directory with permissions rwxr-x--- named tucknotb.movies.[RAND NUM(0, 99,999)]
*/
char* createDir()
{
    DIR* dir = opendir(".");
    int randomInt = randInt(0, 99999);
    char* dirName = calloc(64, sizeof(char));
    sprintf(dirName, "tucknotb.movies.%d", randomInt);
    mode_t mode = 0750; // in octal = 488 decimal = 111 101 000 binary
    int status = mkdir(dirName, mode);
    closedir(dir);
    printf("created directory \033[1;34m%s\033[0m\n", dirName);
    return dirName;
}

/*
* input: linked list of movies
* output: none
* description: reads through the linked list and appends all movies created in year YYYY to a file YYYY.txt
*              if the file does not exist, then it is created and then the movie title is appended. Uses a brute force method.
*/
void createMovieFiles(struct movie* movies, const char* dirPath)
{
    char fullPath[128];
    while (movies != NULL)
    {
        char fileName[16];
        sprintf(fileName, "%d.txt", movies->year);
        sprintf(fullPath, "%s/%s", dirPath, fileName);

        bool fileExists = (access(fullPath, F_OK) == 0); // returns 0 if it exists, -1 if not
        FILE* file;

        if (!fileExists) // change permissions of file if it was just created
        {
            file = fopen(fullPath, "w");  // create file if it doesn't exist
            fclose(file);
            mode_t mode = 064; // inoctal = 416 decimal = 110 100 000 binary
            if (chmod(fullPath, mode) == -1)
            {
                printf("\033[31mError changing permissions\033[0m\n");
                exit(1);
            }
        }

        // appends the movie title to the file
        file = fopen(fullPath, "a");
        fprintf(file, "%s\n", movies->title);
        fclose(file);
        movies = movies->next; // iterate linked list
    }
}






int main()
{
    // initialize program variables
    srand(time(NULL));
    bool endProgram = false;


    // main exec loop
    while (!endProgram)
    {
        int userHomeChoice = getHomeOption();
        switch (userHomeChoice)
        {
            case 1: // select a file
                int userFileChoice = -1;
                char* fileName = NULL;

                while (fileName == NULL)
                {
                    userFileChoice = getFileOption();
                    fileName = getFile(userFileChoice);
                }
                struct movie* movies = processFile(fileName);

                // create the directory with rwxr-x--- permissions
                char* newDirName = createDir();
                char newDirPath[128];
                sprintf(newDirPath, "./%s", newDirName);

                // create the files with movie info: brute force method
                createMovieFiles(movies, newDirPath);

                // free used memory
                free(fileName);
                free(newDirName);
                while (movies != NULL)
                {
                    struct movie* tempMovie = movies;
                    movies = movies->next;
                    free(tempMovie->title);
                    free(tempMovie->languages);
                    free(tempMovie);
                }
                printf("\n"); // formatting new line
                break;
            case 2: // end program
                endProgram = true;
                break;
            default:
                printf("\033[31mInvalid input, must be either 1 or 2\033[0m\n\n");
                break;
        }
    }

    return 0;
}