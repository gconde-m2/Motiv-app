const express = require("express");
const router = express.Router();
const multer = require('multer')

const User = require("../models/user.model");
const ensureLogin = require("connect-ensure-login");

const Content = require("../models/content.model");
const Goal = require("../models/goal.model");

const uploadLocal = require("./../configs/local-upload.config");
const Songs = require("../models/songs.model");

const { findByIdAndUpdate } = require("../models/user.model");
var SpotifyWebApi = require('spotify-web-api-node');

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
});
spotifyApi.clientCredentialsGrant().then(data => spotifyApi.setAccessToken(data.body['access_token']))
.catch(error => console.log('Something went wrong when retrieving an access token', error));




const checkLoggedIn = (req, res, next) => req.isAuthenticated() ? next() :
 res.render('index', { errorMessage: 'Desautorizado, inicia sesión para continuar' })


 
//main/goals
router.get("/", checkLoggedIn, (req, res, next) => {
  Goal.find()
    .populate("Content")
    .then((goal) => res.render("main/goals", { user: req.user, goal }))
    .catch((err) => next(new Error(err)));
});

//edit
router.get("/edit-goals", checkLoggedIn, (req, res, next) =>
  Goal.find().then(
    res.render("main/goals/edit-goals", { user: req.user, goal })
  )
);


//edit
// router.get("/edit-goals/:goal_id",/* checkLoggedIn,*/ (req, res, next) => {
//   const id = req.params.goal_id;
  
//   /*Goal.findById(id).then((goal) =>
//     res.render("main/goals/edit-goals", { user: req.user, goal }),*/
//    //me guardo el goal content en um then
//       spotifyApi
//       .getTracks("3PemitpJcfv2dYFOatMYb2","3PemitpJcfv2dYFOatMYb2")
//       .then((songs) => songs.body.preview_url)
//         .then((songs) =>{  
//           console.log(songs)
//           res.render('main/goals/edit-goals', {songs} )
//       })
//       .catch(err => console.log('error', err))

// })

//main/goals list
router.get("/", checkLoggedIn, (req, res, next) =>
  res.render("main/goals", { user: req.user })
);

//edit goal-list
router.get("/edit-goals/:goal_id", checkLoggedIn, (req, res, next) => {
  const id = req.params.goal_id;

  Goal.findById(id)
    .populate("content")
    .then((goal) =>
      res.render("main/goals/edit-goals", { user: req.user, goal })
    );
});


//create goal and theme

router.get("/new-goal", checkLoggedIn, (req, res) =>
  res.render("main/goals/new-goal")
);

router.post("/new-goal", checkLoggedIn, (req, res) => {
  const { name, theme } = req.body;

  Goal.create({ name, theme })
    .then((goal) =>
      res.redirect(`/main/goals/edit-goals/${goal.id}/add-sentence`)
    )
    .catch((err) => console.log(err));
});

// Add sentence to goal
router.get("/edit-goals/:goal_id/add-sentence", (req, res) => {
  const id = req.params.goal_id;
  Goal.findById(id)
    .then((goal) => res.render("main/goals/new-goal-sentence", goal))
    .catch((err) => console.log(err));
});

router.post("/edit-goals/:goal_id/add-sentence", (req, res) => {
  const id = req.params.goal_id;

  let { sentence, theme } = req.body;

  Content.create({ sentence, theme }).then((content) =>
    Goal.findByIdAndUpdate(id, { $push: { content } })
      .then(() => res.redirect(`/main/goals/edit-goals/${id}/add-image`))
      .catch((err) => console.log(err))
  );
});

// Add image to goal

router.get("/edit-goals/:goal_id/add-image", (req, res) => {
  const id = req.params.goal_id;
  Goal.findById(id)
    .then((goal) => res.render("main/goals/new-goal-image", goal))
    .catch((err) => console.log(err));
});

router.post(
  "/edit-goals/:goal_id/add-image",
  uploadLocal.single("image"),
  (req, res) => {
    const id = req.params.goal_id;
    let { image } = req.body;
    image = `/uploads/${req.file.filename}`;
    Content.create({ image }).then((content) =>
      Goal.findByIdAndUpdate(id, { $push: { content } })
        .then((goal) => res.redirect(`/main/goals/edit-goals/${goal.id}/add-song`))
        .catch((err) => console.log(err))
    );
  }
);

// Add song to goal

router.get("/edit-goals/:goal_id/add-song", (req, res) => {
  const id = req.params.goal_id;
  Goal.findById(id)
    .then((goal) => res.render("main/goals/new-goal-song", goal))
    .catch((err) => console.log(err));
});


//ediit goal

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
  uploadLocal.single("image"),
  (req, res) => {
    let { sentence, image, theme } = req.body;
    const id = req.params.goal_id;

    Content.create({ sentence, image, theme })
      .then((content) => Goal.findByIdAndUpdate(id, { $push: { content } }))
      .then(() => res.redirect(`/main/goals/edit-goals/:${id}`))
      .catch((err) => console.log(err));
  }
);

module.exports = router;