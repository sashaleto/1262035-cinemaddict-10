import UserProfile from './components/user-profile';
import FooterStatistics from "./components/footer-statistics";
import PageController from "./controllers/page";
import FilterController from "./controllers/filter";
import Movies from "./models/movies";
import API from "./api";
import {getWatchedFilmsCount} from './utils';
import {RenderPosition, render} from './utils/render';
import {END_POINT, AUTHORIZATION} from "./connection";

const api = new API(END_POINT, AUTHORIZATION);

const mainElement = document.querySelector(`.main`);
const headerElement = document.querySelector(`.header`);
const footerElement = document.querySelector(`.footer`);
footerElement.querySelector(`.footer__statistics`).remove();


api.getFilms()
  .then((films) => {
    const filmsModel = new Movies();
    filmsModel.setFilms(films);

    const userRating = getWatchedFilmsCount(films);

    render(headerElement, new UserProfile(userRating), RenderPosition.BEFOREEND);

    const page = new PageController(mainElement, filmsModel, api);
    const filters = new FilterController(mainElement, filmsModel, page);

    filters.render();
    page.render();

    render(footerElement, new FooterStatistics(films), RenderPosition.BEFOREEND);
  });

