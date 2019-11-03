function handleError(error) {
    console.log(`Error: ${error}`);
}

window.onload = function() {
    var saved_recipes_div = document.getElementById("saved_recipes");
    var get_stored_recipes = browser.storage.local.get("stored_recipes")
    get_stored_recipes.then((response) => {
	for (recipe_index in response.stored_recipes) {
	    recipe = response.stored_recipes[recipe_index];
	    var recipe_title_p = document.createElement("p");
	    recipe_title_p.classList.add("recipe_name");
	    var recipe_name_text = document.createTextNode(recipe.recipe_name);
	    recipe_title_p.appendChild(recipe_name_text);
	    saved_recipes_div.appendChild(recipe_title_p);
	}
    }, handleError);
}
