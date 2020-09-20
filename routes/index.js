module.exports = app => {

    // Base URLS
    app.use('/main',require('./perfil.routes.js'))
    app.use('/', require('./base.routes.js'))
    app.use('/', require('./auth.routes'))
}