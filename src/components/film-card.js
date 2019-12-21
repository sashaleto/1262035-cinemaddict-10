export const createFilmCardTemplate = (film) => {
  const filterActiveClass = `film-card__controls-item--active`;
  const watchedClass = film.userDetails.alreadyWatched ? filterActiveClass : ``;
  const watchlistClass = film.userDetails.watchlist ? filterActiveClass : ``;
  const favoriteClass = film.userDetails.watchingDate ? filterActiveClass : ``;

  return `
    <article class="film-card">
      <h3 class="film-card__title">${film.title}</h3>
      <p class="film-card__rating">${film.rating}</p>
      <p class="film-card__info">
        <span class="film-card__year">${film.year}</span>
        <span class="film-card__duration">${film.runtime}</span>
        <span class="film-card__genre">${Array.from(film.genres)[0]}</span>
      </p>
      <img src="${film.poster}" alt="${film.title}" class="film-card__poster">
      <p class="film-card__description">${film.description}</p>
      <a class="film-card__comments">${film.commentsCount} comments</a>
      <form class="film-card__controls">
        <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist ${watchlistClass}">Add to watchlist</button>
        <button class="film-card__controls-item button film-card__controls-item--mark-as-watched ${watchedClass}">Mark as watched</button>
        <button class="film-card__controls-item button film-card__controls-item--favorite ${favoriteClass}">Mark as favorite</button>
      </form>
    </article>
  `;
};
