const API_URL = 'https://api.tvmaze.com/search/shows?q=';

document.addEventListener('DOMContentLoaded', () => {
    const searchButton = document.getElementById('search-button');
    const searchInput = document.getElementById('search-input');
    const searchResultsDiv = document.getElementById('search-results');
    const favoritesButton = document.getElementById('favorites-button');
    
    // Event listener for the search button click
    searchButton.addEventListener('click', () => {
        const query = searchInput.value.trim(); // Get the search query from the input
        if (query) {
            fetchSearchResults(query); // Call the function to fetch and display search results
        }
    });

    // Fetch results from TVMaze API
    async function fetchSearchResults(query) {
        try {
            const response = await fetch(API_URL + encodeURIComponent(query));
            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();
            displaySearchResults(data);
        } catch (error) {
            console.error('Error fetching search results:', error);
            searchResultsDiv.innerHTML = '<p>Failed to load results.</p>';
        }
    }

    // Display search results in the grid
    function displaySearchResults(data) {
        searchResultsDiv.innerHTML = ''; // Clear previous search results
        if (data.length === 0) {
            searchResultsDiv.innerHTML = '<p>No results found.</p>';
            return;
        }

        const limitedData = data.slice(0, 7); // Limit to 7 results for now

        limitedData.forEach(item => {
            const show = item.show;
            const contentItem = document.createElement('div');
            contentItem.className = 'content-item';

            // Create show content dynamically
            contentItem.innerHTML = `
                <img src="${show.image ? show.image.medium : 'https://via.placeholder.com/150'}" alt="${show.name}">
                <h3>${show.name}</h3>
                <p>${show.summary ? show.summary.replace(/(<([^>]+)>)/gi, "") : 'No description available.'}</p>
                <button class="favorite-btn" data-id="${show.id}">${isFavorite(show.id) ? 'Unfavorite' : 'Favorite'}</button>
            `;

            // Add click event to redirect to the show's page
            contentItem.addEventListener('click', () => {
                window.location.href = `show.html?id=${show.id}`;
            });

            // Handle favorite button
            const favoriteBtn = contentItem.querySelector('.favorite-btn');
            favoriteBtn.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevents the click from triggering the show page redirect
                toggleFavorite(show);
                favoriteBtn.textContent = isFavorite(show.id) ? 'Unfavorite' : 'Favorite';
            });

            searchResultsDiv.appendChild(contentItem);
        });
    }

    // Toggle favorite state (add/remove)
    function toggleFavorite(show) {
        let favorites = getFavorites();
        if (isFavorite(show.id)) {
            favorites = favorites.filter(fav => fav.id !== show.id); // Remove from favorites
        } else {
            favorites.push(show); // Add to favorites
        }
        localStorage.setItem('favorites', JSON.stringify(favorites));
    }

    // Check if a show is in the favorites
    function isFavorite(showId) {
        const favorites = getFavorites();
        return favorites.some(fav => fav.id === showId);
    }

    // Get favorites from localStorage
    function getFavorites() {
        return JSON.parse(localStorage.getItem('favorites')) || [];
    }

    // Display favorites on button click
    favoritesButton.addEventListener('click', () => {
        const favorites = getFavorites();
        if (favorites.length > 0) {
            displaySearchResults(favorites.map(fav => ({ show: fav })));
        } else {
            searchResultsDiv.innerHTML = '<p>No favorite shows yet.</p>';
        }
    });
});
