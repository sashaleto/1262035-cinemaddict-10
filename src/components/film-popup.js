import AbstractSmartComponent from "./abstract-smart";
import he from 'he';
import {runtimeFormat, releaseDateFormat, commentDateFormat, shakeAnimation} from "../utils";
import {EMOTIONS} from "../constants";

const createGenresTemplate = (genres) => {
  return Array.from(genres).map((genre) => {
    return `<span class="film-details__genre">${genre}</span>`;
  }).join(``);
};

const createCommentsTemplate = (comments) => {
  return comments.map((comment) => {
    const date = commentDateFormat(comment.date);

    return `
    <li class="film-details__comment">
      <span class="film-details__comment-emoji">
        <img src="./images/emoji/${comment.emotion}.png" width="55" height="55" alt="emoji">
      </span>
      <div>
        <p class="film-details__comment-text">${comment.text}</p>
        <p class="film-details__comment-info">
          <span class="film-details__comment-author">${comment.author}</span>
          <span class="film-details__comment-day">${date}</span>
          <button class="film-details__comment-delete" data-comment-id="${comment.id}">Delete</button>
        </p>
      </div>
    </li>
  `;
  }).join(``);
};

const createUserRatingTemplate = (title, poster, rating) => {
  const ratingScore = Array(9).fill(``).map((item, index) => {
    const rate = index + 1;
    return `
        <input type="radio" name="score" class="film-details__user-rating-input visually-hidden" 
               value="${rate}" id="rating-${rate}" ${(rating === rate) ? `checked` : ``}>
        <label class="film-details__user-rating-label" for="rating-${rate}">${rate}</label>
    `;
  }).join(``);

  return `
    <div class="form-details__middle-container">
      <section class="film-details__user-rating-wrap">
        <div class="film-details__user-rating-controls">
          <button class="film-details__watched-reset" type="button">Undo</button>
        </div>

        <div class="film-details__user-score">
          <div class="film-details__user-rating-poster">
            <img src="${poster}" alt="film-poster" class="film-details__user-rating-img">
          </div>

          <section class="film-details__user-rating-inner">
            <h3 class="film-details__user-rating-title">${title}</h3>

            <p class="film-details__user-rating-feelings">How you feel it?</p>

            <div class="film-details__user-rating-score">
                ${ratingScore}
            </div>
          </section>
        </div>
      </section>
    </div>
  `;
};

const createCommentEmotionsTemplate = (emotions) => {
  return emotions.map((emoji) => {
    return `
        <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-${emoji}" value="${emoji}">
        <label class="film-details__emoji-label" for="emoji-${emoji}">
          <img src="./images/emoji/${emoji}.png" width="30" height="30" alt="${emoji}">
        </label>
    `;
  }).join(``);
};

