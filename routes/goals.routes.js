const express = require("express");
const router = express.Router();
const multer = require('multer')
const User = require("../models/User.model");
const ensureLogin = require("connect-ensure-login");
const Content = require("../models/content.model");
const Goal = require("../models/goal.model");
const uploadLocal = multer({ dest: './public/uploads/'})

const checkLoggedIn = (req, res, next) => req.isAuthenticated() ? next() :
 res.render('index', { errorMessage: 'Desautorizado, inicia sesión para continuar' })
//main/goals
router.get('/', checkLoggedIn, (req, res, next) =>{
    Goal.find()
    .populate('Content')
    .then(allGoals=> res.render('main/goals', { goals: allGoals }))
    .catch(err => next(new Error(err)))
    
  })

//edit
router.get('/edit-goals', checkLoggedIn, (req, res, next) => res.render('main/goals/edit-goals',  {user: req.user }))




//main/goals
router.get("/", checkLoggedIn, (req, res, next) =>
  res.render("main/goals", { user: req.user })
);

//edit
router.get("/edit-goals/:goal_id", checkLoggedIn, (req, res, next) => {
  const id = req.params.goal_id;
  Goal.findById(id).then((goal) =>
    res.render("main/goals/edit-goals", { user: req.user, goal })
  );
});


//createeeee

router.get("/new-goal", (req, res) =>
  Goal.find().then((goal) => res.render("main/goals/new-goal", { goal }))
);

/*router.post("/new-goal", uploadLocal.single('content'), (req, res) => {
 let { name, theme, content } = req.body;

  content= `/uploads/${req.file.filename}`
 // originalName= req.file.originalname
 console.log(content)
  Goal
  .create({ name, theme,content:{content:image}})
  .then(() => res.redirect("/main/goals"));
});*/

router.post("/new-goal",uploadLocal.single('content'), (req, res) => {
    
    let { name, theme, content, sentence } = req.body;
    content= `/uploads/${req.file.filename}`
    console.log(content)
    const createGoal = Goal.create({ name, theme })
    Promise.all([createGoal])
        .then(Goal.find({ name }).then(elm => (Content.create({elm:content,elm:sentence}))))
      .then(() => res.redirect("/main/goals"));
});


/*
router.post("/new-goal", (req, res) => {
  const { name, theme, image, sentence } = req.body;
  Goal.create({ name, theme })
    .then(() => Content.create({ image, sentence }))
    .then(() => res.redirect("/main/goals"));
});

*/


module.exports = router