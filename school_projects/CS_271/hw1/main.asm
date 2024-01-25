; main.asm: project for CS 271 hw1
; author: Brandyn Tucknott
; completion date: 24 Jan. 2024
; description:
;   Asks the user for a length, width, and linear feet of planks, then uses those to print the area and perimeter
;   prints the number of rows that wrap around the perimeter of the fence, and all excess planks. This program gives tells the user what the
;   correct user input is, but assumes all input is correct from the user and makes no attempt to error handle.
; to run (on linux):
;   install NASM compiler
;       apt install nasm
;   compile and link
;       nasm main.asm -f elf
;       ld main.o -m elf_i386 -o main
;   execute
;       ./main

; A = lw, P = 2l + 2w
; exits the program with exit code 0

; section 1
; HW1 + program name: indicate extra credit
; ask user for their name
section .data
    max_chars_in_name equ 0x20

section .bss
    name_buffer resb max_chars_in_name ; 32 chars for name

section .data
    name_buffer_size equ max_chars_in_name ; max chars read from user: 32

    new_line_str db 0x0A, 0x00
    new_line_str_len equ $ - new_line_str

    program_name db "HW 1: Fencing a Pasture by Brandyn Tucknott", 0x00
    program_name_len equ $ - program_name

    name_prompt db "Enter your name (32 character limit): ", 0x00 ; change number here to match max_chars_in_name
    name_prompt_len equ $ - name_prompt

section .text
; function prints the text to console
; esi - string
; edi - length of string
write:
    pushad
    mov eax, 0x04
    mov ebx, 0x01
    mov ecx, esi
    mov edx, edi
    int 0x80
    popad
    ret
; function prints out a new line
new_line:
    pushad
    mov eax, 0x04
    mov ebx, 0x01
    mov ecx, new_line_str
    mov edx, new_line_str_len
    int 0x80
    popad
    ret
; gets the user's name
; stores user input into name_buffer
get_user_name:
    pushad
    mov eax, 0x03
    xor ebx, ebx
    mov ecx, name_buffer
    mov edx, name_buffer_size
    int 0x80
    popad
    ret
; section 2
; ask user for width + length [1, 1_000]
; ask for feet of planks [1, 500_000]
; print area
; print perimeter
; print rails + extra plank
; REPEAT section 2 until specified not to by user (REPROMPOT FOR INVALID INPUT)
section .bss
    int_buffer resb 0x07 ; 500,000 is the largest input the user can give (6 digits)
    width resd 0x01
    length resd 0x01
    planks resd 0x01

    temp_int resd 0x01 ; temporary storage for a number, used primarily for the str_to_int function

section .data
    int_buffer_size equ 0x07 ; max chars read from user
    num_chars_in_int_buffer dd 0x00
    width_prompt db "Enter the width of the pasture (1ft --> 1,000ft): ", 0x00
    width_prompt_len equ $ - width_prompt

    length_prompt db "Enter the length of the pasture (1ft --> 1,000ft): ", 0x00
    length_prompt_len equ $ - length_prompt

    plank_prompt db "Enter the linear feet of wood planks (1ft --> 500,000ft): ", 0x00
    plank_prompt_len equ $ - plank_prompt

    area_text db "Area of enclosure (square ft): ", 0x00
    area_text_len equ $ - area_text

    perimeter_text db "Perimeter of enclosure (ft): ", 0x00
    perimeter_text_len equ $ - perimeter_text

    planks_text_0 db "You have enough wood for ", 0x00
    planks_text_0_len equ $ - planks_text_0

    planks_text_1 db " rails and ", 0x00
    planks_text_1_len equ $ - planks_text_1

    planks_text_2 db " extra feet of planks", 0x00
    planks_text_2_len equ $ - planks_text_2

    reprompt_text db "Would you like to do another calculation? (0=NO, 1=YES): ", 0x00
    reprompt_text_len equ $ - reprompt_text

