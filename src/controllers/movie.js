import FilmCardComponent from "../components/film-card";
import FilmPopupComponent from "../components/film-popup";
import {generateComments} from "../moks/comment";
import {remove, render, RenderPosition} from "../utils/render";

export default class MovieController {
  constructor(container) {
    this._container = container;
    this._popupContainer = document.querySelector(`body`);
  }

  render(film) {
    const filmComponent = new FilmCardComponent(film);
    const filmComments = generateComments(4);
    const filmPopupComponent = new FilmPopupComponent(film, filmComments);

    render(this._container, filmComponent, RenderPosition.BEFOREEND);

    const showPopup = () => {
      render(this._popupContainer, filmPopupComponent, RenderPosition.BEFOREEND);
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
  }
}
