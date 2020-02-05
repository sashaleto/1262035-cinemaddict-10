import {remove, render, replace, RenderPosition} from '../utils/render';
import FilmModel from '../models/film';
import FilmCardComponent from '../components/film-card';
import FilmPopupComponent from '../components/film-popup';

const Mode = {
  DEFAULT: `default`,
  POPUP: `popup`,
};

export default class MovieController {
  constructor(container, onDataChange, onViewChange, api, filmsModel) {
    this._container = container;
    this._popupContainer = document.querySelector(`body`);
    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;
    this._api = api;
    this._filmsModel = filmsModel;

    this._filmComponent = null;
    this._filmPopupComponent = null;

    this._onEscKeyDown = this._onEscKeyDown.bind(this);
    this._onCtrlEnterKeysDown = this._onCtrlEnterKeysDown.bind(this);
    this._removePopup = this._removePopup.bind(this);
    this._buildHandler = this._buildHandler.bind(this);
    this._submitComment = this._submitComment.bind(this);
    this._deleteComment = this._deleteComment.bind(this);
    this._setUserRating = this._setUserRating.bind(this);

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

  _submitComment(e) {
    const commentData = this._filmPopupComponent.getNewCommentData();
    this._filmPopupComponent.toggleCommentFieldState(`disabled`);
    e.target.style.outline = `none`;

    if (commentData.emotion && commentData.text) {
      commentData.date = new Date();

      this._api.postComment(commentData, this._film.id)
        .then((movieWithComment) => {
          this._filmPopupComponent.setComments(movieWithComment.comments);
          this._filmsModel.updateFilm(movieWithComment.movie.id, movieWithComment.movie);
          this._filmPopupComponent.rerender();
        }).catch(() => {
          this._filmPopupComponent.makePostCommentFailWarning();
        });
    } else {
      this._filmPopupComponent.toggleCommentFieldState(`enabled`);
      throw new Error(`Fill in comment and pick one of emoji`);
    }
  }

  _deleteComment(e) {
    const commentId = e.target.dataset.commentId;

    this._api.deleteComment(commentId).then(() => {
      this._filmPopupComponent.deleteComment(commentId);
      this._filmPopupComponent.rerender();
      this._film.commentsCount--;
      this._filmsModel.updateFilm(this._film.id, this._film);
    });
  }

  _setUserRating(e) {
    this._filmPopupComponent.toggleRatingFormState(`disabled`);
    const oldRating = this._film.userDetails.personalRating;
    this._film.userDetails.personalRating = +e.target.value;

    this._api.updateFilm(this._film.id, this._film)
      .then(() => {
        this._filmPopupComponent.rerender();
        this._filmsModel.updateFilm(this._film.id, this._film);
      }).catch(() => {
        this._filmPopupComponent.makeRatingScoreFailWarning();
        this._film.userDetails.personalRating = oldRating;
        e.target.checked = false;
      });
  }

  _removePopup() {
    remove(this._filmPopupComponent);
    this._filmPopupComponent = null;
    this._mode = Mode.DEFAULT;
    this._film.comments = null;
    document.removeEventListener(`keydown`, this._onEscKeyDown);
    document.removeEventListener(`keydown`, this._onCtrlEnterKeysDown);
    document.querySelector(`body`).classList.remove(`hide-overflow`);
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

    const showPopup = (comments) => {
      this._onViewChange();
      this._filmPopupComponent = new FilmPopupComponent();
      this._mode = Mode.POPUP;
      this._filmPopupComponent.setFilm(film);
      this._filmPopupComponent.setComments(comments);

      render(this._popupContainer, this._filmPopupComponent, RenderPosition.BEFOREEND);

      this._filmPopupComponent.setCloseButtonClickHandler(this._removePopup);
      this._filmPopupComponent.setAddToWatchListListener(addToWatchListHandler);
      this._filmPopupComponent.setMarkAsWatchedListener(markAsWatchedHandler);
      this._filmPopupComponent.setAddToFavoritesListener(addToFavoritesHandler);
      this._filmPopupComponent.setUserRatingScoreHandler(this._setUserRating);

      const resetUserRatingHandler = this._buildHandler((e, newFilm) => {
        newFilm.userDetails.personalRating = 0;
        newFilm.userDetails.alreadyWatched = false;
      });
      this._filmPopupComponent.setResetUserRatingHandler(resetUserRatingHandler);

      this._filmPopupComponent.setDeleteCommentListener(this._deleteComment);

      document.addEventListener(`keydown`, this._onEscKeyDown);
      document.addEventListener(`keydown`, this._onCtrlEnterKeysDown);
    };
    this._filmComponent.setOpenPopupListeners(() => {
      this._api.getComments(film.id).then((comments) => {
        showPopup(comments);
        document.querySelector(`body`).classList.add(`hide-overflow`);
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
