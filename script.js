document.addEventListener("DOMContentLoaded", () => {
  const genresList = ["Action", "Adventure", "Comedy", "Drama", "Romance", "Horror", "Animation", "Fantasy"];
  let movies = [];
  let genres = {};

  const contentDiv = document.getElementById("content");
  const searchInput = document.getElementById("search");
  const backToTopButton = document.getElementById("back-to-top");
  const errorMessage = document.getElementById("error-message");

  // Fetch movies data
  fetch('movies.json')
    .then(response => response.json())
    .then(data => {
      movies = data;
      genres = groupMoviesByGenre(movies);
      renderContent();
    })
    .catch(error => {
      console.error('Error fetching movies:', error);
      errorMessage.classList.remove('hidden');
    });

  // Group movies by genre
  function groupMoviesByGenre(movies) {
    const groupedGenres = {};
    genresList.forEach(genre => groupedGenres[genre] = []);
    movies.forEach(movie => {
      if (movie.Genre) {
        movie.Genre.split(', ').forEach(genre => {
          if (groupedGenres[genre]) {
            groupedGenres[genre].push(movie);
          }
        });
      }
    });
    return groupedGenres;
  }

  // Shuffle array elements
  function shuffleArray(array) {
    return array.sort(() => Math.random() - 0.5);
  }

  // Render content
  function renderContent() {
    contentDiv.innerHTML = '';
    errorMessage.classList.add('hidden');

    // Render genres
    Object.keys(genres).forEach(genre => {
      const genreSection = document.createElement("div");
      genreSection.classList.add("genre-section");

      const genreTitle = document.createElement("h2");
      genreTitle.classList.add("genre-title");
      genreTitle.textContent = genre;
      genreSection.appendChild(genreTitle);

      const genreRow = document.createElement("div");
      genreRow.classList.add("genre-row");

      shuffleArray(genres[genre]).slice(0, 15).forEach(movie => {
        const movieCard = createMovieCard(movie);
        genreRow.appendChild(movieCard);
      });

      const showMore = document.createElement("div");
      showMore.classList.add("show-more");
      showMore.innerHTML = '<span>→</span>';
      showMore.onclick = () => alert(`Show more movies for genre: ${genre}`);
      genreRow.appendChild(showMore);

      genreSection.appendChild(genreRow);
      contentDiv.appendChild(genreSection);
    });

    // Render "All Movies" section
    const allMoviesSection = document.createElement("div");
    allMoviesSection.classList.add("all-movies-section");

    const allMoviesTitle = document.createElement("h2");
    allMoviesTitle.classList.add("genre-title");
    allMoviesTitle.textContent = "All Movies";
    allMoviesSection.appendChild(allMoviesTitle);

    const allMoviesGrid = document.createElement("div");
    allMoviesGrid.classList.add("all-movies-grid");

    const filteredMovies = filterMoviesBySearch();
    shuffleArray(filteredMovies).forEach(movie => {
      const movieCard = createMovieCard(movie);
      allMoviesGrid.appendChild(movieCard);
    });

    allMoviesSection.appendChild(allMoviesGrid);
    contentDiv.appendChild(allMoviesSection);
  }

  // Create movie card
  function createMovieCard(movie) {
    const movieCard = document.createElement("div");
    movieCard.classList.add("movie-card");

    const movieImg = document.createElement("img");
    movieImg.src = movie.imageUrl;
    movieImg.alt = movie.title;

    const movieCardContent = document.createElement("div");
    movieCardContent.classList.add("movie-card-content");

    const movieTitle = document.createElement("h3");
    movieTitle.classList.add("movie-card-title");
    movieTitle.textContent = movie.title;

    const movieDescription = document.createElement("p");
    movieDescription.classList.add("movie-card-description");
    movieDescription.textContent = movie.Genre ? movie.Genre : 'No genres available';

    movieCardContent.appendChild(movieTitle);
    movieCardContent.appendChild(movieDescription);

    movieCard.appendChild(movieImg);
    movieCard.appendChild(movieCardContent);

    return movieCard;
  }

  // Filter movies by search
  function filterMoviesBySearch() {
    const query = searchInput.value.toLowerCase().replace(/\s+/g, '');
    return movies.filter(movie => 
      movie.title.toLowerCase().replace(/\s+/g, '').includes(query)
    );
  }

  // Search functionality with debouncing
  let debounceTimeout;
  searchInput.addEventListener("input", () => {
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(renderContent, 300);
  });

  // Back to top button visibility
  window.addEventListener("scroll", () => {
    if (window.scrollY > 300) {
      backToTopButton.classList.add("visible");
    } else {
      backToTopButton.classList.remove("visible");
    }
  });

  // Smooth scroll for back-to-top button
  backToTopButton.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
});