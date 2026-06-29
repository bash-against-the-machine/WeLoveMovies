const service = require("./movies.service");
const theatersService = require("../theaters/theaters.service");
const reviewsService = require("../reviews/reviews.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

// Checks if the movie exists, if not returns an error that is passed to errorHandler middleware
async function movieExists(req, res, next) {
  const { movieId } = req.params;
  const movie = await service.read(movieId);

  if (movie) {
    res.locals.movie = movie;
    return next();
  }
  next({ status: 404, message: `Movie cannot be found.` });
}

// If the movie exists, recieves the data from movieExists middleware and send it to the client
async function read(req, res) {
  res.json({ data: res.locals.movie });
}

// List all the movies in the database or only the movies showing if ?is_showing=true is added as a query
async function list(req, res) {
  const { is_showing } = req.query;
  const data = is_showing ? await service.showingMovies() : await service.allMovies();
  res.json({ data });
}

// List the theaters where the movie is showing
async function listTheaters(req, res) {
  const { movieId } = req.params;
  const data = await theatersService.listByMovie(movieId);
  res.json({ data });
}

// List the reviews for the movie
async function listReviews(req, res) {
  const { movieId } = req.params;
  const data = await reviewsService.list(movieId);
  res.json({ data });
}

module.exports = {
  list: [asyncErrorBoundary(list)],
  read: [asyncErrorBoundary(movieExists), read],
  listTheaters: [asyncErrorBoundary(listTheaters)],
  listReviews: [asyncErrorBoundary(listReviews)],
};
