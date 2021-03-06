import AbstractComponent from './abstract';
import {runtimeFormat} from '../utils';
import moment from 'moment';

const DESCRIPTION_MAX_LENGTH = 140;

const makeShortFilmDescription = (description) => {
  let shortDescription = description;

  if (description.length > DESCRIPTION_MAX_LENGTH) {
    shortDescription = description.slice(0, DESCRIPTION_MAX_LENGTH) + `...`;
  }

  return shortDescription;
};

const createFilmCardTemplate = (film) => {
  const filterActiveClass = `film-card__controls-item--active`;
  const watchedClass = film.userDetails.alreadyWatched ? filterActiveClass : ``;
  const watchlistClass = film.userDetails.watchlist ? filterActiveClass : ``;
  const favoriteClass = film.userDetails.favorite ? filterActiveClass : ``;
  const shortDescription = makeShortFilmDescription(film.description);
  const genre = film.genres.size ? Array.from(film.genres)[0] : ``;
  const year = moment(film.releaseDate).format(`YYYY`);

  return `
    <article class="film-card">
      <h3 class="film-card__title">${film.title}</h3>
      <p class="film-card__rating">${film.rating}</p>
      <p class="film-card__info">
        <span class="film-card__year">${year}</span>
        <span class="film-card__duration">${runtimeFormat(film.runtime)}</span>
        <span class="film-card__genre">${genre}</span>
      </p>
      <img src="${film.poster}" alt="${film.title}" class="film-card__poster">
      <p class="film-card__description">${shortDescription}</p>
      <a class="film-card__comments">${film.commentsCount} comments</a>
      <form class="film-card__controls">
        <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist ${watchlistClass}">Add to watchlist</button>
        <button class="film-card__controls-item button film-card__controls-item--mark-as-watched ${watchedClass}">Mark as watched</button>
        <button class="film-card__controls-item button film-card__controls-item--favorite ${favoriteClass}">Mark as favorite</button>
      </form>
    </article>
  `;
};

export default class FilmCardComponent extends AbstractComponent {
  constructor(film) {
    super();
    this._film = film;
  }

  getTemplate() {
    return createFilmCardTemplate(this._film);
  }

  setOpenPopupListeners(handler) {
    this.getElement().querySelectorAll(`.film-card__poster, .film-card__comments, .film-card__title`)
      .forEach((element) => element.addEventListener(`click`, handler));
  }

  setAddToWatchListListener(handler) {
    this.getElement().querySelector(`.film-card__controls-item--add-to-watchlist`).addEventListener(`click`, (e) => {
      e.preventDefault();
      handler(e, this._film);
    });
  }

  setMarkAsWatchedListener(handler) {
    this.getElement().querySelector(`.film-card__controls-item--mark-as-watched`).addEventListener(`click`, (e) => {
      e.preventDefault();
      handler(e, this._film);
    });
  }

  setAddToFavoritesListener(handler) {
    this.getElement().querySelector(`.film-card__controls-item--favorite`).addEventListener(`click`, (e) => {
      e.preventDefault();
      handler(e, this._film);
    });
  }
}
