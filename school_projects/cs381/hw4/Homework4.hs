-- Homework 4 - Semantics
-- Name:  Brandyn Tucknott
-- Last Updated: 16 February 2024
-- Description: completion of CS 381 Hw 4
--      This program describes a datatype which allows pushing to and operating on elements in a stack

module Homework4 where
import Data.Maybe

type Prog = [Cmd]

-- Note: Add derving(Show,Eq) to all data defivitions
data Cmd
    = LDI Int
    | LDB Bool
    | ADD
    | MULT
    | DUP
    | LEQ
    | IFELSE Prog Prog
    deriving (Show, Eq)



-- Sample programs
p1 = [LDI 5, ADD, MULT]
p2 = [LEQ, IFELSE [LDI 7, ADD] [MULT]]
p3 = [LDB False, DUP]	
--	 
data Val = I Int | B Bool
    deriving(Show, Eq)

type Stack = [Val]

-- Sample stacks
s1 = [I 1, I 2, I 3, I 5]
s2 = [B False, I 5, I 7]
s3 = [I 10, I 4, B True]
--
data Result = S Stack | Error
    deriving(Show, Eq)
		
semCmd :: Cmd -> Stack -> Maybe Stack
-- load an integer onto the stack
semCmd (LDI i) s = Just((I i):s)

-- load a boolean onto the stack
semCmd (LDB b) s = Just((B b):s)

-- Add the top values on the stack and push result onto the stack
-- If there aren't two integers return Nothing
semCmd ADD ((I i):(I i'):s) = Just ((I (i + i')):s)
semCmd ADD _ = Nothing

-- _DONE semCmd MULT
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

-- _DONE duplicate DUP to duplicate the top value on the
-- stack both integers and boolean values can be duplicated
-- if the stack is empty return Nothing
semCmd DUP ((I i):s) = Just((I i):(I i):s) -- append the removed element and an extra copy
semCmd DUP ((B b):s) = Just((B b):(B b):s) -- one for Int, one for Bool
semCmd DUP _ = Nothing

-- Catch any undefined commands or errors with wild cards
semCmd _ _ = Nothing -- anything that reaches here is garbage; catch it and delete it

-- sem applies all the commands in the program to the stack

sem :: Prog -> Stack -> Maybe Stack
sem [] [] = Nothing    -- empty stack and no program
sem []  s = Just s     -- no program
sem (c:cs) s = case semCmd c s of
                Just s' -> sem cs s'
                Nothing -> Nothing	-- stop execution on Nothing		

-- to run call sem and replace nothing with Error and
-- remove the Just from the stack to return S stack
run :: Prog -> Stack -> Result
run p s = if isNothing((sem p s))then Error
		  else S (fromJust(sem p s))