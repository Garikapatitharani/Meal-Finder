// === DOM references ===
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const mealContainer = document.getElementById('meal-container');
const mealModal = document.getElementById('meal-modal');
const mealDetails = document.getElementById('meal-details');
const closeModal = document.getElementById('close-modal');
const categoryCards = document.getElementById('category-cards');
const sidebarCategories = document.getElementById('sidebar-categories');
const categoryInfo = document.getElementById('category-info');
const categoryTitle = document.getElementById('category-title');
const categoryDescription = document.getElementById('category-description');

// === 1. Load Categories ===
let allCategories = [];
fetch("https://www.themealdb.com/api/json/v1/1/categories.php")
  .then(res => res.json())
  .then(data => {
    allCategories = data.categories;

    allCategories.forEach(cat => {
      // Sidebar item
      const li = document.createElement('li');
      li.textContent = cat.strCategory;
      li.setAttribute('data-category', cat.strCategory);
      sidebarCategories.appendChild(li);

      li.addEventListener('click', () => {
        fetchMealsWithDescription(cat.strCategory);
        sidebar.classList.add('hidden');
        document.getElementById('all-categories').style.display = 'none';
      });

      // Main category card
      const card = document.createElement('div');
      card.className = 'category-card';
      card.innerHTML = `
        <img src="${cat.strCategoryThumb}" alt="${cat.strCategory}">
        <h4>${cat.strCategory}</h4>
      `;

      card.addEventListener('click', () => {
  const categoryName = cat.strCategory;
  const categoryDesc = cat.strCategoryDescription;

  fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${categoryName}`)
    .then(res => res.json())
    .then(data => {
      mealContainer.innerHTML = '';
      categoryTitle.textContent = categoryName;
      categoryDescription.textContent = categoryDesc;
      categoryInfo.style.display = 'block';

      if (data.meals && data.meals.length > 0) {
        const meals = data.meals;

        meals.forEach(meal => {
          const mealCard = document.createElement('div');
          mealCard.className = 'meal-card';

          const mealImg = document.createElement('img');
          mealImg.src = meal.strMealThumb;
          mealImg.alt = meal.strMeal;
          mealImg.classList.add('clickable-image');

          mealImg.addEventListener('click', () => {
            getMealDetails(meal.idMeal);
          });

          const mealTitle = document.createElement('h3');
          mealTitle.textContent = meal.strMeal;

          mealCard.appendChild(mealImg);
          mealCard.appendChild(mealTitle);
          mealContainer.appendChild(mealCard);
        });
      } else {
        mealContainer.innerHTML = '<p>No meals found for this category.</p>';
      }

      // ✅ Show meals section
      mealContainer.style.display = 'flex';
      document.querySelector('.hero').style.display = 'none';
      document.getElementById('meal-detail-page').classList.add('hidden');
      document.getElementById('all-categories').style.display = 'block';
    });
});
      categoryCards.appendChild(card);
    });
  });

  
// === 2. Sidebar Toggle ===
const toggleBtn = document.getElementById('toggle-btn');
const closeSidebar = document.getElementById('close-sidebar');
const sidebar = document.getElementById('sidebar');

toggleBtn.addEventListener('click', () => {
  sidebar.classList.remove('hidden');
});
closeSidebar.addEventListener('click', () => {
  sidebar.classList.add('hidden');
});

// === 3. Search ===
searchBtn.addEventListener('click', () => {
  const searchValue = searchInput.value.trim();
  if (searchValue) {
    categoryInfo.style.display = 'none';
      document.getElementById('all-categories').style.display = 'block';
    fetchMeals(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchValue}`);
  }
});

// === 4. Fetch Meals ===
function fetchMeals(url, categoryName = '', categoryDesc = '') {
  fetch(url)
    .then(res => res.json())
    .then(data => {
      mealContainer.innerHTML = '';

      if (categoryName && categoryDesc) {
        categoryTitle.textContent = categoryName;
        categoryDescription.textContent = categoryDesc;
        categoryInfo.style.display = 'block';
      } else {
        categoryInfo.style.display = 'none';
      }

      if (data.meals) {
        data.meals.forEach(meal => {
          const mealCard = document.createElement('div');
          mealCard.className = 'meal-card';

          const mealImg = document.createElement('img');
          mealImg.src = meal.strMealThumb;
          mealImg.alt = meal.strMeal;
          mealImg.classList.add('clickable-image');

          mealImg.addEventListener('click', () => {
            getMealDetails(meal.idMeal);
          });

          const mealTitle = document.createElement('h3');
          mealTitle.textContent = meal.strMeal;

          mealCard.appendChild(mealImg);
          mealCard.appendChild(mealTitle);
          mealContainer.appendChild(mealCard);
        });
      } else {
        mealContainer.innerHTML = '<p>No meals found.</p>';
      }
    });
}

function fetchMealsWithDescription(categoryName) {
  const category = allCategories.find(c => c.strCategory === categoryName);
  const desc = category ? category.strCategoryDescription : '';
  fetchMeals(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${categoryName}`, categoryName, desc);
}

// === 5. Get Meal Details ===
function getMealDetails(id) {
  categoryInfo.style.display = 'none';
  fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`)
    .then(res => res.json())
    .then(data => {
      const meal = data.meals[0];

      document.getElementById("meal-title").textContent = meal.strMeal;
      document.getElementById("meal-category").textContent = meal.strCategory;
          // Tags
      const mealTags = document.getElementById("meal-tags");
      if (meal.strTags) {
         mealTags.style.display = 'block';
         mealTags.textContent = `Tags: ${meal.strTags}`;
      } else {
         mealTags.style.display = 'none';
      }

        // Source
      const mealSource = document.getElementById("meal-source");
      if (meal.strSource) {
         mealSource.style.display = 'block';
         mealSource.innerHTML = `Source: <a href="${meal.strSource}" target="_blank">${meal.strSource}</a>`;
      } else {
         mealSource.style.display = 'none';
      }
      document.getElementById("meal-image").src = meal.strMealThumb;
      document.getElementById("meal-image").alt = meal.strMeal;

      const ingredientsList = document.getElementById("ingredients-list");
      ingredientsList.innerHTML = '';
      for (let i = 1; i <= 20; i++) {
        const ing = meal[`strIngredient${i}`];
        const meas = meal[`strMeasure${i}`];
        if (ing && ing.trim()) {
          const div = document.createElement("div");
          div.classList.add('ingredient-item');
          div.textContent=ing;
          ingredientsList.appendChild(div);
        }
      }

      const measurementList = document.getElementById("measurement-list");
      measurementList.innerHTML = "<h4>Measurements:</h4>";

      for (let i = 1; i <= 20; i++) {
       const ing = meal[`strIngredient${i}`];
       const meas = meal[`strMeasure${i}`];
      if (ing && ing.trim() && meas && meas.trim()) {
        const item = document.createElement("div");
        item.innerHTML = `<span class="orange-symbol">🔶</span> ${meas.trim()} - ${ing.trim()}`;
         measurementList.appendChild(item);
       }
      }

      const instructionsList = document.getElementById("instructions-list");
      instructionsList.innerHTML = '';
      const steps = meal.strInstructions.split('.').filter(s => s.trim());
      steps.forEach((step, index) => {
        const stepDiv = document.createElement('div');
        stepDiv.className = 'instruction-step';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = `step${index}`;

        const label = document.createElement('label');
        label.setAttribute('for', `step${index}`);
        label.textContent = step.trim() + '.';

        stepDiv.appendChild(checkbox);
        stepDiv.appendChild(label);
        instructionsList.appendChild(stepDiv);
      });

      document.getElementById('meal-container').style.display = 'none';
      document.querySelector('.hero').style.display = 'none';
      document.getElementById('meal-detail-page').classList.remove('hidden');
      document.getElementById('all-categories').style.display = 'block';
    });
}

// === 6. Modal Close ===
document.addEventListener('DOMContentLoaded', () => {
  closeModal.addEventListener('click', () => {
    mealModal.classList.add('hidden');
  });
});

// === 7. Home Link ===
document.getElementById('home-link').addEventListener('click', () => {
  document.getElementById('meal-container').style.display = 'none';
  document.getElementById('meal-detail-page').classList.add('hidden');
  document.querySelector('.hero').style.display = 'block';
  document.getElementById('all-categories').style.display = 'block';
});
