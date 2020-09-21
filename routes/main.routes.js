const express = require('express')
const router = express.Router()
const User = require("../models/User.model")
const ensureLogin = require('connect-ensure-login');
//const Sentence = require('../models/sentence.model')
const Goal = require("../models/goal.model");
const Content = require("../models/content.model");



const checkLoggedIn = (req, res, next) => req.isAuthenticated() ? next() :
 res.render('index', { errorMessage: 'Desautorizado, inicia sesión para continuar' })

 router.get('/', checkLoggedIn, (req, res, next) =>{ 
     
    // Sentence
    // .count()
    // .exec(function (err, count) {

    //     var random = Math.floor(Math.random() * count)
    
    //     Sentence.findOne().skip(random).exec(
    //       function (err, sentence) {
             res.render('main/index'/*,  { sentence,user: req.user  }*/)
          })
       // })
    //})
    

//goals


//Set aim
router.get('/setaim', checkLoggedIn, (req, res, next) => res.render('main/setAim',  {user: req.user }))

//profile
router.get('/perfil', checkLoggedIn, (req, res, next) => res.render('main/profile',  {user: req.user }))


//musica prueba

router.get('/music', checkLoggedIn, (req, res, next) => res.render('main/spoty/music',  {user: req.user }))
var SpotifyWebApi = require('spotify-web-api-node');

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
});
spotifyApi
.clientCredentialsGrant()
.then(data => spotifyApi.setAccessToken(data.body['access_token']))
.catch(error => console.log('Something went wrong when retrieving an access token', error));


router.get('/artist-search', (req, res) => {
    console.log("paco")
    spotifyApi
        .searchArtists(req.query.artist)
        .then(data => {
            res.render('main/spoty/artist-results', {searchedArt: data.body.artists.items} )
        })
        .catch(err => console.log('error', err));

})
router.get('/:artistId/albums', (req, res, next) => {
    spotifyApi.get(req.params.artistId)
    .then(data => {
        res.render('main/spoty/albums-results', {artistAlbums: data.body.items})
    })
    .catch(err => console.log('Error', err))
});


router.get('/:albumId/tracks', (req,res)=>{

    spotifyApi.getAlbumTracks(req.params.albumId)
    .then(data =>{

        res.render('main/spoty/tracks-results', {tracksPage: data.body.items})
    })
    .catch(err => console.log('Error', err))
})


 router.post('/:albumId/tracks',(req,res)=>{
     const goal_id = req.params.song_id
     
 })


    // No disponemos del ID en el formulario, por lo que lo obtenemos mediante Route Params
    

//musica enddd
module.exports = router