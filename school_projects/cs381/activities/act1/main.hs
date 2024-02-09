range :: Integer -> [Integer]
range n
    | n <= 0 = []
    | otherwise = n : range (n - 1)

copies :: Integer -> [Integer] -> [[Integer]]
copies n list
    | n <= 0 = []
    | otherwise = list : copies (n - 1) list

-- works according to the test cases, but the test cases are wrong
greaterList :: Ord a => a -> [a] -> [a]
greaterList _ [] = []
greaterList n (x:xs)
    | x <= n = greaterList n xs
    | otherwise = x : greaterList n xs

first :: Ord a => [a] -> a
first [] = ""
first (x) = x
first (x:xs) = x

allSame :: Ord a => [a] -> a
allSame [] = False
allSame [x] = True
allSame (x:xs)
    | x == first xs = False
    | otherwise = allSame xs

-- minmax :: 
-- minmax

main :: IO ()
main = do
    putStrLn "\n Range"
    print (range 0)
    print (range 1)
    print (range 4)
    print (range 5)
    putStrLn " \n Copies "
    print (copies 0 [])
    print (copies 1 [])
    print (copies 3 [1, 2,3,4])
    print (copies 1 [2, 3])
    print (copies 0 [1, 2, 3])
    putStrLn " \n greaterList "
    print (greaterList 5 [3, 8, 1,9,2])
    print (greaterList 8 [])
    print (greaterList 'g' "Hello")
    print (greaterList 2.3 [6.1, 1.2, 7.5,0])
    print (greaterList 8 [1,2,4,7])
    -- putStrLn " \n All same "
    -- print (allSame "aaa")
    -- print (allSame ['a','b','c'])
    -- print (allSame [])
    -- print (allSame ['x'])
    -- print (allSame "Hello")
    -- print (allSame ['a','a'])
    -- print (allSame "" )
    -- putStrLn "\n Minmax "
    -- print (minmax [1])
    -- print (minmax [2,2,2])
    -- print (minmax [])
    -- print (minmax [3,5,1,9,10])