const db = require("../db/connection");

async function list(is_showing) {
  return db("movies")
    .select("movies.*")
    .modify((queryBuilder) => {
      if (is_showing) {
        queryBuilder
          .join(
            "movies_theaters",
            "movies.movie_id",
            "movies_theaters.movie_id"
          )
          .where({ "movies_theaters.is_showing": true })
          .groupBy("movies.movie_id");
      }
    });
}

// List all the movies in the database
async function allMovies() {
  return db("movies").select("*");
}

// List only the movies that are showing, sorted by title
async function showingMovies() {
  return db("movies as m")
    .join("movies_theaters as mt", "m.movie_id", "mt.movie_id")
    .where({ "mt.is_showing": true })
    .distinct("m.*")
    .orderBy("m.title");
}

// List a single movie based on movie_id
async function read(movie_id) {
  return db("movies")
    .select("*")
    .where({ "movie_id": movie_id })
    .first();
}

module.exports = {
  list,
  read,
  allMovies,
  showingMovies,
};