const createFilmPopupTemplate = (film, comments) => {
  const writers = Array.from(film.writers).map((name) => name).join(`, `);
  const actors = Array.from(film.actors).map((name) => name).join(`, `);
  const genres = createGenresTemplate(film.genres);
  const allComments = createCommentsTemplate(comments);

  const isInWatchList = film.userDetails.watchlist;
  const isWatched = film.userDetails.alreadyWatched;
  const isInFavorites = film.userDetails.favorite;

  const genresTitle = (film.genres.size > 1) ? `Genres` : `Genre`;

  const userRating = createUserRatingTemplate(film.title, film.poster, film.userDetails.personalRating);
  const commentEmotions = createCommentEmotionsTemplate(EMOTIONS);

  return `
      <section class="film-details">
        <form class="film-details__inner" action="" method="get">
          <div class="form-details__top-container">
            <div class="film-details__close">
              <button class="film-details__close-btn" type="button">close</button>
            </div>
            <div class="film-details__info-wrap">
              <div class="film-details__poster">
                <img class="film-details__poster-img" src="${film.poster}" alt="">
      
                <p class="film-details__age">${film.ageRating}+</p>
              </div>
      
              <div class="film-details__info">
                <div class="film-details__info-head">
                  <div class="film-details__title-wrap">
                    <h3 class="film-details__title">${film.title}</h3>
                    <p class="film-details__title-original">Original: ${film.alternativeTitle}</p>
                  </div>
      
                  <div class="film-details__rating">
                    <p class="film-details__total-rating">${film.rating}</p>
                  </div>
                </div>
      
                <table class="film-details__table">
                  <tr class="film-details__row">
                    <td class="film-details__term">Director</td>
                    <td class="film-details__cell">${film.director}</td>
                  </tr>
                  <tr class="film-details__row">
                    <td class="film-details__term">Writers</td>
                    <td class="film-details__cell">${writers}</td>
                  </tr>
                  <tr class="film-details__row">
                    <td class="film-details__term">Actors</td>
                    <td class="film-details__cell">${actors}</td>
                  </tr>
                  <tr class="film-details__row">
                    <td class="film-details__term">Release Date</td>
                    <td class="film-details__cell">${releaseDateFormat(film.releaseDate)}</td>
                  </tr>
                  <tr class="film-details__row">
                    <td class="film-details__term">Runtime</td>
                    <td class="film-details__cell">${runtimeFormat(film.runtime)}</td>
                  </tr>
                  <tr class="film-details__row">
                    <td class="film-details__term">Country</td>
                    <td class="film-details__cell">${film.country}</td>
                  </tr>
                  <tr class="film-details__row">
                    <td class="film-details__term">${genresTitle}</td>
                    <td class="film-details__cell">
                      ${genres}
                    </td>
                  </tr>
                </table>
      
                <p class="film-details__film-description">
                  ${film.description}
                </p>
              </div>
            </div>
      
            <section class="film-details__controls">
              <input type="checkbox" class="film-details__control-input visually-hidden" id="watchlist" name="watchlist" ${isInWatchList ? `checked` : ``}>
              <label for="watchlist" class="film-details__control-label film-details__control-label--watchlist">Add to watchlist</label>
      
              <input type="checkbox" class="film-details__control-input visually-hidden" id="watched" name="watched" ${isWatched ? `checked` : ``}>
              <label for="watched" class="film-details__control-label film-details__control-label--watched">Already watched</label>
      
              <input type="checkbox" class="film-details__control-input visually-hidden" id="favorite" name="favorite" ${isInFavorites ? `checked` : ``}>
              <label for="favorite" class="film-details__control-label film-details__control-label--favorite">Add to favorites</label>
            </section>
          </div>
          
          ${isWatched ? userRating : ``}
        
          <div class="form-details__bottom-container">
            <section class="film-details__comments-wrap">
              <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${comments.length}</span></h3>
      
              <ul class="film-details__comments-list">
                ${allComments}
              </ul>
      
              <div class="film-details__new-comment">
                <div for="add-emoji" class="film-details__add-emoji-label"></div>
      
                <label class="film-details__comment-label">
                  <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"></textarea>
                </label>
      
                <div class="film-details__emoji-list">
                  ${commentEmotions}
                </div>
              </div>
            </section>
          </div>
        </form>
    </section>
  `;
};

export default class FilmPopupComponent extends AbstractSmartComponent {
  constructor() {
    super();
    this._film = null;
    this._comments = null;
    this._closeButtonClickHandler = null;
    this._addToWatchClickHandler = null;
    this._markAsWatchedhClickHandler = null;
    this._addToFavoritesClickHandler = null;
    this._userRatingHandler = null;
    this._resetUserRatingHandler = null;
    this._deleteCommentClickHandler = null;
    this._userRatingForm = null;
  }

  getTemplate() {
    return createFilmPopupTemplate(this._film, this._comments);
  }

  rerender() {
    super.rerender();
    this._userRatingForm = null;
  }

  recoveryListeners() {
    this.setUserRatingScoreHandler(this._userRatingHandler);
    this.setResetUserRatingHandler(this._resetUserRatingHandler);
    this.setCloseButtonClickHandler(this._closeButtonClickHandler);
    this.setAddToWatchListListener(this._addToWatchClickHandler);
    this.setMarkAsWatchedListener(this._markAsWatchedhClickHandler);
    this.setAddToFavoritesListener(this._addToFavoritesClickHandler);
    this.setDeleteCommentListener(this._deleteCommentClickHandler);
  }

