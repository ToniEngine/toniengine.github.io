// Data Science & Machine Learning bank.
//
// Hand-authored from course transcripts: the questions, distractors and
// explanations are written for this quiz and test the concepts taught. No
// transcript prose is reproduced verbatim.
//
// To add a module: append entries with a new `section` label, keep ids unique
// and running in sequence, and give every question a `note` that explains why
// the right answer is right - the note is what the player learns from.
//
// answer = index into options[] of the correct choice (before runtime shuffling).
window.QUESTIONS_DS = [

  /* ── Tree-Based Models: CART ──────────────────────────────── */
  {
    id: 1,
    section: "CART Fundamentals",
    question: "What does the acronym CART stand for in supervised learning?",
    options: [
      "Classification And Regression Tree",
      "Clustered Attribute Regression Technique",
      "Categorical And Real-valued Training",
      "Conditional Average Response Test"
    ],
    answer: 0,
    note: "CART stands for Classification And Regression Tree - one family of models that handles both tasks. The same tree structure predicts a class label for classification and a continuous value for regression."
  },
  {
    id: 2,
    section: "CART Fundamentals",
    question: "What does a classification tree actually learn from a labelled dataset?",
    options: [
      "A set of weights, one per feature",
      "A sequence of if-else questions about individual features",
      "A distance metric between training instances",
      "A probability distribution over the whole feature space"
    ],
    answer: 1,
    note: "A classification tree learns a sequence of if-else questions, each about one feature and one split point. Weights are what a linear model learns; a distance metric is what k-nearest-neighbours relies on."
  },
  {
    id: 3,
    section: "CART Fundamentals",
    question: "What is the key advantage of a tree over a linear model in terms of the relationships it can represent?",
    options: [
      "Trees always achieve higher accuracy",
      "Trees train faster on every dataset",
      "Trees can capture non-linear relationships between features and labels",
      "Trees are immune to overfitting"
    ],
    answer: 2,
    note: "Trees can capture non-linear relationships, which a plain linear model cannot. They are not automatically more accurate, and they are in fact quite prone to overfitting - which is exactly why depth has to be controlled."
  },
  {
    id: 4,
    section: "CART Fundamentals",
    question: "Why do decision trees not require features to be standardised or put on the same scale?",
    options: [
      "Because each split compares one feature against a threshold, independently of the others",
      "Because trees normalise the features internally before splitting",
      "Because trees only accept features already scaled between 0 and 1",
      "Because trees discard any feature with a large range"
    ],
    answer: 0,
    note: "Each split asks a question about a single feature against a split point, so the units and ranges of other features are irrelevant. Distance- and gradient-based models are the ones that need scaling."
  },

  /* ── Reading a tree ──────────────────────────────────────── */
  {
    id: 5,
    section: "Reading a Decision Tree",
    question: "In a tree diagram, an instance is tested at a node with the condition 'concave points mean <= 0.051'. Where does the instance go if the condition holds?",
    options: [
      "Down the False branch",
      "Down the True branch",
      "It stops at that node and is predicted immediately",
      "It is passed to both branches and the results averaged"
    ],
    answer: 1,
    note: "If the condition is satisfied the instance traverses the True branch; otherwise it takes the False branch. It keeps traversing internal nodes until it reaches a leaf, where the prediction is made."
  },
  {
    id: 6,
    section: "Reading a Decision Tree",
    question: "How does a trained classification tree decide the label to predict once an instance reaches a leaf?",
    options: [
      "It averages the labels of all training instances in the tree",
      "It predicts the label of the nearest training instance",
      "It predicts the prevailing (most common) class among the training instances at that leaf",
      "It predicts whichever class was rarest in the training set"
    ],
    answer: 2,
    note: "The prediction is the prevailing class at that leaf - the majority label of the training instances that ended up there. Averaging labels is what a regression tree does with continuous targets."
  },
  {
    id: 7,
    section: "Reading a Decision Tree",
    question: "What is the maximum depth of a decision tree?",
    options: [
      "The total number of nodes in the tree",
      "The number of features used by the tree",
      "The number of leaves at the bottom of the tree",
      "The maximum number of branches separating the top of the tree from an extreme leaf"
    ],
    answer: 3,
    note: "Maximum depth counts the branches on the longest path from the root to a leaf. It is the main lever for controlling how complex the tree gets - and therefore how much it overfits."
  },
  {
    id: 8,
    section: "Reading a Decision Tree",
    question: "A tree is trained with max_depth=2. What is the largest number of if-else tests any single instance can face before being classified?",
    options: [
      "1",
      "2",
      "4",
      "8"
    ],
    answer: 1,
    note: "Depth is the number of branches from root to leaf, so with max_depth=2 an instance passes at most 2 tests. The 4 is the maximum number of leaves such a tree can have, which is a different quantity."
  },

  /* ── scikit-learn workflow ───────────────────────────────── */
  {
    id: 9,
    section: "scikit-learn Workflow",
    question: "Which import gives you a decision tree classifier in scikit-learn?",
    options: [
      "from sklearn.tree import DecisionTreeClassifier",
      "from sklearn.ensemble import DecisionTreeClassifier",
      "from sklearn.linear_model import DecisionTreeClassifier",
      "from sklearn.classify import DecisionTree"
    ],
    answer: 0,
    note: "DecisionTreeClassifier lives in sklearn.tree. sklearn.ensemble holds the models built out of many trees, such as RandomForestClassifier and the boosting estimators."
  },
  {
    id: 10,
    section: "scikit-learn Workflow",
    question: "Which scikit-learn modules provide train_test_split and accuracy_score respectively?",
    options: [
      "sklearn.tree and sklearn.metrics",
      "sklearn.model_selection and sklearn.metrics",
      "sklearn.metrics and sklearn.model_selection",
      "sklearn.preprocessing and sklearn.tree"
    ],
    answer: 1,
    note: "train_test_split comes from sklearn.model_selection - it is about how you split data for evaluation - and accuracy_score comes from sklearn.metrics, which holds the scoring functions."
  },
  {
    id: 11,
    section: "scikit-learn Workflow",
    question: "Why must a model's performance be measured on a separate test set rather than on the training data?",
    options: [
      "Test sets are always larger, so the estimate is more stable",
      "Training-set accuracy cannot be computed in scikit-learn",
      "To obtain an unbiased estimate of performance on unseen data",
      "Because the fit method deletes the training labels afterwards"
    ],
    answer: 2,
    note: "The model has already seen the training data, so scoring on it flatters the model. An unseen test set is what gives an unbiased estimate of how it will perform in production."
  },
  {
    id: 12,
    section: "scikit-learn Workflow",
    question: "What does setting stratify=y in train_test_split achieve?",
    options: [
      "It shuffles the data before splitting",
      "It scales the features to zero mean and unit variance",
      "It removes rows containing missing labels",
      "It makes the train and test sets keep the same proportion of class labels as the full dataset"
    ],
    answer: 3,
    note: "stratify=y preserves the class balance across the split, so neither set is accidentally skewed. This matters most with imbalanced classes, where a random split can badly under-represent the minority class in the test set."
  },
  {
    id: 13,
    section: "scikit-learn Workflow",
    question: "In train_test_split(X, y, test_size=0.2), how is the data divided?",
    options: [
      "80% training, 20% test",
      "20% training, 80% test",
      "80% training, 20% validation, with no test set",
      "The split depends on the number of classes in y"
    ],
    answer: 0,
    note: "test_size=0.2 assigns 20% of the data to the test set, leaving 80% for training. It is the size of the test portion that the parameter names, not the training portion."
  },
  {
    id: 14,
    section: "scikit-learn Workflow",
    question: "Why is random_state set to a fixed value such as 1 when instantiating a tree?",
    options: [
      "It improves the accuracy of the model",
      "It makes the result reproducible across runs",
      "It sets the maximum depth of the tree",
      "It is required whenever stratify is used"
    ],
    answer: 1,
    note: "random_state fixes the seed so the same code gives the same result each run. It aids reproducibility and does nothing for accuracy - a different seed just gives a different, equally valid, arbitrary choice."
  },
  {
    id: 15,
    section: "scikit-learn Workflow",
    question: "What is the correct order of calls to train and evaluate a classifier in scikit-learn?",
    options: [
      "predict, then fit, then accuracy_score",
      "fit on the test set, then predict on the training set",
      "fit on the training set, predict on the test set, then accuracy_score",
      "accuracy_score, then fit, then predict"
    ],
    answer: 2,
    note: "Fit on the training data, predict on the held-out test features, then compare those predictions against the true test labels with accuracy_score. Fitting on the test set would defeat the whole point of holding it back."
  },

  /* ── Decision regions ───────────────────────────────────── */
  {
    id: 16,
    section: "Decision Regions",
    question: "What is a decision region?",
    options: [
      "The range of values a single feature can take",
      "An area of the feature space in which every instance is assigned the same class label",
      "The portion of the dataset held back for testing",
      "The interval within which the model's accuracy is expected to fall"
    ],
    answer: 1,
    note: "A classification model carves the feature space into decision regions, and every instance falling in one region gets that region's label. The surfaces separating them are the decision boundaries."
  },
  {
    id: 17,
    section: "Decision Regions",
    question: "What is the shape of the decision boundary produced by a linear classifier on two features?",
    options: [
      "A straight line",
      "A set of rectangles",
      "A circle centred on the class mean",
      "A staircase of diagonal segments"
    ],
    answer: 0,
    note: "A linear classifier separates two features with a straight line. In higher dimensions this generalises to a flat hyperplane, but it stays straight either way."
  },
  {
    id: 18,
    section: "Decision Regions",
    question: "Why does a classification tree produce rectangular decision regions?",
    options: [
      "Because it standardises features onto a square grid before training",
      "Because it fits a straight line and then rounds it to right angles",
      "Because each split involves only one feature, so every boundary is perpendicular to that feature's axis",
      "Because rectangles minimise the number of leaves required"
    ],
    answer: 2,
    note: "Each split tests a single feature against a threshold, which places an axis-parallel cut through the feature space. Stacking those cuts yields rectangular regions - a tree cannot draw a diagonal boundary in one split."
  },
  {
    id: 19,
    section: "Decision Regions",
    question: "A dataset's two classes are cleanly separated by a diagonal line. What should you expect from a shallow decision tree?",
    options: [
      "It reproduces the diagonal boundary exactly",
      "It refuses to fit and raises an error",
      "It approximates the diagonal with a coarse staircase of axis-parallel steps",
      "It rotates the feature space so the boundary becomes axis-parallel"
    ],
    answer: 2,
    note: "Because every cut is axis-parallel, a tree can only approximate a diagonal as a staircase, and a shallow tree makes that staircase coarse. This is a case where a linear model needs far less capacity to do better."
  },
  {
    id: 20,
    section: "Decision Regions",
    question: "In the Wisconsin Breast Cancer example, what is the tree predicting?",
    options: [
      "The size of the tumour in millimetres",
      "The number of cancerous cells in the sample",
      "The patient's likely survival time",
      "Whether a tumour is malignant or benign"
    ],
    answer: 3,
    note: "It is a binary classification task: malignant or benign. Predicting a size or a survival time would be regression, which needs a regression tree rather than a classifier."
  },

  /* ── Code practice: import, instantiate, fit, predict ────── */
  {
    id: 21,
    section: "Decision Tree Code Practice",
    question: "You need the DecisionTreeClassifier class itself, not the whole module. Which statement is correct Python?",
    options: [
      "import DecisionTreeClassifier from sklearn.tree",
      "from sklearn.tree import DecisionTreeClassifier",
      "import sklearn.tree.DecisionTreeClassifier",
      "from sklearn import DecisionTreeClassifier"
    ],
    answer: 1,
    note: "Python puts the module first: 'from <module> import <name>'. Writing 'import X from Y' is JavaScript syntax and raises a SyntaxError. The last option fails because the class lives in the sklearn.tree submodule, not in sklearn itself."
  },
  {
    id: 22,
    section: "Decision Tree Code Practice",
    question: "Which line instantiates a decision tree called dt with a maximum depth of 6?",
    options: [
      "dt = DecisionTreeClassifier(depth=6)",
      "dt = DecisionTreeClassifier.max_depth(6)",
      "dt = DecisionTreeClassifier(max_depth=6, random_state=1)",
      "dt = DecisionTreeClassifier(6, random_state=1)"
    ],
    answer: 2,
    note: "The parameter is named max_depth, and it is passed as a keyword argument when the estimator is constructed. 'depth' is not a valid parameter name, and the positional form is wrong because the first positional parameter of DecisionTreeClassifier is the splitting criterion, not the depth."
  },
  {
    id: 23,
    section: "Decision Tree Code Practice",
    question: "After running dt = DecisionTreeClassifier(max_depth=6), what state is the model in?",
    options: [
      "Trained and ready to predict",
      "Configured but not yet trained - it has seen no data",
      "Trained on a default sample of the data",
      "Trained only if random_state was also set"
    ],
    answer: 1,
    note: "Instantiating only sets the hyperparameters. No data has been passed, so nothing has been learned. Calling predict at this point raises a NotFittedError - the model has to be fitted first."
  },
  {
    id: 24,
    section: "Decision Tree Code Practice",
    question: "What does setting max_depth=6 rather than leaving it unset actually do?",
    options: [
      "Limits the tree to 6 leaves",
      "Limits the tree to 6 features",
      "Forces the tree to make exactly 6 splits",
      "Stops the tree growing more than 6 levels deep, which limits overfitting"
    ],
    answer: 3,
    note: "max_depth caps the length of the longest root-to-leaf path. Left unset, the tree keeps splitting until the leaves are pure, which usually overfits. It is a ceiling, not a target - the tree may finish shallower if splitting stops paying off."
  },
  {
    id: 25,
    section: "Decision Tree Code Practice",
    question: "Which call fits dt to the training set?",
    options: [
      "dt.fit(X_train, y_train)",
      "dt.train(X_train, y_train)",
      "dt.fit(X_train)",
      "dt.fit(X_test, y_test)"
    ],
    answer: 0,
    note: "scikit-learn estimators use fit, not train, and supervised learning needs both the features and the labels. Fitting on the test set would contaminate your evaluation - that data has to stay unseen."
  },
  {
    id: 26,
    section: "Decision Tree Code Practice",
    question: "Why must fit receive y_train as well as X_train?",
    options: [
      "To tell the model how many rows to expect",
      "Because supervised learning needs the correct labels to learn the splits from",
      "To set the random seed for the splits",
      "It does not - y_train is optional for trees"
    ],
    answer: 1,
    note: "A classification tree chooses each split by seeing which one best separates the known labels. Without y_train there is nothing to separate, which is what distinguishes supervised learning from unsupervised methods like clustering."
  },
  {
    id: 27,
    section: "Decision Tree Code Practice",
    question: "Which line predicts the test set labels and assigns them to y_pred?",
    options: [
      "y_pred = dt.predict(y_test)",
      "y_pred = dt.fit_predict(X_test)",
      "y_pred = dt.predict(X_test)",
      "y_pred = dt.predict(X_train)"
    ],
    answer: 2,
    note: "predict takes features and returns labels, so it is passed X_test. Passing y_test is a common slip - those are the answers you are trying to predict, and handing them to the model would be circular."
  },
  {
    id: 28,
    section: "Decision Tree Code Practice",
    question: "What does dt.predict(X_test) return?",
    options: [
      "The accuracy of the model on the test set",
      "An array of predicted labels, one per row of X_test",
      "The probability of each class for each row",
      "The fitted tree structure"
    ],
    answer: 1,
    note: "predict returns one predicted label per input row. Class probabilities come from predict_proba, and the accuracy is computed separately by comparing these predictions against the true labels."
  },
  {
    id: 29,
    section: "Decision Tree Code Practice",
    question: "Put the four steps in the correct order: (i) fit, (ii) import, (iii) predict, (iv) instantiate.",
    options: [
      "ii, iv, i, iii",
      "ii, i, iv, iii",
      "iv, ii, i, iii",
      "ii, iv, iii, i"
    ],
    answer: 0,
    note: "Import the class, instantiate it with your hyperparameters, fit it on the training data, then predict on the test features. Predicting before fitting raises a NotFittedError."
  },
  {
    id: 30,
    section: "Decision Tree Code Practice",
    question: "Having produced y_pred, which call scores the model correctly?",
    options: [
      "accuracy_score(X_test, y_pred)",
      "accuracy_score(y_pred, X_test)",
      "accuracy_score(y_train, y_pred)",
      "accuracy_score(y_test, y_pred)"
    ],
    answer: 3,
    note: "accuracy_score compares the true labels with the predicted ones, so it takes y_test and y_pred. Passing X_test compares features against labels, and y_train has a different length from y_pred, which raises an error."
  },
  {
    id: 31,
    section: "Decision Tree Code Practice",
    question: "You call dt.predict(X_test) immediately after instantiating dt, without fitting. What happens?",
    options: [
      "It returns all zeros",
      "It raises a NotFittedError",
      "It silently fits the model first, then predicts",
      "It returns random labels"
    ],
    answer: 1,
    note: "scikit-learn raises NotFittedError rather than guessing. The library deliberately fails loudly here, because silently returning meaningless predictions would be far harder to debug."
  },
  {
    id: 32,
    section: "Decision Tree Code Practice",
    question: "Two trees are fitted on the same data, one with max_depth=2 and one with max_depth=6. What difference should you expect?",
    options: [
      "The deeper tree fits the training data more closely and risks overfitting",
      "The deeper tree always scores higher on the test set",
      "Both trees produce identical decision boundaries",
      "The shallower tree takes longer to train"
    ],
    answer: 0,
    note: "More depth means more splits and a closer fit to the training data - which is exactly how overfitting starts. Better training accuracy does not guarantee better test accuracy, and choosing the depth is what hyperparameter tuning is for."
  },

  /* ── Evaluating a classifier ─────────────────────────────── */
  {
    id: 33,
    section: "Evaluating a Classifier",
    question: "Which import gives you the accuracy_score function?",
    options: [
      "from sklearn.tree import accuracy_score",
      "from sklearn.metrics import accuracy_score",
      "from sklearn.model_selection import accuracy_score",
      "from sklearn.accuracy import accuracy_score"
    ],
    answer: 1,
    note: "Scoring functions live in sklearn.metrics. A useful rule of thumb for the library: sklearn.tree holds models, sklearn.model_selection holds tools for splitting and searching, and sklearn.metrics holds everything that scores a result."
  },
  {
    id: 34,
    section: "Evaluating a Classifier",
    question: "What exactly does the accuracy metric measure?",
    options: [
      "The average distance between predicted and true labels",
      "How confident the model is in its predictions",
      "The fraction of predictions on the test set that are correct",
      "The proportion of the data used for testing"
    ],
    answer: 2,
    note: "Accuracy is correct predictions divided by total predictions. It says nothing about confidence - a model can be right often while being badly calibrated, which is why predict_proba exists separately."
  },
  {
    id: 35,
    section: "Evaluating a Classifier",
    question: "Which line computes the test set accuracy of a fitted tree dt?",
    options: [
      "acc = accuracy_score(y_test, y_pred)",
      "acc = accuracy_score(X_test, y_pred)",
      "acc = dt.accuracy_score(X_test, y_test)",
      "acc = accuracy_score(dt, X_test)"
    ],
    answer: 0,
    note: "accuracy_score compares two label arrays: the true test labels and the predicted ones. It is a standalone function rather than a method on the estimator, and it never takes the features or the model itself."
  },
  {
    id: 36,
    section: "Evaluating a Classifier",
    question: "accuracy_score returns 0.89. What does that number represent?",
    options: [
      "89 correct predictions were made",
      "89% of test predictions were correct",
      "The model is 0.89 standard deviations better than random",
      "0.89% of test predictions were correct"
    ],
    answer: 1,
    note: "accuracy_score returns a fraction between 0 and 1, so 0.89 means 89% correct. It is not a count and not already a percentage - multiply by 100 yourself if you want to print one."
  },
  {
    id: 37,
    section: "Evaluating a Classifier",
    question: "In print(\"Test set accuracy: {:.2f}\".format(acc)), what does {:.2f} do?",
    options: [
      "Rounds acc to the nearest whole number",
      "Converts acc to a percentage",
      "Multiplies acc by 2",
      "Formats acc as a decimal number with 2 places after the point"
    ],
    answer: 3,
    note: "The .2f format specifier prints a float to two decimal places, so 0.8947 displays as 0.89. It only changes how the value is displayed - acc itself keeps its full precision."
  },
  {
    id: 38,
    section: "Evaluating a Classifier",
    question: "Would accuracy_score(y_pred, y_test) give a different number from accuracy_score(y_test, y_pred)?",
    options: [
      "Yes, the first argument must always be the true labels or the result is wrong",
      "No - accuracy just counts matches, so the order does not change the value",
      "Yes, swapping them inverts the score to 1 minus the accuracy",
      "It raises an error because the arguments are named"
    ],
    answer: 1,
    note: "Accuracy is symmetric: it counts positions where the two arrays agree, so the order cannot change the count. Keep the conventional (y_true, y_pred) order anyway, because precision, recall and the confusion matrix are NOT symmetric and swapping those does give wrong answers."
  },
  {
    id: 39,
    section: "Evaluating a Classifier",
    question: "Why is dt scored on X_test and y_test rather than on the training data?",
    options: [
      "Because the training data is deleted once fit has run",
      "Because accuracy_score only accepts test data",
      "Because the model has already seen the training data, so scoring on it overstates performance",
      "Because the test set is always the larger of the two"
    ],
    answer: 2,
    note: "The tree was fitted to the training labels, so it will score well on them almost by construction. Only data the model has never seen gives an honest estimate of how it will behave on new cases."
  },
  {
    id: 40,
    section: "Evaluating a Classifier",
    question: "A dataset is 97% benign and 3% malignant. A model predicts 'benign' for every case. What is its accuracy, and what is the problem?",
    options: [
      "3% - and the model is obviously useless",
      "50% - accuracy always defaults to chance level for a constant model",
      "97% - and accuracy hides that it never catches a single malignant case",
      "0% - predicting one class always scores zero"
    ],
    answer: 2,
    note: "It scores 97% while being clinically worthless, because accuracy weights every case equally. On imbalanced problems this is why you also look at precision, recall and the confusion matrix - the 3% you are missing is usually the class you care about."
  },
  {
    id: 41,
    section: "Evaluating a Classifier",
    question: "Which call is equivalent to accuracy_score(y_test, dt.predict(X_test))?",
    options: [
      "dt.evaluate(X_test, y_test)",
      "dt.accuracy(X_test, y_test)",
      "dt.score(X_test, y_test)",
      "dt.fit(X_test, y_test)"
    ],
    answer: 2,
    note: "Every scikit-learn classifier has a score method that predicts and scores in one step, and for classifiers it returns accuracy. Note it takes the features, not predictions, because it runs predict internally."
  },
  {
    id: 42,
    section: "Evaluating a Classifier",
    question: "You accidentally write accuracy_score(y_test, dt.predict(X_train)). What happens?",
    options: [
      "It raises an error because the two arrays have different lengths",
      "It silently returns the training accuracy",
      "It returns 0.0",
      "It returns the average of the training and test accuracy"
    ],
    answer: 0,
    note: "X_train has more rows than y_test, so the two label arrays cannot be compared element by element and scikit-learn raises a ValueError. The mismatched length is what saves you here - had the sets been the same size, you would have got a meaningless number with no warning at all."
  },

  /* ── How a tree actually learns ──────────────────────────── */
  {
    id: 43,
    section: "Tree Learning & Information Gain",
    question: "In decision-tree terminology, what is a node?",
    options: [
      "A single row of the training data",
      "A point in the tree involving either a question or a prediction",
      "One feature of the dataset",
      "The threshold value used to split the data"
    ],
    answer: 1,
    note: "A tree is a hierarchy of nodes, and each one either asks a question about a feature or makes a prediction. The threshold itself is the split point, which is part of a question rather than the node."
  },
  {
    id: 44,
    section: "Tree Learning & Information Gain",
    question: "Which statement describes the root of a decision tree?",
    options: [
      "It has no parent and poses a question that creates two children",
      "It has one parent and makes the final prediction",
      "It is the deepest node in the tree",
      "It has no children and no question"
    ],
    answer: 0,
    note: "The root is where the tree starts growing, so nothing sits above it. Like an internal node it asks a question and branches in two - the difference is purely that it has no parent."
  },
  {
    id: 45,
    section: "Tree Learning & Information Gain",
    question: "Which set of properties belongs to a leaf?",
    options: [
      "One parent, two children, and a question",
      "No parent, no children, and a prediction",
      "One parent, no children, no question - and this is where the prediction is made",
      "Two parents, no children, and a question"
    ],
    answer: 2,
    note: "A leaf sits at the end of a branch: it has a parent, no children, and asks nothing. It is the only place a prediction actually happens - every other node just routes the instance onward."
  },
  {
    id: 46,
    section: "Tree Learning & Information Gain",
    question: "An instance lands in a leaf containing 257 benign and 7 malignant training instances. What does the tree predict?",
    options: [
      "Malignant, because that is the higher-risk class",
      "It refuses to predict because the leaf is impure",
      "A probability of 0.5 for each class",
      "Benign, because it is the predominant class in that leaf"
    ],
    answer: 3,
    note: "The prediction is the majority class in the leaf, so 257 against 7 gives benign. A leaf does not need to be perfectly pure to make a prediction - it just goes with whichever class predominates."
  },
  {
    id: 47,
    section: "Tree Learning & Information Gain",
    question: "What does it mean for a tree to produce the 'purest' leaves possible?",
    options: [
      "Each leaf contains the same number of instances",
      "Each leaf has one class label predominating within it",
      "Each leaf contains exactly one training instance",
      "Every feature is used exactly once per branch"
    ],
    answer: 1,
    note: "Purity is about the class mix inside a leaf: a pure leaf is dominated by a single label. Equal-sized leaves are irrelevant, and one instance per leaf would be a badly overfitted tree rather than a good one."
  },
  {
    id: 48,
    section: "Tree Learning & Information Gain",
    question: "How does a tree decide which feature f and split point sp to use at a node?",
    options: [
      "It picks the feature with the largest numerical range",
      "It tries features in the order they appear in the dataset",
      "It chooses the pair that maximises information gain",
      "It selects a feature at random and finds the median"
    ],
    answer: 2,
    note: "At each node the tree searches feature and split-point combinations and keeps the one giving the greatest information gain. Column order and feature scale play no part, which is why trees need no standardisation."
  },
  {
    id: 49,
    section: "Tree Learning & Information Gain",
    question: "When a node of N samples splits into children of N_left and N_right, how are the children's impurities combined in the information gain?",
    options: [
      "They are simply added together",
      "Only the more impure child is counted",
      "They are averaged without regard to size",
      "Each is weighted by the fraction of samples it received, then subtracted from the parent's impurity"
    ],
    answer: 3,
    note: "Information gain is the parent's impurity minus the size-weighted impurities of the two children. The weighting matters: a very impure child holding only a handful of samples should not count as heavily as a large one."
  },
  {
    id: 50,
    section: "Tree Learning & Information Gain",
    question: "Which pair are criteria for measuring the impurity of a node?",
    options: [
      "Accuracy and precision",
      "The gini index and entropy",
      "Mean squared error and R-squared",
      "Variance and covariance"
    ],
    answer: 1,
    note: "Gini index and entropy are the two impurity criteria used for classification trees. Accuracy and precision score a finished model rather than guiding individual splits, and MSE is the criterion a regression tree uses instead."
  },
  {
    id: 51,
    section: "Tree Learning & Information Gain",
    question: "In an unconstrained tree, what happens at a node when splitting yields zero information gain?",
    options: [
      "The node is declared a leaf",
      "The node is split anyway using a random feature",
      "The tree restarts training from the root",
      "The node is deleted and its samples discarded"
    ],
    answer: 0,
    note: "If a split buys no reduction in impurity there is nothing to gain by making it, so the node becomes a leaf and growth stops down that branch. That is the natural stopping rule when no depth limit is set."
  },
  {
    id: 52,
    section: "Tree Learning & Information Gain",
    question: "A tree is trained with max_depth=2. A node at depth 2 could still be split for a positive information gain. What happens?",
    options: [
      "It is split anyway, because positive gain overrides the limit",
      "It is declared a leaf, because the depth constraint takes priority",
      "Training raises an error about the conflicting constraint",
      "The tree increases max_depth automatically to allow the split"
    ],
    answer: 1,
    note: "The depth constraint wins. Every node at the maximum depth becomes a leaf whether or not further gain was available - which is precisely how max_depth limits overfitting, by stopping growth early on purpose."
  },
  {
    id: 53,
    section: "Tree Learning & Information Gain",
    question: "The nodes of a classification tree are said to be grown 'recursively'. What does that mean here?",
    options: [
      "The tree calls itself until it runs out of memory",
      "Every node is grown simultaneously in a single pass",
      "The tree is rebuilt from scratch after each split",
      "Whether a node exists, and what it asks, depends on the state of the nodes above it"
    ],
    answer: 3,
    note: "Each split is made on the data that survived the splits above it, so a node's existence and its question both depend on its predecessors. The tree is built top-down, one decision at a time, rather than all at once."
  },
  {
    id: 54,
    section: "Tree Learning & Information Gain",
    question: "How do you tell scikit-learn to use the gini index as the impurity criterion?",
    options: [
      "DecisionTreeClassifier(impurity='gini')",
      "DecisionTreeClassifier(criterion='gini')",
      "DecisionTreeClassifier(gini=True)",
      "DecisionTreeClassifier(metric='gini')"
    ],
    answer: 1,
    note: "The parameter is criterion, and it accepts 'gini' or 'entropy' for classification. Gini is the default, so passing it explicitly is about making the choice visible rather than changing behaviour."
  },
  {
    id: 55,
    section: "Tree Learning & Information Gain",
    question: "How many children does a question at an internal node give rise to in a CART tree?",
    options: [
      "Two, via two branches",
      "One per class label in the dataset",
      "One per distinct value of the chosen feature",
      "As many as the max_depth setting allows"
    ],
    answer: 0,
    note: "CART trees are binary: every question splits the data in two, True and False. Trees that branch once per feature value are a different family - the multiway splits of algorithms like ID3."
  },
  {
    id: 56,
    section: "Tree Learning & Information Gain",
    question: "What distinguishes an internal node from the root?",
    options: [
      "An internal node makes a prediction, the root asks a question",
      "An internal node cannot have children",
      "An internal node has a parent, whereas the root has none",
      "An internal node uses entropy while the root uses gini"
    ],
    answer: 2,
    note: "Both ask a question and both produce two children. The only structural difference is that an internal node sits below something, while the root is where the tree starts and has nothing above it."
  },

  /* ── Linear models vs trees ──────────────────────────────── */
  {
    id: 57,
    section: "Linear Models vs Trees",
    question: "Which import gives you LogisticRegression?",
    options: [
      "from sklearn.linear_model import LogisticRegression",
      "from sklearn.logistic import LogisticRegression",
      "from sklearn.linear_models import LogisticRegression",
      "from sklearn.tree import LogisticRegression"
    ],
    answer: 0,
    note: "It lives in sklearn.linear_model - singular, not linear_models. That missing 's' is one of the most common import errors in scikit-learn."
  },
  {
    id: 58,
    section: "Linear Models vs Trees",
    question: "Despite its name, what task is LogisticRegression used for?",
    options: [
      "Regression - predicting a continuous value",
      "Classification - predicting a class label",
      "Clustering unlabelled data",
      "Reducing the number of features"
    ],
    answer: 1,
    note: "Logistic regression is a classifier, not a regressor. The name comes from the underlying maths, which regresses onto the log-odds - but the output you use is a class label. For continuous targets you would reach for LinearRegression instead."
  },
  {
    id: 59,
    section: "Linear Models vs Trees",
    question: "How many decision regions does a single linear decision boundary create?",
    options: [
      "One per class label in the dataset",
      "Two",
      "Four",
      "As many as there are features"
    ],
    answer: 1,
    note: "One straight boundary cuts the feature space into exactly two regions, one on each side. That is the structural limit of a plain linear classifier on a binary problem - it gets one cut, and it must be straight."
  },
  {
    id: 60,
    section: "Linear Models vs Trees",
    question: "You have fitted dt and now want to fit logreg on the same data. What does the code look like?",
    options: [
      "logreg.fit(X_train, y_train) - the same call, because scikit-learn estimators share one interface",
      "logreg.fit(X_train) - linear models do not take labels",
      "logreg.train(X_train, y_train) - linear models use train, not fit",
      "logreg.fit(dt) - the tree is passed in for comparison"
    ],
    answer: 0,
    note: "Every scikit-learn estimator exposes the same fit/predict interface, so swapping a tree for a logistic regression changes only the line where you instantiate it. That consistency is one of the library's main design wins."
  },
  {
    id: 61,
    section: "Linear Models vs Trees",
    question: "Both dt and logreg are trained on the same two features. How will their decision boundaries differ?",
    options: [
      "Both produce straight boundaries, but at different angles",
      "The tree produces one curved boundary, logreg produces several",
      "The tree gives axis-parallel rectangular regions, logreg gives a single straight line",
      "They will be identical if trained on the same data"
    ],
    answer: 2,
    note: "The tree splits one feature at a time, so every cut is parallel to an axis and the regions come out rectangular. Logistic regression fits one straight boundary at whatever angle best separates the classes."
  },
  {
    id: 62,
    section: "Linear Models vs Trees",
    question: "What is the purpose of typing help(plot_labeled_decision_regions) in the shell?",
    options: [
      "It plots the decision regions immediately",
      "It displays the function's documentation, including what arguments it expects",
      "It checks the function for errors",
      "It lists all functions available in the workspace"
    ],
    answer: 1,
    note: "help() prints an object's documentation - its signature and docstring. It is the fastest way to find out what a function expects without leaving the shell, and works on any Python object."
  },
  {
    id: 63,
    section: "Linear Models vs Trees",
    question: "plot_labeled_decision_regions() is described as taking a list of two trained classifiers. What must be true before you call it?",
    options: [
      "Both models must be instantiated but not fitted",
      "Both models must be trees",
      "Both models must already be fitted to the training data",
      "Both models must have identical hyperparameters"
    ],
    answer: 2,
    note: "Decision regions are a property of a trained model, so both classifiers have to be fitted first. An unfitted estimator has no boundary to draw and would raise NotFittedError."
  },
  {
    id: 64,
    section: "Linear Models vs Trees",
    question: "The classes in a dataset are separated by a clean diagonal line. Which model is better suited?",
    options: [
      "A logistic regression, because one straight boundary fits it exactly",
      "A shallow decision tree, because trees handle any shape",
      "Neither can represent a diagonal boundary",
      "Both fit it equally well with no difference in complexity"
    ],
    answer: 0,
    note: "A diagonal is exactly what a linear boundary represents naturally. A tree can only approximate it with a staircase of axis-parallel cuts, needing considerable depth to get close - and overfitting as it does so."
  },
  {
    id: 65,
    section: "Linear Models vs Trees",
    question: "The boundary between two classes is strongly non-linear - a curved, interlocking shape. Which model copes better?",
    options: [
      "Logistic regression, because it is more flexible",
      "A decision tree, because stacking many axis-parallel splits can approximate complex shapes",
      "Neither - non-linear boundaries require unsupervised learning",
      "Both perform identically on non-linear data"
    ],
    answer: 1,
    note: "This is the tree's advantage. A plain logistic regression can only ever draw one straight line, whereas a tree stacks splits to approximate a complex region - which is why trees are used where relationships are non-linear."
  },
  {
    id: 66,
    section: "Linear Models vs Trees",
    question: "One feature is measured in millimetres and another in thousands of dollars. Which model is more likely to need the features scaled first?",
    options: [
      "The decision tree, because it compares features against each other",
      "Neither - scikit-learn scales all inputs automatically",
      "Both need scaling equally",
      "The logistic regression, because its coefficients are affected by feature scale"
    ],
    answer: 3,
    note: "Logistic regression weights all features in one equation, so wildly different scales distort the fit and slow convergence. A tree compares each feature against its own threshold, so scaling changes nothing for it."
  },
  {
    id: 67,
    section: "Linear Models vs Trees",
    question: "What does instantiating logreg = LogisticRegression() and then calling logreg.fit(X_train, y_train) accomplish?",
    options: [
      "It creates the model and learns the boundary from the training data",
      "It creates the model and immediately scores it",
      "It only creates the model - fit must be called on the test set to train it",
      "It converts the tree dt into a linear model"
    ],
    answer: 0,
    note: "Instantiating configures the model; fitting is where it learns from the labelled training data. The two steps are always separate in scikit-learn, for the tree and the linear model alike."
  },
  {
    id: 68,
    section: "Linear Models vs Trees",
    question: "Why compare the decision regions of dt and logreg visually rather than just their accuracy scores?",
    options: [
      "Because accuracy cannot be computed for logistic regression",
      "Because the plot always shows which model is better",
      "Because the shapes show HOW each model separates the classes, which a single number hides",
      "Because visual comparison replaces the need for a test set"
    ],
    answer: 2,
    note: "Two models can score alike while carving the space up completely differently, and the plot shows which one's assumptions actually match the data. It supplements the accuracy score rather than replacing it - you still need the test set for an honest estimate."
  },

  /* ── The growth rules, stated as a set ───────────────────── */
  {
    id: 69,
    section: "Tree Learning & Information Gain",
    question: "Which of the following is NOT one of the rules governing the growth of an unconstrained classification tree?",
    options: [
      "The existence of a node depends on the state of its predecessors",
      "When an internal node is split, the split is performed so that information gain is minimized",
      "When the information gain from splitting a node is null, the node is declared a leaf",
      "The impurity of a node can be measured using criteria such as entropy and the gini index"
    ],
    answer: 1,
    note: "The tree MAXIMIZES information gain at each split - it searches for the most informative division available, not the least. The other three are all genuine rules. Watch for this inversion: swapping maximize for minimize is a favourite way to turn a true statement into a false one."
  },
  {
    id: 70,
    section: "Tree Learning & Information Gain",
    question: "A tree evaluates four candidate splits at a node, with information gains of 0.02, 0.31, 0.14 and 0.00. Which does it choose?",
    options: [
      "The split with gain 0.00, since it needs no further division",
      "The split with gain 0.02, the smallest non-zero gain",
      "The split with gain 0.14, the middle value",
      "The split with gain 0.31, the largest gain"
    ],
    answer: 3,
    note: "It takes the largest gain, 0.31 - the split that reduces impurity most. Information gain measures how much purer the children are than the parent, so more is better and the tree is greedy about taking it."
  },
  {
    id: 71,
    section: "Tree Learning & Information Gain",
    question: "Why is a node with zero information gain turned into a leaf rather than split anyway?",
    options: [
      "Because zero gain means the split would produce children no purer than the parent, so it buys nothing",
      "Because scikit-learn cannot compute a split when the gain is zero",
      "Because zero gain indicates corrupted data at that node",
      "Because leaves are always cheaper to store than internal nodes"
    ],
    answer: 0,
    note: "Zero gain means the proposed children are no purer than the parent, so the split adds depth and complexity for no improvement in separation. Stopping there keeps the tree simpler and less prone to overfitting."
  },
  {
    id: 72,
    section: "Tree Learning & Information Gain",
    question: "The word 'unconstrained' in 'an unconstrained classification tree' refers to what?",
    options: [
      "The tree may use any impurity criterion it chooses at each node",
      "The tree is not restricted to binary splits",
      "No limits such as max_depth have been set, so growth stops only when splitting stops paying off",
      "The training data has not been scaled or preprocessed"
    ],
    answer: 2,
    note: "Unconstrained means no hyperparameter caps growth, so the only stopping rule is zero information gain. Setting something like max_depth constrains the tree, and that constraint then overrides the gain rule - nodes at the limit become leaves regardless."
  },

  /* ── Overfitting and underfitting ────────────────────────── */
  {
    id: 73,
    section: "Overfitting & Underfitting",
    question: "In supervised learning, what does the mapping y = f(x) represent?",
    options: [
      "The model you have trained on the data",
      "An unknown true function relating features to labels, which you are trying to determine",
      "The loss function minimised during training",
      "The split point chosen at the root of a tree"
    ],
    answer: 1,
    note: "f is the true but unknown function linking features to labels. What you train is f-hat, an approximation of it. Keeping those two apart is what makes the whole bias-variance discussion coherent."
  },
  {
    id: 74,
    section: "Overfitting & Underfitting",
    question: "Real data is generated with randomness or noise. What should a good model do with that noise?",
    options: [
      "Fit it as closely as possible, since it is part of the data",
      "Discard as much of it as possible",
      "Delete the noisy rows before training",
      "Amplify it so the model becomes more sensitive"
    ],
    answer: 1,
    note: "Noise carries no information about f, so a model that fits it has learned something that will not recur in new data. You cannot simply delete it either - noise is not labelled as such, which is what makes this hard."
  },
  {
    id: 75,
    section: "Overfitting & Underfitting",
    question: "What is overfitting?",
    options: [
      "The model is not flexible enough to approximate the true function",
      "The model is trained on too many features",
      "The model fits the noise in the training set",
      "The model is trained for too few iterations"
    ],
    answer: 2,
    note: "An overfitted model has memorised the noise rather than the underlying pattern. Because that noise does not repeat in new data, its predictive power on unseen sets collapses."
  },
  {
    id: 76,
    section: "Overfitting & Underfitting",
    question: "What is underfitting?",
    options: [
      "The model is not flexible enough to approximate the true function",
      "The model memorises the training set exactly",
      "The model does well on training data but poorly on test data",
      "The training set is smaller than the test set"
    ],
    answer: 0,
    note: "An underfitted model lacks the capacity to capture the real relationship between features and labels. The course analogy is teaching calculus to a three-year-old - the required flexibility simply is not there."
  },
  {
    id: 77,
    section: "Overfitting & Underfitting",
    question: "Which pattern of errors indicates overfitting?",
    options: [
      "High training error and high test error",
      "Low training error and high test error",
      "High training error and low test error",
      "Training and test error roughly equal, both low"
    ],
    answer: 1,
    note: "Overfitting shows up as a large gap between the two: the model scores well on what it memorised and badly on anything new. The gap is the diagnostic, not either number alone."
  },
  {
    id: 78,
    section: "Overfitting & Underfitting",
    question: "Which pattern of errors indicates underfitting?",
    options: [
      "Low training error and high test error",
      "Low training error and low test error",
      "Training and test error roughly equal, with both relatively high",
      "Test error far below training error"
    ],
    answer: 2,
    note: "An underfitted model does badly everywhere, so the two errors sit close together but both high. That closeness is what separates it from overfitting, where the two diverge."
  },
  {
    id: 79,
    section: "Overfitting & Underfitting",
    question: "A model scores 99% on the training set and 62% on the test set. What is the diagnosis?",
    options: [
      "Underfitting - it needs more complexity",
      "Overfitting - it has memorised the training set",
      "The test set must be mislabelled",
      "The model is well balanced"
    ],
    answer: 1,
    note: "A 37-point gap is the signature of overfitting. For a tree the usual first response is to reduce complexity - lower max_depth, or require more samples per leaf."
  },
  {
    id: 80,
    section: "Overfitting & Underfitting",
    question: "A model scores 64% on the training set and 63% on the test set. What is happening?",
    options: [
      "It is overfitting, because the scores are so close",
      "It is performing ideally, since the scores agree",
      "It is underfitting - consistent but poor, so it cannot capture the pattern",
      "The training and test sets have been swapped"
    ],
    answer: 2,
    note: "Agreement between training and test scores is only good news if both are high. Here they agree because the model is equally unable to capture the pattern in either - the fix is more complexity, not less."
  },

  /* ── Bias, variance and complexity ───────────────────────── */
  {
    id: 81,
    section: "Bias, Variance & Complexity",
    question: "The generalization error decomposes into which three terms?",
    options: [
      "Training error, test error and validation error",
      "Bias, variance and irreducible error",
      "Precision, recall and accuracy",
      "Gini index, entropy and information gain"
    ],
    answer: 1,
    note: "Generalization error = bias + variance + irreducible error, the last being the contribution of noise. In the formal statement the bias term is squared, but it is the three components that matter here."
  },
  {
    id: 82,
    section: "Bias, Variance & Complexity",
    question: "What does the bias term measure?",
    options: [
      "How much predictions vary across different training sets",
      "How much noise is present in the data",
      "On average, how much f-hat differs from the true function f",
      "How unbalanced the class labels are"
    ],
    answer: 2,
    note: "Bias is the systematic gap between your model and the truth, averaged out. Do not confuse this technical sense with bias meaning unfairness - they are unrelated ideas sharing a word."
  },
  {
    id: 83,
    section: "Bias, Variance & Complexity",
    question: "What does the variance term measure?",
    options: [
      "How inconsistent f-hat is when trained on different training sets",
      "The spread of feature values in the dataset",
      "The average distance between predictions and true labels",
      "How much the test set differs from the training set"
    ],
    answer: 0,
    note: "Variance is about instability: retrain on a different sample, and how much does the fitted model change? A high-variance model chases the particular points it was handed, which is why it tracks noise."
  },
  {
    id: 84,
    section: "Bias, Variance & Complexity",
    question: "High bias leads to which problem?",
    options: [
      "Overfitting",
      "Underfitting",
      "Irreducible error",
      "Class imbalance"
    ],
    answer: 1,
    note: "A high-bias model is too rigid to follow the true function, so it underfits. Pair these correctly and half the topic is done: high bias with underfitting, high variance with overfitting."
  },
  {
    id: 85,
    section: "Bias, Variance & Complexity",
    question: "High variance leads to which problem?",
    options: [
      "Underfitting",
      "Irreducible error",
      "Overfitting",
      "Feature scaling problems"
    ],
    answer: 2,
    note: "A high-variance model follows the training points so closely that it misses the true function underneath - it has fitted the noise, which is overfitting."
  },
  {
    id: 86,
    section: "Bias, Variance & Complexity",
    question: "What is the irreducible error?",
    options: [
      "The error left once the model has fully converged",
      "The error contributed by noise, which no model can remove",
      "The difference between training and test error",
      "The error caused by poor hyperparameter choices"
    ],
    answer: 1,
    note: "It comes from randomness in how the data was generated, so no amount of tuning touches it. Because it is a constant floor, the tuning effort goes into balancing bias against variance instead."
  },
  {
    id: 87,
    section: "Bias, Variance & Complexity",
    question: "What happens to bias and variance as model complexity increases?",
    options: [
      "Both increase",
      "Both decrease",
      "Bias increases and variance decreases",
      "Bias decreases and variance increases"
    ],
    answer: 3,
    note: "More complexity means more flexibility to match the true function, so bias falls - but also more sensitivity to the particular sample, so variance rises. That opposing movement is the whole trade-off."
  },
  {
    id: 88,
    section: "Bias, Variance & Complexity",
    question: "For a decision tree, which change increases model complexity?",
    options: [
      "Increasing the maximum tree depth",
      "Decreasing the maximum tree depth",
      "Changing criterion from gini to entropy",
      "Setting random_state to a fixed value"
    ],
    answer: 0,
    note: "Deeper trees make more splits and carve finer regions, which is what more complexity means. Swapping the criterion changes how splits are chosen rather than how many, and random_state only affects reproducibility."
  },
  {
    id: 89,
    section: "Bias, Variance & Complexity",
    question: "What is the goal when navigating the bias-variance trade-off?",
    options: [
      "Drive bias to zero regardless of variance",
      "Drive variance to zero regardless of bias",
      "Find the complexity that minimises total generalization error",
      "Eliminate the irreducible error"
    ],
    answer: 2,
    note: "You minimise the sum, not either term alone. Pushing one down pushes the other up, so the best model sits where their total is lowest - and the irreducible error cannot be removed at all."
  },
  {
    id: 90,
    section: "Bias, Variance & Complexity",
    question: "In the shooting-target analogy, what does a tight cluster of shots far from the centre represent?",
    options: [
      "Low bias and low variance",
      "Low variance but high bias",
      "High variance but low bias",
      "High variance and high bias"
    ],
    answer: 1,
    note: "Tight grouping means the model is consistent, so variance is low; being off-centre means it is consistently wrong, which is high bias. Shots scattered all over the target would be the high-variance, high-bias case."
  },

  /* ── Cross-validation and diagnosis ──────────────────────── */
  {
    id: 91,
    section: "Cross-Validation & Diagnosis",
    question: "Why can the generalization error of a model not be computed directly?",
    options: [
      "Because scikit-learn provides no function for it",
      "Because f is unknown, you usually have only one dataset, and the noise term is inaccessible",
      "Because it requires more CPU than is normally available",
      "Because it can only be computed for regression, not classification"
    ],
    answer: 1,
    note: "All three obstacles bite at once: you never see the true function, you rarely have many independent datasets, and the noise contribution cannot be separated out. Everything that follows is a way of estimating around that."
  },
  {
    id: 92,
    section: "Cross-Validation & Diagnosis",
    question: "What is the basic approach to approximating the generalization error?",
    options: [
      "Train on all the data and report the training error",
      "Split into train and test, fit on the training set, and take the test error as the estimate",
      "Average the errors of several different algorithms",
      "Measure how long the model takes to converge"
    ],
    answer: 1,
    note: "Holding data back and scoring on it approximates performance on genuinely unseen data. Reporting training error instead would be optimistic, because the model has already been fitted to those exact points."
  },
  {
    id: 93,
    section: "Cross-Validation & Diagnosis",
    question: "How should the test set be treated during model development?",
    options: [
      "Kept untouched until you are confident, then used only for the final evaluation",
      "Used after every training run to guide the next change",
      "Merged into the training set once the model is stable",
      "Re-split randomly before each experiment"
    ],
    answer: 0,
    note: "Every peek at the test set leaks information into your choices, and repeated tuning against it turns it into a second training set. That is exactly the gap cross-validation fills during development."
  },
  {
    id: 94,
    section: "Cross-Validation & Diagnosis",
    question: "Why does evaluating on the training set give an optimistic estimate of error?",
    options: [
      "Because training sets are usually larger",
      "Because training data contains less noise",
      "Because the model was already exposed to that data when it was fitted",
      "Because scikit-learn rounds training scores upward"
    ],
    answer: 2,
    note: "The model was fitted to those exact points, so scoring on them partly measures memorisation. That flattering number is not evidence about behaviour on new data."
  },
  {
    id: 95,
    section: "Cross-Validation & Diagnosis",
    question: "In 10-fold cross-validation, how is each of the 10 error estimates obtained?",
    options: [
      "Train on one fold and evaluate on the other nine",
      "Train on all ten folds and evaluate on the test set",
      "Train on nine folds and evaluate on the one held out",
      "Train and evaluate on the same fold, ten times over"
    ],
    answer: 2,
    note: "Each round holds out one fold for evaluation and trains on the remaining nine, rotating until every fold has served as the held-out one. That yields ten error estimates from a single dataset."
  },
  {
    id: 96,
    section: "Cross-Validation & Diagnosis",
    question: "How is the CV error computed from the individual fold errors?",
    options: [
      "As the mean of the errors",
      "As the lowest of the errors",
      "As the sum of the errors",
      "As the error of the final fold"
    ],
    answer: 0,
    note: "The CV error is the mean across folds, which is more stable than any single split. Taking the minimum would flatter the model by reporting its luckiest fold."
  },
  {
    id: 97,
    section: "Cross-Validation & Diagnosis",
    question: "The CV error is appreciably GREATER than the training error. What does this diagnose?",
    options: [
      "High bias - the model underfits",
      "High variance - the model overfits the training set",
      "Irreducible error dominating",
      "A corrupted test set"
    ],
    answer: 1,
    note: "Doing well on training data but worse across held-out folds is the overfitting signature, which means high variance. The remedy is to reduce complexity, or gather more training data."
  },
  {
    id: 98,
    section: "Cross-Validation & Diagnosis",
    question: "Which remedies address a high-variance decision tree?",
    options: [
      "Increase max_depth and reduce the training data",
      "Decrease max_depth, increase min_samples_leaf, or gather more data",
      "Change the scoring metric to accuracy",
      "Set n_jobs to -1"
    ],
    answer: 1,
    note: "High variance means the model is too flexible, so you constrain it - a shallower tree, or more samples required per leaf. More training data helps too, since it becomes harder to memorise."
  },
  {
    id: 99,
    section: "Cross-Validation & Diagnosis",
    question: "The CV error is roughly equal to the training error, but both are far above the error you want. What does this diagnose?",
    options: [
      "High variance - the model overfits",
      "High bias - the model underfits the training set",
      "The folds were split incorrectly",
      "The model has converged optimally"
    ],
    answer: 1,
    note: "Consistent but poor performance across both means the model cannot capture the pattern anywhere - high bias. Note the comparison is against your DESIRED error: agreement alone says nothing until you know whether the level is acceptable."
  },
  {
    id: 100,
    section: "Cross-Validation & Diagnosis",
    question: "Which remedies address a high-bias model?",
    options: [
      "Increase model complexity, or gather more relevant features",
      "Decrease model complexity and prune the tree",
      "Collect more rows of the same features",
      "Reduce the number of cross-validation folds"
    ],
    answer: 0,
    note: "Underfitting means insufficient capacity, so you add complexity or give the model better inputs. More rows of the same weak features will not help - unlike the high-variance case, where extra data does."
  },
  {
    id: 101,
    section: "Cross-Validation & Diagnosis",
    question: "Which import provides cross_val_score?",
    options: [
      "from sklearn.metrics import cross_val_score",
      "from sklearn.model_selection import cross_val_score",
      "from sklearn.tree import cross_val_score",
      "from sklearn.cross_validation import cross_val_score"
    ],
    answer: 1,
    note: "It sits in sklearn.model_selection, alongside train_test_split - both are about how data is divided for evaluation. The old sklearn.cross_validation module was removed years ago."
  },
  {
    id: 102,
    section: "Cross-Validation & Diagnosis",
    question: "In cross_val_score(dt, X_train, y_train, cv=10, ...), what does cv=10 specify?",
    options: [
      "The maximum tree depth to use",
      "That ten different models will be compared",
      "The number of folds the training set is split into",
      "That ten percent of the data is held out"
    ],
    answer: 2,
    note: "cv sets the number of folds, so the training set is divided ten ways and the model is trained and scored ten times. It has nothing to do with tree depth or the size of the test split."
  },
  {
    id: 103,
    section: "Cross-Validation & Diagnosis",
    question: "Why is scoring set to 'neg_mean_squared_error' rather than a plain MSE?",
    options: [
      "Because negative errors train faster",
      "Because cross_val_score does not offer MSE directly, and its convention is that higher scores are better",
      "Because MSE cannot be computed for trees",
      "Because the auto dataset has negative targets"
    ],
    answer: 1,
    note: "scikit-learn's scoring convention is that greater is better, so an error metric is negated to fit it. Multiply the returned array by -1 to recover the actual MSE values."
  },
  {
    id: 104,
    section: "Cross-Validation & Diagnosis",
    question: "What does cross_val_score return when cv=10?",
    options: [
      "A single averaged score",
      "A numpy array of ten scores, one per fold",
      "The fitted model with the best score",
      "A dictionary of scores keyed by fold name"
    ],
    answer: 1,
    note: "You get one score per fold as an array, and you take the mean yourself. Keeping them separate is useful - a wide spread across folds is itself a sign of an unstable model."
  },
  {
    id: 105,
    section: "Cross-Validation & Diagnosis",
    question: "What does setting n_jobs=-1 do?",
    options: [
      "Disables parallel processing",
      "Runs the folds in reverse order",
      "Limits the computation to one CPU core",
      "Uses all available CPUs for the computation"
    ],
    answer: 3,
    note: "n_jobs=-1 means use every available core. Cross-validation fits are independent of one another, so they parallelise well and the speedup is close to free."
  },
  {
    id: 106,
    section: "Cross-Validation & Diagnosis",
    question: "Does calling cross_val_score(dt, X_train, y_train, cv=10) leave dt fitted and ready to predict?",
    options: [
      "No - it fits copies internally for scoring, so you still have to call dt.fit yourself",
      "Yes, dt is fitted on the last fold",
      "Yes, dt is fitted on the whole training set",
      "Only if n_jobs is set to 1"
    ],
    answer: 0,
    note: "cross_val_score clones the estimator for each fold and discards those copies, leaving your original untouched. This is why the workflow calls dt.fit(X_train, y_train) afterwards - forgetting it raises NotFittedError."
  },
  {
    id: 107,
    section: "Cross-Validation & Diagnosis",
    question: "Which line instantiates the regressor used in the auto-dataset example?",
    options: [
      "dt = DecisionTreeClassifier(max_depth=4, min_samples_leaf=0.14)",
      "dt = DecisionTreeRegressor(depth=4, samples_leaf=0.14)",
      "dt = DecisionTreeRegressor(max_depth=4, min_samples_leaf=0.14)",
      "dt = DecisionTreeRegressor(max_depth=0.14, min_samples_leaf=4)"
    ],
    answer: 2,
    note: "The auto dataset has a continuous target, so it needs a regressor rather than a classifier. min_samples_leaf given as 0.14 is read as a fraction - each leaf must hold at least 14% of the samples."
  },
  {
    id: 108,
    section: "Cross-Validation & Diagnosis",
    question: "A fitted tree has training MSE below its CV MSE, while the CV and test MSEs are roughly equal. What does this tell you?",
    options: [
      "The model underfits, and the test set is unrepresentative",
      "The model overfits and suffers high variance, and the CV error was a good estimate of test error",
      "The model is perfectly balanced",
      "The folds were too few to draw any conclusion"
    ],
    answer: 1,
    note: "Training error below CV error is the high-variance signature. That CV and test errors then agree is the useful part: it confirms cross-validation gave an honest estimate of unseen performance without ever touching the test set."
  }
];
