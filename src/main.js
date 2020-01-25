import UserProfile from './components/user-profile';
import NavigationComponent from './components/main-navigation';
import MainFiltersComponent from './components/main-filters';
import BoardComponent from './components/board';

import {getWatchedFilmsCount} from './utils';
import {RenderPosition, render} from './utils/render';

import {generateFilms} from "./moks/films";
import {NAVIGATION} from "./moks/main-navigation";
import PageController from "./controllers/page";

const FILMS_COUNT = 23;

const mainElement = document.querySelector(`.main`);
const headerElement = document.querySelector(`.header`);
const footerElement = document.querySelector(`.footer`);


const films = generateFilms(FILMS_COUNT);
const userRating = getWatchedFilmsCount(films);

render(headerElement, new UserProfile(userRating), RenderPosition.BEFOREEND);
render(mainElement, new NavigationComponent(NAVIGATION, films), RenderPosition.BEFOREEND);
render(mainElement, new MainFiltersComponent(), RenderPosition.BEFOREEND);

const boardComponent = new BoardComponent();
render(mainElement, boardComponent, RenderPosition.BEFOREEND);

renderBoard(boardComponent, films);

footerElement.querySelector(`.footer__statistics`).innerHTML = `<p>${films.length} movies inside</p>`;
