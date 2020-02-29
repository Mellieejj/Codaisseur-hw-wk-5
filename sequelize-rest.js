// import sequelize, express & body-parser, connect sequelize met postgres db
const Sequelize = require("sequelize");
const express = require("express");
const bodyParser = require("body-parser");

const sequelize = new Sequelize(
  "postgres://postgres:secret@localhost:5432/postgres"
);

//define model
const Movie = sequelize.define("movie", {
  title: Sequelize.STRING,
  yearOfRelease: Sequelize.INTEGER,
  synopsis: Sequelize.TEXT
});

// sync with db, 3 example rows created
sequelize
  .sync()
  .then(() => console.log("database updated"))
  .then(() => {
    Movie.findOrCreate({
      where: {
        title: "Pokémon Detective Pikachu",
        yearOfRelease: 2019,
        synopsis:
          "In a world where people collect Pokémon to do battle, a boy comes across an intelligent talking Pikachu who seeks to be a detective."
      }
    });
  })
  .then(() => {
    Movie.findOrCreate({
      where: {
        title: "Sonic, the hegdehog",
        yearOfRelease: 2020,
        synopsis:
          "After discovering a small, blue, fast hedgehog, a small-town police officer must help it defeat an evil genius who wants to do experiments on it."
      }
    });
  })
  .then(() => {
    Movie.findOrCreate({
      where: {
        title: "Bad Boys for Life",
        yearOfRelease: 2020,
        synopsis:
          "The Bad Boys Mike Lowrey and Marcus Burnett are back together for one last ride in the highly anticipated Bad Boys for Life."
      }
    });
  })
  .catch(console.error);

//create express app, middelware body-parser and port
const app = express();
const port = 3000;

app.use(bodyParser.json());

// read all movies
app.get("/movies", (request, response, next) => {
  const limit = Math.min(request.query.limit || 25, 150);
  const offset = request.query.offset || 0;

  Movie.findAndCountAll({ limit, offset })
    .then(list => {
      response.send({ movies: list.rows, total: list.count });
    })
    .catch(next);
});

//read single movie
app.get("/movies/:movieId", (request, response, next) => {
  Movie.findByPk(request.params.movieId).then(movie => {
    if (!movie) {
      response.status(404).end();
    } else {
      response.json(movie);
    }
  });
});

//create new movie resource
app.post("/movies", (request, response, next) => {
  console.log(request.body);
  Movie.create(request.body)
    .then(movie => response.status(201).json(movie))
    .catch(next);
});

//update singel movie
app.put("/movies/:movieId", (request, response, next) => {
  const title = request.body.title;
  const synopsis = request.body.synopsis;
  const yearOfRelease = request.body.yearOfRelease;

  Movie.findByPk(request.params.movieId)
    .then(movie => {
      if (movie) {
        movie
          .update({ title, synopsis, yearOfRelease })
          .then(movie => response.json(movie));
      } else {
        response.status(404).end();
      }
    })
    .catch(next);
});

// delete single movie
app.delete("/movies/:movieId", (request, response, next) => {
  Movie.destroy({
    where: {
      id: request.params.movieId
    }
  })
    .then(deletedMovie => {
      if (deletedMovie) {
        response.status(204).end();
      } else {
        response.status(404).end();
      }
    })
    .catch(next);
});

//app listening
app.listen(port, () => {
  console.log(`App listen on port ${port}`);
});
