import UserProfile from './components/user-profile';
import NavigationComponent from './components/main-navigation';
import SortingComponent from './components/sorting';
import BoardComponent from './components/board';
import FooterStatistics from "./components/footer-statistics";

import PageController from "./controllers/page";

import {getWatchedFilmsCount} from './utils';
import {RenderPosition, render} from './utils/render';

import {generateFilms} from "./moks/films";
import {NAVIGATION} from "./moks/main-navigation";

const FILMS_COUNT = 23;

const mainElement = document.querySelector(`.main`);
const headerElement = document.querySelector(`.header`);
const footerElement = document.querySelector(`.footer`);
footerElement.querySelector(`.footer__statistics`).remove();

const films = generateFilms(FILMS_COUNT);
const userRating = getWatchedFilmsCount(films);

render(headerElement, new UserProfile(userRating), RenderPosition.BEFOREEND);
render(mainElement, new NavigationComponent(NAVIGATION, films), RenderPosition.BEFOREEND);
render(mainElement, new SortingComponent(), RenderPosition.BEFOREEND);

const boardComponent = new BoardComponent();
render(mainElement, boardComponent, RenderPosition.BEFOREEND);

const page = new PageController(boardComponent);
page.render(films);

render(footerElement, new FooterStatistics(films), RenderPosition.BEFOREEND);
