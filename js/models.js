export class cardRecipe {
	constructor(recipe) {
		this._id = recipe.id;
		this._name = recipe.name;
		this._description = recipe.description;
		this._time = recipe.time;
		this._image = recipe.image;
		this._appliance = recipe.appliance;
		this._ingredients = recipe.ingredients;
		this._ustensils = recipe.ustensils;
	}

	cardTemplate() {
		const card = document.createElement("article");
		card.setAttribute("class", "col-4");
		const template = `<div class="card mb-3 position-relative">
					<img src="/assets/photos/${this._image}" class="card-img-top" alt="" data-recipe-img />
					<span
						data-recipe-time
						class="w-25 position-absolute top-25 end-25 rounded-pill text-center bg-warning"
					>${this._time}min</span>
					<div class="card-body h-550px">
						<h5 class="card-title" data-recipe-title>${this._name}</h5>
						<p class="text-body-secondary text-uppercase">
							Recette
						</p>
						<p
							class="h-150px card-text text-wrap text-truncate"
							data-recipe-desc
						>${this._description}</p>
						<p class="text-body-secondary text-uppercase">
							Ingrédients
						</p>
						<div class="row" id="ingredientsRecipe-${this._id}"></div>
					</div>
				</div>`;
		card.innerHTML = template;
		return card;
	}

	ingredientsTemplate() {
		this._ingredients.forEach((element) => {
			const ingredientsContainer = document.getElementById(
				`ingredientsRecipe-${this._id}`
			);
			ingredientsContainer.innerHTML += `<div class="col-6">
                  <p class="mb-0 card-text small" data-ingredient-title>${
						element.ingredient
					}</p>
            <small class="text-body-secondary">${element.quantity ?? ""}</small>
            <small class="text-body-secondary">${element.unit ?? ""}</small>`;
		});
	}
}

export class filterList {
	constructor(data) {
		this._name = data;
	}

	filterTemplate() {
		const list = document.createElement("li");
		const template = `<a class="dropdown-item" href="#" data-filter-link>${this._name.toLowerCase()}</a>`;
		list.innerHTML = template;
		return list;
	}
	buttonTemplate() {
		const template = document.createElement("button");
		template.setAttribute("type", "button");
		template.setAttribute("data-button-remove", true);
		template.classList.add(
			"btn",
			"position-absolute",
			"p-0",
			"top-5",
			"end-5",
			"bi",
			"bi-x-circle-fill"
		);
		return template;
	}
}

export class tagsList {
	constructor(string) {
		this._value = string;
	}

	createTag() {
		const tag = document.createElement("div");
		tag.setAttribute("class", "bg-warning rounded p-2 me-3");
		const template = `${this._value}<button type="button" class="btn bi bi-x-lg p-0 float-end" data-button-remove></button>`;
		tag.innerHTML = template;
		return tag;
	}
}
