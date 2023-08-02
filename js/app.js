const modal = document.getElementById("modal");
const showBtn = document.getElementById("show-btn");
const closeBtn = document.getElementById("close-btn");
const overlay = document.getElementById("overlay");
const main = document.getElementById("main");
const form = document.getElementById("form");
const search = document.getElementById("search");
const img = "http://image.tmdb.org/t/p/w/80";
let searchValue = "";

const API_KEY = "ce762116";

form.addEventListener("submit", (e) => {
  e.preventDefault();
  searchValue = search.value.trim();

  if (searchValue && searchValue !== "") {
    const URL = `https://omdbapi.com/?s=${searchValue}&page=1&apikey=${API_KEY}`;
    getMovies(URL);
    search.value = "";
  } else {
    window.location.reload();
  }
});

async function getMovies(url) {
  try {
    const res = await fetch(url);
    const data = await res.json();
    showMovies(data.Search);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

// add classList hidden
const addHidden = () => {
  modal.classList.add("hidden");
  overlay.classList.add("hidden");
};

// remove classList hidden
const removeHidden = () => {
  overlay.classList.remove("hidden");
  modal.classList.remove("hidden");
  console.log("clicked");
};



closeBtn.addEventListener("click", addHidden);

overlay.addEventListener("click", addHidden);

document.addEventListener("keydown", (e) => {
  if (e.key == "Escape") {
    addHidden();
  }
});

function showMovies(movies) {
  movies.forEach((movie) => {
    const { Title, Poster, Type, Year, imdbID } = movie;

    const moviEl = document.createElement("div");
    moviEl.classList.add("movie");
    moviEl.innerHTML = `
      <img src="${Poster}" alt="${Title}">
      <div class="movie-info">
        <h3>${Title}</h3>
        <span>${Type}</span>
      </div>
      <div class="overview" data-id="${imdbID}">
        ${Year}
        <button class="btn show-btn" onclick="getOneMovie('${imdbID}')">
          More info
        </button>
      </div>
    `;
    main.appendChild(moviEl);
  });
}

async function getOneMovie(imdbID) {
  try {
    const result = await fetch(
      `http://www.omdbapi.com/?i=${imdbID}&apikey=${API_KEY}`
    );
    const movieDetails = await result.json();
    console.log(movieDetails);
    const modalBody = document.querySelector(".modal-body");
    modalBody.innerHTML = `
      <h2 class="modal-title"> ${movieDetails.Title}</h2>
      <p class="title"> Actors:${movieDetails.Actors}</p>
      <p class="title">Year: ${movieDetails.Year}</p>
      <p class="title">Type: ${movieDetails.Type}</p>
      <p class="title">IMDb Rating: ${movieDetails.imdbRating}</p>
      <p class="title"> Plot: ${movieDetails.Plot}</p>
    `;

    // Show the modal by removing the hidden class
    modal.classList.remove("hidden");
    overlay.classList.remove("hidden");
  } catch (error) {
    console.error("Error fetching movie details:", error);
  }
}
