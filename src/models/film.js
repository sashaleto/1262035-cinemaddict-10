export default class FilmModel {
  constructor(data) {
    this.id = data[`id`];
    this.commentsIds = data[`comments`];
    this.comments = [];
    this.commentsCount = data[`comments`].length;
    this.title = data[`film_info`][`title`];
    this.alternativeTitle = data[`film_info`][`alternative_title`];
    this.rating = data[`film_info`][`total_rating`];
    this.poster = data[`film_info`][`poster`];
    this.ageRating = data[`film_info`][`age_rating`];
    this.director = data[`film_info`][`director`];
    this.writers = new Set(data[`film_info`][`writers`]);
    this.actors = new Set(data[`film_info`][`actors`]);
    this.releaseDate = new Date(data[`film_info`][`release`][`date`]);
    this.country = data[`film_info`][`release`][`release_country`];
    this.runtime = data[`film_info`][`runtime`];
    this.genres = new Set(data[`film_info`][`genre`]);
    this.description = data[`film_info`][`description`];
    this.userDetails = {};
    this.userDetails.personalRating = data[`user_details`][`personal_rating`] ? data[`user_details`][`personal_rating`] : 0;
    this.userDetails.watchlist = Boolean(data[`user_details`][`watchlist`]);
    this.userDetails.alreadyWatched = Boolean(data[`user_details`][`already_watched`]);
    this.userDetails.watchingDate = data[`user_details`][`watching_date`] ? new Date(data[`user_details`][`watching_date`]) : new Date();
    this.userDetails.favorite = Boolean(data[`user_details`][`favorite`]);
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

  static parseFilm(data) {
    return new FilmModel(data);
  }

  static parseFilms(data) {
    return data.map(FilmModel.parseFilm);
  }

  static clone(data) {
    return new FilmModel(data.toRAW());
  }
}
