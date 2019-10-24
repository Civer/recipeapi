const express = require("express");
const router = express.Router();
const DBFunctions = require("../functions/DBFunctions");
const ObjectId = require("mongodb").ObjectId;
router.post("/", (request, resolve) => {
    const token = request.cookies.token;
    const recipe = request.body.recipe;
    const recipe_id = recipe.recipe_uuid;
    if (recipe_id) {
        var recipeObjectId = new ObjectId(recipe_id);
        DBFunctions.dbReplaceData("recipe", { _id: recipeObjectId }, recipe)
            .then((res) => {
            resolve.json("Modified " + res.modifiedCount + " entry");
        })
            .catch((err) => {
            console.log(err);
            resolve.json("Undefined Error");
        });
    }
    else {
        DBFunctions.dbInsertData("recipe", recipe)
            .then((res) => {
            resolve.json(res.insertedId);
        })
            .catch((err) => {
            console.log(err);
            resolve.json("Undefined Error");
        });
    }
    let id;
});
module.exports = router;
