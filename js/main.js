import { recipes } from "../data/recipes.js";
import { cardRecipe, filterList } from "./models.js";

const cardsWrapper = document.getElementById("recipeCards");
const recipesArray = recipes.sort((a, b) => a.name.localeCompare(b.name));

/** display recipes */
// data MUST be in the same format as recipes.js, string is the term searched for displaying tags and message
function displayRecipes(data, string) {
	cardsWrapper.innerHTML = "";
	if (string === "" || !string) {
		data = recipesArray;
	}
	data.forEach((recipe) => {
		const card = new cardRecipe(recipe);
		cardsWrapper.appendChild(card.cardTemplate());
		card.ingredientsTemplate();
	});
	countRecipes(data.length, string);
	displayFilters(data);
}

/** display filters */
// data MUST be in the same format as recipes.js
function displayFilters(data) {
	const ingredientsList = document.querySelector("[data-filter-ingredients]");
	const ustensilsList = document.querySelector("[data-filter-ustensils]");
	const appliancesList = document.querySelector("[data-filter-appliances]");
	ingredientsList.innerHTML = `<li>
		<form
			class="d-flex w-100 mb-3 px-2 justify-content-center align-items-center position-relative"
			role="search"
		>
			<input
				class="form-control w-100"
				type="search"
				name="searchIng"
				id="searchIng"
				placeholder=""
				aria-label="Rechercher un ingrédient"
			/>
			<button
				type="button"
				class="btn position-absolute bi bi-search end-5"
			></button>
		</form>
	</li>`;
	ustensilsList.innerHTML = `<li>
		<form
			class="d-flex w-100 mb-3 px-2 justify-content-center align-items-center position-relative"
			role="search"
		>
			<input
				class="form-control w-100"
				type="search"
				name="searchUstensils"
				id="searchUstensils"
				placeholder=""
				aria-label="Rechercher un ustensile"
			/>
			<button
				type="button"
				class="btn position-absolute bi bi-search end-5"
			></button>
		</form>
	</li>`;
	appliancesList.innerHTML = `<li>
		<form
			class="d-flex w-100 mb-3 px-2 justify-content-center align-items-center position-relative"
			role="search"
		>
			<input
				class="form-control w-100"
				type="search"
				name="searchAppliance"
				id="searchAppliance"
				placeholder=""
				aria-label="Rechercher un appareil"
			/>
			<button
				type="button"
				class="btn position-absolute bi bi-search end-5"
			></button>
		</form>
	</li>`;
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
function countRecipes(nb, string) {
	const nbreRecipeString = nb === 0 || nb === 1 ? " recette" : " recettes";
	if (nb === 0) {
		message.innerHTML = `Aucune recette ne contient <span class="fw-bold">${string}</span> vous pouvez chercher «
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
				recipe.description.toLowerCase().includes(value.toLowerCase())
		);
		displayRecipes(newRecipes, value);
	}
});
searchInput.addEventListener("input", (e) => {
	if (e.target.value === "") {
		displayRecipes(recipesArray, "");
	}
});

const tagsWrapper = document.getElementById("tagsContainer");
const tagTemplate = document.querySelector("[data-tags-template]");
function displayTags() {
	const tag = tagTemplate.content.cloneNode(true).children[0];
	tag.innerHTML = `${searchInput.value}<button
	type="button"
	class="btn bi bi-x-lg p-0 float-end"
	></button>`;
	tagsWrapper.append(tag);
}
function removeTags() {
	const button = tagsWrapper.querySelector("button");
	button.addEventListener("click", (e) => {
		e.target.parentNode.remove();
		toggleRecipes("");
	});
}

displayRecipes(recipesArray, "");
