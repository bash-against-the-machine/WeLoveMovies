const service = require("./movies.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function movieExists(req, res, next) {
  // TODO: Add your code here.
  const { movieId } = req.params;
  const movie = await service.read(movieId);

  if (movie) {
    res.locals.movie = movie;
    return next();
  }
  next({ status: 404, message: `Movie cannot be found.` });
}

async function read(req, res) {
  // TODO: Add your code here
  res.json({ data: res.locals.movie });
}

// List all the movies in the database or only the movies showing if ?is_showing=true is added as a query
async function list(req, res) {
  // TODO: Add your code here.
  const { is_showing } = req.query;
  const data = is_showing ? await service.showingMovies() : await service.allMovies();
  res.json({ data });
}

module.exports = {
  list: [asyncErrorBoundary(list)],
  read: [asyncErrorBoundary(movieExists), read],
};
