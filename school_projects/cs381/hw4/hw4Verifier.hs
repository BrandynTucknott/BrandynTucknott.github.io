import Homework4
-- HW4 verifier
-- Written by Matthew Beitler
-- This verifier requires you use deriving (Eq,Show) on:
--     data Cmd , Val and Result

main :: IO()
main = do
    -- setup
    let program1  = [ADD] 
    let program2  = [ADD]
    let program3  = [ADD]
    let program4  = [ADD, ADD] 
    let program5  = [IFELSE [ADD] [MULT]] 
    let program6  = [IFELSE [ADD] [MULT]] 
    let program7  = [LEQ, IFELSE [ADD] [MULT]] 
    let program8  = [LEQ, IFELSE [ADD, DUP] [MULT]] 
    let program9  = [LEQ] 
    let program10 = [LEQ] 
    let program11 = [ADD, ADD] 
    let program12 = [IFELSE [ADD] [LDI 10, MULT], DUP] 
    let program13 = [IFELSE [ADD] [LDI 10, MULT], DUP] 
    let program14 = [LDI 10, LDI 5, ADD] 
    let program15 = [LDB True, DUP, DUP]


    let stack1    = [I 1, I 3]
    let stack2    = [B True, I 3, I 5]
    let stack3    = [I 3, I 5, I 7]
    let stack4    = [I 3, I 5, I 7]
    let stack5    = [B True, I 5, I 8]
    let stack6    = [B False, I 5, I 8]
    let stack7    = [I 10, I 3, I 5, I 8]
    let stack8    = [I 1, I 3, I 5, I 8]
    let stack9    = [I 1, I 3, I 5, I 8]
    let stack10   = [B True, I 3, I 5, I 8]
    let stack11   = [I 3, I 5]
    let stack12   = [B False, I 7]
    let stack13   = [B True, I 7]
    let stack14   = []
    let stack15   = []


    let output1   = S [I 4]
    let output2   = Error
    let output3   = S [I 8,I 7]
    let output4   = S [I 15]
    let output5   = S [I 13]
    let output6   = S [I 40]
    let output7   = S [I 40]
    let output8   = S [I 13,I 13]
    let output9   = S [B True,I 5,I 8]
    let output10  = Error
    let output11  = Error
    let output12  = S [I 70,I 70]
    let output13  = Error
    let output14  = S [I 15]
    let output15  = S [B True,B True,B True]

-- requirement waring
    putStrLn "******************** Warning ********************"
    putStrLn "This verifier requires you use deriving (Eq,Show) on:"
    putStrLn "  - data Cmd"
    putStrLn "  - data Val"
    putStrLn "  - data Result\n\n"

