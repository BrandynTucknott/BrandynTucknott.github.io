#####################################################################
#Course: CS 499/ Introduction to Intelligent Decision Making
# Description: Implements policy iteration
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
        self.R =  np.full((len(self.states)), -1)
        self.R[self.goal_id] = 100.0
        for s in self.traffic_state_id:
            self.R[s] = -10.0


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

    # FILL IN THE MISSING LINES TO SOLVE THE PROBLEM USING POLICY ITERATION (PI). 
    # Specifically, you are required to do the following:
    # 1. Calculate and print the time taken to solve PI
    # 2. Complete the missing lines of code in policy evaluation and policy improvement
    # 3. Print policy
    # 4. Print value function

    def PI(self):
        start = timeit.default_timer()
        self.V = np.zeros((len(self.states))).astype('float32').reshape(-1,1)
        bestAction = np.full((len(self.states)), -1)
        for s in self.states:
            for na, a in enumerate(self.actions):
                if self.P[s][na] is not None:
                    bestAction[s] = na
                    continue 
        curr_iter = 0
        max_trials = 10000
        initialize_bestQ = -10000
        epsilon = 0.00001
        while(curr_iter < max_trials):
            curr_iter += 1
            print("curr_iter = ", curr_iter)
            max_residual = 0
            PolicyStable = True
            
            #Policy Evaluation
            #############################Complete the following line of code for policy evaluation.
            #Hint: For a fixed policy pi, V(s) = Q(s,pi(s)) 
            for iter_vi in range(100):
                policy_eval_complete = False
                v1 = np.zeros((len(self.states))).astype('float32').reshape(-1,1)
                for s in self.states:
                    if s == self.goal_id:
                        bestAction[s] = 0
                        v1[s] = self.R[s]
                        continue

                    qaction = 0
                    succ_list = self.P[s][bestAction[s]]
                    if succ_list is not None: #Note: calculate v1[s] using the values from previous iteration (self.V[s])
                        v1[s] = self.R[s] + self.gamma * sum([prob * self.V[s_p] for s_p, prob in succ_list])

                    max_residual = max(max_residual, abs(v1[s] - self.V[s]))
                self.V = v1
                if max_residual < epsilon:
                    policy_eval_complete = True
                    break




            # Policy Improvement
            for s in self.states:
                if s == self.goal_id:
                    continue
                bestQ = initialize_bestQ
                curr_bestAction = bestAction[s]
                
                ############################# Complete the "for" loop for policy improvement and update policy, if necessary.
                # Hint: You need to calculate Q values of all actions and select the best action for policy improvement.
                for na, a in enumerate(self.actions):
                    # __HERE - this whole loop
                    succ_list = self.P[s][na]
                    if succ_list is None:
                        continue
                    q = self.R[s] + self.gamma * sum([p * self.V[s_] for s_, p in succ_list])

                    if q > bestQ:
                        bestQ = q
                        bestAction[s] = na
                        # print(f"bestAction[{s}] = {na}") # remove me
                    # __HERE - stopped here
                if bestAction[s] != curr_bestAction:
                    PolicyStable = False
            
            if PolicyStable:
                self.policy = bestAction
                end = timeit.default_timer()
                print("exiting....")
        #############################Complete the following line of code to print the time taken (in seconds) to solve
                print(f'Time taken to solve (seconds): {end - start: 0.4f}')
                break



    def qvalue(self,s, a):
        qaction = 0 #variable denoting the Q-value of the given (s,a) pair
        succ_list = self.P[s][a]
        if succ_list is not None:
            for succ in succ_list:
                succ_state_id = self.states.index(succ[0]) #denotes s'
                prob = succ[1] #denotes the transition probability
                
    #############################Complete the following line of code to calculate Q-value.
                qaction += prob * self.gamma * self.V[succ_state_id]
    
            qaction += self.R[s]

            return qaction

        else:
            return initialize_bestQ 

