{- HW2.hs
-- Author: Brandyn Tucknott
-- Completion Date: 30 January 2024
-}

module HW2 where
import HW2types
import Data.List (sort, nub)
-- =================================================================================================
-- =================================================================================================
-- Problem 1: Trees
-- No duplicate values in tree nodes

{- sizeTree
input: tree
output: Int
    number of nodes in the tree
    size of a leaf is 0
-}
sizeTree :: Tree -> Int
sizeTree Leaf = 0
sizeTree (Node _ left right) = 1 + sizeTree(left) + sizeTree(right)

{- height
input: tree
output: Int
    height of the tree: number of edges in the longest path from the root node
    height of a leaf: -1
    height of a singleton: 0
-}
height :: Tree -> Int
height Leaf = -1
height (Node _ left right) = 1 + max (height left) (height right)

{- treeSum
input: tree
output: Int
    sum of all nodes
    treeSum of a leaf is 0
-}
treeSum :: Tree -> Int
treeSum Leaf = 0
treeSum (Node n left right) = n + treeSum left + treeSum right

{- overload '==' to return True if two trees contain the same value and False otherwise
    * two leafs are equivalent
-}
-- createArray (helper function)
-- input: tree
-- output: Int array
--      all values from nodes in the tree
createArray :: Tree -> [Int]
createArray Leaf = []
createArray (Node n left right) = n:createArray(left) ++ createArray(right)

-- isEqual (helper function)
-- input: two Int arrays
--      they must be of equal length
-- output: boolean
--      True if the arrays are equal, False if not
isEqual :: [Int] -> [Int] -> Bool
isEqual [] [] = True
isEqual (x:xs) (y:ys)
    | x /= y = False
    | otherwise = isEqual xs ys

instance Eq Tree where
    -- (==) :: Eq -> Tree -> Tree -> Bool
    Leaf == Leaf = True -- Assume two leafs are equivalent
    Leaf == Node n l r = False
    Node n l r == Leaf = False
    Node n1 left1 right1 == Node n2 left2 right2 =
        let 
            -- create two arrays + sort
            arr1 = sort( createArray (Node n1 left1 right1) )
            arr2 = sort( createArray (Node n2 left2 right2) )
        in
        -- cmp size
        if length(arr1) /= length(arr2) then False
        -- cmp elements
        else isEqual arr1 arr2

-- splitList (helper function)
-- divide the given list into two halves
-- input: array of Ints
-- output: duple of two arrays (half the original array each)
splitList :: [Int] -> ([Int], [Int])
splitList [] = ([], [])
splitList [x] = ([x], [])
splitList (x:y:xs) = 
    let 
        (first, second) = splitList xs 
    in 
        (x:first, y:second)

-- createTree (helper function)
-- input: list of Int
-- output: tree
createTree :: [Int] -> Tree
createTree [] = Leaf
createTree (x:xs) = Node x (createTree first_half) (createTree second_half)
    where
        (first_half, second_half) = splitList xs
    

{- mergeTrees
input: 2 trees t1, t2
output: tree
    contains all the values of t1 and t2
-}
mergeTrees :: Tree -> Tree -> Tree
mergeTrees Leaf Leaf = Leaf
mergeTrees tree Leaf = tree
mergeTrees Leaf tree = tree
-- mergeTrees (Node n left right) tree = Node n (mergeTrees left tree) (mergeTrees right tree)
mergeTrees (Node n1 left1 right1) (Node n2 left2 right2) =
    -- create two lists (one for each tree)
    let
        arr1 = createArray (Node n1 left1 right1)
        arr2 = createArray (Node n2 left2 right2)
    in
        -- combine the lists
        -- nub out the extra elements
        -- turn list into tree
        createTree ( nub (arr1 ++ arr2) )

{- isBST
input: tree
output: boolean
    True: if input tree is a BST
    False: otherwise
-}
isBST :: Tree -> Bool
-- ensure the value of the left subtree < node
--                        right subtree > node
isBST Leaf = True
isBST (Node n Leaf Leaf) = True
isBST (Node n (Node l left right) Leaf)
    | l < n = isBST (Node l left right)
    | otherwise = False
