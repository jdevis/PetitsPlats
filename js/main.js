import { recipes } from "../data/recipes.js";
import { cardRecipe, filterList, formList, tagsList } from "./models.js";

const cardsWrapper = document.getElementById("recipeCards");
const recipesArray = recipes.sort((a, b) => a.name.localeCompare(b.name));

/** display recipes */
// data MUST be in the same format as recipes.js
function displayRecipes(data) {
	cardsWrapper.innerHTML = "";
	let searchValue = searchInput.value;
	if (searchValue === "" || !searchValue) {
		data = recipesArray;
	}
	data.forEach((recipe) => {
		const card = new cardRecipe(recipe);
		cardsWrapper.appendChild(card.cardTemplate());
		card.ingredientsTemplate();
	});
	countRecipes();
	displayFilters(data);
}
function removeRecipes(value) {
	cardsWrapper.innerHTML = "";
	if (value === searchInput.value) {
		searchInput.value = "";
		displayRecipes(recipesArray);
	} else {
		const data = recipesArray.filter(
			(recipe) =>
				!recipe.name.toLowerCase().includes(value.toLowerCase()) ||
				!recipe.description
					.toLowerCase()
					.includes(value.toLowerCase()) ||
				!recipe.appliance.toLowerCase().includes(value.toLowerCase()) ||
				recipe.ingredients.forEach((ingredient) => {
					!ingredient.ingredient
						.toLowerCase()
						.includes(value.toLowerCase());
				}) ||
				recipe.ustensils.forEach((ustensil) => {
					!ustensil.toLowerCase().includes(value.toLowerCase());
				})
		);
		displayRecipes(data);
	}
}

/** display filters */
// data MUST be in the same format as recipes.js
function displayFilters(data) {
	const ingredientsList = document.querySelector("[data-filter-ingredients]");
	const ustensilsList = document.querySelector("[data-filter-ustensils]");
	const appliancesList = document.querySelector("[data-filter-appliances]");
	const ingredientsForm = new formList(
		"searchIng",
		"Rechercher un ingrédient"
	);
	ingredientsList.innerHTML = "";
	ingredientsList.appendChild(ingredientsForm.formTemplate());
	const ustensilsForm = new formList(
		"searchUstensils",
		"Rechercher un ustensile"
	);
	ustensilsList.innerHTML = "";
	ustensilsList.appendChild(ustensilsForm.formTemplate());
	const appliancesForm = new formList(
		"searchAppliance",
		"Rechercher un appareil"
	);
	appliancesList.innerHTML = "";
	appliancesList.appendChild(appliancesForm.formTemplate());
	let ingredientsArray = [];
	let ustensilsArray = [];
	let appliancesArray = [];
	data.forEach((recipe) => {
		recipe.ingredients.forEach((ingredients) => {
			ingredientsArray.push(ingredients.ingredient.toLowerCase());
		});
		recipe.ustensils.forEach((ustensil) => {
			ustensilsArray.push(ustensil.toLowerCase());
		});
		appliancesArray.push(recipe.appliance.toLowerCase());
	});
	let ingredientsArrayFiltered = [...new Set(ingredientsArray)].sort((a, b) =>
		a.localeCompare(b)
	);
	let ustensilsArrayFiltered = [...new Set(ustensilsArray)].sort((a, b) =>
		a.localeCompare(b)
	);
	let appliancesArrayFiltered = [...new Set(appliancesArray)].sort((a, b) =>
		a.localeCompare(b)
	);
	ingredientsArrayFiltered.forEach((ingredient) => {
		const ingredientLi = new filterList(ingredient);
		ingredientsList.children[0].append(ingredientLi.filterTemplate());
	});
	ustensilsArrayFiltered.forEach((ustensil) => {
		const ustensilLi = new filterList(ustensil);
		ustensilsList.children[0].append(ustensilLi.filterTemplate());
	});
	appliancesArrayFiltered.forEach((appliance) => {
		const applianceLi = new filterList(appliance);
		appliancesList.children[0].append(applianceLi.filterTemplate());
	});
}

const message = document.querySelector("[data-message]");
function countRecipes() {
	let nb = cardsWrapper.querySelectorAll("article").length;
	let searchValue = searchInput.value;
	const nbreRecipeString = nb === 0 || nb === 1 ? " recette" : " recettes";
	if (nb === 0) {
		message.innerHTML = `Aucune recette ne contient <span class="fw-bold">${searchValue}</span> vous pouvez chercher «
tarte aux pommes », « poisson », etc.... `;
		message.classList.remove("d-none");
	} else {
		message.classList.add("d-none");
	}
	document.getElementById("recipesNumber").textContent =
		nb + nbreRecipeString;
}

/** searchBar */
const searchForm = document.getElementById("search");
const searchInput = document.getElementById("searchInput");
searchForm.addEventListener("submit", (e) => {
	e.preventDefault();
	const value = searchInput.value;
	if (value.length > 2) {
		const newRecipes = recipesArray.filter(
			(recipe) =>
				recipe.name.toLowerCase().includes(value.toLowerCase()) ||
				recipe.description
					.toLowerCase()
					.includes(value.toLowerCase()) ||
				recipe.appliance.toLowerCase().includes(value.toLowerCase()) ||
				recipe.ingredients.forEach((ingredient) => {
					ingredient.ingredient
						.toLowerCase()
						.includes(value.toLowerCase());
				}) ||
				recipe.ustensils.forEach((ustensil) => {
					ustensil.toLowerCase().includes(value.toLowerCase());
				})
		);
		displayRecipes(newRecipes);
		displayTags(value);
	}
});
searchInput.addEventListener("input", (e) => {
	if (e.target.value === "") {
		displayRecipes(recipesArray);
	}
});

const tagsWrapper = document.getElementById("tagsContainer");
function displayTags(value) {
	const tag = new tagsList(value);
	tagsWrapper.appendChild(tag.createTag());
	removeTags();
}
function removeTags() {
	const buttons = tagsWrapper.querySelectorAll("button");
	buttons.forEach((button) => {
		button.addEventListener("click", (e) => {
			const value = e.target.parentNode.textContent;
			e.target.parentNode.remove();
			removeRecipes(value);
		});
	});
}

displayRecipes(recipesArray);
