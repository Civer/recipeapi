function handleError(error) {
    console.log(`Error: ${error}`);
}

window.onload = function() {
    var saved_recipes_div = document.getElementById("saved_recipes_div");
    var saved_recipes_ul = document.createElement("ul");
    saved_recipes_ul.id = "saved_recipes_list";
    saved_recipes_ul.classList.add("recipe_list");
    saved_recipes_div.appendChild(saved_recipes_ul);

    var get_stored_recipes = browser.storage.local.get("stored_recipes")
    get_stored_recipes.then((response) => {
	// Need to generate many listeners, an anonymous function guarantees _separate_
	// listeners for separate elements via closures.
	for (recipe_index in response.stored_recipes) {(function() {
	    var recipe = response.stored_recipes[recipe_index];
	    var recipe_entry_li = document.createElement("li");
	    recipe_entry_li.classList.add("recipe_entry");
	    var recipe_title_text = document.createTextNode(recipe.recipe_name);
	    recipe_entry_li.appendChild(recipe_title_text);

	    var full_recipe_html_node = render_json_recipe_as_html(recipe);

	    var expand_recipe_handler = function () {
		recipe_entry_li.removeChild(recipe_title_text);
		recipe_entry_li.appendChild(full_recipe_html_node);
		recipe_entry_li.removeEventListener("click", expand_recipe_handler);
		recipe_entry_li.addEventListener("click", collapse_recipe_handler);
		recipe_entry_li.classList.add("expanded");
		recipe_entry_li.classList.remove("collapsed");
	    }

	    var collapse_recipe_handler = function () {
		recipe_entry_li.removeChild(full_recipe_html_node);
		recipe_entry_li.appendChild(recipe_title_text);
		recipe_entry_li.removeEventListener("click", collapse_recipe_handler);
		recipe_entry_li.addEventListener("click", expand_recipe_handler);
		recipe_entry_li.classList.add("collapsed");
		recipe_entry_li.classList.remove("expanded");
	    }

	    recipe_entry_li.classList.add("collapsed");
	    recipe_entry_li.addEventListener("click", expand_recipe_handler);
	    saved_recipes_ul.appendChild(recipe_entry_li);
	    }());
	}
    }, handleError);
}


/**
 * Take a recipe object and return an Element object for displaying a recipe in the browser.
 */
// This should really be in a library or such
function render_json_recipe_as_html(recipe_json) {
    var recipe_div = document.createElement("div");
    recipe_div.classList.add("recipe");

    var recipe_title_h1 = document.createElement("h1");
    recipe_title_h1.id = "recipe_name";
    var recipe_name_text = document.createTextNode(recipe_json.recipe_name);
    recipe_title_h1.appendChild(recipe_name_text);
    recipe_div.appendChild(recipe_title_h1);

    var ingredients_ul = document.createElement("ul");
    ingredients_ul.id = "ingredients";
    for (ingredient_index in recipe_json.ingredients) {
	var ingredient_li = document.createElement("li");
	ingredient_li.classList.add("recipe_ingredient");

	ingredient_amount_span = document.createElement("span");
	ingredient_amount_span.classList.add("ingredient_amount");
	ingredient_amount_text = document.createTextNode(recipe_json.ingredients[ingredient_index].amounts[0].amount || "");
	ingredient_amount_span.appendChild(ingredient_amount_text);
	ingredient_li.appendChild(ingredient_amount_span);

	ingredient_unit_span = document.createElement("span");
	ingredient_unit_span.classList.add("ingredient_unit");
	ingredient_unit_text = document.createTextNode(recipe_json.ingredients[ingredient_index].amounts[0].unit || "");
	ingredient_unit_span.appendChild(ingredient_unit_text);
	ingredient_li.appendChild(ingredient_unit_span);

	ingredient_name_span = document.createElement("span");
	ingredient_name_span.classList.add("ingredient_name");
	ingredient_name_text = document.createTextNode(recipe_json.ingredients[ingredient_index].name);
	ingredient_name_span.appendChild(ingredient_name_text);
	ingredient_li.appendChild(ingredient_name_span);

	ingredients_ul.appendChild(ingredient_li);
    }
    recipe_div.appendChild(ingredients_ul);

    var steps_ol = document.createElement("ol");
    steps_ol.id = "steps";
    for (step_index in recipe_json.steps) {
	var step_li = document.createElement("li");
	step_li.classList.add("recipe_step");
	step_text = document.createTextNode(recipe_json.steps[step_index]);
	step_li.appendChild(step_text);
	steps_ol.appendChild(step_li);
    }
    recipe_div.appendChild(steps_ol);

    return recipe_div;
};
