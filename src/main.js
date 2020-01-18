import UserProfile from './components/user-profile';
import NavigationComponent from './components/main-navigation';
import {createMainFiltersTemplate} from './components/main-filters';
import {createFilmsBoardTemplate} from './components/board';
import {createFilmListTemplate} from './components/films-list';
import FilmCardComponent from './components/film-card';
import {createFilmPopupTemplate} from './components/film-popup';
import {createShowMoreBtnTemplate} from './components/show-more-button';

import {getWatchedFilmsCount, render, sortFilmsBy} from './utils';
import {RenderPosition} from './constants';

import {generateFilms} from "./moks/films";
import {NAVIGATION} from "./moks/main-navigation";
import {generateComments} from "./moks/comment";

const FILMS_COUNT = 24;
const EXTRA_FILMS_COUNT = 2;
const INITIALLY_SHOWN_FILMS_COUNT = 5;
const NEXT_SHOWN_FILMS_COUNT = 5;

const mainElement = document.querySelector(`.main`);
const headerElement = document.querySelector(`.header`);
const footerElement = document.querySelector(`.footer`);

const films = generateFilms(FILMS_COUNT);
const userRating = getWatchedFilmsCount(films);

// Функция для рендеринга компонентов
const renderComponent = (container, markup, position) => {
  container.insertAdjacentHTML(position, markup);
};
render(headerElement, new UserProfile(userRating).getElement(), RenderPosition.BEFOREEND);
render(mainElement, new NavigationComponent(NAVIGATION, films).getElement(), RenderPosition.BEFOREEND);
renderComponent(mainElement, createMainFiltersTemplate(), `beforeend`);
renderComponent(mainElement, createFilmsBoardTemplate(), `beforeend`);

const boardElement = mainElement.querySelector(`.films`);
renderComponent(boardElement, createFilmListTemplate(`films-list`, `All movies. Upcoming`, true), `beforeend`);
renderComponent(boardElement, createFilmListTemplate(`films-list--extra`, `Top rated`, false), `beforeend`);
renderComponent(boardElement, createFilmListTemplate(`films-list--extra`, `Most commented`, false), `beforeend`);

const allFilmsContainer = mainElement.querySelector(`.films-list .films-list__container`);

let lastShownFilmNumber = INITIALLY_SHOWN_FILMS_COUNT;
films.slice(0, lastShownFilmNumber).forEach((film) => render(allFilmsContainer, new FilmCardComponent(film).getElement(), RenderPosition.BEFOREEND));

const extraFilmsContainer = mainElement.querySelectorAll(`.films-list--extra .films-list__container`);

const topRatedFilms = sortFilmsBy(films, `rating`).slice(0, EXTRA_FILMS_COUNT);
if (topRatedFilms[0].rating > 0) {
  for (let i = 0; i < EXTRA_FILMS_COUNT; i++) {
    render(extraFilmsContainer.item(0), new FilmCardComponent(topRatedFilms[i]).getElement(), RenderPosition.BEFOREEND);
  }
}

const topCommentedFilms = sortFilmsBy(films, `commentsCount`).slice(0, EXTRA_FILMS_COUNT);
if (topCommentedFilms[0].commentsCount > 0) {
  for (let i = 0; i < EXTRA_FILMS_COUNT; i++) {
    render(extraFilmsContainer.item(1), new FilmCardComponent(topCommentedFilms[i]).getElement(), RenderPosition.BEFOREEND);
  }
}

if (films.length >= INITIALLY_SHOWN_FILMS_COUNT) {
  const allFilmsList = mainElement.querySelector(`.films-list`);
  renderComponent(allFilmsList, createShowMoreBtnTemplate(), `beforeend`);

  const showMoreButton = allFilmsList.querySelector(`.films-list__show-more`);
  showMoreButton.addEventListener(`click`, () => {
    const increasedFilmNumber = lastShownFilmNumber + NEXT_SHOWN_FILMS_COUNT;

    films.slice(lastShownFilmNumber, increasedFilmNumber).forEach((film) => render(allFilmsContainer, new FilmCardComponent(film).getElement(), RenderPosition.BEFOREEND));
    lastShownFilmNumber = increasedFilmNumber;

    if (increasedFilmNumber >= films.length) {
      showMoreButton.remove();
    }
  });
}

const filmComments = generateComments(4);
renderComponent(footerElement, createFilmPopupTemplate(films[1], filmComments), `afterend`);

footerElement.querySelector(`.footer__statistics`).innerHTML = `<p>${films.length} movies inside</p>`;
