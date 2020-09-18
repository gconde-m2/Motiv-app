const express = require('express')
const router = express.Router()

// Endpoints
router.get('/', (req, res) => res.render('index'))


// Middleware personalizado de detección de sesión
router.use((req, res, next) => {
    if (req.session.currentUser) {
        next()
    } else {
        res.render('login-form', { errorMessage: 'Inicia sesión para acceder...' })
    }
})
// Equivalencia pro! yay!
// router.use((req, res, next) => req.session.currentUser ? next() : res.render('login-form', { errorMessage: 'Inicia sesión para acceder...' }))

router.get('/perfil', (req, res) => res.render('profile', req.session.currentUser))


module.exports = router
