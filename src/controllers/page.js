import {remove, render, RenderPosition} from "../utils/render";
import {sortFilmsBy} from "../utils";
import FilmListComponent from "../components/films-list";
import ShowMoreComponent from "../components/show-more-button";
import NoFilmsComponent from "../components/no-films";
import NavigationComponent from "../components/main-navigation";
import {NAVIGATION} from "../moks/main-navigation";
import SortingComponent, {SortType} from "../components/sorting";
import BoardComponent from "../components/board";
import MovieController from "./movie";

const EXTRA_FILMS_COUNT = 2;
const INITIALLY_SHOWN_FILMS_COUNT = 5;
const NEXT_SHOWN_FILMS_COUNT = 5;

export default class PageController {
  constructor(container, films) {
    this._films = films;
    this._activeFilmControllers = [];
    this._container = container;
    this._noFilmsComponent = new NoFilmsComponent();
    this._navigationComponent = new NavigationComponent(NAVIGATION, films);
    this._sortingComponent = new SortingComponent();
    this._boardComponent = new BoardComponent();
    this._allFilmsComponent = new FilmListComponent(`films-list`, `All movies. Upcoming`, true);
    this._topRatedComponent = new FilmListComponent(`films-list--extra`, `Top rated`, false);
    this._mostCommentedComponent = new FilmListComponent(`films-list--extra`, `Most commented`, false);
    this._showMoreComponent = new ShowMoreComponent();

    this._shownFilmsCount = INITIALLY_SHOWN_FILMS_COUNT;

    this._onDataChange = this._onDataChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);

    this._onSortTypeChange = this._onSortTypeChange.bind(this);
    this._sortingComponent.setSortTypeChangeHandler(this._onSortTypeChange);
  }

  _renderFilms(filmsContainer, films) {
    // для управления всеми созданными контроллерами фильмов
    return films.map((film) => {
      const controller = new MovieController(filmsContainer, this._onDataChange, this._onViewChange);
      controller.render(film);
      return controller;
    });
  }

  _onDataChange(movieController, oldFilmData, newFilmData) {
    const index = this._films.findIndex((film) => film === oldFilmData);

    if (index === -1) {
      return;
    }

    this._films = [].concat(this._films.slice(0, index), newFilmData, this._films.slice(index + 1));

    movieController.render(newFilmData);
  }

  _onViewChange() {
    this._activeFilmControllers.forEach((controller) => controller.setDefaultView());
  }

  _renderShowMoreButton() {
    if (this._films.length >= this._shownFilmsCount) {
      const allFilmsList = this._allFilmsComponent.getElement();
      const showMoreComponent = this._showMoreComponent;

      render(allFilmsList, showMoreComponent, RenderPosition.BEFOREEND);

      showMoreComponent.setClickHandler(() => {
        const increasedFilmNumber = this._shownFilmsCount + NEXT_SHOWN_FILMS_COUNT;

        const newControllers = this._renderFilms(this._allFilmsComponent.getFilmsListContainer(), this._films.slice(this._shownFilmsCount, increasedFilmNumber));
        this._activeFilmControllers = this._activeFilmControllers.concat(newControllers);

        this._shownFilmsCount = increasedFilmNumber;

        if (increasedFilmNumber >= this._films.length) {
          remove(showMoreComponent);
        }
      });
    }
  }

  _onSortTypeChange(sortType) {
    let sortedFilms = [];

    switch (sortType) {
      case SortType.DATE_DOWN:
        sortedFilms = sortFilmsBy(this._films, `releaseDate`);
        break;
      case SortType.RATING_DOWN:
        sortedFilms = sortFilmsBy(this._films, `rating`);
        break;
      case SortType.DEFAULT:
        sortedFilms = this._films.slice(0, this._shownFilmsCount);
        break;
    }

    this._allFilmsComponent.getFilmsListContainer().innerHTML = ``;
    const newControllers = this._renderFilms(this._allFilmsComponent.getFilmsListContainer(), sortedFilms);
    this._activeFilmControllers = this._activeFilmControllers.concat(newControllers);

    if (sortType === SortType.DEFAULT) {
      this._renderShowMoreButton();
    } else {
      remove(this._showMoreComponent);
    }
  }

  render(films) {
    this._films = films;

    render(this._container, this._navigationComponent, RenderPosition.BEFOREEND);
    render(this._container, this._sortingComponent, RenderPosition.BEFOREEND);
    render(this._container, this._boardComponent, RenderPosition.BEFOREEND);

    const allFilmsComponent = this._allFilmsComponent;

    render(this._boardComponent.getElement(), allFilmsComponent, RenderPosition.BEFOREEND);
    const allFilmsContainer = allFilmsComponent.getFilmsListContainer();

    if (films.length) {
      // Отрисовка блока "All Films"
      this._activeFilmControllers = this._renderFilms(allFilmsContainer, films.slice(0, this._shownFilmsCount));

      const renderExtraFilms = (extraFilmsComponent, property) => {
        const extraFilms = sortFilmsBy(films, property).slice(0, EXTRA_FILMS_COUNT);
        if (extraFilms[0][property] > 0) {
          const extraFilmsContainer = extraFilmsComponent.getFilmsListContainer();

          render(this._boardComponent.getElement(), extraFilmsComponent, RenderPosition.BEFOREEND);
          const newExtraFilmsControllers = this._renderFilms(extraFilmsContainer, extraFilms);
          this._activeFilmControllers = this._activeFilmControllers.concat(newExtraFilmsControllers);
        }
      };

      // Отрисовка блока "Top Rated Films"
      renderExtraFilms(this._topRatedComponent, `rating`);

      // Отрисовка блока "Top Commented Films"
      renderExtraFilms(this._mostCommentedComponent, `commentsCount`);

      // Добавление/скрытие кнопки "Загрузить еще"
      this._renderShowMoreButton();
    } else {
      render(allFilmsComponent.getElement(), this._noFilmsComponent, RenderPosition.BEFOREEND);
    }
  }
}
