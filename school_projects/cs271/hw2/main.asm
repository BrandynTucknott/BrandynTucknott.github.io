; Name: main.asm (CS 271 assignment 2)
; Author: Brandyn Tucknott
; CS 271 Assignment 2
; Date Completed: 1 February 2024
; Description:
;	This project will prompt the user for an integer n between 1 and 1000, error check the input for
;	lowerbound, upperbound
;		print all factors of n in [lowerbound, upperbound]
;		if n is prime, it will tell the user it is prime in addition to printing the factors.
;		if n is perfect square, say so (odd number of divisors)
; End of program, print all primes the user has encountered
section .bss
	str32_buffer resb 0x20 ; 32 byte buffer for a string
	double_buffer resb 0x0B ; 2^32 - 1 = 10 digit number at most + 1
	lowerbound resd 0x01
	upperbound resd 0x01

	str200_buffer resb 0xc8 ; 200 byte buffer for the array
	num_factors resd 0x01 ; number of factors for a given number

	primes_buffer_str resb 0xc8 ; 200 byte buffer for prime numbers (in string form)
	primes_str_index resd 0x01 ; index of primes_buffer_str (array)
	primes_buffer_int resd 168 ; 168 primes between 1 and 1000 

	temp_int resd 0x01
	validate_result resd 0x01 ; either 0 or 1: 0 = valid, 1 = invalid

section .data
	new_line_str db 0x0A, 0x00
	new_line_str_len equ $ - new_line_str

	name_and_title db "CS 271 HW 2 (Extra Credit): Factors", 0x00
	name_and_title_len equ $ - name_and_title

	description1 db 0x09, "This program calculates the displays the factors from lowerbound to upperbound.", 0x00
	description1_len equ $ - description1

	description2 db 0x09, "It indicates which numbers are primes or perfect squares and lists all in-range primes afterwards", 0x00
	description2_len equ $ - description2

	name_prompt db "Enter your name (32 char max): ", 0x00
	name_prompt_len equ $ - name_prompt

	name db 0x20 ; space to 
	name_len equ 0x20

	num_chars_in_double_buffer dd 0x00

	lowerbound_prompt db "Enter an integer between 1 and 1000 for the lowerbound of the range: ", 0x00
	lowerbound_prompt_len equ $ - lowerbound_prompt

	upperbound_prompt db "Enter an integer between 1 and 1000 for the upperbound of the range: ", 0x00
	upperbound_prompt_len equ $ - upperbound_prompt

	nan_error_msg db "Your input was not a positive integer.", 0x00
	nan_error_msg_len equ $ - nan_error_msg

	too_small_msg db "Your input was too small.", 0x00
	too_small_msg_len equ $ - too_small_msg

	too_big_msg db "Your input was too big.", 0x00
	too_big_msg_len equ $ - too_big_msg

	goodbye_text db "Goodbye ", 0x00
	goodbye_text_len equ $ - goodbye_text

	prime_text db 0x09, "** Prime Number **", 0x00
	prime_text_len equ $ - prime_text

	PS_text db 0x09, "** Perfect Square **", 0x00
	PS_text_len equ $ - PS_text

	colon db ": ", 0x00
	colon_len equ $ - colon

	go_again_prompt db "Would you like to make another calculation? (0 = NO, 1 = YES): ", 0x00
	go_again_prompt_len equ $ - go_again_prompt

section .text
; function prints the text to console
; esi - string
; edi - length of string
write:
	pushad
	mov eax, 4
	mov ebx, 1
	mov ecx, esi
	mov edx, edi
	int 0x80
	popad
	ret

; function prints a new line to the console
; nl = new line
nl:
	pushad
	mov eax, 4
	mov ebx, 1
	mov ecx, new_line_str
	mov edx, new_line_str_len
	int 0x80
	popad
	ret
 ; print two new lines
nl2:
	call nl
	call nl
	ret

; gets the user input (32 char max)
; stores user input into str32_buffer
get_user_str32:
    pushad
    mov eax, 3
    mov ebx, 0
    mov ecx, str32_buffer
    mov edx, 0x20 ; str32_buffer is always a 32-bit buffer
    int 0x80
    popad
    ret

