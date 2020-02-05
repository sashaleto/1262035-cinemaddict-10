import {FilterType} from '../constants';

export const getFavoritesFilms = (films) => {
  return films.filter((film) => !!film.userDetails.favorite);
};

export const getWatchedFilms = (films) => {
  return films.filter((film) => !!film.userDetails.alreadyWatched);
};

export const getISFilmInWatchlist = (films) => {
  return films.filter((film) => !!film.userDetails.watchlist);
};

export const getFilmsByFilter = (films, filterType) => {
  switch (filterType) {
    case FilterType.ALL:
      return films;
    case FilterType.WATCHLIST:
      return getISFilmInWatchlist(films);
    case FilterType.HISTORY:
      return getWatchedFilms(films);
    case FilterType.FAVORITES:
      return getFavoritesFilms(films);
    case FilterType.STATS:
      return [];
  }

  return films;
};
