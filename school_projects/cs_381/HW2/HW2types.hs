module HW2types where

-- Type for Trees
data Tree = Node Int Tree Tree | Leaf
	deriving Show

--Trees
tree1 = Node 5 Leaf Leaf
tree2 = Node 8 (Node 6 Leaf Leaf) (Node 2 (Node 3 Leaf Leaf) (Node 7 Leaf Leaf))
tree3 = Node 8 (Node 2 (Leaf)(Node 3 Leaf Leaf))(Node 10 (Node 9 Leaf Leaf) Leaf )
tree4 = Node 4 (Node 3 (Node 2 (Node 1 Leaf Leaf) Leaf) Leaf) Leaf
tree5 = Node 4 Leaf (Node 6 (Node 3 Leaf Leaf)(Node 10 Leaf Leaf))
tree6 = Node 4 (Node 2 Leaf Leaf) (Node 10 (Node 11 (Node 7 Leaf Leaf) Leaf) Leaf)

-- Type for Graphs
--
type Vertex  = Int
type Edge  = (Vertex,Vertex)
type Graph = [Edge]

--Graphs
graph1 :: Graph
graph1 = [(1,2), (2,2), (2,4), (4,3), (3,3), (5,6),(6,5)]
