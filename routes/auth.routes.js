const express = require('express')
const router = express.Router()
const bcrypt = require("bcrypt")

const User = require('../models/user.model')

const bcryptSalt = 10




// Formulario registro
router.get('/registro', (req, res) => res.render('signup-form'))
router.post('/registro', (req, res) => {

    const { username, password } = req.body

    if (password.length < 3) {      // Si la contraseña es débil, expulsamos
        res.render('signup-form', { errorMessage: 'La contraseña es débil' })
        return
    }

    User.findOne({ username })
        .then(theFoundUser => {

            if (theFoundUser) { // Si ya existe un usuario con este username, expulsamos
                res.render('signup-form', { errorMessage: 'Usuario ya registrado' })
                return
            }

            const salt = bcrypt.genSaltSync(bcryptSalt)
            const hashPass = bcrypt.hashSync(password, salt)

            User.create({ username, password: hashPass })
                .then(() => res.redirect('/perfil'))
                .catch(err => console.log(err))

        })
        .catch(err => console.log('error:', err))
})



// Formulario de incio de sesión

router.post('/', (req, res) => {

    const { username, password } = req.body

    if (username === '' || password === '') {
        res.render('index', { errorMessage: 'Rellena los campos' })
        return
    }

    User.findOne({ username })
        .then(theFoundUser => {

            if (!theFoundUser) {
                res.render('index', { errorMessage: 'Usuario no registrado' })
                return
            }

            if (bcrypt.compareSync(password, theFoundUser.password)) {
                req.session.currentUser = theFoundUser      // Guardamos el usuario logueado en req.session.currentUser
                res.redirect("/perfil")
            } else {
                res.render('index', { errorMessage: 'Contraseña incorrecta' })
            }
        })
        .catch(err => console.log(err))
})


router.get('/cerrar-sesion', (req, res) => {
    req.session.destroy(() => res.redirect("/"))
})

module.exports = router
