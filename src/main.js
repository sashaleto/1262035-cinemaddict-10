import UserProfile from './components/user-profile';
import NavigationComponent from './components/main-navigation';
import MainFiltersComponent from './components/main-filters';
import BoardComponent from './components/board';
import FilmListComponent from './components/films-list';
import FilmCardComponent from './components/film-card';
import FilmPopupComponent from './components/film-popup';
import ShowMoreComponent from './components/show-more-button';
import NoFilmsComponent from './components/no-films';

import {getWatchedFilmsCount, sortFilmsBy} from './utils';
import {RenderPosition, render, remove} from './utils/render';

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

render(headerElement, new UserProfile(userRating), RenderPosition.BEFOREEND);
render(mainElement, new NavigationComponent(NAVIGATION, films), RenderPosition.BEFOREEND);
render(mainElement, new MainFiltersComponent(), RenderPosition.BEFOREEND);

const boardComponent = new BoardComponent();
const boardElement = boardComponent.getElement();
render(mainElement, boardComponent, RenderPosition.BEFOREEND);

const allFilmsComponent = new FilmListComponent(`films-list`, `All movies. Upcoming`, true);

render(boardElement, allFilmsComponent, RenderPosition.BEFOREEND);

const allFilmsContainer = allFilmsComponent.getElement().querySelector(`.films-list .films-list__container`);

if (films.length) {
  let lastShownFilmNumber = INITIALLY_SHOWN_FILMS_COUNT;

  const renderFilm = (film, container) => {
    const filmComponent = new FilmCardComponent(film);
    const filmComments = generateComments(4);
    const filmPopupComponent = new FilmPopupComponent(film, filmComments);

    render(container, filmComponent, RenderPosition.BEFOREEND);

    const popupOpenElements = filmComponent.getElement().querySelectorAll(`.film-card__poster, .film-card__comments, .film-card__title`);

    const showPopup = () => {
      render(bodyElement, filmPopupComponent, RenderPosition.BEFOREEND);
      const closePopupBtn = filmPopupComponent.getElement().querySelector(`.film-details__close-btn`);
      closePopupBtn.addEventListener(`click`, removePopup);
      document.addEventListener(`keydown`, onEscKeyDown);
    };

    const removePopup = () => {
      remove(filmPopupComponent);
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

      render(boardElement, extraFilmsListComponent, RenderPosition.BEFOREEND);
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

    render(allFilmsList, showMoreComponent, RenderPosition.BEFOREEND);

    showMoreComponent.setClickHandler(() => {
      const increasedFilmNumber = lastShownFilmNumber + NEXT_SHOWN_FILMS_COUNT;

      films.slice(lastShownFilmNumber, increasedFilmNumber).forEach((film) => renderFilm(film, allFilmsContainer));
      lastShownFilmNumber = increasedFilmNumber;

      if (increasedFilmNumber >= films.length) {
        remove(showMoreComponent);
      }
    });
  }
} else {
  render(allFilmsContainer, new NoFilmsComponent(), RenderPosition.BEFOREEND);
}
footerElement.querySelector(`.footer__statistics`).innerHTML = `<p>${films.length} movies inside</p>`;
