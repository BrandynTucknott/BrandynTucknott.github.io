// Online C++ compiler to run C++ program online
#include <iostream>
#include <vector>
#include <iterator>
#include <limits>
#include <unordered_map>
#include <stdlib.h>

class Solution {
public:
    // removes the given node from the list of given nodes
    void removeNode(std::vector<int>& unvisited, int node) {
        std::vector<int>::iterator it;
        if (unvisited.size() == 0)
            return;
        for (it = unvisited.begin(); it != unvisited.end(); it++) {
            if (*it == node) {
                unvisited.erase(it);
                return;
            }
        }
    }

    // returns true if a node is unvisited, false otherwise
    bool isUnvisited(std::vector<int> unvisited, int node) {
        std::vector<int>::iterator it;
        for (it = unvisited.begin(); it != unvisited.end(); it++) {
            if (*it == node)
                return true;
        }
        return false;
    }






    std::unordered_map<int, int> shortestPath(int n, std::vector<std::vector<int>>& edges, int src) {
        std::vector<int> shortest_paths; // shortest_paths[i] := shortest distance from src to node i
        std::vector<int> unvisited;

        // init all shortest lengths to be infinity
        for (int i = 0; i < n; i++) {
            unvisited.push_back(i);
            if (i == src) { // distance from a node to itself is 0
                shortest_paths.push_back(0);
                continue;
            }
            shortest_paths.push_back(std::numeric_limits<int>::max());
        }

        int currentNode = src;
        int old_node = src;
        std::vector<std::vector<int>>::iterator it;
        while (unvisited.size() > 0) {
            for (it = edges.begin(); it != edges.end(); it++) {
                // start node matches our current node
                if ((*it)[0] == currentNode) {
                    // set shortest path and previous node if applicable
                    
                    int shortest_prev_path = shortest_paths[currentNode];
                    
                    if ((*it)[2] + shortest_prev_path < shortest_paths[(*it)[1]]) {
                        shortest_paths[(*it)[1]] = (*it)[2] + shortest_prev_path;                  
                    }
                }
            }
            // mark node as visited, find new current node
            removeNode(unvisited, currentNode);
            old_node = currentNode;
            int shortest = std::numeric_limits<int>::max();
            for (int i = 0; i < n; i++) {
                if (shortest_paths[i] < shortest && isUnvisited(unvisited, i)) {
                    shortest = shortest_paths[i];
                    currentNode = i;
                }
            }
            if (old_node == currentNode) { // there are uvisited, but unreachable nodes
                break;
            }
        } // end of edge checking while loop
        std::unordered_map<int, int> map;
        for (int i = 0; i < n; i++) {
            map[i] = shortest_paths[i];
            if (shortest_paths[i] == std::numeric_limits<int>::max())
                map[i] = -1;
        }
        return map;
    } // end of shortestPath function
};


int main() {
    const int n = 4;
    const int src = 1;
    std::vector<std::vector<int>> edges;
    // std::vector<int> edge1 = {0, 1, 10};
    // std::vector<int> edge2 = {0, 2, 3};
    // std::vector<int> edge3 = {1, 3, 2};
    // std::vector<int> edge4 = {2, 1, 4};
    // std::vector<int> edge5 = {2, 3, 8};
    // std::vector<int> edge6 = {2, 4, 2};
    // std::vector<int> edge7 = {3, 4, 5};
    
    // edges.push_back(edge1);
    // edges.push_back(edge2);
    // edges.push_back(edge3);
    // edges.push_back(edge4);
    // edges.push_back(edge5);
    // edges.push_back(edge6);
    // edges.push_back(edge7);

    std::vector<int> edge1 = {0, 1, 5};
    std::vector<int> edge2 = {0, 2, 7};
    std::vector<int> edge3 = {1, 2, 2};
    std::vector<int> edge4 = {1, 3, 6};
    std::vector<int> edge5 = {2, 3, 4};

    edges.push_back(edge1);
    edges.push_back(edge2);
    edges.push_back(edge3);
    edges.push_back(edge4);
    edges.push_back(edge5);
    
    Solution sol = Solution();
    std::unordered_map<int, int> map = sol.shortestPath(n, edges, src);

    std::cout << "Shortest paths from src:\n";
    for (std::pair<int, int> x : map) {
        std::cout << x.first << ", " << x.second << "\t";
    }
    std::cout << "\n";
    

    return 0;
}