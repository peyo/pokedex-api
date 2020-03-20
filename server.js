require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");
const POKEDEX = require("./pokedex.json");

const app = express();

const morganSetting = process.env.NODE_ENV === "product" ? "tiny" : "common"
app.use(morgan(morganSetting));
app.use(helmet.hidePoweredBy({ setTo: "PHP 4.2.0"}));
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

app.use((error, req, res, next) => {
  let response
  if (process.env.NODE_ENV === "production") {
    response = { error: { message: "server error" }}
  } else {
    response = { error }
  }
  res.status(500).json(response)
})

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});
