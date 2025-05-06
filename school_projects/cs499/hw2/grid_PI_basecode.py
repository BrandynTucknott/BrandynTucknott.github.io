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
						v1[s] =  # __HERE
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
				for na, a in enumerate(self.actions): # __HERE: this whole loop
					




					
						
				if bestAction[s] != curr_bestAction:
					PolicyStable = False
			
			if PolicyStable:
				self.policy = bestAction
				end = timeit.default_timer()
				print("exiting....")
		#############################Complete the following line of code to print the time taken (in seconds) to solve
				print(f'Time taken to solve (seconds): {end - start: .4f}') # __HERE
				break



	def qvalue(self,s, a):
		qaction = 0 #variable denoting the Q-value of the given (s,a) pair
		succ_list = self.P[s][a]
		if succ_list is not None:
			for succ in succ_list:
				succ_state_id = self.states.index(succ[0]) #denotes s'
				prob = succ[1] #denotes the transition probability
				
	#############################Complete the following line of code to calculate Q-value.
                qaction = 

            return qaction

		else:
			return initialize_bestQ 

#############################Complete the following function to print the policy
    def printPolicy(self):
        

#############################Complete the following function to print the value function
    def printValues(self):
        

taxi = Taxi_Grid()
taxi.PI()
print("expected reward = ", float(taxi.V[0]))
taxi.printPolicy()
taxi.printValues()