-- run examples

    -- Example 1
    -- print command
    putStrLn "Example 1:"
    putStrLn ("run " ++ (show program1) ++ " " ++ (show (stack1 :: [Val])))

    -- evaluate command
    let result = run program1 stack1
    putStrLn ("Result: " ++ show (result))
    if ((result) == S [I 4]) then putStrLn "Example 1 Passed\n"
    else putStrLn ("Example 1 Failed - Expecting: " ++ (show output1) ++ "\n")


    -- Example 2
    putStrLn "Example 2:"
    putStrLn ("run " ++ (show program2) ++ " " ++ (show (stack2 :: [Val])))

    let result = run program2 stack2
    putStrLn ("Result: " ++ show (result))
    if ((result) == (output2)) then putStrLn "Example 2 Passed\n"
    else putStrLn ("Example 2 Failed - Expecting: " ++ (show output2) ++ "\n")


    -- Example 3
    putStrLn "Example 3:"
    putStrLn ("run " ++ (show program3) ++ " " ++ (show (stack3 :: [Val])))

    let result = run program3 stack3
    putStrLn ("Result: " ++ show (result))
    if ((result) == (output3)) then putStrLn "Example 3 Passed\n"
    else putStrLn ("Example 3 Failed - Expecting: " ++ (show output3) ++ "\n")


    -- Example 4
    putStrLn "Example 4:"
    putStrLn ("run " ++ (show program4) ++ " " ++ (show (stack4 :: [Val])))

    let result = run program4 stack4
    putStrLn ("Result: " ++ show (result))
    if ((result) == (output4)) then putStrLn "Example 4 Passed\n"
    else putStrLn ("Example 4 Failed - Expecting: " ++ (show output4) ++ "\n")


    -- Example 5
    putStrLn "Example 5:"
    putStrLn ("run " ++ (show program5) ++ " " ++ (show (stack5 :: [Val])))

    let result = run program5 stack5
    putStrLn ("Result: " ++ show (result))
    if ((result) == (output5)) then putStrLn "Example 5 Passed\n"
    else putStrLn ("Example 5 Failed - Expecting: " ++ (show output5) ++ "\n")


    -- Example 6
    putStrLn "Example 6:"
    putStrLn ("run " ++ (show program6) ++ " " ++ (show (stack6 :: [Val])))

    let result = run program6 stack6
    putStrLn ("Result: " ++ show (result))
    if ((result) == (output6)) then putStrLn "Example 6 Passed\n"
    else putStrLn ("Example 6 Failed - Expecting: " ++ (show output6) ++ "\n")


    -- Example 7
    putStrLn "Example 7:"
    putStrLn ("run " ++ (show program7) ++ " " ++ (show (stack7 :: [Val])))

    let result = run program7 stack7
    putStrLn ("Result: " ++ show (result))
    if ((result) == (output7)) then putStrLn "Example 7 Passed\n"
    else putStrLn ("Example 7 Failed - Expecting: " ++ (show output7) ++ "\n")


    -- Example 8
    putStrLn "Example 8:"
    putStrLn ("run " ++ (show program8) ++ " " ++ (show (stack8 :: [Val])))

    let result = run program8 stack8
    putStrLn ("Result: " ++ show (result))
    if ((result) == (output8)) then putStrLn "Example 8 Passed\n"
    else putStrLn ("Example 8 Failed - Expecting: " ++ (show output8) ++ "\n")


    -- Example 9
    putStrLn "Example 9:"
    putStrLn ("run " ++ (show program9) ++ " " ++ (show (stack9 :: [Val])))

    let result = run program9 stack9
    putStrLn ("Result: " ++ show (result))
    if ((result) == (output9)) then putStrLn "Example 9 Passed\n"
    else putStrLn ("Example 9 Failed - Expecting: " ++ (show output9) ++ "\n")


    -- Example 10
    putStrLn "Example 10:"
    putStrLn ("run " ++ (show program10) ++ " " ++ (show (stack10 :: [Val])))

    let result = run program10 stack10
    putStrLn ("Result: " ++ show (result))
    if ((result) == (output10)) then putStrLn "Example 10 Passed\n"
    else putStrLn ("Example 10 Failed - Expecting: " ++ (show output10) ++ "\n")


    -- Example 11
    putStrLn "Example 11:"
    putStrLn ("run " ++ (show program11) ++ " " ++ (show (stack11 :: [Val])))

    let result = run program11 stack11
    putStrLn ("Result: " ++ show (result))
    if ((result) == (output11)) then putStrLn "Example 11 Passed\n"
    else putStrLn ("Example 11 Failed - Expecting: " ++ (show output11) ++ "\n")


    -- Example 12
    putStrLn "Example 12:"
    putStrLn ("run " ++ (show program12) ++ " " ++ (show (stack12 :: [Val])))

    let result = run program12 stack12
    putStrLn ("Result: " ++ show (result))
    if ((result) == (output12)) then putStrLn "Example 12 Passed\n"
    else putStrLn ("Example 12 Failed - Expecting: " ++ (show output12) ++ "\n")


    -- Example 13
    putStrLn "Example 13:"
    putStrLn ("run " ++ (show program13) ++ " " ++ (show (stack13 :: [Val])))

    let result = run program13 stack13
    putStrLn ("Result: " ++ show (result))
    if ((result) == (output13)) then putStrLn "Example 13 Passed\n"
    else putStrLn ("Example 13 Failed - Expecting: " ++ (show output13) ++ "\n")


    -- Example 14
    putStrLn "Example 14:"
    putStrLn ("run " ++ (show program14) ++ " " ++ (show (stack14 :: [Val])))

    let result = run program14 stack14
    putStrLn ("Result: " ++ show (result))
    if ((result) == (output14)) then putStrLn "Example 14 Passed\n"
    else putStrLn ("Example 14 Failed - Expecting: " ++ (show output14) ++ "\n")


    -- Example 15
    putStrLn "Example 15:"
    putStrLn ("run " ++ (show program15) ++ " " ++ (show (stack15 :: [Val])))

    let result = run program15 stack15
    putStrLn ("Result: " ++ show (result))
    if ((result) == (output15)) then putStrLn "Example 15 Passed\n"
    else putStrLn ("Example 15 Failed - Expecting: " ++ (show output15) ++ "\n")