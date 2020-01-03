import {createUserProfileTemplate} from './components/user-profile';
import {createNavigationTemplate} from './components/main-navigation';
import {createMainFiltersTemplate} from './components/main-filters';
import {createFilmsBoardTemplate} from './components/board';
import {createFilmListTemplate} from './components/films-list';
import {createFilmCardTemplate} from './components/film-card';
import {createFilmPopupTemplate} from './components/film-popup';
import {createShowMoreBtnTemplate} from './components/show-more-button';

import {getWatchedFilmsCount} from './utils';

import {generateFilms} from "./moks/films";
import {NAVIGATION} from "./moks/main-navigation";
import {generateComments} from "./moks/comment";

import {sortFilmsBy} from "./utils";

const FILMS_COUNT = 5;
const EXTRA_FILMS_COUNT = 2;
const mainElement = document.querySelector(`.main`);
const headerElement = document.querySelector(`.header`);
const footerElement = document.querySelector(`.footer`);

const films = generateFilms(FILMS_COUNT);
const userRating = getWatchedFilmsCount(films);

// Функция для рендеринга компонентов
const renderComponent = (container, markup, position) => {
  container.insertAdjacentHTML(position, markup);
};
renderComponent(headerElement, createUserProfileTemplate(userRating), `beforeend`);
renderComponent(mainElement, createNavigationTemplate(NAVIGATION, films), `beforeend`);
renderComponent(mainElement, createMainFiltersTemplate(), `beforeend`);
renderComponent(mainElement, createFilmsBoardTemplate(), `beforeend`);

const boardElement = mainElement.querySelector(`.films`);
renderComponent(boardElement, createFilmListTemplate(`films-list`, `All movies. Upcoming`, true), `beforeend`);
renderComponent(boardElement, createFilmListTemplate(`films-list--extra`, `Top rated`, false), `beforeend`);
renderComponent(boardElement, createFilmListTemplate(`films-list--extra`, `Most commented`, false), `beforeend`);

const allFilmsContainer = mainElement.querySelector(`.films-list .films-list__container`);

for (let i = 0; i < FILMS_COUNT; i++) {
  renderComponent(allFilmsContainer, createFilmCardTemplate(films[i]), `beforeend`);
}

const extraFilmsContainer = mainElement.querySelectorAll(`.films-list--extra .films-list__container`);

const topRatedFilms = sortFilmsBy(films, `rating`).slice(0, EXTRA_FILMS_COUNT);
if (topRatedFilms[0].rating > 0) {
  for (let i = 0; i < EXTRA_FILMS_COUNT; i++) {
    renderComponent(extraFilmsContainer.item(0), createFilmCardTemplate(topRatedFilms[i]), `beforeend`);
  }
}

const topCommentedFilms = sortFilmsBy(films, `commentsCount`).slice(0, EXTRA_FILMS_COUNT);
if (topCommentedFilms[0].commentsCount > 0) {
  for (let i = 0; i < EXTRA_FILMS_COUNT; i++) {
    renderComponent(extraFilmsContainer.item(1), createFilmCardTemplate(topCommentedFilms[i]), `beforeend`);
  }
}

const allFilmsList = mainElement.querySelector(`.films-list`);
renderComponent(allFilmsList, createShowMoreBtnTemplate(), `beforeend`);

const filmComments = generateComments(4);
renderComponent(footerElement, createFilmPopupTemplate(films[1], filmComments), `afterend`);

footerElement.querySelector(`.footer__statistics`).innerHTML = `<p>${films.length} movies inside</p>`;
