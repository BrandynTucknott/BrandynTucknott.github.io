hw1: main.c movies_sample_1.csv
	gcc --std=gnu99 -o movies main.c
	./movies movies_sample_1.csv

memcheck: main.c movies_sample_1.csv
	gcc --std=gnu99 -o movies_mem main.c
	valgrind ./movies_mem movies_sample_1.csv

clean: main.c movies
	rm *.o movies test