; function to unsigned integer from the user
; stores user input in double_buffer
get_user_double:
    pushad
    mov eax, 3
    mov ebx, 0
    mov ecx, double_buffer
    mov dword [ecx], 0 ; clear int_buffer before read (int_buffer is 7 bytes)
    mov edx, 0x0A ; buffer size in bytes
    int 0x80

	; update the num_chars_in_int_buffer
    mov ecx, 0x0A ; index of loop
    sub ecx, 1 ; starts at 11, but only want 10
    mov eax, double_buffer ; address of string
    determine_double_buffer_size_loop:
        cmp byte [eax], 0x30
        jl update_num_chars_in_double_buffer

        cmp byte [eax], 0x39
        jg update_num_chars_in_double_buffer

        inc dword eax ; move eax to start at next char in buffer
        loop determine_double_buffer_size_loop
    update_num_chars_in_double_buffer:
        mov eax, 0x09
        sub eax, ecx ; = num_chars_in_int_buffer
        mov dword [num_chars_in_double_buffer], eax
    popad
    ret
; END OF get_user_double ================================================================================

; before running:
;   esi - address of num in string form
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

    mov eax, temp_int ; just in case zeroing
    mov dword [eax], 0
    mov ebx, 0
    mov ecx, 0
    mov edx, 0

    mov ecx, edi ; loop counter

    digit_loop: ; for each digit in string
        ; get digit - ebx = address(esi + edi - ecx)
        mov ebx, esi
        add ebx, edi
        sub ebx, ecx
        mov eax, 0
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
    mov esi, double_buffer ; init buffer vals to 0 and shift up index index by 7 (to start at the end of the buffer)
    mov dword [esi], 0 ; cleared 4 / 10 bytes
    add esi, 4
    mov dword [esi], 0 ; cleared 8 / 10 bytes
    add esi, 4
    mov word [esi], 0 ; cleared 10 / 10 bytes
    mov ebx, 0
    mov eax, 0

    ; loop initialization
    mov eax, edi

    cmp eax, 0 ; is the number to print == 0?
    je zero_case
    jmp print_num_loop
    zero_case: ; for some reason this function doesn't work when edi = 0. This fixes that
        add eax, 0x30 ; convert to ascii
        mov ebx, double_buffer
        mov [ebx], eax
        mov esi, double_buffer ; set esi to the start of the buffer
        mov edi, 0x01 ; size of int buffer
        call write

        popad
        ret

    print_num_loop: ; for each digit
        ; no digits: break out of loop?
        cmp eax, 0x00
        je continue_print_num

        ; get the digit (divide eax by 10; remainder stored in edx)
        mov edx, 0
        mov ebx, 0x0A
        div ebx

        ; convert to ascii
        add dword edx, 0x30

        ; add to string + increment add index
        sub esi, 0x01
        mov [esi], dl ; remainder, so edx < 10, dl contains the whole number
        jmp print_num_loop
continue_print_num:
    mov esi, double_buffer ; set esi to the start of the buffer
    mov edi, 0x0A ; size of double_buffer
    call write

    popad
    ret
; END OF print_num =====================================================================

