import { recipes } from "../data/recipes.js";

const cardsWrapper = document.getElementById("recipeCards");
const cardTemplate = document.querySelector("[data-recipe-template]");
const ingredientsTemplate = document.querySelector(
	"[data-ingredients-template]"
);
let recipesArray = recipes.sort((a, b) => a.name.localeCompare(b.name));
let ingredientsArray = [];
let ingredientsFilterArray = [];
let applianceArray = [];
let ustensilsArray = [];

/** display recipes */
function displayRecipes() {
	recipesArray = recipesArray.map((recipe) => {
		const card = cardTemplate.content.cloneNode(true).children[0];
		const img = card.querySelector("[data-recipe-img]");
		const recipeTitle = card.querySelector("[data-recipe-title]");
		const recipeDesc = card.querySelector("[data-recipe-desc]");
		const recipeTime = card.querySelector("[data-recipe-time]");
		const src = "/assets/photos/" + recipe.image;
		card.setAttribute("id", "recipeId-" + recipe.id);
		img.setAttribute("src", src);
		recipeTitle.textContent = recipe.name;
		recipeDesc.textContent = recipe.description;
		recipeTime.textContent = recipe.time + "min";
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
			if (
				!ingredientsFilterArray.includes(ing.ingredient.toLowerCase())
			) {
				ingredientsFilterArray.push(ing.ingredient.toLowerCase());
			}
			return { ingredientTitle: ing.ingredient };
		});
		//store ustensils for filter
		recipe.ustensils.forEach((element) => {
			if (!ustensilsArray.includes(element.toLowerCase())) {
				ustensilsArray.push(element.toLowerCase());
			}
		});
		//store appliances for filter
		if (!applianceArray.includes(recipe.appliance.toLowerCase())) {
			applianceArray.push(recipe.appliance.toLowerCase());
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
function displayFilters() {
	const ingredientsList = document.querySelector("[data-filter-ingredients]");
	const appliancesList = document.querySelector("[data-filter-appliances]");
	const ustensilsList = document.querySelector("[data-filter-ustensils]");
	const listTemplate = document.querySelector("[data-filter-list]");
	// sort alphabetically
	ingredientsFilterArray.sort((a, b) => a.localeCompare(b));
	applianceArray.sort((a, b) => a.localeCompare(b));
	ustensilsArray.sort((a, b) => a.localeCompare(b));
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

const message = document.querySelector("[data-message]");
function countRecipes(value) {
	let count = cardsWrapper.getElementsByClassName("d-none").length;
	let newCount = 50 - count;
	const nbreRecipeString =
		newCount === 0 || newCount === 1 ? " recette" : " recettes";
	if (newCount === 0) {
		message.innerHTML = `Aucune recette ne contient <span class="fw-bold">${value}</span> vous pouvez chercher «
tarte aux pommes », « poisson », etc.... `;
		message.classList.remove("d-none");
	} else {
		message.classList.add("d-none");
	}
	document.getElementById("recipesNumber").textContent =
		newCount + nbreRecipeString;
}

function filterArrays(key) {
	const arrayFiltered = recipesArray.filter(
		(element) =>
			element.name.includes(key) || element.description.includes(key)
	);
	return arrayFiltered;
}

/** searchBar */
const searchForm = document.getElementById("search");
const searchInput = document.getElementById("searchInput");
searchForm.addEventListener("submit", (e) => {
	e.preventDefault();
});
searchInput.addEventListener("input", (e) => {
	const value = e.target.value;
	if (value.length > 2) {
		toggleRecipes(value);
		displayTags();
	}
});
function toggleRecipes(value) {
	console.log(value);
	recipesArray.forEach((recipe) => {
		const isVisible =
			recipe.title.toLowerCase().includes(value) ||
			recipe.description.toLowerCase().includes(value);
		recipe.element.classList.toggle("d-none", !isVisible);
	});
	countRecipes(value);
	//filterArrays(value);
}

const tagsWrapper = document.getElementById("tagsContainer");
const tagTemplate = document.querySelector("[data-tags-template]");
function displayTags() {
	const tag = tagTemplate.content.cloneNode(true).children[0];
	tag.innerHTML = `${searchInput.value}<button
	type="button"
	class="btn bi bi-x-lg p-0 float-end"
	></button>`;
	tagsWrapper.append(tag);
	removeTags();
}
function removeTags() {
	const button = tagsWrapper.querySelector("button");
	button.addEventListener("click", (e) => {
		e.target.parentNode.remove();
		toggleRecipes("");
	});
}

displayRecipes();
displayFilters();
