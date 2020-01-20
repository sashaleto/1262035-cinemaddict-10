import UserProfile from './components/user-profile';
import NavigationComponent from './components/main-navigation';
import MainFiltersComponent from './components/main-filters';
import BoardComponent from './components/board';
import FilmListComponent from './components/films-list';
import FilmCardComponent from './components/film-card';
import FilmPopupComponent from './components/film-popup';
import ShowMoreComponent from './components/show-more-button';
import NoFilmsComponent from './components/no-films';

import {getWatchedFilmsCount, render, sortFilmsBy} from './utils';
import {RenderPosition} from './constants';

import {generateFilms} from "./moks/films";
import {NAVIGATION} from "./moks/main-navigation";
import {generateComments} from "./moks/comment";

const FILMS_COUNT = 23;
const EXTRA_FILMS_COUNT = 2;
const INITIALLY_SHOWN_FILMS_COUNT = 5;
const NEXT_SHOWN_FILMS_COUNT = 5;

const bodyElement = document.querySelector(`body`);
const mainElement = document.querySelector(`.main`);
const headerElement = document.querySelector(`.header`);
const footerElement = document.querySelector(`.footer`);

const films = generateFilms(FILMS_COUNT);
const userRating = getWatchedFilmsCount(films);

render(headerElement, new UserProfile(userRating).getElement(), RenderPosition.BEFOREEND);
render(mainElement, new NavigationComponent(NAVIGATION, films).getElement(), RenderPosition.BEFOREEND);
render(mainElement, new MainFiltersComponent().getElement(), RenderPosition.BEFOREEND);

const boardElement = new BoardComponent().getElement();
render(mainElement, boardElement, RenderPosition.BEFOREEND);

const allFilmsComponent = new FilmListComponent(`films-list`, `All movies. Upcoming`, true);

render(boardElement, allFilmsComponent.getElement(), RenderPosition.BEFOREEND);

const allFilmsContainer = allFilmsComponent.getElement().querySelector(`.films-list .films-list__container`);

if (films.length) {
  let lastShownFilmNumber = INITIALLY_SHOWN_FILMS_COUNT;

  const renderFilm = (film, container) => {
    const filmComponent = new FilmCardComponent(film);
    const filmComments = generateComments(4);
    const filmPopupComponent = new FilmPopupComponent(film, filmComments);

    render(container, filmComponent.getElement(), RenderPosition.BEFOREEND);

    const popupOpenElements = filmComponent.getElement().querySelectorAll(`.film-card__poster, .film-card__comments, .film-card__title`);

    const showPopup = () => {
      render(bodyElement, filmPopupComponent.getElement(), RenderPosition.BEFOREEND);
      const closePopupBtn = filmPopupComponent.getElement().querySelector(`.film-details__close-btn`);
      closePopupBtn.addEventListener(`click`, removePopup);
      document.addEventListener(`keydown`, onEscKeyDown);
    };

    const removePopup = () => {
      bodyElement.removeChild(filmPopupComponent.getElement());
      document.removeEventListener(`keydown`, onEscKeyDown);
    };

    const onEscKeyDown = (evt) => {
      const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

      if (isEscKey) {
        removePopup();
      }
    };

    popupOpenElements.forEach((element) => element.addEventListener(`click`, showPopup));
  };

  const renderExtraFilms = (property, title) => {
    const extraFilms = sortFilmsBy(films, property).slice(0, EXTRA_FILMS_COUNT);
    if (extraFilms[0][property] > 0) {
      const extraFilmsListComponent = new FilmListComponent(`films-list--extra`, title, false);
      const extraFilmsContainer = extraFilmsListComponent.getElement().querySelector(`.films-list__container`);

      render(boardElement, extraFilmsListComponent.getElement(), RenderPosition.BEFOREEND);
      for (let i = 0; i < EXTRA_FILMS_COUNT; i++) {
        renderFilm(extraFilms[i], extraFilmsContainer);
      }
    }
  };

  // Отрисовка блока "All Films"
  films.slice(0, lastShownFilmNumber).forEach((film) => renderFilm(film, allFilmsContainer));

  // Отрисовка блока "Top Rated Films"
  renderExtraFilms(`rating`, `Top rated`);

  // Отрисовка блока "Top Commented Films"
  renderExtraFilms(`commentsCount`, `Most commented`);

  // Добавление/скрытие кнопки "Загрузить еще"
  if (films.length >= INITIALLY_SHOWN_FILMS_COUNT) {
    const allFilmsList = allFilmsComponent.getElement();
    const showMoreComponent = new ShowMoreComponent();
    const showMoreButton = showMoreComponent.getElement();

    render(allFilmsList, showMoreButton, RenderPosition.BEFOREEND);

    showMoreButton.addEventListener(`click`, () => {
      const increasedFilmNumber = lastShownFilmNumber + NEXT_SHOWN_FILMS_COUNT;

      films.slice(lastShownFilmNumber, increasedFilmNumber).forEach((film) => renderFilm(film, allFilmsContainer));
      lastShownFilmNumber = increasedFilmNumber;

      if (increasedFilmNumber >= films.length) {
        showMoreButton.remove();
        showMoreComponent.removeElement();
      }
    });
  }
} else {
  const noFilmsComponent = new NoFilmsComponent();
  render(allFilmsContainer, noFilmsComponent.getElement(), RenderPosition.BEFOREEND);
}
footerElement.querySelector(`.footer__statistics`).innerHTML = `<p>${films.length} movies inside</p>`;
