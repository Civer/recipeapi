const dotenv = require("dotenv");
const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const colors = require("colors");

// Import Route Functions

const CreateRecipe = require("./dist/routes/CreateRecipe");
const GetRecipe = require("./dist/routes/GetRecipe");
const SearchRecipes = require("./dist/routes/SearchRecipes");

//Import Helper Functions

const DBFunctions = require("./dist/functions/DBFunctions");

// Initialize app
dotenv.config();
var app = express();
DBFunctions.initDBPool();

// View setup
app.set("view engine", "none");

// Middleware setup

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
// app.use(cors());

// Define Routes

//Endpoints: Create Recipe, Read Recipe, Update Recipe
app.use("/recipe/create/", CreateRecipe);
app.use("/recipe/get/", GetRecipe);
app.use("/recipe/search/", SearchRecipes);
app.use("/documentation/", (req, res) => {
  res.redirect("documentation.html");
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  var error = err.status + ": " + err.message;
  console.error("[ERROR]".red + "[ROUTING] =>".yellow + " " + error.bold);

  // render the error page
  res.sendStatus(err.status || 500);
});

module.exports = app;
