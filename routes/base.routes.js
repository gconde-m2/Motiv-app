const express = require('express')
const router = express.Router()

// Endpoints
router.get('/', (req, res) => res.render('index'))


// Middleware personalizado de detección de sesión
router.use((req, res, next) => {
    if (req.session.currentUser) {
        next()
    } else {
        res.render('/', { errorMessage: 'Inicia sesión para acceder...' })
    }
})


router.get('/perfil', (req, res) => res.render('perfil/index', req.session.currentUser))


module.exports = router
