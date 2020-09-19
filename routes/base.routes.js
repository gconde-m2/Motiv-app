const express = require('express')
const router = express.Router()


const checkLoggedIn = (req, res, next) => req.isAuthenticated() ? next() :
 res.render('index', { errorMessage: 'Desautorizado, inicia sesión para continuar' })

const checkRole = rolesToCheck => {
    return (req, res, next) => {
        
        if (req.isAuthenticated() && rolesToCheck.includes(req.user.role))
            next()
        else 
            res.render('index', { errorMessage: 'Desautorizado, no tienes permisos para ver eso.' })
    }
}

// Endpoints
router.get('/', (req, res) => res.render('index'))
router.get('/perfil', checkLoggedIn, (req, res, next) => res.render('perfil/index',  {user: req.user }))

module.exports = router
