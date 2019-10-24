const express = require("express");
const router = express.Router();
const DBFunctions = require("../functions/DBFunctions");
const ObjectId = require("mongodb").ObjectId;

router.post("/", (request: any, resolve: any) => {
  const token: any = request.cookies.token;
  const recipe: recipe = request.body.recipe;
  const recipe_id: string = recipe.recipe_uuid;

  if (recipe_id) {
    var recipeObjectId = new ObjectId(recipe_id);
    DBFunctions.dbReplaceData("recipe", { _id: recipeObjectId }, recipe)
      .then((res: any) => {
        resolve.json("Modified " + res.modifiedCount + " entry");
      })
      .catch((err: any) => {
        console.log(err);
        resolve.json("Undefined Error");
      });
  } else {
    DBFunctions.dbInsertData("recipe", recipe)
      .then((res: any) => {
        resolve.json(res.insertedId);
      })
      .catch((err: any) => {
        console.log(err);
        resolve.json("Undefined Error");
      });
  }
  let id: string;
});

module.exports = router;
