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
  }

  _renderFilms(filmsContainer, films) {
    films.forEach((film) => new MovieController(filmsContainer, this._onDataChange).render(film));
  }

  _onDataChange(movieController, oldFilmData, newFilmData) {
    const index = this._films.findIndex((film) => film === oldFilmData);

    if (index === -1) {
      return;
    }

    this._films = [].concat(this._films.slice(0, index), newFilmData, this._films.slice(index + 1));

    movieController.render(newFilmData);
  }

  _renderShowMoreButton() {
    if (this._films.length >= this._shownFilmsCount) {
      const allFilmsList = this._allFilmsComponent.getElement();
      const showMoreComponent = this._showMoreComponent;

      render(allFilmsList, showMoreComponent, RenderPosition.BEFOREEND);

      showMoreComponent.setClickHandler(() => {
        const increasedFilmNumber = this._shownFilmsCount + NEXT_SHOWN_FILMS_COUNT;

        this._renderFilms(this._allFilmsComponent.getFilmsListContainer(), this._films.slice(this._shownFilmsCount, increasedFilmNumber));
        this._shownFilmsCount = increasedFilmNumber;

        if (increasedFilmNumber >= this._films.length) {
          remove(showMoreComponent);
        }
      });
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
      this._renderFilms(allFilmsContainer, films.slice(0, this._shownFilmsCount));

      const renderExtraFilms = (extraFilmsComponent, property) => {
        const extraFilms = sortFilmsBy(films, property).slice(0, EXTRA_FILMS_COUNT);
        if (extraFilms[0][property] > 0) {
          const extraFilmsContainer = extraFilmsComponent.getFilmsListContainer();

          render(this._boardComponent.getElement(), extraFilmsComponent, RenderPosition.BEFOREEND);
          this._renderFilms(extraFilmsContainer, extraFilms);
        }
      };

      // Отрисовка блока "Top Rated Films"
      renderExtraFilms(this._topRatedComponent, `rating`);

      // Отрисовка блока "Top Commented Films"
      renderExtraFilms(this._mostCommentedComponent, `commentsCount`);

      // Добавление/скрытие кнопки "Загрузить еще"
      this._renderShowMoreButton();

      // Добавление обработчика сортировки
      this._sortingComponent.setSortTypeChangeHandler((sortType) => {
        let sortedFilms = [];

        switch (sortType) {
          case SortType.DATE_DOWN:
            sortedFilms = sortFilmsBy(films, `releaseDate`);
            break;
          case SortType.RATING_DOWN:
            sortedFilms = sortFilmsBy(films, `rating`);
            break;
          case SortType.DEFAULT:
            sortedFilms = films.slice(0, INITIALLY_SHOWN_FILMS_COUNT);
            break;
        }

        allFilmsContainer.innerHTML = ``;
        this._renderFilms(allFilmsContainer, sortedFilms);

        if (sortType === SortType.DEFAULT) {
          this._renderShowMoreButton();
        } else {
          remove(this._showMoreComponent);
        }
      });
    } else {
      render(allFilmsComponent.getElement(), this._noFilmsComponent, RenderPosition.BEFOREEND);
    }
  }
}