; function to validate user input; prints error message and jumps to reprompt if incorrect
; input:
;	esi - address to string (will be checked for valid user input)
; 	edi - length of string
; output:
;	[validate_result] - 0 : user input is valid
;		  				1 : user input is invalid (flag to reprompt for user input)
validate_user_int:
	pushad
	mov eax, 0 ; just in case zeroing
	mov ebx, 0
	mov ecx, 0
	mov edx, 0

	; loop index = ecx: start at 0
	validate_digit_loop:
		cmp ecx, edi ; current number of checked digits vs num digits in the number
		je after_validate_loop ; stop trying to validate digits if all digits are valid

		mov bl, BYTE [esi] ; current char
		
		cmp bl, 10 ; if it is the new line char, no more digits to read
		je after_validate_loop

		cmp bl, 0x30 ; is it less than 48 (ascii for 0)
		jl validate_NAN_error ; NaN bc char val is too small

		cmp bl, 0x39 ; is it creater than 57 (ascii for 9)
		jg validate_NAN_error ; NaN bc char val is too big

		; else: char is a valid digit; check next char
		inc DWORD esi
		inc DWORD ecx
		jmp validate_digit_loop

	after_validate_loop:
		; if char val is not between 48 and 57 (before conversion), then it is not a digit --> user did not enter a number
		mov esi, double_buffer
		mov edi, [num_chars_in_double_buffer]
		call str_to_int ; user input in integer form now stored in temp_int
		mov eax, [temp_int]
		; at this point, the user input is a valid integer, now check its value
		; print too little if not
		cmp eax, 1
		jl validate_too_small_error

		; print too big if it is
		cmp eax, 1000
		jg validate_too_big_error

		; input is valid
		mov eax, validate_result
		mov DWORD [eax], 0
		popad
		ret
	
	validate_too_small_error:
		; print error message
		mov esi, too_small_msg
		mov edi, too_small_msg_len
		call write
		call nl
		; need to get input again
		mov eax, validate_result
		mov DWORD [eax], 1
		popad
		ret

	validate_too_big_error:
		; print error message
		mov esi, too_big_msg
		mov edi, too_big_msg_len
		call write
		call nl
		; need to get input again
		mov eax, validate_result
		mov DWORD [eax], 1
		popad
		ret

	; input is correct, do nothing
	validate_NAN_error:
		; print error message
		mov esi, nan_error_msg
		mov edi, nan_error_msg_len
		call write
		call nl
		; need to get input again
		mov eax, validate_result
		mov DWORD [eax], 1
		popad
		ret
; END OF VALIDATE USER INT
; ===========================================================================

; moves the null character into all bytes for this buffer
; input: NONE
; output:
;	[primes_buffer_str] = 0 at all bytes
zero_out_primes_str:
	pushad
	mov ecx, 0 ; loop counter
	mov eax, primes_buffer_str
	zero_out_primes_str_loop:
		mov DWORD [eax], 0
		add eax, 4
		add ecx, 4

		cmp ecx, 200
		jl zero_out_primes_str_loop
	popad
	ret

; moves the null character into all bytes for this buffer
; input: NONE
; output:
;	[primes_buffer] = 0 at all bytes
zero_out_primes_int:
	pushad
	mov ecx, 0 ; loop counter
	mov eax, primes_buffer_int
	zero_out_primes_int_loop:
		mov DWORD [eax], 0
		inc DWORD [eax]
		inc DWORD ecx

		cmp ecx, 168
		jl zero_out_primes_int_loop
	popad
	ret

; moves the null character into all bytes for this buffer
; input: NONE
; output:
;	[str200_buffer] = 0 at all bytes
zero_out_str200:
	pushad
	mov ecx, 0 ; loop counter
	mov eax, str200_buffer
	zero_out_str200_loop:
		mov DWORD [eax], 0
		add eax, 4
		add ecx, 4

		cmp ecx, 200
		jl zero_out_str200_loop
	popad
	ret

; moves the null character into all bytes for this buffer
; input: NONE
; output:
;	[str32_buffer] = 0 at all bytes
zero_out_str32:
	pushad
	mov ecx, 0 ; loop counter
	mov eax, str32_buffer
	zero_out_str32_loop:
		mov DWORD [eax], 0
		add eax, 4
		add ecx, 4

		cmp ecx, 32
		jl zero_out_str32_loop
	popad
	ret

; changes an integer to string
; input:
;	edi - unsigned integer to turn into string
; output:
; 	[double_buffer] - number in string form
; 	[temp_int] - length of the string
int_to_string:
	pushad
	call zero_out_str32
	mov eax, 0
	mov ebx, 0
	mov ecx, 0
	mov edx, 0

	mov eax, edi
	; ecx = loop counter
	int_to_string_loop:
		; get digit
		push ecx
		mov ecx, 10
		div ecx ; eax: quotient; edx:  remainder
		pop ecx
		mov ebx, str32_buffer
		add edx, 0x30 ; convert to ascii
		; add to double_buffer (reverse order; 123 -> "321")
		mov [ebx], edx
		inc DWORD ecx ; length of str++
		inc DWORD ebx ; next char
		cmp eax, 0 ; if there is still num left, continue dividing and converting digits to strings
		jl int_to_string_loop
	after_int_to_string_loop:
		; convert to normal order
		mov eax, temp_int
		mov [eax], ecx ; store the length of the string version
		mov ebx, double_buffer
		; esi = temp char
		convert_to_normal_order_loop:
			mov esi, [ebx] ; temp store current char
			sub DWORD ecx, 1 ; string change length to index
			push ecx
			add ecx, ebx
			mov edx, [ecx]
			mov [ebx], edx ; swap with corresponding char
			mov [ecx], esi
			pop ecx

			mov edx, ebx ; edx = ebx + ecx
			add edx, ecx

			cmp edx, ebx ; if ebx + ecx > ebx (comparing addresses)
			jg convert_to_normal_order_loop
	exit_int_to_string:
		popad
		ret

