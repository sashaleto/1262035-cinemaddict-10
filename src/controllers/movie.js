import FilmCardComponent from "../components/film-card";
import FilmPopupComponent from "../components/film-popup";
import {generateComments} from "../moks/comment";
import {remove, render, replace, RenderPosition} from "../utils/render";

export default class MovieController {
  constructor(container, onDataChange) {
    this._container = container;
    this._popupContainer = document.querySelector(`body`);
    this._onDataChange = onDataChange;

    this._filmComponent = null;
    this._filmPopupComponent = null;

    this._onEscKeyDown = this._onEscKeyDown.bind(this);
    this._showPopup = this._showPopup.bind(this);
    this._removePopup = this._removePopup.bind(this);
  }

  _onEscKeyDown(evt) {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey) {
      this._removePopup();
    }
  }

  _removePopup() {
    remove(this._filmPopupComponent);
    document.removeEventListener(`keydown`, this._onEscKeyDown);
  }

  _showPopup() {
    render(this._popupContainer, this._filmPopupComponent, RenderPosition.BEFOREEND);
    this._filmPopupComponent.setCloseButtonClickHandler(this._removePopup);
    document.addEventListener(`keydown`, this._onEscKeyDown);
  }

  render(film) {
    const filmOldComponent = this._filmComponent;
    const filmOldPopupComponent = this._filmPopupComponent;

    const filmComments = generateComments(4);
    this._filmComponent = new FilmCardComponent(film);
    this._filmPopupComponent = new FilmPopupComponent(film, filmComments);

    this._filmComponent.setOpenPopupListeners(this._showPopup);

    this._filmComponent.setAddToWatchListListener((e) => {
      e.preventDefault();
      const newData = Object.assign({}, film);
      newData.userDetails.watchlist = !film.userDetails.watchlist;
      this._onDataChange(this, film, newData);
    });

    this._filmComponent.setMarkAsWatchedListener((e) => {
      e.preventDefault();
      const newData = Object.assign({}, film);
      newData.userDetails.alreadyWatched = !film.userDetails.alreadyWatched;
      this._onDataChange(this, film, newData);
    });

    this._filmComponent.setAddToFavoritesListener((e) => {
      e.preventDefault();
      const newData = Object.assign({}, film);
      newData.userDetails.favorite = !film.userDetails.favorite;
      this._onDataChange(this, film, newData);
    });

    if (filmOldComponent && filmOldPopupComponent) {
      replace(filmOldComponent, this._filmComponent);
      replace(filmOldPopupComponent, this._filmPopupComponent);
    } else {
      render(this._container, this._filmComponent, RenderPosition.BEFOREEND);
    }
  }
}
