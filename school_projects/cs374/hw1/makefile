hw1: main.c movies_sample_1.csv
	gcc --std=gnu99 -o movies main.c
	./movies movies_sample_1.csv

memcheck: main.c movies_sample_1.csv
	valgrind gcc --std=gnu99 -o movies_mem main.c
	./movies_mem movies_sample_1.csv

test: mem_test.c
	valgrind --leak-check=full gcc --std=gnu99 -o test mem_test.c
	./test

clean: main.c movies
	rm *.o movies test