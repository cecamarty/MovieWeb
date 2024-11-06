// Wait until the DOM is fully loaded before executing script
document.addEventListener("DOMContentLoaded", () => {

  // Define list of genres
  const genresList = ["Action", "Adventure", "Comedy", "Drama", "Romance", "Horror", "Animation", "Fantasy"];
  let movies = []; // Array to hold movie data from JSON
  let genres = {}; // Object to store movies grouped by genre

  // Get references to DOM elements
  const contentDiv = document.getElementById("content");
  const searchInput = document.getElementById("search");
  const backToTopButton = document.getElementById("back-to-top");
  const errorMessage = document.getElementById("error-message");

  // Fetch movies data from movies.json file
  fetch('movies.json')
    .then(response => response.json())
    .then(data => {
      movies = data;  // Store the fetched movie data
      genres = groupMoviesByGenre(movies);  // Group movies by genre
      renderContent();  // Render the initial content on the page
    })
    .catch(error => {
      console.error('Error fetching movies:', error);  // Log error in console
      errorMessage.classList.remove('hidden');  // Display error message to user
    });

  // Function to group movies by genre
  function groupMoviesByGenre(movies) {
    const groupedGenres = {};  // Object to hold genre groups

    // Initialize an empty array for each genre in genresList
    genresList.forEach(genre => groupedGenres[genre] = []);

    // Add movies to their respective genre arrays
    movies.forEach(movie => {
      if (movie.Genre) {
        movie.Genre.split(', ').forEach(genre => {
          if (groupedGenres[genre]) {
            groupedGenres[genre].push(movie);  // Add movie to the relevant genre
          }
        });
      }
    });
    return groupedGenres;  // Return grouped movies
  }

  // Function to shuffle elements in an array randomly
  function shuffleArray(array) {
    return array.sort(() => Math.random() - 0.5);  // Randomize array order
  }

  // Function to render the main content, including genres and movies
  function renderContent() {
    contentDiv.innerHTML = '';  // Clear any previous content
    errorMessage.classList.add('hidden');  // Hide error message, if visible

    // Loop through each genre and render its section
    Object.keys(genres).forEach(genre => {
      const genreSection = document.createElement("div");  // Create genre section
      genreSection.classList.add("genre-section");

      const genreTitle = document.createElement("h2");  // Create genre title
      genreTitle.classList.add("genre-title");
      genreTitle.textContent = genre;
      genreSection.appendChild(genreTitle);

      const genreRow = document.createElement("div");  // Create row to hold movie cards
      genreRow.classList.add("genre-row");

      // Shuffle and display up to 15 movies for the genre
      shuffleArray(genres[genre]).slice(0, 15).forEach(movie => {
        const movieCard = createMovieCard(movie);  // Create movie card
        genreRow.appendChild(movieCard);
      });

      // "Show More" button to view more movies in this genre
      const showMore = document.createElement("div");
      showMore.classList.add("show-more");
      showMore.innerHTML = '<span>→</span>';
      showMore.onclick = () => renderGenreMovies(genre);  // Render all movies in this genre
      genreRow.appendChild(showMore);

      genreSection.appendChild(genreRow);
      contentDiv.appendChild(genreSection);
    });

    // Render the "All Movies" section with search filter applied
    const allMoviesSection = document.createElement("div");
    allMoviesSection.classList.add("all-movies-section");

    const allMoviesTitle = document.createElement("h2");
    allMoviesTitle.classList.add("genre-title");
    allMoviesTitle.textContent = "All Movies";
    allMoviesSection.appendChild(allMoviesTitle);

    const allMoviesGrid = document.createElement("div");  // Grid to hold all movie cards
    allMoviesGrid.classList.add("all-movies-grid");

    const filteredMovies = filterMoviesBySearch();  // Apply search filter to movies
    shuffleArray(filteredMovies).forEach(movie => {
      const movieCard = createMovieCard(movie);  // Create movie card
      allMoviesGrid.appendChild(movieCard);
    });

    allMoviesSection.appendChild(allMoviesGrid);
    contentDiv.appendChild(allMoviesSection);
  }

  // Function to render all movies within a single genre
  function renderGenreMovies(genre) {
    contentDiv.innerHTML = '';  // Clear previous content

    const genreSection = document.createElement("div");  // Create section for genre
    genreSection.classList.add("all-movies-section");

    const genreTitle = document.createElement("h2");  // Title for genre
    genreTitle.classList.add("genre-title");
    genreTitle.textContent = genre;
    genreSection.appendChild(genreTitle);

    const genreGrid = document.createElement("div");  // Grid for movie cards
    genreGrid.classList.add("all-movies-grid");

    genres[genre].forEach(movie => {
      const movieCard = createMovieCard(movie);  // Create movie card
      genreGrid.appendChild(movieCard);
    });

    genreSection.appendChild(genreGrid);
    contentDiv.appendChild(genreSection);
  }

  // Function to create an individual movie card element
  function createMovieCard(movie) {
    const movieCard = document.createElement("div");  // Movie card container
    movieCard.classList.add("movie-card");

    const movieImg = document.createElement("img");  // Movie image
    movieImg.src = movie.imageUrl;
    movieImg.alt = movie.title;

    const movieCardContent = document.createElement("div");  // Movie card content container
    movieCardContent.classList.add("movie-card-content");

    const movieTitle = document.createElement("h3");  // Movie title
    movieTitle.classList.add("movie-card-title");
    movieTitle.textContent = movie.title;

    const movieDescription = document.createElement("p");  // Movie genre description
    movieDescription.classList.add("movie-card-description");
    movieDescription.textContent = movie.Genre ? movie.Genre : 'No genres available';

    movieCardContent.appendChild(movieTitle);  // Append title and description to content
    movieCardContent.appendChild(movieDescription);

    movieCard.appendChild(movieImg);  // Append image and content to movie card
    movieCard.appendChild(movieCardContent);

    return movieCard;  // Return the completed movie card
  }

  // Function to filter movies based on the search query
  function filterMoviesBySearch() {
    const query = searchInput.value.toLowerCase().replace(/\s+/g, '');  // Clean search query
    return movies.filter(movie => 
      movie.title.toLowerCase().replace(/\s+/g, '').includes(query)
    );  // Return movies that match the query
  }

  // Debounced search functionality for better performance
  let debounceTimeout;
  searchInput.addEventListener("input", () => {
    clearTimeout(debounceTimeout);  // Clear previous timeout
    debounceTimeout = setTimeout(renderContent, 300);  // Wait 300ms before triggering search
  });
  
  // Show/hide "Back to Top" button based on scroll position
  window.addEventListener("scroll", () => {
    if (window.scrollY > 300) {
      backToTopButton.classList.add("visible");
    } else {
      backToTopButton.classList.remove("visible");
    }
  });

  // Smooth scroll to top when "Back to Top" button is clicked
  backToTopButton.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
});