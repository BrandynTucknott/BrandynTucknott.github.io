-- Homework 3 template
module Sentence where

-- Grammar for the animal sentence language:
--
--   <sentence> ->  <noun> <verb> [<noun>]  
--               	|  <sentence> `and` <sentence>
--				 	
--   <noun> 	-> <adj> <noun> | <noun> `and` <noun>
--					| `cats` | `dogs` | `bears` | `goats`

--   <verb>		->  `chase` | `cuddle` | `hug` | `scare`
--   <adj>		->	`sad` | `small` | `big` | `happy`
data Sentence
   = NVN Noun Verb Noun -- noun verb noun sentence
   | NV Noun Verb -- noun verb sentence
   | And Sentence Sentence-- sentence and sentence
   | End
  deriving (Eq,Show)

data Adj = Sad | Small | Big | Happy -- adjectives
  deriving (Eq,Show)

data Noun =
  NP Adj Noun -- Noun phrase
  | NAnd Noun Noun -- noun and noun
  | Bears | Cats | Dogs | Goats -- list of nouns
  deriving (Eq,Show)

data Verb = Chase | Cuddle | Hug | Scare
  deriving (Eq,Show)



ex1 :: Sentence
ex1 = NVN Cats Hug Dogs

ex2 :: Sentence
ex2 = NVN (NP Small Cats) Hug Dogs

ex3 :: Sentence
ex3 = NVN (NAnd Dogs Cats) Chase Goats

ex4 :: Sentence
ex4 = NVN (NAnd (NP Happy Dogs) Cats) Chase Goats

ex5 :: Sentence
ex5 = NV Bears Hug


-- | Build a sentence from a noun verb noun.
-- | buildS2 Cats Hug Cats
-- | NVN Cats Hug Cats
buildS2 :: Noun -> Verb -> Noun -> Sentence
buildS2 n1 v n2 = (NVN n1 v n2)

-- | Build a sentence from a noun verb 
-- | buildS1 Cats Hug 
-- | NV Cats Hug 
buildS1 :: Noun -> Verb ->Sentence
buildS1 n v = (NV n v)


-- | Build a noun phrase from an adjective and noun
-- | buildNP Happy Dogs
-- | NP Happy Dogs
buildNP :: Adj -> Noun -> Noun
buildNP a n = (NP a n)

-- | Build a noun conjunction from two nouns
-- | buildNAnd Dogs Cats
-- | NAnd Dogs Cats 
buildNAnd :: Noun -> Noun -> Noun
buildNAnd n1 n2 = (NAnd n1 n2)

-- | Build a sentence that is a conjunction of a list of other sentences.
-- | conjunction [ex1, ex2]
-- | And (NVN Cats Hug Dogs) (NVN (NP Small Cats) Hug Dogs)
-- | The End is used if no sentences are given
conjunction :: [Sentence] -> Sentence
conjunction []    = End
conjunction [s] = s
conjunction (s:xs) = (And s (conjunction xs))


-- | Pretty print a sentence.
pretty :: Sentence -> String
pretty (NVN s v o) = prettyNoun s ++ " " ++ prettyVerb v ++ " " ++ prettyNoun o
pretty (And l r)   = pretty l ++ " and " ++ pretty r
pretty (NV s v)     = prettyNoun s ++ " " ++ prettyVerb v
pretty (End) = "."

-- | Pretty print a noun.
prettyNoun :: Noun -> String
prettyNoun Cats  = "cats"
prettyNoun Dogs  = "dogs"
prettyNoun Goats  = "goats"
prettyNoun Bears  = "bears"


prettyNoun (NP a n) = prettyAdj a ++ " " ++ prettyNoun n
prettyNoun (NAnd m n) = prettyNoun m ++ " and " ++prettyNoun n

-- | Pretty print a verb.
prettyVerb :: Verb -> String
prettyVerb Chase  = "chase"
prettyVerb Cuddle  = "cuddle"
prettyVerb Hug  = "hug"
prettyVerb Scare  = "scare"

-- | Pretty print an adjective.
prettyAdj :: Adj -> String
prettyAdj Sad  = "sad"
prettyAdj Small  = "small"
prettyAdj Big  = "big"
prettyAdj Happy  = "happy"


-- | Does the sentence contain only chase and scare?
-- | isMean ex2 => False
-- | isMean ex3 => True
isMean :: Sentence -> Bool
isMean (NVN _ Chase _)  = True
isMean (NVN _ Scare _) = True
isMean (NVN _ Cuddle _) = False
isMean (NVN _ Hug _) = False
isMean (NV _ Chase)  = True
isMean (NV _ Scare) = True
isMean (NV _ Cuddle) = False
isMean (NV _ Hug) = False
isMean (And s1 s2) = isMean s1 && isMean s2
isMean End = True

-- helper function for wordCount, determines wether the input noun is a singular noun or paired with an adjective/noun
wordCountNoun :: Noun -> Int
wordCountNoun (NP _ n) = wordCountNoun n + 1 -- 1 adjective + num words in noun
wordCountNoun (NAnd n1 n2) = wordCountNoun n1 + wordCountNoun n2 + 1 -- num words in noun1 + num words in noun2 + 1 for connecting nouns "and"
wordCountNoun Bears = 1
wordCountNoun Cats = 1
wordCountNoun Dogs = 1
wordCountNoun Goats = 1

-- |Count the number of words in a sentence
-- | wordCount ex4
--    6
wordCount :: Sentence -> Int
wordCount End = 0
wordCount (NV n _) = wordCountNoun n + 1 -- num words in noun + 1 verb
wordCount (NVN n1 _ n2) = wordCountNoun n1 + wordCountNoun n2 + 1 -- num words in noun1 + num words in noun2 + 1 verb
wordCount ( And l r ) = wordCount l + wordCount r + 1 -- +1 for connecting sentences "and"

main :: IO ()
main = 
  do
    print(pretty ex1)
    print(wordCount ex1)
    print(isMean ex1)

    putStrLn("")

    print(pretty ex2)
    print(wordCount ex2)
    print(isMean ex2)

    putStrLn("")

    print(pretty ex3)
    print(wordCount ex3)
    print(isMean ex3)

    putStrLn("")

    print(pretty ex4)
    print(wordCount ex4)
    print(isMean ex4)

    putStrLn("")

    print(pretty ex5)
    print(wordCount ex5)
    print(isMean ex5)

    putStrLn("")

    let c1 = conjunction [ex1, ex2]
    print(pretty c1)
    print(wordCount c1)
    print(isMean c1)