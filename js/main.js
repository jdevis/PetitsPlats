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
function filterArrays() {
	let newRecipes = defaultRecipes;
	if (tagsSelected.length > 0) {
		tagsSelected.forEach((tag) => {
			newRecipes = newRecipes.filter(
				(recipe) =>
					recipe.name.toLowerCase().includes(tag) ||
					recipe.description.toLowerCase().includes(tag) ||
					recipe.appliance.toLowerCase().includes(tag) ||
					recipe.ingredients.some((ing) =>
						ing.ingredient.toLowerCase().includes(tag)
					) ||
					recipe.ustensils.some((ust) =>
						ust.toLowerCase().includes(tag)
					)
			);
		});
	}
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
					filterItem.classList.add("selected");
					filterLi.classList.add("position-relative");
					let filterText = filterItem.textContent;
					filterItem.innerHTML = filterText;
					let button = new filterList(filter);
					button = button.buttonTemplate();
					filterItem.after(button);
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
function listenToFormsAndFilters() {
	const allForms = document.querySelectorAll("form");
	const allLinks = document.querySelectorAll("[data-filter-link]");
	let value = new String();
	allForms.forEach((form) => {
		form.addEventListener("submit", (e) => {
			e.preventDefault();
			value = e.target
				.querySelector("input[type='search']")
				.value.trim()
				.toLowerCase();
			if (value.length > 2 && !tagsSelected.includes(value)) {
				updateTags(value);
				displayData(value, tagsWrapper, "tag");
				init();
				removeTags();
			}
		});
	});
	allLinks.forEach((link) => {
		link.addEventListener("click", (e) => {
			e.preventDefault();
			value = e.target.textContent;
			updateTags(value);
			displayData(value, tagsWrapper, "tag");
			init();
			removeTags();
		});
	});
}

function removeTags() {
	const buttons = document.querySelectorAll("[data-button-remove]");
	const aliveTags = tagsWrapper.childNodes;
	buttons.forEach((button) => {
		button.addEventListener("click", (e) => {
			const value = e.target.parentNode.textContent;
			aliveTags.forEach((e) => {
				if (e.textContent === value) {
					e.remove();
				}
			});
			tagsSelected = removeElementFromArray(value, tagsSelected);
			init();
		});
	});
}

/** Init */
function init() {
	// update recipes
	recipesArray = filterArrays();
	//update filters
	updateFilters();
	// display recipes
	displayData(recipesArray, cardsWrapper, "recipe");
	//display filters
	displayData(ingredientsArray, ingredientsList, "filterList");
	displayData(ustensilsArray, ustensilsList, "filterList");
	displayData(appliancesArray, appliancesList, "filterList");
	//update and display number of recipes
	countRecipes();
	// add listeners on forms and filters
	listenToFormsAndFilters();
}
init();