; function to unsigned integers from the user
; stores user input in int_buffer (max )
get_user_int:
    pushad
    mov eax, 0x03
    xor ebx, ebx
    mov ecx, int_buffer
    mov dword [ecx], 0x00 ; clear int_buffer before read (int_buffer is 7 bytes)
    mov word [ecx + 0x04], 0x00
    mov byte [ecx], 0x00
    mov edx, int_buffer_size
    int 0x80

    ; update the num_chars_in_int_buffer
    mov ecx, int_buffer_size ; index of loop
    sub ecx, 0x01 ; starts at 7, but only want 6
    mov eax, int_buffer ; address of string
    determine_buffer_size_loop:
        cmp byte [eax], 0x30
        jl update_num_chars_in_int_buffer

        cmp byte [eax], 0x39
        jg update_num_chars_in_int_buffer

        inc dword eax ; move eax to start at next char in buffer
        loop determine_buffer_size_loop
    update_num_chars_in_int_buffer:
        mov eax, 0x06
        sub eax, ecx ; = num_chars_in_int_buffer
        mov dword [num_chars_in_int_buffer], eax
    popad
    ret
; END OF get_user_int ================================================================================

; before running:
;   esi - num in string form
;   edi - length of string
; while running: reg - (outer loop) / (inner loop)
;   eax - digit / product
;   ebx - address of digit / exponent
;   ecx - loop counter / loop counter
; after running:
;   [temp_int] - unsigned integer 4 bytes
; start with largest digit and moves in descending order, assumes valid input: only digits 0-9
;           EX: 345 --> 3*10^2 + 4*10 + 5
str_to_int:
    pushad

    mov eax, temp_int
    mov dword [eax], 0x00
    xor ebx, ebx
    xor ecx, ecx
    xor edx, edx

    mov ecx, edi ; loop counter

    digit_loop: ; for each digit in string
        ; get digit - ebx = address(esi + edi - ecx)
        mov ebx, esi
        add ebx, edi
        sub ebx, ecx
        xor eax, eax
        mov al, [ebx] ; digit, assuming eax only points to the first byte of int_buffer

        ; convert to num
        sub eax, 0x30 ; ascii num -> num

        ; multiply it by appropriate power of 10: 10^(ecx - 1): store in eax:
        mov ebx, ecx
        sub ebx, 1
        push ecx
        push eax
        mov ecx, ebx ; 10^ebx loop counter
        mov eax, 0x01

        cmp ecx, 0x00 ; skips loop if index == 0
        je after_pow_loop
        pow_loop: ; 10^n loop
           imul eax, 0x0A
           loop pow_loop
    after_pow_loop:
        ; add to temp_int
        mov ebx, eax ; put in 10^n
        pop eax ; get digit
        imul ebx, eax ; multiply 10^n by digit, store product in ebx
        add dword [temp_int], ebx
        pop ecx
    loop digit_loop
    popad
    ret
; END OF str_to_int ======================================================================

; prints the number in edi
; registers:
;   edi - holds the number to be printed
;   eax - holds the number/index for the loop (they are the same in this case)
;   esi - string buffer
;   edx - holds the digit
;   ecx - loop counter
print_num:
    pushad

    ; just in case clears
    mov esi, int_buffer ; init buffer vals to 0 and shift up index index by 7 (to start at the end of the buffer)
    mov dword [esi], 0x00
    add esi, 0x04
    mov word [esi], 0x00
    add esi, 0x01
    mov byte [esi], 0x00

    xor ebx, ebx
    xor eax, eax

    ; loop initialization
    mov eax, edi

    cmp eax, 0x00
    je zero_case
    jmp print_num_loop
    zero_case: ; for some reason this function doesn't work when edi = 0. This fixes that
        add eax, 0x30 ; convert to ascii
        mov ebx, int_buffer
        mov [ebx], eax
        mov esi, int_buffer ; set esi to the start of the buffer
        mov edi, 0x01 ; size of int buffer
        call write

        popad
        ret

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
        sub esi, 0x01
        mov [esi], dl ; remainder, so edx < 10, dl contains the whole number
        jmp print_num_loop
