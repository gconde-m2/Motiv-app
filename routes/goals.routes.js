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
const Song = require("../models/songs.model");

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
  let id = req.user._id
  console.log(id)
  User.findById(id)
    .populate("goal")
    .then((content) => {
      let arr = []
      content.goal.forEach(element => {
        arr.push(element)
      });

      res.render("main/goals", { user: req.user, goal: arr })
    })
    .catch((err) => next(new Error(err)));
});



//edit
router.get("/edit-goals", checkLoggedIn, (req, res, next) =>
  Goal.find().then(
    res.render("main/goals/edit-goals", { user: req.user, goal })
  )
);



//edit goal-list
router.get("/edit-goals/:goal_id",/* checkLoggedIn,*/async (req, res, next) => {
  const id = req.params.goal_id;

  let arr = []
  let rep
  let goal = await Goal.findById(id).populate("content")
  for (let k = 0; k < goal.content.length; k++) {
    for (let i = 0; i < goal.content[k].song.length; i++) {

      let obj = {
        name: undefined,
        preview_url: undefined,
        album_name: undefined,
        artist_name: undefined
      }
      rep = await spotifyApi.getTrack(goal.content[k].song[i])
      obj.name = rep.body.name
      obj.preview_url = rep.body.preview_url
      obj.album_name = rep.body.album.name
      obj.artist_name = rep.body.artists[0].name
      arr.push(obj)
    }
  }
  res.render("main/goals/edit-goals", { user: req.user, goal, song: arr })
});

//create goal and theme

router.get("/new-goal", checkLoggedIn, (req, res) =>
  res.render("main/goals/new-goal")
);

router.post("/new-goal", checkLoggedIn, (req, res) => {
  let { name, theme } = req.body;
  let userid = req.user._id

  Goal.create({ name, theme })
    .then((goal) => {
      goal.theme.map((goalThm) =>
        Content.find({ theme: { $in: [goalThm] } })
          .then((relatedContent) =>
            Goal.findByIdAndUpdate(goal.id, {
              $push: { content: relatedContent }
            })))
      let route = goal._id
      User.findById(userid)
        .then((user) => {
          user.goal.push(goal)
          user.save()

        })
      res.redirect(`/main/goals/edit-goals/${route}/add-sentence`)
    })
    .catch((err) => console.log(err))
})


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
  Song.find()
    .then((songs) => {
      Goal.findById(id)
        .then((goal) => res.render("main/goals/new-goal-song", { songs, goal }))
        .catch((err) => console.log(err))
    })

  router.post(
    "/edit-goals/:goal_id/add-song",
    uploadLocal.single("image"),
    (req, res) => {
      const id = req.params.goal_id;
      let { song } = req.body;

      Content.create({ song }).then((content) =>
        Goal.findByIdAndUpdate(id, { $push: { content } })
          .then((goal) => res.redirect(`/main`))
          .then(() => Song.collection.drop())
          .catch((err) => console.log(err))
      );
    }
  );
});


router.get("/edit-goals/:goal_id/add-one-sentence", (req, res) => {
  const id = req.params.goal_id;

  Goal.findById(id)
    .then((goal) => res.render("main/goals/add-sentence", goal))
    .catch((err) => console.log(err));
});

router.post("/edit-goals/:goal_id/add-one-sentence", (req, res) => {
  const id = req.params.goal_id;
  let { sentence } = req.body;

  Content.create({ sentence })
    .then((content) => Goal.findByIdAndUpdate(id, { $push: { content } }))
    .then(() => res.redirect(`/main/goals/edit-goals/${id}`))
    .catch((err) => console.log(err));
});

//add picture to a goal already created

router.get("/edit-goals/:goal_id/add-one-picture", (req, res) => {
  const id = req.params.goal_id;

  Goal.findById(id)
    .then((goal) => res.render("main/goals/add-picture", goal))
    .catch((err) => console.log(err));
});

router.post(
  "/edit-goals/:goal_id/add-one-picture",
  uploadLocal.single("image"),
  (req, res) => {
    const id = req.params.goal_id;

    let { image } = req.body;
    image = `/uploads/${req.file.filename}`;

    Content.create({ image })
      .then((content) => Goal.findByIdAndUpdate(id, { $push: { content } }))
      .then(() => res.redirect(`/main/goals/edit-goals/${id}`))
      .catch((err) => console.log(err));
  }
);
//delete goals
router.get("/edit-goals/:goal_id/goal-delete", (req, res) => {
  const id = req.params.goal_id;
  Goal.findByIdAndDelete(id)
    .then(() => res.redirect("/main/goals"))
    .catch((err) => console.log("error-------", err));
});
//delete content
router.get("/edit-goals/:content_id/content-delete", (req, res) => {
  const id = req.params.content_id;
  Content.findByIdAndDelete(id)
    .then(() => res.redirect(`/main/goals/`))
    .catch((err) => console.log("error-------", err));
});

module.exports = router;