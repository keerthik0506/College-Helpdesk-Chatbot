import json
import pickle
import numpy as np
import random
import nltk
from nltk.stem import PorterStemmer
from nltk.tokenize import word_tokenize
from sklearn.neural_network import MLPClassifier

stemmer = PorterStemmer()

with open("intents.json") as file:
    data = json.load(file)

words = []
labels = []
docs_x = []
docs_y = []

for intent in data["intents"]:
    for pattern in intent["patterns"]:
        wrds = word_tokenize(pattern)
        words.extend(wrds)
        docs_x.append(wrds)
        docs_y.append(intent["tag"])
    if intent["tag"] not in labels:
        labels.append(intent["tag"])

words = [stemmer.stem(w.lower()) for w in words if w.isalpha()]
words = sorted(list(set(words)))
labels = sorted(labels)

training = []
output = []
out_empty = [0] * len(labels)

for x, doc in enumerate(docs_x):
    bag = []
    wrds = [stemmer.stem(w.lower()) for w in doc]

    for w in words:
        bag.append(1 if w in wrds else 0)

    output_row = out_empty[:]
    output_row[labels.index(docs_y[x])] = 1

    training.append(bag)
    output.append(output_row)

training = np.array(training)
output = np.array(output)

model = MLPClassifier(hidden_layer_sizes=(8, 8), max_iter=1000)
model.fit(training, output)

pickle.dump(model, open("chatbot_model.pkl", "wb"))
pickle.dump(words, open("words.pkl", "wb"))
pickle.dump(labels, open("labels.pkl", "wb"))

print("Model trained and saved successfully!")