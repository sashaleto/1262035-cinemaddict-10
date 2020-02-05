import {remove, render, RenderPosition} from "../utils/render";
import {sortFilmsBy} from "../utils";
import {getStatsByType} from "../utils/statistics";
import FilmListComponent from "../components/films-list";
import ShowMoreComponent from "../components/show-more-button";
import NoFilmsComponent from "../components/no-films";
import SortingComponent, {SortType} from "../components/sorting";
import BoardComponent from "../components/board";
import MovieController from "./movie";
import StatisticsComponent from "../components/statistics";

const EXTRA_FILMS_COUNT = 2;
const INITIALLY_SHOWN_FILMS_COUNT = 5;
const NEXT_SHOWN_FILMS_COUNT = 5;

export default class PageController {
  constructor(container, filmsModel, api) {
    this._filmsModel = filmsModel;
    this._activeFilmControllers = [];
    this._container = container;

    this._api = api;
    this._noFilmsComponent = new NoFilmsComponent();
    this._sortingComponent = new SortingComponent();
    this._boardComponent = new BoardComponent();
    this._statisticsComponent = new StatisticsComponent(getStatsByType(this._filmsModel.getAllFilms(), `ALL`));
    this._allFilmsComponent = new FilmListComponent(`films-list`, `All movies. Upcoming`, true);
    this._topRatedComponent = new FilmListComponent(`films-list--extra`, `Top rated`, false);
    this._mostCommentedComponent = new FilmListComponent(`films-list--extra`, `Most commented`, false);
    this._showMoreComponent = new ShowMoreComponent();

    this._shownFilmsCount = 0;
    this._sortType = SortType.DEFAULT;
    this._maxAllowedFilms = INITIALLY_SHOWN_FILMS_COUNT;

    this._onDataChange = this._onDataChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);

    this._onFilterChange = this._onFilterChange.bind(this);
    this._filmsModel.setFilterChangeHandler(this._onFilterChange);

    this._onSortTypeChange = this._onSortTypeChange.bind(this);
    this._sortingComponent.setSortTypeChangeHandler(this._onSortTypeChange);

    this._onModelChange = this._onModelChange.bind(this);
    this._filmsModel.setDataChangeHandler(this._onModelChange);

    this._onStatisticsPeriodChange = this._onStatisticsPeriodChange.bind(this);
    this._statisticsComponent.setChangePeriodClickHandler(this._onStatisticsPeriodChange);
  }

  _renderCommonFilms() {
    let sortedFilms = [];
    const films = this._filmsModel.getFilms();

    switch (this._sortType) {
      case SortType.DATE_DOWN:
        sortedFilms = sortFilmsBy(films, `releaseDate`);
        break;
      case SortType.RATING_DOWN:
        sortedFilms = sortFilmsBy(films, `rating`);
        break;
      case SortType.DEFAULT:
        sortedFilms = films;
        break;
    }

    sortedFilms = sortedFilms.slice(0, this._maxAllowedFilms);

    this._renderFilms(sortedFilms, this._allFilmsComponent.getFilmsListContainer());
    this._shownFilmsCount = sortedFilms.length;
  }

  _renderTopBlocks(allFilms) {
    this._renderExtraFilms(allFilms, this._topRatedComponent, `rating`);
    this._renderExtraFilms(allFilms, this._mostCommentedComponent, `commentsCount`);
  }

  _renderExtraFilms(allFilms, extraFilmsComponent, property) {
    const extraFilms = sortFilmsBy(allFilms, property).slice(0, EXTRA_FILMS_COUNT);
    if (extraFilms[0][property] > 0) {
      const extraFilmsContainer = extraFilmsComponent.getFilmsListContainer();

      render(this._boardComponent.getElement(), extraFilmsComponent, RenderPosition.BEFOREEND);
      this._renderFilms(extraFilms, extraFilmsContainer);
    }
  }

  _renderFilms(films, filmsContainer = this._allFilmsComponent.getFilmsListContainer()) {
    // для управления всеми созданными контроллерами фильмов
    const newControllers = films.map((film) => {
      const controller = new MovieController(filmsContainer, this._onDataChange, this._onViewChange, this._api, this._filmsModel);
      controller.render(film);
      return controller;
    });
    this._activeFilmControllers = this._activeFilmControllers.concat(newControllers);
  }

  _onDataChange(movieController, oldFilm, newFilm) {
    this._api.updateFilm(oldFilm.id, newFilm)
      .then((filmModel) => {
        const isSuccess = this._filmsModel.updateFilm(oldFilm.id, filmModel);
        if (isSuccess) {
          movieController.render(filmModel);
        }
      });
  }

  _onModelChange() {
    this._renderPage();
  }

  _onViewChange() {
    this._activeFilmControllers.forEach((controller) => controller.setDefaultView());
  }

  _renderShowMoreButton() {
    const films = this._filmsModel.getFilms();
    if (films.length > this._shownFilmsCount) {
      const allFilmsList = this._allFilmsComponent.getElement();
      const showMoreComponent = this._showMoreComponent;

      render(allFilmsList, showMoreComponent, RenderPosition.BEFOREEND);

      showMoreComponent.setClickHandler(() => {
        this._maxAllowedFilms += NEXT_SHOWN_FILMS_COUNT;
        this._renderPage();
      });
    }
  }

  _renderPage() {
    this._removeFilms();
    remove(this._showMoreComponent);
    this._renderCommonFilms();
    this._renderTopBlocks(this._filmsModel.getAllFilms());
    this._renderShowMoreButton();
  }

  _onSortTypeChange(sortType) {
    this._sortType = sortType;
    this._renderPage();
  }

  _onFilterChange() {
    this._maxAllowedFilms = INITIALLY_SHOWN_FILMS_COUNT;
    this._renderPage();
  }

  _removeFilms() {
    this._activeFilmControllers.forEach((movieController) => movieController.destroy());
    this._activeFilmControllers = [];
    this._shownFilmsCount = 0;
  }

  showStatistics() {
    this._sortingComponent.hide();
    this._boardComponent.hide();
    this._statisticsComponent.show();
  }

  _onStatisticsPeriodChange(period) {
    const stats = getStatsByType(this._filmsModel.getAllFilms(), period);
    this._statisticsComponent.setStats(stats);
    this._statisticsComponent.rerender();
  }

  showBoard() {
    this._statisticsComponent.hide();
    this._sortingComponent.show();
    this._boardComponent.show();
  }

  render() {
    const films = this._filmsModel.getFilms();

    render(this._container, this._sortingComponent, RenderPosition.BEFOREEND);
    render(this._container, this._boardComponent, RenderPosition.BEFOREEND);
    render(this._container, this._statisticsComponent, RenderPosition.BEFOREEND);

    const allFilmsComponent = this._allFilmsComponent;

    render(this._boardComponent.getElement(), allFilmsComponent, RenderPosition.BEFOREEND);

    if (films.length) {
      this._renderPage();
    } else {
      render(allFilmsComponent.getElement(), this._noFilmsComponent, RenderPosition.BEFOREEND);
    }
  }
}
