const express = require('express')
const router = express.Router()
const User = require("../models/User.model")
const ensureLogin = require('connect-ensure-login');
//const Sentence = require('../models/sentence.model')
const Goal = require("../models/goal.model");

const checkLoggedIn = (req, res, next) => req.isAuthenticated() ? next() :
 res.render('index', { errorMessage: 'Desautorizado, inicia sesión para continuar' })
//main/goals
router.get('/', checkLoggedIn, (req, res, next) => res.render('main/goals',  {user: req.user }))

//edit
router.get('/edit-goals', checkLoggedIn, (req, res, next) => res.render('main/goals/edit-goals',  {user: req.user }))



module.exports = router