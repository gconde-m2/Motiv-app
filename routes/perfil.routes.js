const express = require('express')
const router = express.Router()

const ensureLogin = require('connect-ensure-login');
const checkLoggedIn = (req, res, next) => req.isAuthenticated() ? next() :
 res.render('index', { errorMessage: 'Desautorizado, inicia sesión para continuar' })
//goals
router.get('/goals', checkLoggedIn, (req, res, next) => res.render('perfil/goals',  {user: req.user }))

//Set aim
router.get('/setaim', checkLoggedIn, (req, res, next) => res.render('perfil/setAim',  {user: req.user }))

//profile
router.get('/perfil', checkLoggedIn, (req, res, next) => res.render('perfil/profile',  {user: req.user }))

module.exports = router