isBST (Node n Leaf (Node r left right))
    | r > n = isBST (Node r left right)
    | otherwise = False
isBST (Node n (Node l left1 right1) (Node r left2 right2)) =
    if (l < n && r > n) then ( isBST(Node l left1 right1) && isBST(Node r left2 right2) )
    else False

-- lowerHalf (helper function)
-- input: Int, sorted [Int]
-- output: [Int]
lowerHalf :: Int -> [Int] -> [Int]
lowerHalf _ [] = []
lowerHalf n (x:xs)
    | n > 0 = x : lowerHalf (n - 1) xs
    | otherwise = []

-- upperHalf (helper function)
-- input: Int, sorted [Int]
-- output: [Int]
upperHalf :: Int -> [Int] -> [Int]
upperHalf _ [] = []
upperHalf n (x:xs)
    | n > 0 = upperHalf (n - 1) xs
    | otherwise = x : upperHalf n xs

-- splitSortedList (helper function)
-- input: sorted [Int]
-- output: Tree
splitSortedList :: [Int] -> Tree
splitSortedList [] = Leaf
splitSortedList list =
    let
        mid =  div (length list) 2
        low = (lowerHalf mid list) 
        (u:us) = (upperHalf mid list)
    in
        ( Node u (splitSortedList low) (splitSortedList us) )
    
    

-- arrayToTree (helperfunction)
-- input: sorted array [Int]
-- output: Tree
arrayToTree :: [Int] -> Tree
arrayToTree [] = Leaf
arrayToTree [a] = (Node a Leaf Leaf)
arrayToTree [a, b] = (Node b (Node a Leaf Leaf) Leaf)
arrayToTree list = splitSortedList list
    -- let
    --     (lower, upper) = splitSortedList list
    -- in
    --     Node u (arrayToTree lower) (arrayToTree upper)
        


{- convertBST
input: tree
    arbitrary tree
output: tree
    balanced BST
-}
convertBST :: Tree -> Tree
convertBST Leaf = Leaf
convertBST (Node n left right) = 
    if isBST (Node n left right) then (Node n left right)
    else
    -- convert tree -> array
    -- sort array
    let
        nums = sort (createArray (Node n left right))
    in -- convert array to tree
        arrayToTree nums

-- =================================================================================================
-- =================================================================================================
-- Problem 2: Graphs

-- getVertexInt (helper function)
-- input: vertex duple
-- output: [Int, Int]
-- getVertexInt :: Vertex -> Int
-- getVertexInt () = v

-- countVerticies (helper function)
-- input: graph (array of edges)
-- output: array of all unique verticies
countVerticies :: Graph -> [Int]
countVerticies [] = []
countVerticies ( (v1, v2) : vs ) = v1 : v2 : countVerticies vs

{- numVE
input: graph
output: tuple
    (Verticies, Edges)
-}
-- edges = length(graph)
-- verticies = num unique points in the verticies
numVE :: Graph -> (Int, Int)
numVE [] = (0, 0)
numVE graph =
    let
        num_edges = length graph
        num_verticies = length ( nub (countVerticies graph) )
    in
        (num_verticies, num_edges)

{- removeLoops
input: graph
output: graph
    no self loops in the output graph
-}
removeLoops :: Graph -> Graph
removeLoops [] = []
removeLoops ( (v1, v2) : vs)
    | v1 /= v2 = (v1, v2) : removeLoops vs
    | otherwise = removeLoops vs -- don't append anything for this loop: it is a self-loop

{- removeVertex
input: Vertex v, graph
output: graph
    output graph has no edges incident to v
-}
removeVertex :: Vertex -> Graph -> Graph
removeVertex _ [] = []
removeVertex target_v ( (v1, v2) : vs )
    | target_v == v1 = removeVertex target_v vs
    | target_v == v2 = removeVertex target_v vs
    | otherwise = (v1, v2) : removeVertex target_v vs