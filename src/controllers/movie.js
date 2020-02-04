import FilmModel from "../models/film";
import FilmCardComponent from "../components/film-card";
import FilmPopupComponent from "../components/film-popup";
import {remove, render, replace, RenderPosition} from "../utils/render";
import {commentDateFormat} from "../utils";

const Mode = {
  DEFAULT: `default`,
  POPUP: `popup`,
};

export default class MovieController {
  constructor(container, onDataChange, onViewChange, api) {
    this._container = container;
    this._popupContainer = document.querySelector(`body`);
    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;
    this._api = api;

    this._filmComponent = null;
    this._filmPopupComponent = null;

    this._onEscKeyDown = this._onEscKeyDown.bind(this);
    this._onCtrlEnterKeysDown = this._onCtrlEnterKeysDown.bind(this);
    this._removePopup = this._removePopup.bind(this);
    this._buildHandler = this._buildHandler.bind(this);

    this._mode = Mode.DEFAULT;

    this._film = null;
  }

  _onEscKeyDown(evt) {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey) {
      this._removePopup();
    }
  }

  _onCtrlEnterKeysDown(evt) {
    const isComboKeys = (evt.ctrlKey || evt.metaKey) && evt.key === `Enter`;

    if (isComboKeys) {
      this._submitComment(evt);
    }
  }

  _submitComment(evt) {
    const now = new Date().toDateString();
    const data = this._filmPopupComponent.getNewCommentData();

    if (data.emotion && data.text) {
      const newData = Object.assign(data, {
        id: String(Date.parse(now)) + String(Math.random()),
        author: `qwerty`,
        date: commentDateFormat(new Date()),
      });
      this._buildHandler((e, newFilm) => {
        newFilm.comments.push(newData);
      })(evt, this._film);
    } else {
      throw new Error(`Fill in comment and pick one of emoji`);
    }
  }

  _removePopup() {
    remove(this._filmPopupComponent);
    this._filmPopupComponent = null;
    this._mode = Mode.DEFAULT;
    this._film.comments = null;
    document.removeEventListener(`keydown`, this._onEscKeyDown);
    document.removeEventListener(`keydown`, this._onCtrlEnterKeysDown);
  }

  setDefaultView() {
    if (this._mode !== Mode.DEFAULT) {
      this._removePopup();
    }
  }

  _buildHandler(filmMutator) {
    return (e, changingFilm) => {
      const newFilm = FilmModel.clone(changingFilm);
      filmMutator(e, newFilm);
      this._onDataChange(this, changingFilm, newFilm);
    };
  }

  destroy() {
    remove(this._filmComponent);
  }

  render(film) {
    this._film = film;
    const previousFilmComponent = this._filmComponent;

    this._filmComponent = new FilmCardComponent(film);

    const addToWatchListHandler = this._buildHandler((e, newFilm) => {
      newFilm.userDetails.watchlist = !newFilm.userDetails.watchlist;
    });
    this._filmComponent.setAddToWatchListListener(addToWatchListHandler);

    const markAsWatchedHandler = this._buildHandler((e, newFilm) => {
      const wasWatched = newFilm.userDetails.alreadyWatched;
      newFilm.userDetails.alreadyWatched = !wasWatched;

      if (!wasWatched && newFilm.userDetails.alreadyWatched) {
        newFilm.userDetails.watchingDate = new Date();
      }
    });
    this._filmComponent.setMarkAsWatchedListener(markAsWatchedHandler);

    const addToFavoritesHandler = this._buildHandler((e, newFilm) => {
      newFilm.userDetails.favorite = !newFilm.userDetails.favorite;
    });
    this._filmComponent.setAddToFavoritesListener(addToFavoritesHandler);

    const showPopup = () => {
      this._onViewChange();
      this._filmPopupComponent = new FilmPopupComponent();
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
        newFilm.userDetails.personalRating = 0;
        newFilm.userDetails.alreadyWatched = false;
      });
      this._filmPopupComponent.setResetUserRatingHandler(resetUserRatingHandler);

      const deleteCommentHandler = this._buildHandler((e, newFilm) => {
        const commentId = e.target.dataset.commentId;
        const index = newFilm.comments.findIndex((it) => it.id === commentId);
        if (index === -1) {
          return;
        }
        newFilm.comments = [].concat(newFilm.comments.slice(0, index), newFilm.comments.slice(index + 1));
      });
      this._filmPopupComponent.setDeleteCommentListener(deleteCommentHandler);

      document.addEventListener(`keydown`, this._onEscKeyDown);
      document.addEventListener(`keydown`, this._onCtrlEnterKeysDown);
    };
    this._filmComponent.setOpenPopupListeners(() => {
      this._api.getComments(film.id).then((comments) => {
        film.comments = comments;
        showPopup();
      });
    });

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
