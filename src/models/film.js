export default class FilmModel {
  constructor(data) {
    this.id = data[`id`];
    this.comments = data[`comments`];
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
    this.userDetails = data[`user_details`];
    this.userDetails.personalRating = data[`user_details`][`personal_rating`] ? data[`user_details`][`personal_rating`] : null;
    this.userDetails.watchlist = Boolean(data[`user_details`][`watchlist`]);
    this.userDetails.alreadyWatched = Boolean(data[`user_details`][`already_watched`]);
    this.userDetails.watchingDate = data[`user_details`][`watching_date`] ? new Date(data[`user_details`][`watching_date`]) : null;
    this.userDetails.favorite = Boolean(data[`user_details`][`favorite`]);
  }

  static parseFilm(data) {
    return new FilmModel(data);
  }

  static parseFilms(data) {
    return data.map(FilmModel.parseFilm);
  }
}
