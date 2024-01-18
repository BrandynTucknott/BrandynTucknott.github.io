; main.asm: project for CS 271 hw1
; author: Brandyn Tucknott
; description:
;   Asks the user for a length, width, and linear feet of planks, then uses those to print the area and perimeter
;   prints the number of rows that wrap around the perimeter of the fence, and all excess 

; A = lw, P = 2l + 2w
; exits the program with exit code 0

; section 1
; HW1 + program name: indicate extra credit
; ask user for their name
section .bss
    input_buffer resb 0x07 ; 500,000 is the largest input the user can give (6 digits) + null char
    input_buffer_len resb 0x01 ; the number of chars currently in the buffer 1 byte bc never > 255

    name_buffer resb 0x21 ; 32 chars for name + 1 null char
    name_buffer_len resb 0x01 ; the num of chars in the name buffer

section .data
    input_buffer_size equ 0x06 ; max chars read from user
    name_buffer_size equ 0x20 ; max chars read from user: 32

    program_name db "HW 1: Fencing a Pasture by Brandyn Tucknott (Extra Credit)", 0x00
    program_name_len equ $ - program_name

    name_prompt db "Enter your name (32 character limit): ", 0x00
    name_prompt_len equ $ - name_prompt

    new_line_str db 0x0A, 0x00
    new_line_str_len equ $ - new_line_str

section .text
; function prints the text to console
; esi - string
; edi - length of string
write:
    mov eax, 0x04
    mov ebx, 0x01
    mov ecx, esi
    mov edx, edi
    int 0x80
    ret

new_line:
    mov eax, 0x04
    mov ebx, 0x01
    mov ecx, new_line_str
    mov edx, new_line_str_len
    int 0x80
    ret

get_user_name:
    mov eax, 0x03
    mov ebx, 0x00
    mov ecx, name_buffer
    mov edx, name_buffer_size
    int 0x80
    ret
; section 2
; ask user for width
; ask user for length
;       length and width ints between [1, 1000] (TELL USER)
; ask for linear feet of planks
;       int between [1, 500,000] (TELL USER)
; print area
; print perimeter
; print rails + extra
; REPEAT section 2 until specified not to by user (REPROMPOT FOR INVALID INPUT)

; section 3
; say goodbye [USER_NAME]
exit:
    mov eax, 0x01
    xor ebx, ebx
    int 0x80












global _start
_start:
    ; HW1 + program name
    mov esi, program_name
    mov edi, program_name_len
    call write
    call new_line
    ; ask user for their name
    mov esi, name_prompt
    mov edi, name_prompt_len
    call write
    ; get user input
    call get_user_name

    ; ask user for width
    ; ask user for length
    ;       length and width ints between [1, 1000] (TELL USER)
    ; ask for linear feet of planks
    ;       int between [1, 500,000] (TELL USER)
    ; print area
    ; print perimeter
    ; print rails + extra
    ; REPEAT section 2 until specified not to by user (REPROMPOT FOR INVALID INPUT)

    ; say goodbye [USER_NAME]
    call exit