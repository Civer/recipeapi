//Initiate Typescript Module
export {};

//Write Router Code

const express = require("express");
const router = express.Router();
const DBFunctions = require("../functions/DBFunctions");
const ObjectId = require("mongodb").ObjectId;

router.get("/:id", (request: any, resolve: any) => {
  const recipe_id: string = request.params.id;
  console.log(recipe_id);

  if (recipe_id) {
    var recipeObjectId = new ObjectId(recipe_id);
    DBFunctions.dbFetchData("recipe", { _id: recipeObjectId })
      .then((res: any) => {
        resolve.json(res);
      })
      .catch((err: any) => {
        console.log(err);
        resolve.json("Undefined Error");
      });
  } else {
    resolve.json({
      error: {
        id: "3101",
        message: "Parameter Id is necessary."
      }
    });
  }
});

module.exports = router;
