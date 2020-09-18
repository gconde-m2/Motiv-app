const express = require('express')
const router = express.Router()

const ensureLogin = require('connect-ensure-login');


router.get('/', ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render('perfil/index', { user: req.user });
});

module.exports = router