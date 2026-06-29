if (process.env.USER) require("dotenv").config();

const cors = require("cors");

const express = require("express");
const app = express();
const moviesRouter = require("./movies/movies.router");
const theatersRouter = require("./theaters/theaters.router");
const reviewsRouter = require("./reviews/reviews.router");

const errorHandler = require("./errors/errorHandler");


app.use(cors());
app.use(express.json());

app.use("/movies", moviesRouter);
app.use("/theaters", theatersRouter);
app.use("/reviews", reviewsRouter);

// Error handler for unspecified routes
app.use((req, res, next) => {
    next({ 
        status: 404,
        message: `Not found: ${req.originalUrl}`
    });
});

app.use(errorHandler);

module.exports = app;