  setFilm(film) {
    this._film = film;
  }

  setComments(comments) {
    this._comments = comments;
  }

  deleteComment(commentId) {
    this._comments = this._comments.filter((comment) => comment.id !== commentId);
  }

  getNewCommentData() {
    const checkedEmotion = this.getElement().querySelector(`[name="comment-emoji"]:checked`);
    const text = this.getElement().querySelector(`.film-details__comment-input`).value;
    return {
      emotion: checkedEmotion ? checkedEmotion.value : ``,
      text: he.encode(text),
    };
  }

  toggleCommentFieldState(state) {
    const field = this.getElement().querySelector(`.film-details__comment-input`);
    switch (state) {
      case `disabled`:
        field.setAttribute(`disabled`, `disabled`);
        field.style.outline = `none`;
        break;
      case `enabled`:
        field.removeAttribute(`disabled`);
        break;
    }
  }

  toggleRatingFormState(state) {
    const field = this.getElement().querySelectorAll(`.film-details__user-rating-input`);
    switch (state) {
      case `disabled`:
        field.forEach((radio) => {
          radio.setAttribute(`disabled`, `disabled`);
          radio.nextElementSibling.style.background = ``;
        });
        break;
      case `enabled`:
        field.forEach((radio) => radio.removeAttribute(`disabled`));
        break;
    }
  }

  makeRatingScoreFailWarning() {
    const checkedRating = this.getElement().querySelector(`.film-details__user-rating-input:checked + .film-details__user-rating-label`);
    checkedRating.style.background = `red`;
    shakeAnimation(this._userRatingForm, 1500);
    this.toggleRatingFormState(`enabled`);
  }

  makePostCommentFailWarning() {
    const input = this.getElement().querySelector(`.film-details__comment-input`);
    input.style.outline = `2px solid red`;
    shakeAnimation(input, 1500);
    this.toggleCommentFieldState(`enabled`);
  }

  setUserRatingScoreHandler(handler) {
    this._userRatingHandler = handler;
    this._userRatingForm = this.getElement().querySelector(`.film-details__user-rating-score`);
    if (this._userRatingForm) {
      this._userRatingForm.addEventListener(`change`, (e) => {
        this._userRatingHandler(e, this._film);
      });
    }
  }

  setResetUserRatingHandler(handler) {
    this._resetUserRatingHandler = handler;
    const resetUserRating = this.getElement().querySelector(`.film-details__watched-reset`);
    if (resetUserRating) {
      resetUserRating.addEventListener(`click`, (e) => {
        this._resetUserRatingHandler(e, this._film);
      });
    }
  }

  setCloseButtonClickHandler(handler) {
    this._closeButtonClickHandler = handler;
    this.getElement().querySelector(`.film-details__close-btn`).addEventListener(`click`, this._closeButtonClickHandler);
  }

  setAddToWatchListListener(handler) {
    this._addToWatchClickHandler = handler;
    this.getElement().querySelector(`.film-details__control-label--watchlist`).addEventListener(`click`, (e) => {
      e.preventDefault();
      this._addToWatchClickHandler(e, this._film);
    });
  }

  setMarkAsWatchedListener(handler) {
    this._markAsWatchedhClickHandler = handler;
    this.getElement().querySelector(`.film-details__control-label--watched`).addEventListener(`click`, (e) => {
      e.preventDefault();
      this._markAsWatchedhClickHandler(e, this._film);
    });
  }

  setAddToFavoritesListener(handler) {
    this._addToFavoritesClickHandler = handler;
    this.getElement().querySelector(`.film-details__control-label--favorite`).addEventListener(`click`, (e) => {
      e.preventDefault();
      this._addToFavoritesClickHandler(e, this._film);
    });
  }

  setDeleteCommentListener(handler) {
    this._deleteCommentClickHandler = handler;
    this.getElement().querySelector(`.film-details__comments-list`).addEventListener(`click`, (e) => {
      e.preventDefault();

      if (!e.target.classList.contains(`film-details__comment-delete`)) {
        return;
      }

      this._deleteCommentClickHandler(e, this._film);
    });
  }
}
