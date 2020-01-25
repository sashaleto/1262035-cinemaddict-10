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

const renderFilm = (film, container) => {
  const filmComponent = new FilmCardComponent(film);
  const filmComments = generateComments(4);
  const filmPopupComponent = new FilmPopupComponent(film, filmComments);

  render(container, filmComponent, RenderPosition.BEFOREEND);

  const showPopup = () => {
    render(bodyElement, filmPopupComponent, RenderPosition.BEFOREEND);
    filmPopupComponent.setCloseButtonClickHandler(removePopup);
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

  filmComponent.setOpenPopupListeners(showPopup);
};
const renderExtraFilms = (boardComponent, property, title) => {
  const extraFilms = sortFilmsBy(films, property).slice(0, EXTRA_FILMS_COUNT);
  if (extraFilms[0][property] > 0) {
    const extraFilmsListComponent = new FilmListComponent(`films-list--extra`, title, false);
    const extraFilmsContainer = extraFilmsListComponent.getFilmsListContainer();

    render(boardComponent.getElement(), extraFilmsListComponent, RenderPosition.BEFOREEND);
    for (let i = 0; i < EXTRA_FILMS_COUNT; i++) {
      renderFilm(extraFilms[i], extraFilmsContainer);
    }
  }
};
const renderBoard = (boardComponent) => {
  const allFilmsComponent = new FilmListComponent(`films-list`, `All movies. Upcoming`, true);

  render(boardComponent.getElement(), allFilmsComponent, RenderPosition.BEFOREEND);
  const allFilmsContainer = allFilmsComponent.getFilmsListContainer();

  if (films.length) {
    let lastShownFilmNumber = INITIALLY_SHOWN_FILMS_COUNT;

    // Отрисовка блока "All Films"
    films.slice(0, lastShownFilmNumber).forEach((film) => renderFilm(film, allFilmsContainer));

    // Отрисовка блока "Top Rated Films"
    renderExtraFilms(boardComponent, `rating`, `Top rated`);

    // Отрисовка блока "Top Commented Films"
    renderExtraFilms(boardComponent, `commentsCount`, `Most commented`);

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
    render(allFilmsComponent.getElement(), new NoFilmsComponent(), RenderPosition.BEFOREEND);
  }
};

const films = generateFilms(FILMS_COUNT);
const userRating = getWatchedFilmsCount(films);

render(headerElement, new UserProfile(userRating), RenderPosition.BEFOREEND);
render(mainElement, new NavigationComponent(NAVIGATION, films), RenderPosition.BEFOREEND);
render(mainElement, new MainFiltersComponent(), RenderPosition.BEFOREEND);

const boardComponent = new BoardComponent();
render(mainElement, boardComponent, RenderPosition.BEFOREEND);

renderBoard(boardComponent, films);

footerElement.querySelector(`.footer__statistics`).innerHTML = `<p>${films.length} movies inside</p>`;
