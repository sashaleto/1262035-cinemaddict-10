import FilmCardComponent from "../components/film-card";
import {generateComments} from "../moks/comment";
import FilmPopupComponent from "../components/film-popup";
import {remove, render, RenderPosition} from "../utils/render";
import {sortFilmsBy} from "../utils";
import FilmListComponent from "../components/films-list";
import ShowMoreComponent from "../components/show-more-button";
import NoFilmsComponent from "../components/no-films";
import NavigationComponent from "../components/main-navigation";
import {NAVIGATION} from "../moks/main-navigation";
import SortingComponent, {SortType} from "../components/sorting";
import BoardComponent from "../components/board";

const EXTRA_FILMS_COUNT = 2;
const INITIALLY_SHOWN_FILMS_COUNT = 5;
const NEXT_SHOWN_FILMS_COUNT = 5;

const popupContainer = document.querySelector(`body`);

const renderFilm = (film, container) => {
  const filmComponent = new FilmCardComponent(film);
  const filmComments = generateComments(4);
  const filmPopupComponent = new FilmPopupComponent(film, filmComments);

  render(container, filmComponent, RenderPosition.BEFOREEND);

  const showPopup = () => {
    render(popupContainer, filmPopupComponent, RenderPosition.BEFOREEND);
    filmPopupComponent.setCloseButtonClickHandler(removePopup);
    document.addEventListener(`keydown`, onEscKeyDown);
  };

  const removePopup = () => {
    remove(filmPopupComponent);
    document.removeEventListener(`keydown`, onEscKeyDown);
  };

  const onEscKeyDown = (evt) => {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey) {
      removePopup();
    }
  };

  filmComponent.setOpenPopupListeners(showPopup);
};
const renderFilms = (filmsContainer, films) => {
  films.forEach((film) => renderFilm(film, filmsContainer));
};

export default class PageController {
  constructor(container, films) {
    this._container = container;
    this._noFilmsComponent = new NoFilmsComponent();
    this._navigationComponent = new NavigationComponent(NAVIGATION, films);
    this._sortingComponent = new SortingComponent();
    this._boardComponent = new BoardComponent();
    this._allFilmsComponent = new FilmListComponent(`films-list`, `All movies. Upcoming`, true);
    this._topRatedComponent = new FilmListComponent(`films-list--extra`, `Top rated`, false);
    this._mostCommentedComponent = new FilmListComponent(`films-list--extra`, `Most commented`, false);
    this._showMoreComponent = new ShowMoreComponent();
  }

  render(films) {
    render(this._container, this._navigationComponent, RenderPosition.BEFOREEND);
    render(this._container, this._sortingComponent, RenderPosition.BEFOREEND);
    render(this._container, this._boardComponent, RenderPosition.BEFOREEND);

    const allFilmsComponent = this._allFilmsComponent;

    render(this._boardComponent.getElement(), allFilmsComponent, RenderPosition.BEFOREEND);
    const allFilmsContainer = allFilmsComponent.getFilmsListContainer();

    if (films.length) {
      let lastShownFilmNumber = INITIALLY_SHOWN_FILMS_COUNT;

      // Отрисовка блока "All Films"
      renderFilms(allFilmsContainer, films.slice(0, lastShownFilmNumber));

      const renderExtraFilms = (extraFilmsComponent, property) => {
        const extraFilms = sortFilmsBy(films, property).slice(0, EXTRA_FILMS_COUNT);
        if (extraFilms[0][property] > 0) {
          const extraFilmsContainer = extraFilmsComponent.getFilmsListContainer();

          render(this._boardComponent.getElement(), extraFilmsComponent, RenderPosition.BEFOREEND);
          renderFilms(extraFilmsContainer, extraFilms);
        }
      };

      // Отрисовка блока "Top Rated Films"
      renderExtraFilms(this._topRatedComponent, `rating`);

      // Отрисовка блока "Top Commented Films"
      renderExtraFilms(this._mostCommentedComponent, `commentsCount`);

      // Добавление/скрытие кнопки "Загрузить еще"
      const renderShowMoreButton = () => {
        if (films.length >= INITIALLY_SHOWN_FILMS_COUNT) {
          const allFilmsList = allFilmsComponent.getElement();
          const showMoreComponent = this._showMoreComponent;

          render(allFilmsList, showMoreComponent, RenderPosition.BEFOREEND);

          showMoreComponent.setClickHandler(() => {
            const increasedFilmNumber = lastShownFilmNumber + NEXT_SHOWN_FILMS_COUNT;

            renderFilms(allFilmsContainer, films.slice(lastShownFilmNumber, increasedFilmNumber));
            lastShownFilmNumber = increasedFilmNumber;

            if (increasedFilmNumber >= films.length) {
              remove(showMoreComponent);
            }
          });
        }
      };
      renderShowMoreButton();

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
        renderFilms(allFilmsContainer, sortedFilms);

        if (sortType === SortType.DEFAULT) {
          renderShowMoreButton();
        } else {
          remove(this._showMoreComponent);
        }
      });
    } else {
      render(allFilmsComponent.getElement(), this._noFilmsComponent, RenderPosition.BEFOREEND);
    }
  }
}
