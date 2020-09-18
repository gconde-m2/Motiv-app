module.exports = app => {

    // Base URLS
    app.use('/perfil',require('./perfil.routes.js'))
    app.use('/', require('./base.routes.js'))
    app.use('/', require('./auth.routes'))
}