// Declare grabbed_recipe to be global, as we need it in multiple places.
// Should be rewritten with more local scoping.
var grabbed_recipe;

/**
 * Generic error handler.
 */
function handleError(error) {
    console.log(`Error: ${error}`);
}

/* Although we want to send only to one tab, the active one, the API can only send to tabs plural. */
function sendMessageToTabs(tabs) {
    for (let tab of tabs) {
	browser.tabs.sendMessage(
	    tab.id, {greeting: "Hi from background script"}
	).then(response => {
	    grabbed_recipe = response.response

	    var recipe_div = document.getElementById("grabbed_recipe");
	    recipe_div.appendChild(render_json_recipe_as_html(grabbed_recipe));

	}).catch(handleError);
    }
}

/* Stores recipes in the space reserved for the plugin by the browser, not a file specified by the user. */
function store_recipe_json(recipe_json) {
    stored_recipes = []
    var get_stored_recipes = browser.storage.local.get("stored_recipes")
    get_stored_recipes.then((response) => {
	stored_recipes = response.stored_recipes;
    }, handleError).then((promise) => {
	stored_recipes.push(recipe_json);
	var storing_recipe = browser.storage.local.set({ "stored_recipes" : stored_recipes });
	storing_recipe.then(() => {
	    console.log("Recipe stored!");
	}, handleError);
    }, handleError);
}

/**
 * Take a recipe object and return an Element object for displaying a recipe in the browser.
 */
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

window.onload = function() {
    /* Grab the available recipe as soon as the user clicks on the toolbar icon. */
    browser.tabs.query({
	currentWindow: true,
	active: true
    }).then(sendMessageToTabs).catch(handleError);

    /* Force handlers to load only after the DOM is parsed and ready. */
    var save_recipe_button = document.getElementById("save_recipe_button");
    var save_recipe_handler = function() {
	store_recipe_json(grabbed_recipe);
	save_recipe_button.classList.add("success");
	save_recipe_button.textContent = "Recipe saved!";
	save_recipe_button.removeEventListener("click", save_recipe_handler);
    };
    save_recipe_button.addEventListener("click", save_recipe_handler)
};
