import FilmCardComponent from "../components/film-card";
import FilmPopupComponent from "../components/film-popup";
import {generateComments} from "../moks/comment";
import {remove, render, replace, RenderPosition} from "../utils/render";

const Mode = {
  DEFAULT: `default`,
  POPUP: `popup`,
};

export default class MovieController {
  constructor(container, onDataChange, onViewChange) {
    this._container = container;
    this._popupContainer = document.querySelector(`body`);
    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;

    this._filmComponent = null;
    this._filmPopupComponent = null;

    this._onEscKeyDown = this._onEscKeyDown.bind(this);
    this._removePopup = this._removePopup.bind(this);
    this._buildHandler = this._buildHandler.bind(this);

    this._mode = Mode.DEFAULT;
  }

  _onEscKeyDown(evt) {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey) {
      this._removePopup();
    }
  }

  _removePopup() {
    remove(this._filmPopupComponent);
    this._filmPopupComponent = null;
    this._mode = Mode.DEFAULT;
    document.removeEventListener(`keydown`, this._onEscKeyDown);
  }

  setDefaultView() {
    if (this._mode !== Mode.DEFAULT) {
      this._removePopup();
    }
  }

  _buildHandler(filmMutator) {
    return (e, changingFilm) => {
      const newUserDetails = Object.assign({}, changingFilm.userDetails);
      const newFilm = Object.assign({}, changingFilm);
      newFilm.userDetails = newUserDetails;
      filmMutator(e, newFilm);
      this._onDataChange(this, changingFilm, newFilm);
    };
  }

  destroy() {
    // remove(this._filmPopupComponent);
    remove(this._filmComponent);
    document.removeEventListener(`keydown`, this._onEscKeyDown);
  }

  render(film) {
    const previousFilmComponent = this._filmComponent;

    const filmComments = generateComments(4);
    this._filmComponent = new FilmCardComponent(film);

    const addToWatchListHandler = this._buildHandler((e, newFilm) => {
      newFilm.userDetails.watchlist = !newFilm.userDetails.watchlist;
    });
    this._filmComponent.setAddToWatchListListener(addToWatchListHandler);

    const markAsWatchedHandler = this._buildHandler((e, newFilm) => {
      newFilm.userDetails.alreadyWatched = !newFilm.userDetails.alreadyWatched;
    });
    this._filmComponent.setMarkAsWatchedListener(markAsWatchedHandler);

    const addToFavoritesHandler = this._buildHandler((e, newFilm) => {
      newFilm.userDetails.favorite = !newFilm.userDetails.favorite;
    });
    this._filmComponent.setAddToFavoritesListener(addToFavoritesHandler);

    const showPopup = () => {
      this._onViewChange();
      this._filmPopupComponent = new FilmPopupComponent(filmComments);
      this._mode = Mode.POPUP;
      this._filmPopupComponent.setFilm(film);

      render(this._popupContainer, this._filmPopupComponent, RenderPosition.BEFOREEND);

      this._filmPopupComponent.setCloseButtonClickHandler(this._removePopup);
      this._filmPopupComponent.setAddToWatchListListener(addToWatchListHandler);
      this._filmPopupComponent.setMarkAsWatchedListener(markAsWatchedHandler);
      this._filmPopupComponent.setAddToFavoritesListener(addToFavoritesHandler);

      const userRatingScoreHandler = this._buildHandler((e, newFilm) => {
        newFilm.userDetails.personalRating = +e.target.value;
      });
      this._filmPopupComponent.setUserRatingScoreHandler(userRatingScoreHandler);

      const resetUserRatingHandler = this._buildHandler((e, newFilm) => {
        newFilm.userDetails.personalRating = null;
        newFilm.userDetails.alreadyWatched = false;
      });
      this._filmPopupComponent.setResetUserRatingHandler(resetUserRatingHandler);

      document.addEventListener(`keydown`, this._onEscKeyDown);
    };
    this._filmComponent.setOpenPopupListeners(showPopup);

    if (previousFilmComponent) {
      replace(previousFilmComponent, this._filmComponent);
    } else {
      render(this._container, this._filmComponent, RenderPosition.BEFOREEND);
    }

    if (this._filmPopupComponent) {
      this._filmPopupComponent.setFilm(film);
      this._filmPopupComponent.rerender();
      this._mode = Mode.POPUP;
    }
  }
}
