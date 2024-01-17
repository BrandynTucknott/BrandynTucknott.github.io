; part 1
section .data
    xvalue: dd 5
    XVALUE1: dd 500
    Age: dd 21
    letters: db "abcde", 0x0A, 0x0A, 0x0A, 0
    letters_len: equ $ - letters

section .text
global _start
_start:
    mov eax, 4
    mov ebx, 1
    mov ecx, letters
    mov edx, letters_len
    int 0x80

    mov eax, 1
    mov ebx, letters_len
    int 0x80