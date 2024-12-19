// Algo 2
import { recipes } from "../data/recipes.js";

/** display recipes */
class RecipeIngredients {
	constructor(ingredients) {
		this._ingredients = ingredients;
	}
	ingredientsCard() {
		const ingredientsContainer = document.createElement("div");
		ingredientsContainer.classList.add("col-6");
		const ingredientsTemplate = `<p class="card-text small">
										${this._ingredients.ingredient}
										<small
											class="text-body-secondary d-block"
											>${this._ingredients.quantity ?? ""} ${this._ingredients.unit ?? ""}</small
										>
									</p>`;
		ingredientsContainer.innerHTML = ingredientsTemplate;
		return ingredientsContainer;
	}
}

class RecipesCard {
	constructor(recipes) {
		this._recipes = recipes;
	}
	recipeCard() {
		const recipeContainer = document.createElement("article");
		recipeContainer.classList.add("col-4");
		recipeContainer.setAttribute("id", this._recipes.id);
		const recipeTemplate = `
					<div class="card mb-3 position-relative">
						<img
							src="/assets/photos/${this._recipes.image}"
							class="card-img-top"
							alt=""
						/>
						<span
							class="w-25 position-absolute top-25 end-25 rounded-pill text-center bg-warning"
							>${this._recipes.time}min</span
						>
						<div class="card-body">
							<h5 class="card-title">${this._recipes.name}</h5>
							<p class="text-body-secondary text-uppercase">
								Recette
							</p>
							<p class="card-text">
								${this._recipes.description}
							</p>
							<div class="row">
								<p class="text-body-secondary text-uppercase">
									Ingrédients
								</p>
								<div class="row" id="ingredientsContainer-${this._recipes.id}"></div>	
							</div>
						</div>
					</div>`;
		recipeContainer.innerHTML = recipeTemplate;
		return recipeContainer;
	}
}

function displayRecipes() {
	const cardWrapper = document.getElementById("recipeCards");
	recipes.forEach((recipe) => {
		const recipesTemplate = new RecipesCard(recipe);
		cardWrapper.appendChild(recipesTemplate.recipeCard());
		recipe.ingredients.forEach((ingredient) => {
			const ingredientsWrapper = document.getElementById(
				"ingredientsContainer-" + recipe.id
			);
			const ingredientTemplate = new RecipeIngredients(ingredient);
			ingredientsWrapper.appendChild(
				ingredientTemplate.ingredientsCard()
			);
		});
		return recipesTemplate;
	});
}

const cardTemplate = document.querySelector("[data-recipe-template]");
const cardsWrapper = document.getElementById("recipeCards");
const ingredientsTemplate = document.querySelector(
	"[data-ingredients-template]"
);
let recipesArray = [];

recipesArray = recipes.map((recipe) => {
	const card = cardTemplate.content.cloneNode(true).children[0];
	const img = card.querySelector("[data-recipe-img]");
	const recipeTitle = card.querySelector("[data-recipe-title]");
	const desc = card.querySelector("[data-recipe-desc]");
	const src = "/assets/photos/" + recipe.image;
	img.setAttribute("src", src);
	recipeTitle.textContent = recipe.name;
	desc.textContent = recipe.description;
	const ingredientsContainer = card.querySelector(
		"[data-ingredients-container]"
	);
	recipe.ingredients.forEach((ing) => {
		const ingredientCard = ingredientsTemplate.content.cloneNode(true)
			.children[0];
		const ingredientTitle = ingredientCard.querySelector(
			"[data-ingredient-title]"
		);
		const ingredientQuantity = ingredientCard.querySelector(
			"[data-ingredient-qty]"
		);
		const ingredientUnit = ingredientCard.querySelector(
			"[data-ingredient-unit]"
		);
		ingredientTitle.textContent = ing.ingredient;
		ingredientQuantity.textContent = ing.quantity;
		ingredientUnit.textContent = ing.unit;
		ingredientsContainer.append(ingredientCard);
	});
	cardsWrapper.append(card);
	return {
		title: recipe.name,
		description: recipe.description,
		element: card,
	};
});

/** searchBar */
const searchInput = document.getElementById("search");
const message = document.querySelector("[data-message]");
searchInput.addEventListener("input", (e) => {
	const value = e.target.value;
	let messageVisible = false;
	recipesArray.forEach((recipe) => {
		if (value.length > 2) {
			const isVisible =
				recipe.title.toLowerCase().includes(value) ||
				recipe.description.toLowerCase().includes(value);
			recipe.element.classList.toggle("d-none", !isVisible);
			message.classList.toggle("d-none", messageVisible);
		} else {
			recipe.element.classList.remove("d-none");
			message.classList.add("d-none");
		}
	});
});

/** init */
//displayRecipes();
