main: main.asm
	nasm main.asm -g -f elf
	ld main.o -g -m elf_i386 -o main

clean:
	rm *.o main