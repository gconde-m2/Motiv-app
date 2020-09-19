const mongoose = require("mongoose");

const Goal = require("../models/goal.model");
const Sentence = require("../models/sentence.model");
const Song = require("../models/song.model");
const Picture = require("../models/picture.model");

const dbtitle = "PROYECTO";
mongoose.connect(`mongodb://localhost/${dbtitle}`, { useNewUrlParser: true, useUnifiedTopology: true });

Goal.collection.drop();
Sentence.collection.drop();
Song.collection.drop();
Picture.collection.drop();

const goals = [
  {
    name: "My garden",

    theme: ["hobbies", "mental health", "home", "garden"],

    sentence: [
        {
          "kind": "quote",

          "theme": ["hobbies", "garden", "social"],

          "phrase":
            "A society grows great when old men plant trees whose shade they know they shall never sit in.",

          "author": "Greek proverb",
        },
        {
          "kind": "quote",

          "theme": ["work", "garden", "social"],

          "phrase":
            "Working with plants will teach you all other social commitments in a soothing way",

          "author": "Karthikeyan V",
        },
    ],

        //picture: [ ""],

      //song: [""],
    
  },
];

const createSentences = goals.map((goal) => {
  const newSentence = new Sentence(goal.sentence);
  return newSentence
      .save()
      .then((sentence) => sentence.phrase)
      .then((sentence)=>console.log(sentence))
    .catch((err) => {
      throw new Error(`Impossible to add the quote. ${err}`);
    });
});

let findSentences = Promise.all(createSentences)
  .then((sentence) => {
    return goals.map((goal) => {
      return Sentence.findOne({
        kind: goal.sentence.kind,
        theme: [goal.sentence.theme],
        phrase: goal.sentence.phrase,
        author: goal.sentence.author,
      }).then((sentence) => {
        if (!sentence) {
          throw new Error(
            `unknown phrase ${goal.sentence.phrase} by ${goal.sentence.author}`
          );
        }
        return Object.assign({}, goal, { sentence: sentence._id });
      });
    });
  })
  .catch((error) => {
    throw new Error(error);
  });

const saveGoals = findSentences
  .then((findSentences) => {
    return Promise.all(findSentences).then((goals) => {
      return goals.map((goal) => {
        const newGoal = new Goal(goal);
        return newGoal.save();
      });
    });
  })
  .then((savedGoals) => {
    Promise.all(savedGoals)
      .then((goals) =>
        goals.forEach((goal) => console.log(`created ${goal.name}`))
      )
      .then(() => mongoose.connection.close())
      .catch((err) => console.log("Error while saving the goal: ", err));
  });