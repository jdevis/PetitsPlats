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

/** data manipulation and display */
function filterArraysIntoArrays(array, string) {
	array.forEach((elm) => {
		if (
			//elm.ingredient.toLowerCase().includes(string) ||
			elm.toLowerCase().includes(string)
		) {
			//console.log("ingrédient: ", elm.ingredient.toLowerCase());
			console.log("autre: ", elm);
			console.log("tag: ", string);
			return true;
		}
	});
}
function filterArrays() {
	let newRecipes = defaultRecipes;
	if (tagsSelected.length > 0) {
		tagsSelected.forEach((tag) => {
			newRecipes = newRecipes.filter(
				(recipe) =>
					recipe.name.toLowerCase().includes(tag) ||
					recipe.description.toLowerCase().includes(tag) ||
					recipe.appliance.toLowerCase().includes(tag) ||
					//filterArraysIntoArrays(recipe.ingredients, tag) ||
					//filterArraysIntoArrays(recipe.ustensils, tag)
					recipe.ingredients.forEach((ingredient) => {
						ingredient.ingredient.toLowerCase().includes(tag);
					}) ||
					recipe.ustensils.forEach((ustensil) => {
						ustensil.toLowerCase().includes(tag);
					})
			);
		});
	}
	console.log("tableau de recettes filtré: ", newRecipes);
	return newRecipes;
}

function updateFilters() {
	ingredientsArray = [];
	ustensilsArray = [];
	appliancesArray = [];
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
		let listItem = idWrapper.querySelectorAll("li");
		listItem = listItem[0];
		idWrapper.innerHTML = "";
		idWrapper.appendChild(listItem);
		data.forEach((filter) => {
			let filterLi = new filterList(filter);
			filterLi = filterLi.filterTemplate();
			let filterItem = filterLi.children[0];
			tagsSelected.forEach((tag) => {
				if (tag === filterItem.textContent) {
					filterItem.classList.add("selected", "position-relative");
					let filterText = filterItem.textContent;
					filterItem.innerHTML = `${filterText}
			<button type="button"
			class="btn position-absolute p-0 top-5 end-5 bi bi-x-circle-fill">
			</button>`;
				}
			});
			idWrapper.appendChild(filterLi);
		});
	}
}

function updateTags(value) {
	tagsSelected.push(value.trim().toLowerCase());
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
	let value = new String();
	tagsSelected.forEach((tag) => {
		value += " " + tag;
	});
	const nbreRecipeString = nb === 0 || nb === 1 ? " recette" : " recettes";
	if (nb === 0) {
		message.innerHTML = `Aucune recette ne contient <span class="fw-bold">${value}</span> vous pouvez chercher «
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
			const inputValue = e.target
				.querySelector("input[type='search']")
				.value.trim()
				.toLowerCase();
			if (inputValue.length > 2 && !tagsSelected.includes(inputValue)) {
				updateTags(inputValue);
				displayData(inputValue, tagsWrapper, "tag");
				removeTags();
				init();
			}
		});
	});
}

function listenToFiltersLists() {
	const allLinks = document.querySelectorAll("[data-filter-link]");
	allLinks.forEach((link) => {
		link.addEventListener("click", (e) => {
			e.preventDefault();
			updateTags(e.target.textContent);
			displayData(e.target.textContent, tagsWrapper, "tag");
			removeTags();
			init();
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
			init();
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
	listenToFiltersLists();
}
init();
listenToForms();
