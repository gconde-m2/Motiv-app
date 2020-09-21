module.exports = app => {

    // Base URLS
    app.use('/main/goals',require('./goals.routes.js'))
    app.use('/main',require('./main.routes.js'))
    app.use('/', require('./base.routes.js'))
    app.use('/', require('./auth.routes'))
}