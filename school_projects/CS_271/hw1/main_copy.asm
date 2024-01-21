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
section .data
    max_chars_in_name equ 0x20

section .bss
    name_buffer resb max_chars_in_name ; 32 chars for name

section .data
    name_buffer_size equ max_chars_in_name ; max chars read from user: 32

    new_line_str db 0x0A, 0x00
    new_line_str_len equ $ - new_line_str

    program_name db "HW 1: Fencing a Pasture by Brandyn Tucknott (Extra Credit)", 0x00
    program_name_len equ $ - program_name

    name_prompt db "Enter your name (32 character limit): ", 0x00 ; change number here to match max_chars_in_name
    name_prompt_len equ $ - name_prompt

section .text
; function prints the text to console
; esi - string
; edi - length of string
write:
    push eax ; store vals in registers
    push ebx
    push ecx
    push edx
    mov eax, 0x04
    mov ebx, 0x01
    mov ecx, esi
    mov edx, edi
    int 0x80
    pop edx ; retrieve stored vals
    pop ecx
    pop ebx
    pop eax
    ret

new_line:
    push eax ; temp store vals
    push ebx
    push ecx
    push edx
    mov eax, 0x04
    mov ebx, 0x01
    mov ecx, new_line_str
    mov edx, new_line_str_len
    int 0x80
    pop edx ; retrieve vals
    pop ecx
    pop ebx
    pop eax
    ret

get_user_name:
    push eax ; temp store vals
    push ebx
    push ecx
    push edx
    mov eax, 0x03
    xor ebx, ebx
    mov ecx, name_buffer
    mov edx, name_buffer_size
    int 0x80
    pop edx ; retrieve vals
    pop ecx
    pop ebx
    pop eax
    ret
; section 2
; ask user for width + length [1, 1_000]
; ask for feet of planks [1, 500_000]
; print area
; print perimeter
; print rails + extra plank
; REPEAT section 2 until specified not to by user (REPROMPOT FOR INVALID INPUT)
section .bss
    int_buffer resb 0x06 ; 500,000 is the largest input the user can give (6 digits)
    width resd 0x01 ; 4 bytes to store 500,000
    length resd 0x01
    planks resd 0x01

    temp_int resd 0x01 ; temporary storage for a number, used primarily for the str_to_int function

section .data
    int_buffer_size equ 0x06 ; max chars read from user
    width_prompt db "Enter the width of the pasture (1ft --> 1,000ft): ", 0x00
    width_prompt_len equ $ - width_prompt

    length_prompt db "Enter the length of the pasture (1ft --> 1,000ft): ", 0x00
    length_prompt_len equ $ - length_prompt

    plank_prompt db "Enter the linear feet of wood planks (1ft --> 500,000ft): ", 0x00
    plank_prompt_len equ $ - plank_prompt

get_user_int:
    push eax ; temp store vals
    push ebx
    push ecx
    push edx
    mov eax, 0x03
    xor ebx, ebx
    mov ecx, int_buffer
    mov edx, int_buffer_size
    int 0x80
    pop edx ; retrieve vals
    pop ecx
    pop ebx
    pop eax
    ret
; before running:
;   esi - num in string form
;   edi - length of string
; while running:
;   eax - used in MUL
;   ecx - used in MUL
;   ebx / bl - current index
;   dl - char = current digit
;   dh - index int used to calculate 10^(UNSIGNED INT)
; after running:
;   [temp_int] - unsigned integer 4 bytes
; start with largest digit and moves in descending order, assumes valid input: only digits 0-9
;           EX: 345 --> 3*10^2 + 4*10 + 5
str_to_int:
    push eax ; temp store vals
    push ebx
    push ecx
    push edx
    ; clear vals before use
    xor eax, temp_int
    mov dword [eax], 0x00
    xor ebx, ebx
    xor ecx, ecx
    loop:
        xor edx, edx ; just in case
        mov eax, [esi + ebx] ; move char from string into dl + offset by current index
        ;add al, bl ; get offset by current index (bl) to get the correct digit
        mov dl, al
        sub dl, 0x30 ; convert from ascii to int

        mov eax, 0x01, ; get ready to start multiplying by 10
        xor dh, dh ; reset subloop counter
        mov ecx, edi
        sub dword ecx, ebx - 1
        subloop: ; calculates 10^([edi] - bl - 1) (in eax)
            cmp cl, dh ; continue looping?
            je out_of_subloop ; no
            ; yes, continue looping
            push ecx ; temporarily store the value of ecx, edx
            push edx
            mov ecx, 0x0A
            mul ecx
            mov eax, edx
            ; retrieve original values in ecx, edx before multiply
            pop edx
            pop ecx 
            inc byte dh ; increment loop index
            jmp subloop

    out_of_subloop:
        mov cl, dl ; move digit into ecx (MUL prep)
        mul ecx ; multiply eax by ecx and store result in eax
        mov edx, temp_int ; dl is no longer needed for this loop, use edx to increase temp_int
        add dword [edx], eax
        inc byte bl ; increment current index

        cmp ebx, edi ; if (current_index == str_len): nothing left to convert
        je quit_func
        jmp loop ; else continue looping
    quit_func:
        pop edx ; retrieve vals
        pop ecx
        pop ebx
        pop eax
        ret
; section 3
; say goodbye [USER_NAME] + exit the program
section .data
    bye_str db "Goodbye ", 0x00
    bye_str_len equ $ - bye_str
goodbye:
    ; no need to temporarily store vals because the func call after goodbye is sys_exit
    mov esi, bye_str
    mov edi, bye_str_len
    call write

    mov esi, name_buffer
    mov edi, name_buffer_size
    call write
    ret

exit: ; no need to store vals, exiting the program
    mov eax, 0x01
    ;xor ebx, ebx
    mov ebx, 255 ; REMOVE THIS
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

    ; REPEAT section 2 until specified not to by user (REPROMPOT FOR INVALID INPUT)
    ; ask user for width [1, 1000]
    mov esi, width_prompt
    mov edi, width_prompt_len
    call write
    call get_user_int ; user num now in int_buffer as str
    call str_to_int ; convert str to int and store int temp_int
    ;mov eax, [temp_int] ; store number version of user input
    ;mov dword [width], eax


    ; exit (REMOVE AFTER CONFIRMING THIS WORKS)
    mov ecx, temp_int
    mov eax, 1 ; REMOVE THIS
    mov ebx, [ecx] ; REMOVE: exit code = num in temp_int
    int 0x80 ; REMOVE









    ; store gotten width
    mov esi, int_buffer
    mov edi, int_buffer_size
    call str_to_int
    ;mov eax, [temp_int]
    ;mov dword [width], eax
    ; ask user for length [1, 1000]
    mov esi, length_prompt
    mov edi, length_prompt_len
    call write
    call get_user_int

    ; store gotten length
    ; ask for linear feet of planks
    mov esi, plank_prompt
    mov edi, plank_prompt_len
    call write
    call get_user_int

    ; store gotten planks


    ; print area
    ; print perimeter
    ; print rails + extra

    ; user chose not to repeat; exit program
    ; say goodbye [USER_NAME] + exit
    call goodbye
    call exit

; TODO:
; get user name
;   handle buffer overflow