; Problem 1
; n = 10;
; k = 1;
; while (k <= n)
; {
;     print(k);
;     k += 2;
; }

; Problem 2
; for (k = 0; k < 10; k++)
; {
;     print(k);
; }
section .bss
int_buffer resb 0x07

section .data
k dword 1
n dword 10

nl resb 0x0A, 0x00
nl_len equ $ - nl

section .text

write: ; write to terminal
    pushad
    mov eax, 4
    mov ebx, 1
    mov ecx, esi
    mov edx, edi
    int 0x80
    popad
    ret

new_line:
    push esi
    push edi
    mov esi, nl
    mov edi, nl_len
    call write
    pop edi
    pop esi
    ret
print_num: ; taken from assignment 1 (written previously)
    pushad ; push eax -> edx

    ; just in case clears
    mov ecx, int_buffer
    mov dword [ecx], 0x00
    xor ebx, ebx
    xor eax, eax

    ; loop initialization
    mov eax, edi

    print_num_loop: ; for each digit
        ; no digits: break out of loop?
        cmp eax, 0x00
        je continue_print_num

        ; get the digit (divide eax by 10; remainder stored in edx)
        xor edx, edx
        mov ebx, 0x0A
        div ebx

        ; convert to ascii
        add dword edx, 0x30

        ; add to string + increment add index
        mov [ecx], edx
        inc byte cl
continue_print_num:
    mov esi, int_buffer
    mov edi, 0x07 ; size of int buffer
    call write
    call new_line

    popad ; pop edx -> eax
    ret




global _start:
_start:
; Problem 1
    mov eax, k
    mov ebx, n
    loop:
        cmp eax, ebx ; while !(k > n)
        jg exit

        ; print k
        mov edi, k
        call print_num
        call new_line
        ; increment k
        add dword eax, 2

; Problem 2
    mov eax, 0
    mov ebx, 10
    loop:
        cmp eax, ebx ; while !(k >= n)
        jge exit

        ; print k
        mov edi, k
        call print_num
        call new_line
        ; increment k
        inc dword eax


    exit:
        ; sys exit
        mov eax, 1
        mov ebx, 0
        int 0x80