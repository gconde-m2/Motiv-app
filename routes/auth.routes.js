const express = require('express');
const router = express.Router();

const passport = require("passport")
const User = require("../models/user.model")

const bcrypt = require("bcrypt")
const bcryptSalt = 10


//cambio
// signup!!!!!!!!!
router.get("/registro", (req, res, next) => res.render("signup-form"))

router.post("/registro",(req,res,next) => {

    const {username,password} = req.body
  
    if (username.length === 0 || password.length === 0) {
      res.render("signup-form", { errorMessage: "Indicate username and password" })
      return
  }
  User.findOne({ username })
.then(user => {
          if (user) {
              res.render("signup-form", { errorMessage: "The username already exists" })
              return
          }
          else{
            const salt = bcrypt.genSaltSync(bcryptSalt)
  const hashPass = bcrypt.hashSync(password, salt)

  User.create({username,password:hashPass})
  .then(() => res.redirect('/'))
  .catch(error => next(error))
          }
  })
  
})
//log in!!!!!


router.post("/", passport.authenticate("local", {
  
    successRedirect: "/main",
    failureRedirect: "/",
    failureFlash: true,
    passReqToCallback: true
}))



module.exports = router;
