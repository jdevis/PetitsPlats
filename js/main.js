import { recipes } from "../data/recipes.js"; // external data
import { cardRecipe, filterList, tagsList } from "./models.js"; // HTML templates

/** Globals variables */
// Arrays
const defaultRecipes = recipes.sort((a, b) => a.name.localeCompare(b.name));
let recipesArray = defaultRecipes;
let tagsSelected = new Array();
let ingredientsArray = new Array();
let ustensilsArray = new Array();
let appliancesArray = new Array();
// Containers
const cardsWrapper = document.getElementById("recipeCards");
const tagsWrapper = document.getElementById("tagsContainer");
const message = document.getElementById("message");
const ingredientsList = document.getElementById("filter-ingredients");
const ustensilsList = document.getElementById("filter-appliances");
const appliancesList = document.getElementById("filter-ustensils");
const searchInput = document.getElementById("searchInput");

/** data manipulation and display */
function filterArrays() {
	console.log("tableau de recettes before: ", recipesArray);
	let newRecipes = defaultRecipes;
	console.log(
		"tableau de tags: ",
		tagsSelected,
		"longueur: ",
		tagsSelected.length
	);
	if (tagsSelected.length > 0) {
		tagsSelected.forEach((tag) => {
			console.log("tag: ", tag);
			newRecipes = newRecipes.filter(
				(recipe) =>
					recipe.name.toLowerCase().includes(tag.toLowerCase()) ||
					recipe.description
						.toLowerCase()
						.includes(tag.toLowerCase()) ||
					recipe.appliance
						.toLowerCase()
						.includes(tag.toLowerCase()) ||
					recipe.ingredients.forEach((ingredient) => {
						ingredient.ingredient
							.toLowerCase()
							.includes(tag.toLowerCase());
					}) ||
					recipe.ustensils.forEach((ustensil) => {
						ustensil.toLowerCase().includes(tag.toLowerCase());
					})
			);
		});
	}
	console.log("tableau de recettes after: ", newRecipes);
	return newRecipes;
}

function updateFilters() {
	console.log("tableau ingrédients before: ", ingredientsArray);
	recipesArray.forEach((recipe) => {
		recipe.ingredients.forEach((ingredients) => {
			ingredientsArray.push(ingredients.ingredient.toLowerCase());
		});
		recipe.ustensils.forEach((ustensil) => {
			ustensilsArray.push(ustensil.toLowerCase());
		});
		appliancesArray.push(recipe.appliance.toLowerCase());
	});
	ingredientsArray = [...new Set(ingredientsArray)].sort((a, b) =>
		a.localeCompare(b)
	);
	ustensilsArray = [...new Set(ustensilsArray)].sort((a, b) =>
		a.localeCompare(b)
	);
	appliancesArray = [...new Set(appliancesArray)].sort((a, b) =>
		a.localeCompare(b)
	);
	console.log("tableau ingrédients after: ", ingredientsArray);
}

function displayData(data, idWrapper, template) {
	if (template == "recipe") {
		idWrapper.innerHTML = "";
		data.forEach((recipe) => {
			const card = new cardRecipe(recipe);
			idWrapper.appendChild(card.cardTemplate());
			card.ingredientsTemplate();
		});
	}
	if (template == "tag") {
		const tag = new tagsList(data);
		idWrapper.appendChild(tag.createTag());
	}
	if (template == "filterList") {
		data.forEach((filter) => {
			const filterLi = new filterList(filter);
			idWrapper.children[0].append(filterLi.filterTemplate());
		});
	}
}

function updateTags(value) {
	tagsSelected.push(value);
}

function removeElementFromArray(value, array) {
	if (array.includes(value)) {
		let newArray = [];
		array.forEach((elm) => {
			if (elm !== value) {
				newArray.push(elm);
			}
		});
		return newArray;
	}
	return array;
}

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

/** Listeners */
function listenToForms() {
	const allForms = document.querySelectorAll("form");
	allForms.forEach((form) => {
		form.addEventListener("submit", (e) => {
			e.preventDefault();
			console.log("submit du form: ", form);
			const inputValue = e.target.querySelector("input[type='search']")
				.value;
			const inputId = e.target.querySelector("input[type='search']").id;
			console.log(
				"valeur de l'input: ",
				inputValue,
				" longueur: ",
				inputValue.length,
				"id: ",
				inputId
			);
			if (inputValue.length > 2) {
				updateTags(inputValue);
				recipesArray = filterArrays();
				updateFilters();
				displayData(inputValue, tagsWrapper, "tag");
				displayData(recipesArray, cardsWrapper, "recipe");
				displayData(ingredientsArray, ingredientsList, "filterList");
				displayData(ustensilsArray, ustensilsList, "filterList");
				displayData(appliancesArray, appliancesList, "filterList");
				countRecipes();
				removeTags();
			}
		});
	});
}

function removeTags() {
	const buttons = tagsWrapper.querySelectorAll("button");
	buttons.forEach((button) => {
		button.addEventListener("click", (e) => {
			const value = e.target.parentNode.textContent;
			e.target.parentNode.remove();
			tagsSelected = removeElementFromArray(value, tagsSelected);
			recipesArray = filterArrays();
			updateFilters();
			displayData(recipesArray, cardsWrapper, "recipe");
			displayData(ingredientsArray, ingredientsList, "filterList");
			displayData(ustensilsArray, ustensilsList, "filterList");
			displayData(appliancesArray, appliancesList, "filterList");
			countRecipes();
		});
	});
}
/** Init */
function init() {
	// mettre à jour les recettes
	recipesArray = filterArrays();
	//mettre à jour les filtres
	updateFilters();
	// afficher les recettes
	displayData(recipesArray, cardsWrapper, "recipe");
	//afficher les liste de filtres
	displayData(ingredientsArray, ingredientsList, "filterList");
	displayData(ustensilsArray, ustensilsList, "filterList");
	displayData(appliancesArray, appliancesList, "filterList");
	//mettre à jour le nbre de recettes et les afficher
	countRecipes();
}
init();
listenToForms();