; save primes as seen
; input:
;	edi - prime num (unsigned int)
; output:
;	adds prime to primes_buffer_str and primes_buffer_int if it has not been seen yet
;	else it does nothing
insert_prime:
	pushad
	mov eax, primes_buffer_int
	mov ecx, 0 ; loop index
	check_if_prime_in_array_loop:
		; check primes int array to see if prime is a part of the loop
		cmp [eax], edi
		je exit_insert_prime ;	if so, leave functions early
		; increment array index
		inc DWORD eax
		mov ebx, 0
		cmp [eax], ebx ; went through whole array, prime was not present
		je add_primes_to_arrays
		jmp check_if_prime_in_array_loop

	add_primes_to_arrays:
		; right now, eax is currently an empty slot in primes_buffer_int; just add prime here
		mov [eax], edi
		; move string version of prime into primes_buffer_str
		; edi already has the num to convert to string
		call int_to_string ; 
		mov esi, double_buffer ; string form
		mov edi, temp_int ; length of string form

		mov ecx, primes_str_index
		mov eax, primes_buffer_str
		add eax, ecx ; offset starting position of array
		move_prime_str_to_seen_primes:
			mov ebx, [esi]
			mov [eax], ebx ; move char
			; update indicies
			inc DWORD eax
			inc DWORD [ecx]
			inc DWORD esi
			sub DWORD [edi], 1
			; check for loop exit
			mov ebx, 0
			cmp [edi], ebx
			jl move_prime_str_to_seen_primes
			; else completely done, move on to exit

	exit_insert_prime:
		popad
		ret

; calculates the factors of input n
; input:
;	edi - N
; output:
; 	changes [str200_buffer] to contain all factors
; 	[num_factors] to contain num of factors
;	prints all factors before exiting loop
calculate_factors:
	pushad
	mov ecx, num_factors
	mov DWORD [ecx], 0 ; zero out [num_factors]
	mov esi, str200_buffer
	call zero_out_str200
	mov ecx, 0 ; loop counter
	; given N, loop through each digit from 1 to N
	find_factors_loop:
		cmp ecx, edi ; if we went through all numbers from [1, N], exit
		jg after_find_factors_loop
		;	if digit divides N, num_factors++, add digit to str200_buffer
		mov eax, edi
		div ecx ; quotient in eax, remainder in edx
		cmp edx, 0
		je is_divisor
		; else: is not a divisor
			inc DWORD ecx
			jmp find_factors_loop

		is_divisor:
			inc DWORD ecx
			push ecx ; save current num we are checking with N
			mov edx, temp_int
			inc DWORD [edx] ; num_factors++
			call int_to_string ; [double_buffer] holds the string version of int, [temp_int] the length of string
			mov eax, double_buffer
			mov ecx, [temp_int]
			; reminder: esi = str200_buffer
			add_double_to_str200_loop:
				; while ecx > 0
				cmp ecx, 0
				je end_of_double_to_str200_loop
				; move char from double_buffer to str200_buffer
				mov ebx, [eax]
				mov [esi], ebx
				; increment ecx, and both buffers
				inc DWORD esi
				inc DWORD eax
				sub DWORD ecx, 1
			end_of_double_to_str200_loop:
				; add a space in str200 buffer
				mov ebx, 0x20
				mov [esi], ebx ; ascii for 'space'
				inc DWORD esi
				mov ecx, num_factors
				inc DWORD [ecx]
				pop ecx ; retrieve the num we are checking with N
				jmp find_factors_loop


	after_find_factors_loop:
		; mov esi, str_200_buffer
		mov eax, [num_factors]
		; mov ebx, primes_buffer_str
		; edi is the number being factored
		cmp eax, 2 ; if prime, try to insert
		call insert_prime
		popad
		ret
