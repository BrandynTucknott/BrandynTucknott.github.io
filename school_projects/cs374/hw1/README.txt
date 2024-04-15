Instructions on how to compile and execute code.

If you have the makefile:
    'make' will automatically compile and execute the code with the given test data.
    If you want, you can change line 3 of the makefile from
        './movies movies_sample_1.csv' into
        './movies [REPLACE  WITH FILE NAME]'

Alternatively, or if the makefile doesn't work, typing
    'gcc --std=gnu99 -o movies main.c' will compile main into an object file called movies.
    './movies [FILE_NAME]' will run main and read data from FILE_NAME

    For example, if I have a dataset called 'my_movies.csv', I can run main on this file by typing
    'gcc --std=gnu99 -o movies main.c'
    './movies my_movies.csv'
