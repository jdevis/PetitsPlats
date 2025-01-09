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
		for (let i = 0; i < tagsSelected.length; i++) {
			newRecipes = newRecipes.filter(
				(recipe) =>
					recipe.name.toLowerCase().includes(tagsSelected[i]) ||
					recipe.description
						.toLowerCase()
						.includes(tagsSelected[i]) ||
					recipe.appliance.toLowerCase().includes(tagsSelected[i]) ||
					recipe.ingredients.some((ing) =>
						ing.ingredient.toLowerCase().includes(tagsSelected[i])
					) ||
					recipe.ustensils.some((ust) =>
						ust.toLowerCase().includes(tagsSelected[i])
					)
			);
		}
	}
	return newRecipes;
}

function updateFilters() {
	ingredientsArray = [];
	ustensilsArray = [];
	appliancesArray = [];
	for (let i = 0; i < recipesArray.length; i++) {
		for (let j = 0; j < recipesArray[i].ingredients.length; j++) {
			ingredientsArray.push(
				recipesArray[i].ingredients[j].ingredient.toLowerCase()
			);
		}
		for (let k = 0; k < recipesArray[i].ustensils.length; k++) {
			ustensilsArray.push(recipesArray[i].ustensils[k].toLowerCase());
		}
		appliancesArray.push(recipesArray[i].appliance.toLowerCase());
	}
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
		for (let i = 0; i < data.length; i++) {
			const card = new cardRecipe(data[i]);
			idWrapper.appendChild(card.cardTemplate());
			card.ingredientsTemplate();
		}
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
		for (let j = 0; j < data.length; j++) {
			let filterLi = new filterList(data[j]);
			filterLi = filterLi.filterTemplate();
			let filterItem = filterLi.children[0];
			for (let k = 0; k < tagsSelected.length; k++) {
				if (tagsSelected[k] === filterItem.textContent) {
					filterItem.classList.add("selected");
					filterLi.classList.add("position-relative");
					let filterText = filterItem.textContent;
					filterItem.innerHTML = filterText;
					let button = new filterList(tagsSelected[k]);
					button = button.buttonTemplate();
					filterItem.after(button);
				}
			}
			idWrapper.appendChild(filterLi);
		}
	}
}

function updateTags(value) {
	tagsSelected.push(value.trim().toLowerCase());
}

function removeElementFromArray(value, array) {
	if (array.includes(value)) {
		let newArray = [];
		for (let i = 0; i < array.length; i++) {
			if (array[i] !== value) {
				newArray.push(array[i]);
			}
		}
		return newArray;
	}
	return array;
}
function countRecipes() {
	let nb = cardsWrapper.querySelectorAll("article").length;
	let value = new String();
	for (let i = 0; i < tagsSelected.length; i++) {
		value += " " + tagsSelected[i];
	}
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
function listenToForm() {
	const allForms = document.querySelectorAll("form");
	let value = new String();
	for (let i = 0; i < allForms.length; i++) {
		allForms[i].addEventListener("submit", (e) => {
			e.preventDefault();
			value = e.target
				.querySelector("input[type='search']")
				.value.trim()
				.toLowerCase();
			if (value.length > 2 && !tagsSelected.includes(value)) {
				updateTags(value);
				displayData(value, tagsWrapper, "tag");
				assemblingSequences();
				removeTags();
			}
		});
	}
}
function listenToFilters() {
	const allLinks = document.querySelectorAll("[data-filter-link]");
	let value = new String();
	for (let j = 0; j < allLinks.length; j++) {
		allLinks[j].addEventListener("click", (e) => {
			e.preventDefault();
			value = e.target.textContent;
			updateTags(value);
			displayData(value, tagsWrapper, "tag");
			assemblingSequences();
			removeTags();
		});
	}
}

function removeTags() {
	const buttons = document.querySelectorAll("[data-button-remove]");
	const aliveTags = tagsWrapper.childNodes;
	for (let i = 0; i < buttons.length; i++) {
		buttons[i].addEventListener("click", (e) => {
			const value = e.target.parentNode.textContent;
			for (let j = 0; j < aliveTags.length; j++) {
				if (aliveTags[j].textContent === value) {
					aliveTags[j].remove();
				}
			}
			tagsSelected = removeElementFromArray(value, tagsSelected);
			assemblingSequences();
		});
	}
}

/** Init */
function assemblingSequences() {
	console.time("loopFor");
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
	listenToFilters();
	console.timeEnd("loopFor");
}
assemblingSequences();
listenToForm();
