"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//Write Router Code
const express = require("express");
const router = express.Router();
const DBFunctions = require("../functions/DBFunctions");
const ObjectId = require("mongodb").ObjectId;
router.get("/:id", (request, resolve) => {
    const recipe_id = request.params.id;
    console.log(recipe_id);
    if (recipe_id && ObjectId.isValid(recipe_id)) {
        var recipeObjectId = new ObjectId(recipe_id);
        DBFunctions.dbFetchData("recipe", { _id: recipeObjectId })
            .then((res) => {
            resolve.json(res);
        })
            .catch((err) => {
            console.log(err);
            resolve.json("Undefined Error");
        });
    }
    else {
        resolve.json({
            error: {
                id: "3101",
                message: "Parameter Id is not provided or wrong."
            }
        });
    }
});
module.exports = router;
