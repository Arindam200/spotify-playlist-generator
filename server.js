const express = require('express');
const bodyParser = require('body-parser');
const SpotifyWebApi = require('spotify-web-api-node');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  redirectUri: process.env.SPOTIFY_REDIRECT_URI,
});

app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

let accessToken = null;

const checkAuth = (req, res, next) => {
  if (!accessToken) {
    return res.redirect('/');
  }
  next();
};

app.get('/', (req, res) => {
  res.render('index', { loggedIn: !!accessToken });
});

app.get('/login', (req, res) => {
  const scopes = ['playlist-modify-public', 'playlist-modify-private'];
  const authorizeURL = spotifyApi.createAuthorizeURL(scopes);
  res.redirect(authorizeURL);
});

app.get('/callback', async (req, res) => {
  const { code } = req.query;
  try {
    const data = await spotifyApi.authorizationCodeGrant(code);
    accessToken = data.body['access_token'];
    spotifyApi.setAccessToken(accessToken);
    spotifyApi.setRefreshToken(data.body['refresh_token']);
    res.redirect('/');
  } catch (err) {
    console.error('Error during authorization', err);
    res.status(500).send('Authorization Error');
  }
});

app.post('/generate-playlist', checkAuth, async (req, res) => {
  const { artistName, mood } = req.body;

  try {
    const artistData = await spotifyApi.searchArtists(artistName);
    if (artistData.body.artists.items.length === 0) {
      return res.status(404).send('Artist not found');
    }

    const artistId = artistData.body.artists.items[0].id;
    const recommendations = await spotifyApi.getRecommendations({
      seed_artists: [artistId],
      seed_genres: [mood],
      limit: 12,
    });

    const tracks = recommendations.body.tracks.map(track => ({
      name: track.name,
      album: track.album.name,
      artists: track.artists.map(artist => artist.name).join(', '),
      duration: `${Math.floor(track.duration_ms / 60000)}:${((track.duration_ms % 60000) / 1000).toFixed(0).padStart(2, '0')}`,
      uri: track.uri,
      external_url: track.external_urls.spotify,
    }));

    res.render('playlist', { tracks });
  } catch (error) {
    console.error('Error generating playlist:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/save-playlist', checkAuth, async (req, res) => {
  const { playlistName, trackUris } = req.body;

  try {
    const userData = await spotifyApi.getMe();
    const userId = userData.body.id;

    // Create a new playlist
    const newPlaylist = await spotifyApi.createPlaylist(userId, {
      name: playlistName,
      public: false
    });

    // Add tracks to the new playlist
    await spotifyApi.addTracksToPlaylist(newPlaylist.body.id, JSON.parse(trackUris));

    res.status(200).send(`Playlist '${playlistName}' created successfully!`);
  } catch (error) {
    console.error('Error creating playlist:', error);

    // Check if the error has a response property
    if (error.response) {
      console.error('Spotify API response:', error.response);
      res.status(error.response.status).send(error.response.data);
    } else {
      res.status(500).send('Internal Server Error');
    }
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
