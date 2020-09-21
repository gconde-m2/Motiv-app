const mongoose = require("mongoose");

const Goal = require("../models/goal.model");
const Content = require("../models/content.model");


const dbtitle = "PROYECTO";
mongoose.connect(`mongodb://localhost/${dbtitle}`);

Goal.collection.drop();
Content.collection.drop();


const goals = [
{
  name: "Garden",
  theme: ["work","social"],

  content:{
    
      name: "name",
  
      theme:["social","work"],
      
  
      image: "",
      song:"",
      sentence:"fantastico la vida"
  
    },
  },
  {
    name: "paco",
    theme: ["work","social"],
  
    content:{
      
        name: "name",
    
        theme:["social","work"],
        
    
        image: "",
        song:"",
        sentence:"fantastico la vida"
    
      },
    }
]
Content.create(goals)
   
Goal.create(goals)


// const createContent = goals.map(goal =>{
  
//    Goal.create(goal)
//   .then(paco => console.log("paco"))
// })

