import numpy as np
import time
import heapq

def main():
    #############################################################
    # These first bits are just to help you develop your code
    # and have expected ouputs given. All asserts should pass.
    ############################################################

    # I made up some random 3-dimensional data and some labels for us
    example_train_x = np.array([ [ 1, 0, 2], [3, -2, 4], [5, -2, 4],
                                 [ 4, 2, 1.5], [3.2, np.pi, 2], [-5, 0, 1]])
    example_train_y = np.array([[0], [1], [1], [1], [0], [1]])
  
    #########
    # Sanity Check 1: If I query with examples from the training set 
    # and k=1, each point should be its own nearest neighbor
    
    for i in range(len(example_train_x)):
        assert([i] == get_nearest_neighbors(example_train_x, example_train_x[i], 1))
        
    #########
    # Sanity Check 2: See if neighbors are right for some examples (ignoring order)
    nn_idx = get_nearest_neighbors(example_train_x, np.array( [ 1, 4, 2] ), 2)
    assert(set(nn_idx).difference(set([4,3]))==set())

    nn_idx = get_nearest_neighbors(example_train_x, np.array( [ 1, -4, 2] ), 3)
    assert(set(nn_idx).difference(set([1,0,2]))==set())

    nn_idx = get_nearest_neighbors(example_train_x, np.array( [ 10, 40, 20] ), 5)
    assert(set(nn_idx).difference(set([4, 3, 0, 2, 1]))==set())

    #########
    # Sanity Check 3: Neighbors for increasing k should be subsets
    query = np.array( [ 10, 40, 20] )
    p_nn_idx = get_nearest_neighbors(example_train_x, query, 1)
    for k in range(2,7):
      nn_idx = get_nearest_neighbors(example_train_x, query, k)
      assert(set(p_nn_idx).issubset(nn_idx))
      p_nn_idx = nn_idx
   
    #########
    # Test out our prediction code
    queries = np.array( [[ 10, 40, 20], [-2, 0, 5], [0,0,0]] )
    pred = predict(example_train_x, example_train_y, queries, 3)
    assert( np.all(pred == np.array([[0],[1],[0]])))

    #########
    # Test our our accuracy code
    true_y = np.array([[0],[1],[2],[1],[1],[0]])
    pred_y = np.array([[5],[1],[0],[0],[1],[0]])                    
    assert( compute_accuracy(true_y, pred_y) == 3/6)

    pred_y = np.array([[5],[1],[2],[0],[1],[0]])                    
    assert( compute_accuracy(true_y, pred_y) == 4/6)



    #######################################
    # Now on to the real data!
    #######################################

    # Load training and test data as numpy matrices
    train_X, train_y, test_X = load_data()
    # print("train_X:", len(train_X), "x", len(train_X[0])) 
    # print("train_y:", len(train_y), "x", len(train_y[0]))
    # print("test_X:", len(test_X), "x", len(test_X[0]))
    # train_X = 8000 x 85 - 8000 column vectors: training vectors
    # train_y = 8000 x 1 - 8000 income classes: income class vectors
    # test_X = 2000 x 85 - 2000 column vectors: test vectors with no answers (Kaggle set?)

    #######################################
    # Q9 Hyperparmeter Search
    #######################################

    # Search over possible settings of k (for cross-validation model)
    best_k, k_acc = 0, 0
    print("Performing 4-fold cross validation")
    for k in [1,3,5,7,9,99,999,8000]:
        t0 = time.time()

        #######################################
        # DONE Compute train accuracy using whole set
        #######################################
        guesses = predict(train_X, train_y, train_X, k)
        train_acc = compute_accuracy(train_y, guesses)
        # train_acc = -1

        #######################################
        # DONE Compute 4-fold cross validation accuracy
        #######################################
        val_acc, val_acc_var = 0,0
        val_acc, val_acc_var = cross_validation(train_X, train_y, 4, k)
        # setting best k
        if (val_acc > k_acc):
            best_k = k
            k_acc = val_acc
        
        t1 = time.time()
        print("k = {:5d} -- train acc = {:.2f}%  val acc = {:.2f}% ({:.4f})\t\t[exe_time = {:.2f}]".format(k, train_acc*100, val_acc*100, val_acc_var*100, t1-t0))
    
    #######################################


    #######################################
    # Q10 Kaggle Submission
    #######################################


    # set your best k value and then run on the test set: this is set during the main training loop: should be k = 99
    # Make predictions on test set
    pred_test_y = predict(train_X, train_y, test_X, best_k)
    
    # add index and header then save to file
    test_out = np.concatenate((np.expand_dims(np.array(range(2000),dtype=int), axis=1), pred_test_y), axis=1)
    header = np.array([["id", "income"]])
    test_out = np.concatenate((header, test_out))
    np.savetxt('test_predicted.csv', test_out, fmt='%s', delimiter=',')

######################################################################
# Q7 get_nearest_neighbors 
######################################################################
# Finds and returns the index of the k examples nearest to
# the query point. Here, nearest is defined as having the 
# lowest Euclidean distance. This function does the bulk of the
# computation in kNN. As described in the homework, you'll want
# to use efficient computation to get this done. Check out 
# the documentaiton for np.linalg.norm (with axis=1) and broadcasting
# in numpy. 
#
# Input: 
#   example_set --  a n-by-d matrix of examples where each row
#                   corresponds to a single d-dimensional example
#
#   query --    a 1-by-d vector representing a single example
#
#   k --        the number of neighbors to return
#
# Output:
#   idx_of_nearest --   a k-by-1 list of indices for the nearest k
#                       neighbors of the query point
######################################################################

