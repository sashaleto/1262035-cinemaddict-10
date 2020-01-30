import FilmCardComponent from "../components/film-card";
import FilmPopupComponent from "../components/film-popup";
import {generateComments} from "../moks/comment";
import {remove, render, RenderPosition} from "../utils/render";

export default class MovieController {
  constructor(container) {
    this._container = container;
    this._popupContainer = document.querySelector(`body`);

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
    this._filmComponent = new FilmCardComponent(film);
    const filmComments = generateComments(4);
    this._filmPopupComponent = new FilmPopupComponent(film, filmComments);

    render(this._container, this._filmComponent, RenderPosition.BEFOREEND);

    this._filmComponent.setOpenPopupListeners(this._showPopup);
  }
}
