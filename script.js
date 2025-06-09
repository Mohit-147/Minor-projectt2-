document.addEventListener('DOMContentLoaded', () => {
    document.getElementById("searchButton").addEventListener("click", function () {
      const query = document.getElementById("searchInput").value;
      if (query.trim() !== "") {
        fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`)
          .then(response => response.json())
          .then(data => displayResults(data.meals))
          .catch(error => console.error("Error fetching data:", error));
      } else {
        alert("Please enter a recipe name to search!");
      }
    });
  
    function displayResults(meals) {
      const resultDiv = document.getElementById("result");
      resultDiv.innerHTML = "";
  
      if (!meals) {
        resultDiv.innerHTML = "<p>No recipes found. Try another search!</p>";
        return;
      }
  
      meals.forEach(meal => {
        const mealCard = document.createElement("div");
        mealCard.innerHTML = `
          <h2>${meal.strMeal}</h2>
          <img src="${meal.strMealThumb}" alt="${meal.strMeal}" width="300">
          <p><strong>Category:</strong> ${meal.strCategory}</p>
          <p><strong>Area:</strong> ${meal.strArea}</p>
        `;
        const button = document.createElement('button');
        button.textContent = 'View Recipe';
        button.onclick = () => window.open(`https://www.themealdb.com/meal/${meal.idMeal}`, '_blank');
        mealCard.appendChild(button);
        resultDiv.appendChild(mealCard);
      });
    }
  
    // Initial "Chicken" recipes
    const container = document.getElementById('recipes');
    fetch('https://www.themealdb.com/api/json/v1/1/filter.php?c=Chicken')
      .then(res => res.json())
      .then(data => {
        const meals = data.meals.slice(0, 4);
        meals.forEach(meal => {
          const card = document.createElement('div');
          card.className = 'recipe-card';
          card.innerHTML = `
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
            <h3>${meal.strMeal}</h3>
            <a href="https://www.themealdb.com/meal/${meal.idMeal}" target="_blank">View Recipe</a>
          `;
          container.appendChild(card);
        });
      })
      .catch(err => console.error("Error loading recipes:", err));
  
    // Carousel of meals by letter
    const mealcontainer = document.getElementById("mealContainer");
    let allMeals = [];
    let currentIndex = 0;
  
    async function fetchMeals() {
      const res = await fetch("https://www.themealdb.com/api/json/v1/1/search.php?f=c");
      const data = await res.json();
      allMeals = data.meals || [];
      renderMeals();
    }
  
    function renderMeals() {
      mealcontainer.innerHTML = "";
      const visibleMeals = allMeals.slice(currentIndex, currentIndex + 4);
      visibleMeals.forEach(meal => {
        const mealDiv = document.createElement("div");
        mealDiv.className = "meal";
        mealDiv.innerHTML = `
          <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
          <h4>${meal.strMeal}</h4>
        `;
        mealcontainer.appendChild(mealDiv);
      });
    }
  
    document.getElementById("nextBtn").addEventListener("click", () => {
      if (currentIndex + 4 < allMeals.length) {
        currentIndex += 4;
        renderMeals();
      }
    });
  
    document.getElementById("prevBtn").addEventListener("click", () => {
      if (currentIndex - 4 >= 0) {
        currentIndex -= 4;
        renderMeals();
      }
    });
  
    fetchMeals();
  
    // Trending Recipes by Category
    const buttons = document.querySelectorAll('.category-buttons button');
    const recipesContainer = document.querySelector('.trending-recipes');
  
    buttons.forEach(button => {
      button.addEventListener('click', () => {
        document.querySelector('.category-buttons .active')?.classList.remove('active');
        button.classList.add('active');
  
        const category = button.getAttribute('data-category');
        fetchRecipes(category);
      });
    });
  
    async function fetchRecipes(category) {
      recipesContainer.innerHTML = 'Loading...';
  
      try {
        const res = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`);
        const data = await res.json();
        const meals = data.meals.slice(0, 4);
  
        recipesContainer.innerHTML = meals.map(meal => `
          <div class="recipe-card">
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
            <h3>${meal.strMeal.replace(/ /g, '<br>')}</h3>
          </div>
        `).join('');
      } catch (error) {
        console.error('Failed to fetch meals:', error);
        recipesContainer.innerHTML = '<p>Failed to load recipes.</p>';
      }
    }
    fetchRecipes('Pasta');
  });

  
