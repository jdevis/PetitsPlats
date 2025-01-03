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
	let newRecipes = defaultRecipes;
	if (tagsSelected.length > 0) {
		tagsSelected.forEach((tag) => {
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
			const filterLi = new filterList(filter);
			idWrapper.appendChild(filterLi.filterTemplate());
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
	//attention valeur de l'input prendre tag
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
			const inputValue = e.target.querySelector("input[type='search']")
				.value;
			const inputId = e.target.querySelector("input[type='search']").id;
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
	const allLinks = document.querySelectorAll("ul.dropdown-menu li > a");
	allLinks.forEach((link) => {
		link.addEventListener("click", (e) => {
			e.preventDefault();
			console.log(
				"click du lien: ",
				e.target,
				"avec valeur: ",
				e.target.textContent
			);
			e.target.classList.add("selected");
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
	listenToForms();
	listenToFiltersLists();
}
init();
