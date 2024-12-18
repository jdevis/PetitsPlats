// Algo 2
import { recipes } from "../data/recipes.js";

class RecipeIngredients {
	constructor(ingredients) {
		this._ingredients = ingredients;
	}
	ingredientsCard() {
		const ingredientsContainer = document.createElement("div");
		ingredientsContainer.classList.add("col-6");
		const ingredientsTemplate = `<p class="card-text">
										${this._ingredients.ingredient}
										<small
											class="text-body-secondary"
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
	});
}

displayRecipes();