; END OF CALCULATE_FACTORS
; ====================================================================================






say_goodbye:
	mov esi, goodbye_text
	mov edi, goodbye_text_len
	call write
	mov esi, str32_buffer
	mov edi, 0x20
	call write
	ret

; ===============================================================================================================
; /\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\//\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\
; ===============================================================================================================
; START OF MAIN
global _start
_start:
	CDQ
	call zero_out_primes_str
	call zero_out_primes_int
	mov eax, primes_str_index
	mov DWORD [eax], 0
	; display name + program title
	mov esi, name_and_title
	mov edi, name_and_title_len
	call write
	call nl
    ; display instructions
	mov esi, description1
	mov edi, description1_len
	call write
	call nl
	mov esi, description2
	mov edi, description2_len
	call write
	call nl2
    ; get user name
	mov esi, name_prompt
	mov edi, name_prompt_len
	call write
	call get_user_str32
    ; ===============================================================
    ; UNTIL USER SAYS STOP:
    ; 	lowerbound prompt [1, 1000]
	;		validate user input
	get_lowerbound:
		mov esi, lowerbound_prompt
		mov edi, lowerbound_prompt_len
		call write
		call get_user_double

		mov esi, double_buffer
		mov edi, 0x0B
		call validate_user_int ; 0 --> valid input,  1 --> invalid input
		mov edi, [validate_result]
		cmp edi, 1 ; if invalid, reprompt
		je get_lowerbound
	;	upperbound prompt [1, 1000]
	;		validate user input
	get_upperbound:
		mov esi, upperbound_prompt
		mov edi, upperbound_prompt_len
		call write
		call get_user_double

		mov esi, double_buffer
		mov edi, 0x0B
		call validate_user_int ; 0 --> valid input,  1 --> invalid input
		mov edi, [validate_result]
		cmp edi, 1 ; if invalid, reprompt
		je get_upperbound

    ; 	calculate and display all factors 1 to n per number in [lowerbound, upperbound]
    	; 	tell the user if the integer is prime or perfect square
	mov ecx, [lowerbound]
	find_factors_of_nums_in_range_loop:
		mov edi, ecx ; current number N
		call calculate_factors
		mov eax, 1 ; REMOVE
		mov ebx, 0 ; REMOVE
		int 0x80 ; REMOVE
		mov esi, str200_buffer
		mov edi, 200
		push esi
		push edi
		; print (   'N: '   )
		mov edi, ecx
		call print_num ; print 'N'
		mov esi, colon
		mov edi, colon_len
		call write ; print ': '
		pop edi
		pop esi
		call write ; print all factors to screen

		mov eax, [num_factors]
		cmp eax, 2; check for prime
		je print_prime_num
		mov ebx, 2
		div ebx ; num factors % 2 (stored in edx)
		cmp edx, 1; check for perfect square
		je print_perfect_square

		; else: neither, continue looping
		prep_for_next_inrange_loop: ; iterate ecx, make sure ecx is less than or equal to upperbound
			inc DWORD [ecx]
			cmp ecx, [upperbound]
			jle find_factors_of_nums_in_range_loop
			jmp print_all_primes_seen ; else: stop looping, we went over everything from lower -> upper bound

		print_prime_num:
			mov esi, prime_text
			mov edi, prime_text_len
			call write
			call nl
			jmp prep_for_next_inrange_loop
		print_perfect_square:
			mov esi, PS_text
			mov edi, PS_text_len
			call write
			call nl
			jmp prep_for_next_inrange_loop
	; =============== END OF FIND FACTORS LOOP ===================================
	print_all_primes_seen:
	;	print all primes seen in the range
		mov esi, primes_buffer_str
		mov edi, 200
		call write
		call nl

    ; terminate program (say goodbye to user)
	; sys_exit with code 0
	call say_goodbye
	mov eax, 1
	mov ebx, 0
	int 0x80