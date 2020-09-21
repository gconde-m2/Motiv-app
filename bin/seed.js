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

// const createContent = goals.map(goal=> {
//   const newContent = new Content(goal.content)
//   return newContent.save()
//       .then(content => {
//           return content.name;
//       })
//       .catch(error => {
//           throw new Error(`Impossible to add the content. ${error}`)
//       })
// })


// let findContent = Promise.all(createContent)
//   .then(contents => {
//       return books.map(content => {
//           return Content.findOne({ name: goal.content.name, lastName: goal.content.author.lastName })
//               .then(author => {
//                   if (!author) {
//                       throw new Error(`unknown author ${book.author.name} ${book.author.lastName}`);
//                   }
//                   return Object.assign({}, book, { author: author._id });
//               })
//       });
//   })
//   .catch(error => {
//       throw new Error(error)
//   })

// const saveBooks = findAuthors.then(findAuthors => {
//   return Promise.all(findAuthors)
//       .then(books => {
//           return books.map(book => {
//               const newBook = new Book(book);
//               return newBook.save();
//           })
//       })
// }).then(savedBooks => {
//   Promise.all(savedBooks)
//       .then(books => books.forEach(book => console.log(`created ${book.title}`)))
//       .then(() => mongoose.connection.close())
//       .catch(err => console.log("Error while saving the book: ", err))
// })

