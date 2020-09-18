const express = require('express');
const router = express.Router();
// Require user model
const User = require("../models/User.model")
// Add bcrypt to encrypt passwords
const bcrypt = require("bcrypt")
const bcryptSalt = 10
// Add passport
const passport = require("passport")


const ensureLogin = require('connect-ensure-login');


// signup!!!!!!!!!
router.get("/registro", (req, res, next) => res.render("signup-form"))

router.post("/registro",(req,res,next) => {

    const {username,password} = req.body

    if (username.length === 0 || password.length === 0) {
      res.render("signup-form", { message: "Indicate username and password" })
      return
  }

  User.findOne({ username })
.then(user => {
          if (user) {
              res.render("signup-form", { message: "The username already exists" })
              return
          }
  })
  const salt = bcrypt.genSaltSync(bcryptSalt)
  const hashPass = bcrypt.hashSync(password, salt)

  User.create({username,password:hashPass})
  .then(() => res.redirect('/perfil'))
  .catch(error => next(error))
})
//log in!!!!!



router.post("/", passport.authenticate("local", {
  
    successRedirect: "/perfil",
    failureRedirect: "/",
    failureFlash: true,
    passReqToCallback: true
}))


module.exports = router;