continue_print_num:
    mov esi, int_buffer ; set esi to the start of the buffer
    mov edi, 0x07 ; size of int buffer
    call write

    popad
    ret
; END OF print_num =====================================================================

; section 3
; say goodbye [USER_NAME] + exit the program
section .data
    bye_str db "Goodbye ", 0x00
    bye_str_len equ $ - bye_str

; says goodbye to the user
goodbye:
    ; no need to temporarily store vals because the func call after goodbye is sys_exit
    mov esi, bye_str
    mov edi, bye_str_len
    call write

    mov esi, name_buffer
    mov edi, name_buffer_size
    call write
    ret
; exits the program with exit code 0
exit: ; no need to store vals, exiting the program
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
    call new_line

    ; =====================================================================================================
    ; START SECTION 2 =====================================================================================
    ; REPEAT section 2 until specified not to by user (REPROMPOT FOR INVALID INPUT)
    reprompt:
        ; ask user for width [1, 1000]
        mov esi, width_prompt
        mov edi, width_prompt_len
        call write
        call get_user_int ; user num now in int_buffer as str

        ; store gotten width
        mov esi, int_buffer
        mov edi, [num_chars_in_int_buffer]
        call str_to_int
        mov eax, [temp_int]
        mov dword [width], eax

        ; ask user for length [1, 1000]
        mov esi, length_prompt
        mov edi, length_prompt_len
        call write
        call get_user_int

        ; store gotten length
        mov esi, int_buffer
        mov edi, [num_chars_in_int_buffer]
        call str_to_int
        mov eax, [temp_int]
        mov dword [length], eax

        ; ask for linear feet of planks
        mov esi, plank_prompt
        mov edi, plank_prompt_len
        call write
        call get_user_int
        ; store gotten planks
        mov esi, int_buffer
        mov edi, [num_chars_in_int_buffer]
        call str_to_int
        mov eax, [temp_int]
        mov [planks], eax

        call new_line ; visual organization new line

        ; print area - print text
        mov esi, area_text
        mov edi, area_text_len
        call write
        ; print area - calculate area
        mov eax, [length]
        mov ebx, [width]
        mul ebx ; eax holds length * width
        ; print area - print area num
        mov edi, eax
        call print_num
        call new_line

        ; print perimeter - print text
        mov esi, perimeter_text
        mov edi, perimeter_text_len
        call write
        ; print perimeter - calculate perimeter
        mov eax, [length]
        mov ebx, [width]
        add eax, ebx
        mov ebx, 0x02
        mul ebx
        ; print perimeter - print perimeter num
        mov edi, eax
        call print_num
        call new_line

        ; print rails + extra - calculate rows + extra
        ; at this point, eax still contains the perimeter. We want to divide plank length by perimeter and use quotient and remainder
        mov ebx, eax
        mov eax, [planks]
        div ebx
        ; at this point, eax contains quotient, edx the remainder
        ; print rails + extra - text0
        mov esi, planks_text_0
        mov edi, planks_text_0_len
        call write
        ; print rails + extra - print rows
        mov edi, eax
        call print_num
        ; print rails + extra - text1
        mov esi, planks_text_1
        mov edi, planks_text_1_len
        call write
        ; print rails + extra - print extra
        mov edi, edx
        call print_num
        ; print rails + extra - text2
        mov esi, planks_text_2
        mov edi, planks_text_2_len
        call write

        call new_line ; for visual organization on terminal
        call new_line


        ; repeat?
        mov esi, reprompt_text
        mov edi, reprompt_text_len
        call write
        call get_user_int
        call new_line

        mov eax, int_buffer
        cmp byte [eax], 0x31 ; ascii 1 = yes
        je reprompt

    ; END SECTION 2 =======================================================================================
    ; =====================================================================================================

    ; user chose not to repeat; exit program
    call goodbye
    call exit