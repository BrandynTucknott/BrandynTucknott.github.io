-- Homework 4 - Template
-- Name:  Brandyn Tucknott
-- Remove all COMPLETE labels and add code & comments
-- Complete the header comments

module Homework4 where
import Data.Maybe

type Prog 	= [Cmd]

-- Note: Add derving(Show,Eq) to all data defivitions
data Cmd 	--COMPLETE



-- Sample programs
p1 = [LDI 5, ADD, MULT]
p2 = [LEQ, IFELSE [LDI 7, ADD] [MULT]]
p3 = [LDB False, DUP]	
--	 
data Val = -- COMPLETE

type Stack = [Val]

-- Sample stacks
s1 = [I 1, I 2, I 3, I 5]
s2 = [B False, I 5, I 7]
s3 = [I 10, I 4, B True]
--
data Result = -- COMPLETE
		
semCmd :: Cmd -> Stack -> Maybe Stack
-- load an integer onto the stack
semCmd (LDI i) s = Just((I i):s)

-- load a boolean onto the stack
-- COMPLETE

-- Add the top values on the stack and push result onto the stack
-- If there aren't two integers return Nothing
semCmd ADD ((I i):(I i'):s) = -- COMPLETE
semCmd ADD _ =  -- COMPLETE

-- COMPLETE semCmd MULT &  comments
--

-- If top value is less than next push True onto stack
-- otherwise push false
semCmd LEQ ((I i):(I i'):s) = Just ((B(i <= i')):s)
-- COMPLETE

-- If top of stack is True execute first program
-- If False execute second program

semCmd (IFELSE [] _ ) ((B True):s) = Just s 
semCmd (IFELSE p1 _ ) ((B True):s) = sem p1 s
semCmd (IFELSE _ [] ) -- COMPLETE 
semCmd (IFELSE _ p2 ) -- COMPLETE

-- complete duplicate DUP to duplicate the top value on the
-- stack both integers and boolean values can be duplicated
-- if the stack is empty return Nothing
semCmd -- COMPLETE
semCmd -- COMPLETE

-- Catch any undefined commands or errors
-- COMPLETE with wild cards

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

