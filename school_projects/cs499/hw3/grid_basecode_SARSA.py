#####################################################################
# Course: CS 499/ Introduction to Intelligent Decision Making
# Description: Skeleton code for SARSA
#####################################################################
import numpy as np
import sys
import timeit
import random


class Taxi_Grid():
    def __init__(self):
        self.grid_width = 4
        self.grid_height = 4
        self.actions = ['left','up','right','down']
        self.traffic_state_id = [2,5,6,9]
        self.gamma = 0.99
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
        self.Q = [ [0]*len(self.actions) for i in range(len(self.states)) ]
        
        for s in self.states:
            for a, action in enumerate(self.actions):
                self.P[s][a] = self.getSucc(s, action)


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

                if s%self.grid_width < 3: #not right-most cell, slides right when action fails
                    succ.append((s+1, fail_prob))
                else:
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
                elif s%self.grid_width < 3:   #slides right instead
                    succ.append((s+1, fail_prob))
                return succ
            else:
                return None
        return None




    # This function simulates the environment by selecting a successor state, 
    # given a state and an action. Note that in RL, the agent is
    # unaware of the exact transitions. The agent learns by interacting with 
    # the envirnoment. This function simulates that intereaction. This function
    # requires no modification. 

    def generateRandomSuccessor(self, state, action):
        random_value = random.uniform(0, 1)
        prob_sum = 0
        if state ==  self.goal_id:
            return state

        for succ in self.P[state][action]:
            succ_state_id = self.states.index(succ[0])
            prob = succ[1]
            prob_sum += prob
            if prob_sum >= random_value:
                return succ_state_id
    
    # This function returns epsilon greedy policy based on current Q values and epsilon.
    #  This function requires no modification. 

    def get_epsilon_greedy_action(self,state, epsilon):
        applicable_actions = []
        pi_s_a = np.zeros((len(self.actions))).astype('float32').reshape(-1,1)
        best_Q = float('-inf')
        best_action = -1
        for a, action in enumerate(self.actions):
            if self.P[state][a]!=None:
                applicable_actions.append(a)
                if self.Q[state][a] > best_Q:
                    best_Q  = self.Q[state][a]
                    best_action = a


        for a in applicable_actions:
            if a == best_action:
                pi_s_a[a] = 1-epsilon + (epsilon/len(applicable_actions))
            else:
                pi_s_a[a] = epsilon/len(applicable_actions)

        random_value = random.uniform(0, 1)

        prob = 0
        for a, action in enumerate(self.actions):
            prob += pi_s_a[a]
            if prob >= random_value:
                return a


    # Complete the following function. Specifically:
    # 1. Complete the missing lines of code to perform SARSA update of Q values
    # 2. Calculate the run time for each episode and calculate the average runtime across runs

    def SARSA(self):
        alpha = ALPHA
        epsilon = EPSILON
        num_episodes = N_EPISODES
        
        times = []
        ret_rewards = []

        for i in range(num_episodes):
            start = timeit.default_timer()
            accumulated_reward = 0
            # print("***************************** Episode:", i)
            state = self.s0
            action = self.get_epsilon_greedy_action(state, epsilon)
            while state != self.goal_id:
                successor_state = self.generateRandomSuccessor(state, action)
                reward = self.R[state]
                accumulated_reward += reward
                successor_action = self.get_epsilon_greedy_action(successor_state, epsilon)
                self.Q[state][action] += alpha * (reward + self.gamma * self.Q[successor_state][successor_action] - self.Q[state][action])
                state = successor_state
                action = successor_action
                if state == self.goal_id:
                    end = timeit.default_timer()
                    elapsed_time = end - start
                    times.append(elapsed_time)
                    # print("goal reached", state)
                    accumulated_reward += self.R[state]
                    # print("accumulated_reward = ", accumulated_reward)
                    # print(f"total episode time (s) = {elapsed_time: .4f}")
                    ret_rewards.append(accumulated_reward)
        print(f"average time per episode (s) = {np.mean(np.array(times)): .4f}")
        return ret_rewards, times

