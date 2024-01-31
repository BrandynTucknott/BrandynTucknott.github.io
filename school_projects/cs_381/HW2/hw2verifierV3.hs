import HW2types
import HW2
-- Note the grader may contain different test cases. This is just a sample.
-- You should test your code on more inputs.
{-
--Trees
tree1 = Node 5 Leaf Leaf
tree2 = Node 8 (Node 6 Leaf Leaf) (Node 2 (Node 3 Leaf Leaf) (Node 7 Leaf Leaf))
tree3 = Node 8 (Node 2 (Leaf)(Node 3 Leaf Leaf))(Node 10 (Node 9 Leaf Leaf) Leaf )
tree4 = Node 4 (Node 3 (Node 2 (Node 1 Leaf Leaf) Leaf) Leaf) Leaf
tree5 = Node 4 Leaf (Node 6 (Node 3 Leaf Leaf)(Node 10 Leaf Leaf))
tree6 = Node 4 (Node 2 Leaf Leaf) (Node 10 (Node 11 (Node 7 Leaf Leaf) Leaf) Leaf)
graph1 :: Graph
graph1 = [(1,2), (2,2), (2,4), (4,3), (3,3), (5,6),(6,5)]
-}
tree7 = Node 3 (Node 2 (Node 4 (Node 1 Leaf Leaf) Leaf) Leaf) Leaf

main:: IO ()
main = 
	do

		putStrLn "Problem 1  :"
		putStrLn "\n a) test 1 - sizeTree Leaf  "		
		print ( sizeTree Leaf)
		
		putStrLn " a) test 2 - sizeTree tree1 : "			
		print ( sizeTree tree1)
			
		putStrLn " a) test 3 - sizeTree tree2 : "			
		print ( sizeTree tree2)
		
		putStrLn " a) test 4 - sizeTree tree4 : "			
		print ( sizeTree tree4)
		
		putStrLn " a) test 5 - sizeTree tree6 : "			
		print ( sizeTree tree6)

		-- Problem 1 (b) height 
		
		putStrLn "\n  b) test 1 -   height tree1   "	
		print ( height tree1)

		putStrLn " b) test 2 -   height tree2   "	
		print ( height tree2)
		
		putStrLn " b) test 3 -   height tree3   "	
		print ( height tree3)	

		putStrLn " b) test 4 -   height tree4   "	
		print ( height tree4)
		putStrLn "b) test 5 -  height Leaf "		
		print ( height Leaf)		
		
		-- Problem 1 (c) treeSum
			
		putStrLn "\n c) test 1 -  treeSum tree1  "	
		print ( treeSum tree1)
		putStrLn " c) test 2 -  treeSum tree2  "	
		print ( treeSum tree2)		
		putStrLn " c) test 3 -  treeSum tree3  "	
		print ( treeSum tree3)	
		putStrLn " c) test 4 -  treeSum Leaf  "	
		print ( treeSum Leaf)		
		
		-- Problem 1 (d) (==)
		
		putStrLn "\n d) test 1 -  Leaf == Leaf  "
		print ( Leaf == Leaf)
		
		putStrLn " d) test 2 -  Leaf == tree1  "
		print ( Leaf == tree1)

		putStrLn " d) test 3 -  tree2 == tree2  "
		print ( tree2 == tree2)	
		
		putStrLn " d) test 4 -  tree2 == tree4  "
		print ( tree2 == tree4)	
		
		putStrLn " d) test 5 -  tree2 == tree3  "
		print ( tree2 == tree3)
		
		putStrLn " d) test 6 -  tree4 == tree7  "
		print ( tree4 == tree7)
		
		-- Problem 1 (e) mergeTrees	
		putStrLn " \ne) test 1 -  mergeTrees Leaf Leaf  "
		print ( mergeTrees Leaf Leaf)
		
		putStrLn " e) test 2 -  mergeTrees tree1 tree2  "
		print ( mergeTrees tree1 tree2)
		
		putStrLn " e) test 3 -  mergeTrees tree2 tree3  "
		print ( mergeTrees tree2 tree3)

		putStrLn " e) test 4 -  mergeTrees tree4 tree7  "
		print ( mergeTrees tree4 tree7)
		
		-- Problem 1 (f) isBST			
		putStrLn "\n f) isBST "

		putStrLn " f) test 1 -  isBST Leaf "
		print ( isBST Leaf)

		putStrLn " f) test 2 -  isBST tree2 "
		print ( isBST tree2)
		
		putStrLn " f) test 3 -  isBST tree3 "
		print ( isBST tree3)
		
		putStrLn " f) test 4 -  isBST tree4 "
		print ( isBST tree4)
		
		putStrLn " f) test 5 -  isBST tree7 "
		print ( isBST tree7)
		
		-- Problem 1 (g) convertBST			
		putStrLn "\n g) convertBST "

		putStrLn " g) test 1 -  convertBST Leaf "
		print (convertBST Leaf)

		putStrLn " g) test 2 -  convertBST tree7 "
		print (convertBST tree7)
		
		putStrLn " g) test 3 -  convertBST tree2 "
		print (convertBST tree2)
		
		putStrLn " g) test 4 -  convertBST tree4 "
		print (convertBST tree4)
		
		
		let g = [ (1,2), (1,1), (2,3), (2,4),(3,4), (5,8)]
		let h = [ (1,2), (1,3), (2,2), (3,2), (4,4), (1,4) ]
		let g2 = [ (1,5), (1,7), (2,5), (7,2) ]

		putStrLn "\nProblem 2  :"
		putStrLn "\n a) test 1 - numVE g"
		print ( numVE g)

		putStrLn " a) test 2 - numVE h"
		print ( numVE h)

		putStrLn " a) test 3 - numVE g2"
		print ( numVE g2)
		
		putStrLn " a) test 4 - numVE []"
		print ( numVE [])
		
		putStrLn " a) test 5 - numVE [(1,2)]"
		print ( numVE [(1,2)])
		
		-- b) remove loops		
		putStrLn "\n b) test 1 - removeLoops g"
		print ( removeLoops g)

		putStrLn " b) test 2 - removeLoops h"
		print ( removeLoops h)

		putStrLn " b) test 3 - removeLoops g2"
		print ( removeLoops g2)
		
		putStrLn " b) test 4 - removeLoops [(1,1)]"
		print ( removeLoops [(1,1)] )		
		
		-- c) removeVertex
		
		putStrLn "\n c) test 1 - removeVertex 1 g"		
		print ( removeVertex 1 g)

		putStrLn " c) test 2 - removeVertex 2 h"		
		print ( removeVertex 2 h)
		
		putStrLn " c) test 3 - removeVertex 1 [(1,1)]"		
		print ( removeVertex 1 [(1,1)])	

		putStrLn " c) test 4 - removeVertex 5 g"		
		print ( removeVertex 5 g)				
		
		
		
		
		
		
