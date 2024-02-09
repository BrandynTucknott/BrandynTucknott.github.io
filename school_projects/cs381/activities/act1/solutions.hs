module Act1Functions where

range :: Int -> [Int]
range 0 = []
range n = n : range (n - 1)

copies :: Int -> [Int] -> [[Int]]
copies 0 xs = []
copies 1 xs = [xs]
copies n xs = xs : copies (n - 1) xs

greaterList :: Ord a => a -> [a] -> [a]
greaterList y [] = []
greaterList y (x:xs)
    | x > y = x : greaterList y xs
    | x <= y = greaterList y xs

allSame :: [Char] -> Bool
allSame [] = False
allSame [x] = True
allSame (x:y:xs)
    | x == y = allSame(y:xs)
    | otherwise = False

minmax :: [Int] -> (Int, Int)
minmax [] = (0, 0)
minmax xs = (minimum xs, maximum xs)