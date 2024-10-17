const apiKey = 'b0b1f439754e40258ec0045a682c6c56'; // Replace with your API key
let currentPage = 1;
let query = '';
let dietFilter = '';

document.getElementById('search-form').addEventListener('submit', function(event) {
    event.preventDefault();
    query = document.getElementById('search-input').value;
    dietFilter = document.getElementById('diet-filter').value;
    currentPage = 1;
    fetchRecipes(query, currentPage, dietFilter);
});

function fetchRecipes(query, page = 1, diet = '') {
    const apiUrl = `https://api.spoonacular.com/recipes/complexSearch?query=${query}&number=6&offset=${(page - 1) * 6}&diet=${diet}&apiKey=${apiKey}&addRecipeInformation=true`;
    
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            displayRecipes(data.results);
            setupPagination(data.totalResults);
        })
        .catch(error => console.log('Error:', error));
}

function displayRecipes(recipes) {
    const recipeList = document.getElementById('recipe-list');
    recipeList.innerHTML = '';

    recipes.forEach(recipe => {
        const recipeDiv = document.createElement('div');
        recipeDiv.classList.add('recipe');

        recipeDiv.innerHTML = `
            <img src="${recipe.image}" alt="${recipe.title}">
            <h2>${recipe.title}</h2>
            <p><strong>Ingredients:</strong> ${recipe.missedIngredients?.map(i => i.name).join(', ') || 'N/A'}</p>
            <p><strong>Instructions:</strong> <a href="${recipe.sourceUrl}" target="_blank">View Instructions</a></p>
            <button onclick="saveToFavorites('${recipe.id}', '${recipe.title}', '${recipe.image}')">Add to Favorites</button>
        `;

        recipeList.appendChild(recipeDiv);
    });
}

function saveToFavorites(id, title, image) {
    const favorites = JSON.parse(localStorage.getItem('favoriteRecipes')) || [];
    
    if (favorites.some(fav => fav.id === id)) {
        alert('Recipe already in favorites!');
        return;
    }
    
    favorites.push({ id, title, image });
    localStorage.setItem('favoriteRecipes', JSON.stringify(favorites));
    displayFavorites();
}

function displayFavorites() {
    const favorites = JSON.parse(localStorage.getItem('favoriteRecipes')) || [];
    const favoriteList = document.getElementById('favorite-recipes');
    favoriteList.innerHTML = '';

    favorites.forEach(fav => {
        const favDiv = document.createElement('div');
        favDiv.classList.add('favorite');

        favDiv.innerHTML = `
            <img src="${fav.image}" alt="${fav.title}">
            <h2>${fav.title}</h2>
            <button onclick="removeFromFavorites('${fav.id}')">Remove from Favorites</button>
        `;

        favoriteList.appendChild(favDiv);
    });
}

function removeFromFavorites(id) {
    let favorites = JSON.parse(localStorage.getItem('favoriteRecipes')) || [];
    favorites = favorites.filter(fav => fav.id !== id);
    localStorage.setItem('favoriteRecipes', JSON.stringify(favorites));
    displayFavorites();
}

function setupPagination(totalResults) {
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = '';
    const totalPages = Math.ceil(totalResults / 6);
    
    for (let i = 1; i <= totalPages; i++) {
        const button = document.createElement('button');
        button.classList.add('pagination-button');
        button.innerText = i;
        button.addEventListener('click', () => fetchRecipes(query, i, dietFilter));
        
        pagination.appendChild(button);
    }
}

// Initialize favorites on page load
window.onload = function() {
    displayFavorites();
};