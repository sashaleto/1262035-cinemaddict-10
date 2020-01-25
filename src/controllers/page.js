import FilmCardComponent from "../components/film-card";
import {generateComments} from "../moks/comment";
import FilmPopupComponent from "../components/film-popup";
import {remove, render, RenderPosition} from "../utils/render";
import {sortFilmsBy} from "../utils";
import FilmListComponent from "../components/films-list";
import ShowMoreComponent from "../components/show-more-button";
import NoFilmsComponent from "../components/no-films";

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

export default class PageController {
  constructor(boardComponent) {
    this._boardComponent = boardComponent;
    this._noFilmsComponent = new NoFilmsComponent();
    this._allFilmsComponent = new FilmListComponent(`films-list`, `All movies. Upcoming`, true);
    this._topRatedComponent = new FilmListComponent(`films-list--extra`, `Top rated`, false);
    this._mostCommentedComponent = new FilmListComponent(`films-list--extra`, `Most commented`, false);
  }

  render(films) {
    const allFilmsComponent = this._allFilmsComponent;

    render(this._boardComponent.getElement(), allFilmsComponent, RenderPosition.BEFOREEND);
    const allFilmsContainer = allFilmsComponent.getFilmsListContainer();

    if (films.length) {
      let lastShownFilmNumber = INITIALLY_SHOWN_FILMS_COUNT;

      // Отрисовка блока "All Films"
      films.slice(0, lastShownFilmNumber).forEach((film) => renderFilm(film, allFilmsContainer));

      const renderExtraFilms = (extraFilmsComponent, property) => {
        const extraFilms = sortFilmsBy(films, property).slice(0, EXTRA_FILMS_COUNT);
        if (extraFilms[0][property] > 0) {
          const extraFilmsContainer = extraFilmsComponent.getFilmsListContainer();

          render(this._boardComponent.getElement(), extraFilmsComponent, RenderPosition.BEFOREEND);
          extraFilms.forEach((film) => renderFilm(film, extraFilmsContainer));
        }
      };

      // Отрисовка блока "Top Rated Films"
      renderExtraFilms(this._topRatedComponent, `rating`);

      // Отрисовка блока "Top Commented Films"
      renderExtraFilms(this._mostCommentedComponent, `commentsCount`);

      // Добавление/скрытие кнопки "Загрузить еще"
      if (films.length >= INITIALLY_SHOWN_FILMS_COUNT) {
        const allFilmsList = allFilmsComponent.getElement();
        const showMoreComponent = new ShowMoreComponent();

        render(allFilmsList, showMoreComponent, RenderPosition.BEFOREEND);

        showMoreComponent.setClickHandler(() => {
          const increasedFilmNumber = lastShownFilmNumber + NEXT_SHOWN_FILMS_COUNT;

          films.slice(lastShownFilmNumber, increasedFilmNumber).forEach((film) => renderFilm(film, allFilmsContainer));
          lastShownFilmNumber = increasedFilmNumber;

          if (increasedFilmNumber >= films.length) {
            remove(showMoreComponent);
          }
        });
      }
    } else {
      render(allFilmsComponent.getElement(), this._noFilmsComponent, RenderPosition.BEFOREEND);
    }
  }
}
