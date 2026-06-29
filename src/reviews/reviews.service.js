const db = require("../db/connection");

const mapProperties = require("../utils/map-properties");

// Creates a function to map the critic properties that can be nested
const addCritic = mapProperties({
  critic_id: "critic.critic_id",
  preferred_name: "critic.preferred_name",
  surname: "critic.surname",
  organization_name: "critic.organization_name",
  created_at: "critic.created_at",
  updated_at: "critic.updated_at",
});

const tableName = "reviews";

// Deletes a review from database
async function destroy(reviewId) {
  return db(tableName).where({ review_id: reviewId }).del();
}

// Lists all the reviews for a specified movie_id
async function list(movie_id) {
  return db("reviews as r")
    .join(
      "movies as m",
      "m.movie_id",
      "r.movie_id"
    )
    .join(
      "critics as c",
      "c.critic_id",
      "r.critic_id"
    )
    .select("r.*", "c.*")
    .where({ "m.movie_id": movie_id })
    .then((reviews) => reviews.map(addCritic));
}

// Returns a single review based on review_id
async function read(reviewId) {
  return db(tableName)
    .select("*")
    .where({ review_id: reviewId })
    .first();
}

// Returns a single critic based on critic_id
async function readCritic(critic_id) {
  return db("critics").where({ critic_id }).first();
}

// Sets the critic property on the review
async function setCritic(review) {
  review.critic = await readCritic(review.critic_id);
  return review;
}

// Updates a review
async function update(review) {
  return db(tableName)
    .where({ review_id: review.review_id })
    .update(review, "*")
    .then(() => read(review.review_id))
    .then(setCritic);
}

module.exports = {
  destroy,
  list,
  read,
  update,
};
