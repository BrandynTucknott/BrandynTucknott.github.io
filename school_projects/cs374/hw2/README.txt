Instructions on how to compile and execute code.

==================== RUNNING NORMALLY ====================
If you have the makefile:
    'make' will automatically compile and execute the code with the given test data.
    If this doesn't work, then 'make hw2' should work correctly. If not, move onto
    compiling without a makefile below.

Alternatively, or if the makefile doesn't work, typing
    'gcc --std=gnu99 -o movies main.c' will compile main into an object file called movies.
    './movies' will run main and read data from FILE_NAME



==================== CHECK FOR MEMORY LEAKS ====================
With makefile:
    typeing 'make memcheck' will compile and execute the program with valgrind.
Without makefile:
    compile:   'gcc --std=gnu99 -o movies_mem main.c'
	run:       'valgrind ./movies_mem'



==================== CUSTOM CSV FILES ====================
.csv files must be formatted with
Title, Year, Languages, Rating Value
[movie 1], [year 1], [lanugages 1], [rating 1]
[movie 2], [year 2], [lanugages 2], [rating 2]
[movie 3], [year 3], [lanugages 3], [rating 3]
...

*** do not end the file with a new line, end with a movie entry ***

The .csv must begin with 'movies_'. For example, movies_for_me.csv is a valid name, but my_movies.csv is not.
The .csv must be placed in the same directory as the makefile and main.c