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
  }
];
