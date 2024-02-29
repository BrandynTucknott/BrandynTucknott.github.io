-- module Main where
module HW5sol where
import HW5types
import Data.Maybe

-- original hw4 Stack code
semCmd :: Cmd -> Stack -> Maybe Stack
-- load an integer onto the stack
semCmd (LDI i) s = Just((I i):s)

-- load a boolean onto the stack
semCmd (LDB b) s = Just((B b):s)

-- Add the top values on the stack and push result onto the stack
-- If there aren't two integers return Nothing
semCmd ADD ((I i):(I i'):s) = Just ((I (i + i')):s)
semCmd ADD _ = Nothing

-- semCmd MULT
semCmd MULT ((I i):(I i'):s) = Just ((I (i * i')):s)
semCmd MULT _ = Nothing

-- If top value is less than next push True onto stack
-- otherwise push false
semCmd LEQ ((I i):(I i'):s) = Just ((B (i <= i')):s)
semCmd LEQ _ = Nothing


-- If top of stack is True execute first program
-- If False execute second program
semCmd (IFELSE [] _ ) ((B True):s) = Just s
semCmd (IFELSE p1 _ ) ((B True):s) = sem p1 s
semCmd (IFELSE _ [] ) ((B False):s) = Just s
semCmd (IFELSE _ p2 ) ((B False):s) = sem p2 s
semCmd (IFELSE _ _ ) _ = Nothing -- the IFELSE parameters do not make sense: ignore

-- duplicate DUP to duplicate the top value on the
-- stack both integers and boolean values can be duplicated
-- if the stack is empty return Nothing
semCmd DUP ((I i):s) = Just((I i):(I i):s) -- append the removed element and an extra copy
semCmd DUP ((B b):s) = Just((B b):(B b):s) -- one for Int, one for Bool
semCmd DUP _ = Nothing

-- _DONE semCmd DEC
semCmd DEC ((I i):s) = Just ((I (i - 1)):s)
semCmd DEC _ = Nothing

-- _DONE semCmd SWAP
semCmd SWAP ((I e):(I e'):s) = Just ( (I e'):(I e):s )
semCmd SWAP ((I e):(B e'):s) = Just ( (B e'):(I e):s )
semCmd SWAP ((B e):(I e'):s) = Just ( (I e'):(B e):s )
semCmd SWAP ((B e):(B e'):s) = Just ( (B e'):(B e):s )
semCmd SWAP _ = Nothing

-- _DONE semCmd POP
semCmd (POP k) (_:s) = semCmd (POP (k - 1)) s
semCmd (POP 1) (_:s) = Just s
semCmd (POP k) (_:[])
    | k >= 2 = Nothing  -- tried to pop more than the stack had
    | otherwise = Just []

semCmd (POP _) [] = Nothing


-- Catch any undefined commands or errors with wild cards
semCmd _ _ = Nothing -- anything that reaches here is garbage; catch it and delete it

-- helper function, returns the minimum between the inputs
-- input: Int a, Int b
-- output: min{a, b}
minVal :: Rank -> Rank -> Rank
minVal a b
    | a < b = a
    | otherwise = b

-- given a command, outputs the rank of the command
-- input: Cmd
-- output: Int
rankC :: Cmd -> CmdRank
rankC (LDI _) = (0, 1)
rankC (ADD) = (2, 1)
rankC (MULT) = (2, 1)
rankC (DUP) = (1, 2)
rankC (DEC) = (1, 1)
rankC (SWAP) = (2, 2)
rankC (POP k) = (k, 0)
rankC (LDB _) = (0, 1)
rankC (LEQ) = (2, 1)
rankC (IFELSE p1 p2) =
    let
        p1_rank = calculateProgRank p1 0 -- calculate rank of program with empty stack
        p2_rank = calculateProgRank p2 0
    in 
        (1, minVal p1_rank p2_rank)

-- helper function to compute the CmdRank of a given program
-- input: program, rank
-- output: CmdRank
calculateProgRank :: Prog -> Rank -> Rank
-- calculateProgRank [] _ = 0
calculateProgRank (cmd:s) srank =
    let 
        (out_stack, in_stack) = rankC cmd
        _srank = srank - out_stack + in_stack  -- simulate stack operation being done
    in
        if s == [] then _srank -- no error at all, return program rank
        else calculateProgRank s _srank  -- no error so far, continue looking


-- helper function to compute the rank of a program given a program and stack size
-- given a program, computes it's rank
-- input: program ([Cmd]), stack rank (Int)
-- output: program rank
rank :: Prog -> Rank -> Maybe Rank
rank (cmd:s) srank =
    let 
        (out_stack, in_stack) = rankC cmd
        _srank = srank - out_stack  -- simulate stack operation being done
    in
        if _srank < 0 then Nothing -- check if stack rank makes sense (NO)
        else    -- (YES), either keep checking or return prog rank
            let __srank = _srank + in_stack in -- simulate a successful completion of a cmd
            if s == [] then Just __srank -- no error at all, return program rank
            else rank s __srank  -- no error so far, continue looking
rank [] s = Just s

-- given a program, computes it's rank
-- input: program, value stack rank
-- output: program rank
rankP :: Prog -> Rank -> Maybe Rank
rankP p s = rank p s
rankP [] s = Just s

-- sem applies all the commands in the program to the stack
sem :: Prog -> Stack -> Maybe Stack
sem [] [] = Nothing    -- empty stack and no program
sem []  s = Just s     -- no program
sem (c:cs) s = case semCmd c s of
    Just s' -> sem cs s'
    Nothing -> Nothing  -- stop execution on Nothing

-- to run call sem and replace nothing with Error and
-- remove the Just from the stack to return S stack
run :: Prog -> Stack -> Result
run p s = 
    -- check stack for RankError
    -- check for Type Error
    -- check for Nothing
        if isNothing (rankP p (length s)) then RankError
        else if isNothing (sem p s) then TypeError
        else A (fromJust (sem p s))

-- main :: IO()
-- main =
--     do
--         print (run [LDI 8] [B False])