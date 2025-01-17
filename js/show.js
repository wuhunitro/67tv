document.addEventListener('DOMContentLoaded', () => {
    const showDetailsDiv = document.getElementById('show-details');

    // Function to get query parameters from the URL
    function getQueryParam(param) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(param);
    }

    // Get the show ID from the URL
    const showId = getQueryParam('id');
    if (showId) {
        fetchShowDetails(showId);
    } else {
        showDetailsDiv.innerHTML = '<p>No show ID provided.</p>';
    }

    // Fetch show details using the TVMaze API
    async function fetchShowDetails(id) {
        try {
            const response = await fetch(`https://api.tvmaze.com/shows/${id}`);
            if (!response.ok) throw new Error('Network response was not ok');
            const show = await response.json();
            displayShowDetails(show);
        } catch (error) {
            console.error('Error fetching show details:', error);
            showDetailsDiv.innerHTML = '<p>Failed to load show details.</p>';
        }
    }

    // Display show details on the page
    function displayShowDetails(show) {
        showDetailsDiv.innerHTML = `
            <h2>${show.name}</h2>
            <img src="${show.image ? show.image.medium : 'https://via.placeholder.com/300'}" alt="${show.name}">
            <p><strong>Release Date:</strong> ${show.premiered ? show.premiered : 'N/A'}</p>
            <p>${show.summary ? show.summary : 'No summary available.'}</p>
            <p><a href="${show.officialSite ? show.officialSite : '#'}" target="_blank">Watch here</a></p>
            <p><a href=
        `;
    }
});
