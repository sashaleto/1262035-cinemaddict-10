import UserProfile from './components/user-profile';
import NavigationComponent from './components/main-navigation';
import MainFiltersComponent from './components/main-filters';
import BoardComponent from './components/board';
import FilmListComponent from './components/films-list';
import FilmCardComponent from './components/film-card';
import FilmPopupComponent from './components/film-popup';
import ShowMoreComponent from './components/show-more-button';

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

render(headerElement, new UserProfile(userRating).getElement(), RenderPosition.BEFOREEND);
render(mainElement, new NavigationComponent(NAVIGATION, films).getElement(), RenderPosition.BEFOREEND);
render(mainElement, new MainFiltersComponent().getElement(), RenderPosition.BEFOREEND);

const boardElement = new BoardComponent().getElement();
render(mainElement, boardElement, RenderPosition.BEFOREEND);

const allFilmsComponent = new FilmListComponent(`films-list`, `All movies. Upcoming`, true);

render(boardElement, allFilmsComponent.getElement(), RenderPosition.BEFOREEND);
render(boardElement, new FilmListComponent(`films-list--extra`, `Top rated`, false).getElement(), RenderPosition.BEFOREEND);
render(boardElement, new FilmListComponent(`films-list--extra`, `Most commented`, false).getElement(), RenderPosition.BEFOREEND);

const allFilmsContainer = allFilmsComponent.getElement().querySelector(`.films-list .films-list__container`);

let lastShownFilmNumber = INITIALLY_SHOWN_FILMS_COUNT;
films.slice(0, lastShownFilmNumber).forEach((film) => {
  const filmComponent = new FilmCardComponent(film);
  const filmComments = generateComments(4);
  const filmPopupComponent = new FilmPopupComponent(film, filmComments);

  render(allFilmsContainer, filmComponent.getElement(), RenderPosition.BEFOREEND);

  const popupOpenElements = filmComponent.getElement().querySelectorAll(`.film-card__poster, .film-card__comments, .film-card__title`);

  const showPopup = () => {
    render(footerElement, filmPopupComponent.getElement(), RenderPosition.AFTERBEGIN);
    const closePopupBtn = filmPopupComponent.getElement().querySelector(`.film-details__close-btn`);
    closePopupBtn.addEventListener(`click`, () => {
      filmPopupComponent.getElement().remove();
      filmPopupComponent.removeElement();
    });
  };

  popupOpenElements.forEach((element) => element.addEventListener(`click`, showPopup));
});

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
  const allFilmsList = allFilmsComponent.getElement();
  const showMoreComponent = new ShowMoreComponent();
  const showMoreButton = showMoreComponent.getElement();

  render(allFilmsList, showMoreButton, RenderPosition.BEFOREEND);

  showMoreButton.addEventListener(`click`, () => {
    const increasedFilmNumber = lastShownFilmNumber + NEXT_SHOWN_FILMS_COUNT;

    films.slice(lastShownFilmNumber, increasedFilmNumber).forEach((film) => render(allFilmsContainer, new FilmCardComponent(film).getElement(), RenderPosition.BEFOREEND));
    lastShownFilmNumber = increasedFilmNumber;

    if (increasedFilmNumber >= films.length) {
      showMoreButton.remove();
      showMoreComponent.removeElement();
    }
  });
}

footerElement.querySelector(`.footer__statistics`).innerHTML = `<p>${films.length} movies inside</p>`;
