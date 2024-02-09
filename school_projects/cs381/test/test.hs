h _ [] = 0
h y (x:xs) 
    | y > 0 = y + h (y) xs
    | otherwise = 0

g _ [] = []
g y (x:xs) 
    | y>0       = g (y-1) xs
    | otherwise = xs

-- func []
func_tail :: [[Integer]] -> [[Integer]]
func_tail list = map tail list

-- func_head :: [[Integer]] -> [[Integer]]
-- func_head list = map head list

func_rev :: [[Integer]] -> [[Integer]]
func_rev list = map reverse list

main :: IO ()
main = do
    -- print (h 5 [1,2,3,4,5,6,7])
    -- print(func_tail [[1,2,3], [3,4], [5,6]])
    -- print(func_head [[1,2,3], [3,4], [5,6]])
    print(func_rev [[1,2,3], [3,4], [5,6]])
    print (func_rev [1,2,4])
    -- print( g 1 [1,2,3,4,5,6,7,8,9,10] )