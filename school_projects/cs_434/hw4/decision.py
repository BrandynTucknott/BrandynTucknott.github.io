# We are going to cheat a little here and use a package for the dataset and decision trees. Thats why this isn't considered an implementation question.
from sklearn import tree
from sklearn.datasets import load_breast_cancer
import numpy as np
import matplotlib.pyplot as plt
np.random.seed(402)
import matplotlib
import random
font = {'weight' : 'normal',
        'size'   : 18}
matplotlib.rc('font', **font)


cancer = load_breast_cancer()
X, y = cancer.data, cancer.target

# Split into train and test 60/40
X_train = X[:len(X)//5*3]
y_train = y[:len(X)//5*3]
X_test = X[len(X)//5*3:]
y_test = y[len(X)//5*3:]


# Train a single decision tree on this dataset and store the accuracy
clf = tree.DecisionTreeClassifier(criterion="entropy", random_state=0)
clf = clf.fit(X_train, y_train) 
single_acc = clf.score(X_test,y_test)


# Train an ensemble with 20 models
M = 15
preds = np.zeros( (X_test.shape[0],M) )
for m in range(M):

  ###################################################
  # MODIFY IN HERE TO DECREASE CORRELATION
  ###################################################
  # X_data = X_train
  # y_data = y_train
  X_data = []
  y_data = []

  N = len(X_train)

  for i in range(0, N):
    randPoint = random.randrange(0, N)
    X_data.append(X_train[randPoint])
    y_data.append(y_train[randPoint])
  


  #Fit the model and store it's predictions
  clf = tree.DecisionTreeClassifier(criterion="entropy", max_features=150)
  clf = clf.fit(X_data, y_data)
  preds[:,m]= clf.predict(X_test)


# Compute ensemble outputs and accuracy
ensemble_preds = np.mean(preds, axis=1) > 0.5
ensemble_acc = np.mean(ensemble_preds == y_test)

# Compute correlation between models
C = np.zeros( (M,M) )
for i in range(M):
  for j in range(i,M):
    C[i,j] = np.corrcoef(preds[:,i],preds[:,j])[0,1]

# Make a pretty plot
C[C == 0] = np.nan
plt.figure(figsize=(12,12))
plt.imshow(C, vmin=0,vmax=1)
plt.grid(True, alpha=0.15)
plt.text(M*0.05,M*0.92, "Single Model Acc. = {:2.3f}".format(single_acc), fontsize=24)
plt.text(M*0.05,M*0.78, "Avg Corr. = {:2.3f}".format(np.nanmean(C)), fontsize=24)
plt.text(M*0.05,M*0.85, "Ensemble Acc. = {:2.3f}".format(ensemble_acc), fontsize=24)
plt.colorbar()
plt.yticks(np.arange(0,M))
plt.xticks(np.arange(0,M))
plt.xlabel("Model ID")
plt.ylabel("Model ID")
plt.title("Prediction Correlation Between Models")
plt.show()
