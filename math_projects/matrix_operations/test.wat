;; WASM test file for writing hello world
(module
(import "console" "log" func $log(param i32 i32)) ;; import log function
(import "js" "mem" (memory 1)) ;; import 1 page of memory (54KB)

;; Data section
(data (i32.const0) "Hello World From Assembly!")

;; Function Declaration
(func (export "helloWorld")
    i32.const 0 ;; pass offset 0 to log
    i32.const 26 ;; length of string
    call $log
)
) ;; end of module