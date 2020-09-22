const express = require("express");
const router = express.Router();
const multer = require('multer')
const User = require("../models/user.model");
const ensureLogin = require("connect-ensure-login");
const Content = require("../models/content.model");
const Goal = require("../models/goal.model");
const uploadLocal = multer({ dest: './public/uploads/'})
const Songs = require("../models/songs.model");
//cambio
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

router.get("/new-goal", (req, res) =>{
  
  Songs.find().then((songs) => res.render("main/goals/new-goal", { songs }))
  //.then(() => (Goal.find().then((goal) => res.render("main/goals/new-goal", { goal }))
  
  }
);


router.post("/new-goal",uploadLocal.single('image'), (req, res) => {
  let { name, theme, content, sentence } = req.body;
  image= `/uploads/${req.file.filename}`
  const createGoal = Goal.create({ name, theme });
  const createContent = Content.create({ sentence,content });
  Promise.all([createGoal, createContent])
    .then(resp =>  Goal.findByIdAndUpdate(resp[0]._id, { content: resp[1]._id }) )
   .then(() => res.redirect("/main/goals"))
  .catch((err)=> console.log(err))
});


//aÃ±adir content a un goal

router.get("/edit-goals/:goal_id/add-content", (req, res) => {
  const id = req.params.goal_id;

  Goal.findById(id)
    .populate("content")
    .then((goal) =>
      res.render("main/goals/add-content.hbs", { user: req.user, goal })
    );
});
router.post(
  "/edit-goals/:goal_id/add-content",
  uploadLocal.single("content"),
  (req, res) => {
    let { sentence } = req.body;
    const id = req.params.goal_id;

    Content.create({ sentence })
      .then((content) => Goal.findByIdAndUpdate(id, { $push: { content } }))
      .then(() => res.redirect(`/main/goals/edit-goals/:${id}`))
      .catch((err) => console.log(err));
  }
);

module.exports = router