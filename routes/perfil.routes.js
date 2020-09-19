const express = require('express')
const router = express.Router()

const ensureLogin = require('connect-ensure-login');
const checkLoggedIn = (req, res, next) => req.isAuthenticated() ? next() :
 res.render('index', { errorMessage: 'Desautorizado, inicia sesión para continuar' })
//goals
router.get('/goals', checkLoggedIn, (req, res, next) => res.render('perfil/goals',  {user: req.user }))

//Set aim
router.get('/setaim', checkLoggedIn, (req, res, next) => res.render('perfil/setAim',  {user: req.user }))

//profile
router.get('/perfil', checkLoggedIn, (req, res, next) => res.render('perfil/profile',  {user: req.user }))


//musica prueba

router.get('/music', checkLoggedIn, (req, res, next) => res.render('perfil/spoty/music',  {user: req.user }))
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
            res.render('perfil/spoty/artist-results', {searchedArt: data.body.artists.items} )
        })
        .catch(err => console.log('error', err));

})
router.get('/:artistId/albums', (req, res, next) => {
    spotifyApi.getArtistAlbums(req.params.artistId)
    .then(data => {
        res.render('perfil/spoty/albums-results', {artistAlbums: data.body.items})
    })
    .catch(err => console.log('Error', err))
});



router.get('/:albumId/tracks', (req,res)=>{

    spotifyApi.getAlbumTracks(req.params.albumId)
    .then(data =>{

        res.render('perfil/spoty/tracks-results', {tracksPage: data.body.items})
    })
    .catch(err => console.log('Error', err))
})
//musica enddd
module.exports = router