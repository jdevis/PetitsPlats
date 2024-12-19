// Algo 2
import { recipes } from "../data/recipes.js";

/** display recipes */
const cardTemplate = document.querySelector("[data-recipe-template]");
const cardsWrapper = document.getElementById("recipeCards");
const ingredientsTemplate = document.querySelector(
	"[data-ingredients-template]"
);
let recipesArray = [];
let ingredientsArray = [];
let ingredientsFilterArray = [];
let applianceArray = [];
let ustensilsArray = [];

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
		if (!ingredientsFilterArray.includes(ing.ingredient)) {
			ingredientsFilterArray.push(ing.ingredient);
		}
		ingredientsContainer.append(ingredientCard);
		return { ingredientTitle: ing.ingredient };
	});
	recipe.ustensils.forEach((element) => {
		if (!ustensilsArray.includes(element)) {
			ustensilsArray.push(element);
		}
	});
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
console.log(ingredientsFilterArray);
/** display filters */

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
