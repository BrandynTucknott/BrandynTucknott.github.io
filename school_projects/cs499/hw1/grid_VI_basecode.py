#####################################################################
# Course: CS 499/ Introduction to Intelligent Decision Making
# Description: Implements value iteration
#####################################################################
import numpy as np
import sys
import timeit


class Taxi_Grid():
    def __init__(self):
        self.grid_width = 4
        self.grid_height = 4
        self.actions = ['left','up','right','down']
        self.traffic_state_id = [2,5,6,9]
        self.gamma = 0.95
        self.policy = {}
        self.states = []
        self.populateParam()


    # Reward and transition function
    def populateParam(self):
        for s in range(16):
            self.states.append(s)
        self.s0 = 0
        self.goal_id = 11
        ## Modify the following 4 lines for testing with other reward functions.
        # self.R =  np.full((len(self.states)), -1)
        # self.R[self.goal_id] = 100.0
        # for s in self.traffic_state_id:
        #     self.R[s] = -10.0  
        self.R =  np.full((len(self.states)), -5)
        self.R[self.goal_id] = 500.0
        for s in self.traffic_state_id:
            self.R[s] = -50.0

        self.P = [ [None]*len(self.actions) for i in range(len(self.states)) ]
        for s in self.states:
            for a, action in enumerate(self.actions):
                succ_sum=0
                self.P[s][a] = self.getSucc(s, action)
                if self.P[s][a]!=None:
                    for succ in self.P[s][a]:
                        succ_sum += succ[1]
                    if succ_sum !=1:
                        print(s,a,succ)
                        sys.exit()

    def getSucc(self,s,action):
        succ_prob = 0.8
        fail_prob = 0.2
        succ = []
        if action == "left":
            if s%self.grid_width > 0:
                succ.append((s-1, succ_prob))
                if s > self.grid_width - 1: #slides up when its action fails
                    succ.append((s-self.grid_width,fail_prob))
                elif s <= self.grid_width and s >= 0: #slides down if it is the first row
                    succ.append((s+self.grid_width, fail_prob))
                return succ
            else:
                return None
        elif action == "up":
            if s >= self.grid_width:
                succ.append((s-self.grid_width,succ_prob))

                if s%(self.grid_width-1) > 0: #not right-most cell, slides rights when action fails
                    succ.append((s+1, fail_prob))
                elif s%(self.grid_width-1) == 0 and s > 0: #slides left if it is the last column
                    succ.append((s-1, fail_prob))
                return succ
            else:
                return None
        elif action == "right":
            if s%self.grid_width < 3:
                succ.append((s+1, succ_prob))
                if (s + self.grid_width) in self.states: #not the last row, slides down when action fails
                    succ.append(( s+ self.grid_width, fail_prob))
                elif s >= self.grid_width:  #moves up instead
                    succ.append(( s - self.grid_width, fail_prob))
                return succ 
            else:
                return None
        elif action == "down":
            if (s + self.grid_width) in self.states: #not the last row
                succ.append(( s+ self.grid_width, succ_prob))
                if s%self.grid_width > 0: #not the first column. Slides left when action fails
                    succ.append((s-1, fail_prob))
                elif s%(self.grid_width-1) >= 0:   #slides right instead
                    succ.append((s+1, fail_prob))
                return succ
            else:
                None
        return None



    # FILL IN THE MISSING LINES TO SOLVE THE PROBLEM USING VI. 
    # Specifically, you are required to do the following:
    # 1. Calculate and print the time taken to solve VI
    # 2. Calculate Q value of an action
    # 3. Print policy
    # 4. Print value function

    def VI(self):
        start = timeit.default_timer()
        self.V = np.zeros((len(self.states))).astype('float32').reshape(-1,1)
        self.Q =  np.zeros((len(self.states), len(self.actions))).astype('float32')
        max_trials = 1000
        epsilon = 0.00001
        initialize_bestQ = -10000
        curr_iter = 0
        bestAction = np.full((len(self.states)), -1)
        while curr_iter < max_trials:
            max_residual = 0
            curr_iter += 1
            # Loop over states to calculate values
            for s in self.states:
                if s == self.goal_id:
                    bestAction[s] = 0
                    self.V[s] = self.R[s]
                    continue
                bestQ = initialize_bestQ
                
                for na, a in enumerate(self.actions):
                    if self.P[s][na] is  None:
                        continue

                    qaction = max(initialize_bestQ, self.qvalue(s, na)) ##### Complete the code in "def qvalue() to calculate self.qvalue()
                    self.Q[s][na] = qaction 

                    if qaction > bestQ:
                        bestQ = qaction
                        bestAction[s] = na

                residual = abs(bestQ - self.V[s])
                self.V[s] = bestQ
                max_residual = max(max_residual, residual)

            if max_residual < epsilon:
                break

        self.policy = bestAction
        end = timeit.default_timer()
#############################Complete the following line of code to print the time taken (in seconds) to solve VI
        print(f'Time taken to solve (seconds): {end - start: .4f}')


    # Q-value calculation
    def qvalue(self,s, a):
        qaction = 0 #variable denoting the Q-value of the given (s,a) pair
        succ_list = self.P[s][a] 
        if succ_list is not None:
            for succ in succ_list:
                succ_state_id = self.states.index(succ[0]) #denotes s'
                prob = succ[1] #denotes the transition probability

#############################Complete the following line of code to calculate Q-value.
                qaction += prob * self.V[succ_state_id]
            
            qaction = self.R[s] + self.gamma * qaction

            return qaction

        else:
            print("init bestQ:", initialize_bestQ)
            return initialize_bestQ 

#############################Complete the following function to print the policy
    def printPolicy(self):
        print("Optimal Policy:", self.policy)
        

#############################Complete the following function to print the value function
    def printValues(self):
        for s in self.states:
            print(f'State: {s} has Value: {self.V[s][0]: .2f}')
        




taxi = Taxi_Grid()
taxi.VI()
print(taxi.states)
taxi.printPolicy()
taxi.printValues()