#############################Complete the following function to print the policy
    def printPolicy(self):
        print(f"Optimal Policy: {self.policy}")
        

#############################Complete the following function to print the value function
    def printValues(self):
        for i, v in enumerate(self.V):
            print(f"State {i} has Value {v[0]: 0.2f}")
        
        
    # Input: None
    # Output: episode as a list of tuples (state, action, reward)
    # Generates a episode using an epsilon greedy policy
    def generateEpisode(self, epsilon):
        # track episode; each episode consists of tuples (S, A, R)
        episode = []
        START_STATE = 0
        END_STATE = 11
        curr_state = START_STATE # start state = 0
        # print(f"curr_state: {curr_state}")
        
        # construct the episode
        while True:
            # best or random action?
            # what action is being taken, explore vs exploit
            explore = np.random.rand() <= epsilon
            # viable_actions = [idx for idx, _ in enumerate(self.actions) if self.P[curr_state][idx] is not None]
            viable_actions = [idx for idx, _ in enumerate(self.actions)]
            action = None
            if explore:
                action = np.random.choice(viable_actions)
            else:
                action = self.policy[curr_state]
                
            # by here, an action has been chosen
            # calculate reward and add to episode
            episode.append((curr_state, action, self.R[curr_state]))
            
            # did we just append the Goal state to the episode?
            if (curr_state == END_STATE):
                break
            
            # was the action successful or not?
            succ = self.getSucc(curr_state, self.actions[action])
            success = None
            new_state = None
            if succ is None: # attempted action does not work in that location
                new_state = curr_state # nothing happens
            else:
                success = np.random.rand() <= succ[0][1] # largest prob for success
                new_state = succ[0][0] if success else succ[1][0]
            
            # print(succ)
            if succ is not None:
                # print(f"Took action {action} to move from State {curr_state} --> {new_state}")
                curr_state = new_state
            # elif succ is None:
            #     print(f"Illegal Move: Tried action {action} at {curr_state} --> {new_state}")
            
        # end of while loop, an episode has been constructed
        return episode
        
    def graphEpisodes(self, epsilon):
        import matplotlib.pyplot as plt
        
        # generate a list of all episodes
        episodes = []
        MAX_NUM_EPISODES = 20
        for idx in range(0, MAX_NUM_EPISODES):
            episodes.append(self.generateEpisode(epsilon))
            print(f"Episode {idx + 1}:")
            self.printEpisode(episodes[idx])
        
        # count frequency of each state across episodes
        NUM_STATES = len(self.states)
        frequency = np.zeros(NUM_STATES)
        for ep in episodes:
            for S, _, _ in ep: # episodes are lists of tuples (S, A, R)
                frequency[S] += 1
                
                
        # graph the results
        states = np.arange(NUM_STATES)
        plt.figure(figsize=(10, 5))
        plt.bar(states, frequency, color='skyblue', edgecolor='black')
        plt.xlabel("State")
        plt.ylabel("Visit Frequency")
        plt.title(rf"State Visitation Frequency with epsilon $\varepsilon = {epsilon}$")
        plt.xticks(states)
        plt.grid(axis='y', linestyle='--', alpha=0.7)
        plt.tight_layout()
        plt.show(block=False)
    
    def printEpisode(self, ep):
        if ep is None:
            print("Episode is empty: []")
            return
        
        for s, a, r in ep:
            print(f"({s}, {a}, {r}) --> ")
            
        print("LIST END") # keep it consistent, show end of list
            
def main():
    # initial Taxi_Grid PI check
    taxi = Taxi_Grid()
    taxi.PI()
    print("expected reward = ", float(taxi.V[0]))
    taxi.printPolicy()
    taxi.printValues()
    
    # episode checks with varying epsilon
    taxi.graphEpisodes(epsilon=0.2)
    taxi.graphEpisodes(epsilon=0.5)
    taxi.graphEpisodes(epsilon=0.9)
    
    input("Press Enter to close:")
    
if __name__ == "__main__":
    main()