def get_nearest_neighbors(example_set, query, k):
    # use a max-heap to speed up (hopefully) the speed at which comparing
    # distance from query -> point with 
    # distance from current closest neighbors -> query
    distances = np.linalg.norm(example_set - query, axis=1) # get all distances from query
    heap = [] # max-heap to keep track of shortest distances: use of heap suggested by chatGPT
    for i in range(len(distances)):
        d = distances[i]
        if len(heap) < k:
            heapq.heappush(heap, (-d, i)) # min-heap by default, convert to max-heap
        elif d < -heap[0][0]: # if current distance is smaller than the largest distance in close neighbors
            heapq.heappushpop(heap, (-d, i))
    closest = [index for (_, index) in heap]
    return closest


######################################################################
# Q7 knn_classify_point 
######################################################################
# Runs a kNN classifier on the query point
#
# Input: 
#   examples_X --  a n-by-d matrix of examples where each row
#                   corresponds to a single d-dimensional example
#
#   examples_Y --  a n-by-1 vector of example class labels
#
#   query --    a 1-by-d vector representing a single example
#
#   k --        the number of neighbors to return
#
# Output:
#   predicted_label --   either 0 or 1 corresponding to the predicted
#                        class of the query based on the neighbors
######################################################################

def knn_classify_point(examples_X, examples_y, query, k):
    # array of the indicies of the k nearest neighbors to query
    knn = get_nearest_neighbors(examples_X, query, k)
    neighbor_classes = examples_y[knn]
    num_class_1 = np.sum(neighbor_classes)
    # if over half the nighbors are 1's
    if num_class_1 > len(neighbor_classes) / 2:
        return 1
    return 0


######################################################################
# Q8 cross_validation 
######################################################################
# Runs K-fold cross validation on our training data.
#
# Input: 
#   train_X --  a n-by-d matrix of examples where each row
#                   corresponds to a single d-dimensional example
#
#   train_Y --  a n-by-1 vector of example class labels
#
# Output:
#   avg_val_acc --      the average validation accuracy across the folds
#   var_val_acc --      the variance of validation accuracy across the folds
######################################################################

def cross_validation(train_X, train_y, num_folds=4, k=1):
    accuracies = [] # array to store accuracies for variance calculation

    # split train x and train y into num_folds different subsets
    # subset_size = int(len(train_y) / num_folds)
    subsets_x = np.split(train_X, num_folds)
    subsets_y = np.split(train_y, num_folds)
    # use each subset once to test while the others to train the model
    for i in range(0, num_folds): # index i holds the current test set
        td = [] # training data
        ld = [] # label data
        for j in range(num_folds): # form the training/label data with 3 of the 4 folds
            if i != j:
                td = np.vstack(subsets_x[j]) if len(td) == 0 else np.vstack([td, subsets_x[j]])
                ld = np.vstack(subsets_y[j]) if len(ld) == 0 else np.vstack([ld, subsets_y[j]])
        # by now, all the training data matrix is created
        model_predictions = predict(td, ld, subsets_x[i], k)
        accuracy = compute_accuracy(subsets_y[i], model_predictions)
        accuracies.append(accuracy)
    avg_acc = np.mean(accuracies)
    avg_acc_var = np.var(accuracies)
        
    # avg out the accuracy of each "fold"
    return avg_acc, avg_acc_var



##################################################################
# Instructor Provided Code, Don't need to modify but should read
##################################################################


######################################################################
# compute_accuracy 
######################################################################
# Runs a kNN classifier on the query point
#
# Input: 
#   true_y --  a n-by-1 vector where each value corresponds to 
#              the true label of an example
#
#   predicted_y --  a n-by-1 vector where each value corresponds
#                to the predicted label of an example
#
# Output:
#   predicted_label --   the fraction of predicted labels that match 
#                        the true labels
######################################################################

def compute_accuracy(true_y, predicted_y):
    accuracy = np.mean(true_y == predicted_y)
    return accuracy

######################################################################
# Runs a kNN classifier on every query in a matrix of queries
#
# Input: 
#   examples_X --  a n-by-d matrix of examples where each row
#                   corresponds to a single d-dimensional example
#
#   examples_Y --  a n-by-1 vector of example class labels
#
#   queries_X --    a m-by-d matrix representing a set of queries 
#
#   k --        the number of neighbors to return
#
# Output:
#   predicted_y --   a m-by-1 vector of predicted class labels
######################################################################

def predict(examples_X, examples_y, queries_X, k): 
    # For each query, run a knn classifier
    predicted_y = [knn_classify_point(examples_X, examples_y, query, k) for query in queries_X]

    # 'np.int' was deprecated, replaced with a version using 'int' instead
    return np.array(predicted_y,dtype=int)[:,np.newaxis]

# Load data
def load_data():
    traindata = np.genfromtxt('train.csv', delimiter=',')[1:, 1:]
    train_X = traindata[:, :-1]
    train_y = traindata[:, -1]
    train_y = train_y[:,np.newaxis]
    
    test_X = np.genfromtxt('test_pub.csv', delimiter=',')[1:, 1:]

    return train_X, train_y, test_X


    
if __name__ == "__main__":
    main()