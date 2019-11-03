/**
 * Parse DOM of chefkoch.de and return grabbed recipe as JSON.
 */
function grab_recipe_chefkoch() {
    /* Parse DOM to extract various elements of a recipe */

    /* Recipe Name */
    var recipe_name = document.querySelector(".recipe-header h1").textContent;

    /* Ingredients
    List of String for name, Number, Unit
    */
    function parse_recipe_ingredient(ingredients_entry) {
	ingredient_name = ingredients_entry.querySelector("td.td-right").textContent.trim();
	ingredient_amount_and_unit = ingredients_entry.querySelector("td.td-left").textContent.trim().replace(/\s\s+/g, ' ').split(' ');

	ingredient = {name: ingredient_name, amounts: [ { amount: ingredient_amount_and_unit[0], unit: ingredient_amount_and_unit[1]} ]};

	return ingredient;
    }

    var recipe_ingredients_raw = document.querySelectorAll("table.ingredients tr");
    var recipe_ingredients = []
    for (index = 0; index < recipe_ingredients_raw.length; ++index) {
	recipe_ingredients.push(parse_recipe_ingredient(recipe_ingredients_raw[index]));
    }

    /* Steps
    List of strings
    */
    var recipe_steps_raw = document.querySelectorAll("article")[2].querySelector("div").textContent.split("\n\n");

    /* Yields
    Number + Unit

    Chefkoch.de always gives yields in "Portionen", so defaulting to that as Unit and grabbing the amount directly.
    */
    var recipe_yield_amount = document.querySelector(".recipe-servings input[name='portionen']").value;
    var recipe_yield = {amount: recipe_yield_amount, unit: "Portion"};

    /* Optional: Notes */
    /* None in this case */

    grabbed_recipe = {
	recipe_name: recipe_name,
	ingredients: recipe_ingredients,
	steps: recipe_steps_raw,
	yields: [recipe_yield]
    };

    return grabbed_recipe;
}

function respond_with_recipe(request, sender, sendResponse) {
    grabbed_recipe = grab_recipe_chefkoch();
    sendResponse({response: grabbed_recipe});
}

// Respond with parsed recipe regardless of exact message, wherever it may come from.
browser.runtime.onMessage.addListener(respond_with_recipe);
