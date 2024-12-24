import {
	displayRecipes,
	displayFilters,
	recipesArray,
	cardsWrapper,
} from "./display.js";

/** searchBar */
const searchForm = document.getElementById("search");
const searchInput = document.getElementById("searchInput");
const message = document.querySelector("[data-message]");
let count = 0;
let newCount = 0;
function toggleRecipes() {
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
}
const tagsWrapper = document.getElementById("tagsContainer");
const tagTemplate = document.querySelector("[data-tags-template]");
searchForm.addEventListener("submit", (e) => {
	e.preventDefault();
	const tag = tagTemplate.content.cloneNode(true).children[0];
	tag.innerHTML = `${searchInput.value}<button
					type="button"
					class="btn bi bi-x-lg p-0 float-end"
				></button>`;
	tagsWrapper.append(tag);
	removeTags();
});
/** Removing tags  */
function removeTags() {
	const buttons = tagsWrapper.querySelector("button");
	buttons.addEventListener("click", (e) => {
		e.target.parentNode.remove();
	});
}
displayRecipes();
displayFilters();
toggleRecipes();
