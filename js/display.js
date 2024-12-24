import { recipes } from "../data/recipes.js";

export const cardsWrapper = document.getElementById("recipeCards");
export let recipesArray = [];
let ingredientsArray = [];
let ingredientsFilterArray = [];
let applianceArray = [];
let ustensilsArray = [];
const cardTemplate = document.querySelector("[data-recipe-template]");
const ingredientsTemplate = document.querySelector(
	"[data-ingredients-template]"
);
/** display recipes */
export function displayRecipes() {
	recipesArray = recipes.map((recipe) => {
		const card = cardTemplate.content.cloneNode(true).children[0];
		const img = card.querySelector("[data-recipe-img]");
		const recipeTitle = card.querySelector("[data-recipe-title]");
		const desc = card.querySelector("[data-recipe-desc]");
		const src = "/assets/photos/" + recipe.image;
		card.setAttribute("id", "recipeId-" + recipe.id);
		img.setAttribute("src", src);
		recipeTitle.textContent = recipe.name;
		desc.textContent = recipe.description;
		const ingredientsContainer = card.querySelector(
			"[data-ingredients-container]"
		);
		ingredientsArray = recipe.ingredients.map((ing) => {
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
			//store ingredients for filter
			if (!ingredientsFilterArray.includes(ing.ingredient)) {
				ingredientsFilterArray.push(ing.ingredient);
			}
			return { ingredientTitle: ing.ingredient };
		});
		//store ustensils for filter
		recipe.ustensils.forEach((element) => {
			if (!ustensilsArray.includes(element)) {
				ustensilsArray.push(element);
			}
		});
		//store appliances for filter
		if (!applianceArray.includes(recipe.appliance)) {
			applianceArray.push(recipe.appliance);
		}
		cardsWrapper.append(card);
		return {
			title: recipe.name,
			description: recipe.description,
			appliance: recipe.appliance,
			element: card,
		};
	});
}

/** display filters */
export function displayFilters() {
	const ingredientsList = document.querySelector("[data-filter-ingredients]");
	const appliancesList = document.querySelector("[data-filter-appliances]");
	const ustensilsList = document.querySelector("[data-filter-ustensils]");
	const listTemplate = document.querySelector("[data-filter-list]");
	// sort alphabetically
	ingredientsFilterArray.sort((a, b) =>
		a.localeCompare(b, "fr", { ignorePunctuation: true })
	);
	applianceArray.sort((a, b) =>
		a.localeCompare(b, "fr", { ignorePunctuation: true })
	);
	ustensilsArray.sort((a, b) =>
		a.localeCompare(b, "fr", { ignorePunctuation: true })
	);
	// ingredients filter
	ingredientsFilterArray.forEach((element) => {
		const list = listTemplate.content.cloneNode(true).children[0];
		const link = list.querySelector("[data-filter-link]");
		link.textContent = element;
		ingredientsList.children[0].append(list);
	});
	// appliances filter
	applianceArray.forEach((element) => {
		const list = listTemplate.content.cloneNode(true).children[0];
		const link = list.querySelector("[data-filter-link]");
		link.textContent = element;
		appliancesList.children[0].append(list);
	});
	// ustensils filter
	ustensilsArray.forEach((element) => {
		const list = listTemplate.content.cloneNode(true).children[0];
		const link = list.querySelector("[data-filter-link]");
		link.textContent = element;
		ustensilsList.children[0].append(list);
	});
}
