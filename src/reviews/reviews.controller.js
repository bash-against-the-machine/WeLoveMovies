const service = require("./reviews.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const methodNotAllowed = require("../errors/methodNotAllowed");


// Checks if the review exists, if not returns an error that is passed to errorHandler middleware
async function reviewExists(req, res, next) {
  const { reviewId } = req.params;
  const review = await service.read(reviewId);

  if (review) {
    res.locals.review = review;
    return next();
  }
  next({ status: 404, message: `Review cannot be found.` });
}

// Deletes the review
async function destroy(req, res) {
  await service.destroy(res.locals.review.review_id);
  res.sendStatus(204);
}

// This was moved to movies.controller as listReviews, this was done because this is for a route that
// starts with /movies/:movieId, therefore this is no longer needed
async function list(req, res) {
  // TODO: Write your code here

  res.json({  });
}

// Checks if there is a movieId in the path
function hasMovieIdInPath(req, res, next) {
  if (req.params.movieId) {
    return next();
  }
  methodNotAllowed(req, res, next);
}

// Checks if there is a movieId in the path
function noMovieIdInPath(req, res, next) {
  if (req.params.movieId) {
    return methodNotAllowed(req, res, next);
  }
  next();
}

// Updates the specified review
async function update(req, res) {
  const data = await service.update({
    ...req.body.data,
    review_id: res.locals.review.review_id
  });
  res.json({ data });
}

module.exports = {
  destroy: [
    noMovieIdInPath,
    asyncErrorBoundary(reviewExists),
    asyncErrorBoundary(destroy),
  ],
  list: [hasMovieIdInPath, asyncErrorBoundary(list)],
  update: [
    noMovieIdInPath,
    asyncErrorBoundary(reviewExists),
    asyncErrorBoundary(update),
  ],
};
