const mongoose = require("mongoose");

const Goal = require("../models/goal.model");
const Sentence = require("../models/sentence.model");
const Song = require("../models/song.model");
const Picture = require("../models/picture.model");

const dbtitle = "PROYECTO";
mongoose.connect(`mongodb://localhost/${dbtitle}`);

Goal.collection.drop();
Sentence.collection.drop();
Song.collection.drop();
Picture.collection.drop();

const goals = [
  {
    name: "My garden",
    theme: ["hobbies", "health", "home"],
    sentence: [{
        kind: "quote",
        theme: ["hobbies", "social"],
        phrase:
          "A society grows great when old men plant trees whose shade they know they shall never sit in.",
        author: "Greek proverb"
    },{
        kind: "quote",
        theme: ["hobbies", "social"],
        phrase:
          "I want to water my plants on sunday morning.",
        author: "Laura Li"
    }]
  },{
    name: "Working out",
    theme: ["hobbies", "health"],
    sentence: [{
        kind: "quote",
        theme: ["health"],
        phrase:
          "Don't let anyone work harden than you do",
        author: ""
    }]
  },
];


Promise.all(goals.map(goal => Sentence.create(goal.sentence).then(sentence => sentence.phrase)))
    .then(() => goals.map(goal => Sentence.findOne({ phrase: goal.sentence.phrase }).then(goal => Object.assign({}, sentence, { goal: goal._id }))))
    .then(findSentences => Promise.all(findSentences).then(goals => goals.map(goal => goal.create(goal))))
    .then(savedGoals => Promise.all(savedGoals).then(goals => goals.forEach(goals => console.log(`Goal: ${goals.name} creado`))).then(() => mongoose.connection.close()))
    .catch(error => console.log('Error: ', error))

