const express = require('express')
const axios = require('axios')
const app = express()

app.use(require('cors')())

app.get('/movies', (req, res) => {
  const targetURL = req.header('Target-URL')
  if (!targetURL) {
    res.status(500).send({ error: 'There is no Target-URL header in the request' })
  }
  axios.get(targetURL)
    .then(({ data: movie }) => {
      const betterMovie = {
        title: movie.Title,
        year: movie.Year,
        rated: movie.Rated,

        season: movie.Season ? +movie.Season : null,
        episode: movie.Episode ? +movie.Episode : null,
        totalSeasons: movie.totalSeasons ? +movie.totalSeasons : null,

        // Cast the API's release date as a native JavaScript Date type.
        released: movie.Released ? new Date(movie.Released) : null,

        // Return runtime as minutes casted as a Number instead of an
        // arbitrary string.
        runtime: movie.Runtime,

        countries: movie.Country,
        genres: movie.Genre,
        director: movie.Director,
        writers: movie.Writer,
        actors: movie.Actors,
        plot: movie.Plot,

        // A hotlink to a JPG of the movie poster on IMDB.
        poster: movie.Poster,

        imdb: {
          id: movie.imdbID,
          rating: movie.imdbRating ? +movie.imdbRating : null,
          votes: movie.imdbVotes
        },

        // Determine tomatoRatings existance by the presense of tomatoMeter.
        tomato: !movie.tomatoMeter
          ? undefined
          : {
              meter: +movie.tomatoMeter,
              image: movie.tomatoImage,
              rating: +movie.tomatoRating,
              reviews: +movie.tomatoReviews,
              fresh: +movie.tomatoFresh,
              rotten: +movie.tomatoRotten,
              consensus: movie.tomatoConsensus,
              userMeter: +movie.tomatoUserMeter,
              userRating: +movie.tomatoUserRating,
              userReviews: +movie.tomatoUserReviews,
              url: movie.tomatoURL,
              dvdReleased: movie.DVD ? new Date(movie.DVD) : null
            },

        metacritic: movie.Metascore ? +movie.Metascore : null,

        awards: movie.Awards,

        type: movie.Type
      }
      res.json(betterMovie)
    })
    .catch(err => res.status(500).send(err))
})

app.get('*', (req, res) => {
  const targetURL = req.header('Target-URL')
  if (!targetURL) {
    res.status(500).send({ error: 'There is no Target-URL header in the request' })
  }
  axios.get(targetURL, {
    headers: { Authorization: req.header('Authorization') }
  })
    .then(response => {
      console.log(response)
      res.json(response.data)
    })
    .catch(err => res.status(500).send(err))
})

app.listen(process.env.PORT || 3000)
