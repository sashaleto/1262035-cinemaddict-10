import {getWatchedFilms} from './filters';
import {RangeType} from '../constants';

const makeAllGenresObject = (films) => {
  const stats = {};

  films.forEach((film) => {
    const genres = film.genres;
    genres.forEach((genre) => {
      stats[genre] = stats[genre] ? stats[genre] + 1 : 1;
    });
  });

  return stats;
};

const filterFilmsByTimeRange = (dateFrom, films) => {
  return films.filter((film) => {
    const watchingDate = film.userDetails.watchingDate;

    return watchingDate >= dateFrom;
  });
};

export const getWatchedFilmsCount = (films) => {
  return getWatchedFilms(films).length;
};

export const countTotalDuration = (films) => {
  return films.map((film) => film.runtime).reduce((a, b) => a + b, 0);
};

export const getStatsByType = (films, type) => {
  let filteredFilms = getWatchedFilms(films);
  const stats = {
    watchedMoviesCount: 0,
    totalDuration: 0,
    topGenre: ``,
    genresStats: {
      genre: ``,
      moviesCount: 0,
    },
  };
  const now = new Date();

  switch (type) {
    case RangeType.ALL:
      break;
    case RangeType.TODAY:
      const midnight = new Date();
      midnight.setHours(0, 0, 0, 0);
      filteredFilms = filterFilmsByTimeRange(midnight, filteredFilms);
      break;
    case RangeType.WEEK:
      const weekAgo = new Date(now.getMilliseconds() - (7 * 24 * 60 * 60 * 1000));
      filteredFilms = filterFilmsByTimeRange(weekAgo, filteredFilms);
      break;
    case RangeType.MONTH:
      const monthAgo = new Date(now.getMilliseconds() - (30 * 24 * 60 * 60 * 1000));
      filteredFilms = filterFilmsByTimeRange(monthAgo, filteredFilms);
      break;
    case RangeType.YEAR:
      const yearAgo = new Date(now.getMilliseconds() - (365 * 24 * 60 * 60 * 1000));
      filteredFilms = filterFilmsByTimeRange(yearAgo, filteredFilms);
      break;
  }

  stats.watchedMoviesCount = getWatchedFilmsCount(filteredFilms);
  stats.totalDuration = countTotalDuration(filteredFilms);
  stats.genresStats = makeAllGenresObject(filteredFilms);
  stats.topGenre = sortGenresByCount(stats.genresStats)[0].genre;

  return stats;
};

export const sortGenresByCount = (genresStats) => {
  return Object.keys(genresStats).map((key) => {
    return {
      genre: key,
      count: genresStats[key],
    };
  }).sort((a, b) => b.count - a.count);
};
