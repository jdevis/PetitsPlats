/** Algo 2 */
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

/** display filters */
const ingredientsList = document.querySelector("[data-filter-ingredients]");
const appliancesList = document.querySelector("[data-filter-appliances]");
const ustensilsList = document.querySelector("[data-filter-ustensils]");
const listTemplate = document.querySelector("[data-filter-list]");
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

/** searchBar */
const searchInput = document.getElementById("search");
const message = document.querySelector("[data-message]");
let count = 50; // number of recipes displayed
let newCount = 0;
searchInput.addEventListener("input", (e) => {
	const value = e.target.value;
	recipesArray.forEach((recipe) => {
		if (value.length > 2) {
			const isVisible =
				recipe.title.toLowerCase().includes(value) ||
				recipe.description.toLowerCase().includes(value);
			recipe.element.classList.toggle("d-none", !isVisible);
		} else {
			recipe.element.classList.remove("d-none");
		}
		count = cardsWrapper.getElementsByClassName("d-none").length;
	});
	newCount = 50 - count;
	const nbreRecipeString =
		newCount === 0 || newCount === 1 ? " recette" : " recettes";
	if (newCount === 0) {
		message.innerHTML = `Aucune recette ne contient <span class="fw-bold">${e.target.value}</span> vous pouvez chercher «
tarte aux pommes », « poisson », etc.... `;
		message.classList.remove("d-none");
	} else {
		message.classList.add("d-none");
	}
	document.getElementById("recipesNumber").textContent =
		newCount + nbreRecipeString;
});
