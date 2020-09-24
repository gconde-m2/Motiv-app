const express = require('express')
const router = express.Router()

const User = require("../models/user.model")
const ensureLogin = require('connect-ensure-login');


const Goal = require("../models/goal.model");
const Content = require("../models/content.model");

const Song = require("../models/songs.model");
const spotifyApi = require("./../configs/spotify.config");

const Aux = require("../models/aux.model");
//cambiooo
const checkLoggedIn = (req, res, next) => req.isAuthenticated() ? next() :
    res.render('index', { errorMessage: 'Desautorizado, inicia sesión para continuar' })

router.get('/', checkLoggedIn, (req, res, next) => {

    // Sentence
    // .count()
    // .exec(function (err, count) {

    //     var random = Math.floor(Math.random() * count)

    //     Sentence.findOne().skip(random).exec(
    //       function (err, sentence) {
    res.render('main/index'/*,  { sentence,user: req.user  }*/)
    Aux.collection.drop()
    Song.collection.drop()

})
// })
//})

//Set aim
router.get('/setaim', checkLoggedIn, (req, res, next) => res.render('main/setAim', { user: req.user }))

//profile
router.get('/perfil', checkLoggedIn, (req, res, next) => res.render('main/profile', { user: req.user }))

//musica prueba

router.get('/music', checkLoggedIn, (req, res, next) => res.render('main/spoty/music', { user: req.user }))

router.get('/artist-search', (req, res) => {
    console.log("paco")
    spotifyApi
        .searchArtists(req.query.artist)
        .then(data => {
            res.render('main/spoty/artist-results', { searchedArt: data.body.artists.items })
        })

        .catch(err => console.log('error', err));

})
router.get('/:artistId/albums', (req, res, next) => {
    spotifyApi.getArtistAlbums(req.params.artistId)
        .then(data => {
            res.render('main/spoty/albums-results', { artistAlbums: data.body.items })
        })
        .catch(err => console.log('Error', err))
});


router.get('/:albumId/tracks', (req, res, next) => {

    spotifyApi.getAlbumTracks(req.params.albumId)
        .then(data => {

            res.render('main/spoty/tracks-results', { tracksPage: data.body.items })
        })
        .catch(err => console.log('Error', err))
})


router.get('/track/:trackId', (req, res, next) => {
   
    spotifyApi.getTrack(req.params.trackId)
        .then(tracksPage => {
            Aux.find()
            .then(el =>{ 
                console.log(el[0].backString)
                res.render('main/spoty/info-tracks', { tracksPage , backString: el[0].backString})})
                .catch(err => console.log('Error', err))
        })
        .catch(err => console.log('Error', err))
})


router.post('/track/:trackId', (req, res, next) => {

    const { songId, name } = req.body


    Song.create({ songId, name })
    spotifyApi.getTrack(req.params.trackId)
    .then(tracksPage => {
        Aux.find()
        .then(el =>{ 
            console.log(el[0].backString)
            res.render('main/spoty/info-tracks', { tracksPage , backString: el[0].backString})})
            .catch(err => console.log('Error', err))
    })
})
//musica enddd
module.exports = router