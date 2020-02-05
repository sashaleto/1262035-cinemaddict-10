export default class FilmModel {
  constructor(film) {
    this.id = film[`id`];
    this.commentsIds = film[`comments`];
    this.comments = [];
    this.commentsCount = film[`comments`].length;
    this.title = film[`film_info`][`title`];
    this.alternativeTitle = film[`film_info`][`alternative_title`];
    this.rating = film[`film_info`][`total_rating`];
    this.poster = film[`film_info`][`poster`];
    this.ageRating = film[`film_info`][`age_rating`];
    this.director = film[`film_info`][`director`];
    this.writers = new Set(film[`film_info`][`writers`]);
    this.actors = new Set(film[`film_info`][`actors`]);
    this.releaseDate = new Date(film[`film_info`][`release`][`date`]);
    this.country = film[`film_info`][`release`][`release_country`];
    this.runtime = film[`film_info`][`runtime`];
    this.genres = new Set(film[`film_info`][`genre`]);
    this.description = film[`film_info`][`description`];
    this.userDetails = {};
    this.userDetails.personalRating = film[`user_details`][`personal_rating`] ? film[`user_details`][`personal_rating`] : 0;
    this.userDetails.watchlist = Boolean(film[`user_details`][`watchlist`]);
    this.userDetails.alreadyWatched = Boolean(film[`user_details`][`already_watched`]);
    this.userDetails.watchingDate = film[`user_details`][`watching_date`] ? new Date(film[`user_details`][`watching_date`]) : new Date();
    this.userDetails.favorite = Boolean(film[`user_details`][`favorite`]);
  }

  toRAW() {
    return {
      'id': this.id,
      'comments': this.commentsIds,
      'film_info': {
        'title': this.title,
        'alternative_title': this.alternativeTitle,
        'total_rating': this.rating,
        'poster': this.poster,
        'age_rating': this.ageRating,
        'director': this.director,
        'writers': Array.from(this.writers),
        'actors': Array.from(this.actors),
        'release': {
          'date': this.releaseDate.toISOString(),
          'release_country': this.country,
        },
        'runtime': this.runtime,
        'genre': Array.from(this.genres),
        'description': this.description,
      },
      'user_details': {
        'personal_rating': this.userDetails.personalRating,
        'watchlist': this.userDetails.watchlist,
        'already_watched': this.userDetails.alreadyWatched,
        'watching_date': this.userDetails.watchingDate.toISOString(),
        'favorite': this.userDetails.favorite,
      }
    };
  }

  static parseFilm(film) {
    return new FilmModel(film);
  }

  static parseFilms(films) {
    return films.map(FilmModel.parseFilm);
  }

  static clone(film) {
    return new FilmModel(film.toRAW());
  }
}
