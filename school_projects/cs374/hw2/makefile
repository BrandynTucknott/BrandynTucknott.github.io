hw2: main.c
	gcc --std=gnu99 -o movies main.c
	./movies

memcheck: main.c
	gcc --std=gnu99 -o movies_mem main.c
	valgrind ./movies_mem

cleandir:
	rm -r tucknotb.movies.*

clean: main.c movies
	rm *.o movies movies_mem