# global variables for epsilon and alpha in SARSA to reference
ALPHA = None
EPSILON = None
N_EPISODES = None
import matplotlib.pyplot as plt
from collections import defaultdict
if __name__ == "__main__":
    # part a
    # N_EPISODES = 200
    # N_TRIALS = 5
    # epsilon_list = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6]
    # alpha_list = [0.1, 0.3, 0.5, 0.7, 0.9]
    
    # episodes = np.arange(N_EPISODES)
    
    # # Store all trials: (eps, alpha) → array of shape [N_TRIALS, N_EPISODES]
    # reward_trials = defaultdict(lambda: np.zeros((N_TRIALS, N_EPISODES)))

    # for eps in epsilon_list:
    #     for alpha in alpha_list:
    #         EPSILON = eps
    #         ALPHA = alpha
    #         for trial in range(N_TRIALS):
    #             taxi = Taxi_Grid()
    #             rewards, _ = taxi.SARSA()
    #             reward_trials[(eps, alpha)][trial] = rewards

    #     # Now plot results
    #     # these figures are for parameter tuning
    #     plt.figure(figsize=(14, 9))

    #     for (eps, alpha), rewards in reward_trials.items():
    #         mean_rewards = rewards.mean(axis=0)
    #         std_rewards = rewards.std(axis=0)
    #         label = f"ε={eps}, α={alpha}"
    #         plt.plot(episodes, mean_rewards, label=label)
    #         plt.fill_between(episodes, mean_rewards - std_rewards, mean_rewards + std_rewards, alpha=0.2)

    #     plt.xlabel("Episode")
    #     plt.ylabel("Accumulated Reward")
    #     plt.title("SARSA Learning Curves with ε, α Parameter Sweep")
    #     plt.legend(loc='lower right', fontsize='small', ncol=2)
    #     plt.grid(True)
    #     plt.tight_layout()
    #     plt.show(block=False)
    #     reward_trials.clear()

    # input("Press enter to exit...")
    
    # part b
    # ALPHA = 0.1
    # EPSILON = 0.2
    
    # N_EPISODES = 100
    # N_TRIALS = 50
    
    # reward_trials = np.zeros((N_TRIALS, N_EPISODES))
    # episodes = np.arange(N_EPISODES)

    # for trial in range(N_TRIALS):
    #     taxi = Taxi_Grid()
    #     rewards, _ = taxi.SARSA()  # should return list of 100 episode rewards
    #     reward_trials[trial] = rewards

    # # Compute mean and std dev over trials, per episode
    # mean_rewards = reward_trials.mean(axis=0)
    # std_rewards = reward_trials.std(axis=0)

    # # Plot the learning curve with shaded std deviation
    # plt.figure(figsize=(14, 9))
    # label = f"ε={EPSILON}, α={ALPHA}"
    # plt.plot(episodes, mean_rewards, label=label)
    # plt.fill_between(episodes, mean_rewards - std_rewards, mean_rewards + std_rewards, alpha=0.2)

    # plt.xlabel("Episode")
    # plt.ylabel("Accumulated Reward")
    # plt.title("SARSA: Mean Reward over 50 Trials")
    # plt.legend(loc='lower right', fontsize='small')
    # plt.grid(True)
    # plt.tight_layout()
    # plt.show()
    
    
    
    
    
    
    # part c
    # ALPHA = 0.1
    # EPSILON = 0.95
    
    # N_EPISODES = 200
    # N_TRIALS = 50
    
    # reward_trials = np.zeros((N_TRIALS, N_EPISODES))
    # episodes = np.arange(N_EPISODES)

    # for trial in range(N_TRIALS):
    #     taxi = Taxi_Grid()
    #     rewards, _ = taxi.SARSA()  # should return list of 100 episode rewards
    #     reward_trials[trial] = rewards

    # # Compute mean and std dev over trials, per episode
    # mean_rewards = reward_trials.mean(axis=0)
    # std_rewards = reward_trials.std(axis=0)

    # # Plot the learning curve with shaded std deviation
    # plt.figure(figsize=(14, 9))
    # label = f"ε={EPSILON}, α={ALPHA}"
    # plt.plot(episodes, mean_rewards, label=label)
    # plt.fill_between(episodes, mean_rewards - std_rewards, mean_rewards + std_rewards, alpha=0.2)

    # plt.xlabel("Episode")
    # plt.ylabel("Accumulated Reward")
    # plt.title("SARSA: Mean Reward over 50 Trials")
    # plt.legend(loc='lower right', fontsize='small')
    # plt.grid(True)
    # plt.tight_layout()
    # plt.show()
    
    
    # part d
    ALPHA = 0.1
    EPSILON = 0.95
    
    N_EPISODES = 200
    N_TRIALS = 50
    
    time_trials = np.zeros((N_TRIALS, N_EPISODES))
    episodes = np.arange(N_EPISODES)

    for trial in range(N_TRIALS):
        taxi = Taxi_Grid()
        _, times = taxi.SARSA()  # should return list of 100 episode rewards
        time_trials[trial] = times

    # Compute mean and std dev over trials, per episode
    mean_time = time_trials.mean(axis=0)
    std_time = time_trials.std(axis=0)

    # Plot the learning curve with shaded std deviation
    plt.figure(figsize=(14, 9))
    label = f"ε={EPSILON}, α={ALPHA}"
    plt.plot(episodes, mean_time, label=label)
    plt.fill_between(episodes, mean_time - std_time, mean_time + std_time, alpha=0.2)

    plt.xlabel("Episode")
    plt.ylabel("Time (s)")
    plt.title("SARSA: Mean time(s) for 200 Episodes over 50 Trials")
    plt.legend(loc='lower right', fontsize='small')
    plt.grid(True)
    plt.tight_layout()
    plt.show()