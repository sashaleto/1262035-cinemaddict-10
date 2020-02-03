import UserProfile from './components/user-profile';
import FooterStatistics from "./components/footer-statistics";
import PageController from "./controllers/page";
import FilterController from "./controllers/filter";
import Movies from "./models/movies";

import {getWatchedFilmsCount} from './utils';
import {RenderPosition, render} from './utils/render';

import {generateFilms} from "./moks/films";

const FILMS_COUNT = 23;

const mainElement = document.querySelector(`.main`);
const headerElement = document.querySelector(`.header`);
const footerElement = document.querySelector(`.footer`);
footerElement.querySelector(`.footer__statistics`).remove();

const films = generateFilms(FILMS_COUNT);
const filmsModel = new Movies();
filmsModel.setFilms(films);

const userRating = getWatchedFilmsCount(films);

render(headerElement, new UserProfile(userRating), RenderPosition.BEFOREEND);

const filters = new FilterController(mainElement, filmsModel);
filters.render();

const page = new PageController(mainElement, filmsModel);
page.render();

render(footerElement, new FooterStatistics(films), RenderPosition.BEFOREEND);
