//Initiate Typescript Module
export {};

//Write Router Code

const express = require("express");
const router = express.Router();
const DBFunctions = require("../functions/DBFunctions");
const ObjectId = require("mongodb").ObjectId;

router.get("/:searchObject&:searchString", (request: any, resolve: any) => {
  const searchObject: string = request.params.searchObject;
  const searchString: RegExp = new RegExp(request.params.searchString, "i");

  console.log(searchString);

  const allowedSearchObjects = [
    "recipe_name",
    "ingredient_name",
    "ingredient_x_id"
  ];

  if (allowedSearchObjects.indexOf(searchObject) !== -1) {
    let searchQuery: object;

    switch (searchObject) {
      case "recipe_name":
        searchQuery = { recipe_name: searchString };
        break;
      case "ingredient_name":
        searchQuery = { ingredients: { $elemMatch: { name: searchString } } };
        break;
      case "ingredient_x_id":
        searchQuery = { ingredients: { $elemMatch: { x_id: searchString } } };
        break;
      default:
        break;
    }

    DBFunctions.dbFetchData("recipe", searchQuery)
      .then((res: any) => {
        resolve.json(res);
      })
      .catch((err: any) => {
        console.log(err);
        resolve.json({
          error: {
            id: "3202",
            message: "Query problem."
          }
        });
      });
  } else {
    resolve.json({
      error: {
        id: "3201",
        message: "Search object is not known."
      }
    });
  }
});

module.exports = router;
