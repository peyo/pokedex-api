require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");
const POKEDEX = require("./pokedex.json");

const app = express();

console.log(process.env.API_TOKEN);

app.use(morgan("dev"));
app.use(helmet.hidePoweredBy({ setTo: "PHP 4.2.0" }));
app.use(cors());

const validTypes =
  [
    `Bug`, `Dark`, `Dragon`,
    `Electric`, `Fairy`, `Fighting`,
    `Fire`, `Flying`, `Ghost`,
    `Grass`, `Ground`, `Ice`,
    `Normal`, `Poison`, `Psychic`,
    `Rock`, `Steel`, `Water`
  ];

app.use(function validateBearerToken(req, res, next) {
  const apiToken = process.env.API_TOKEN;
  const authToken = req.get("Authorization");

  console.log("validate bearer token middleware");

  if (!authToken || authToken.split(" ")[1] !== apiToken) {
    return res.status(401).json({ error: "Unauthorized request" });
  }
  next();
});

app.get("/types", function handleGetTypes(req, res) {
  res.json(validTypes);
});

app.get("/pokemon", function handleGetPokemon(req, res) {
  const { name = "", type } = req.query;
  let result = POKEDEX.pokemon;

  if (name) {
    result = result
      .filter(pokemon =>
        pokemon
          .name
          .toLowerCase()
          .includes(name.toLowerCase())
      );
  };

  if (type) {
    result = result
      .filter(pokemon =>
        pokemon
          .type
          .includes(type)
      );
  };

  res.json(result);
});

const PORT = 8000;

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});
