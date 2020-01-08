import {getFavoritesFilmsCount, getWatchedFilmsCount, getWatchlistCount} from '../utils';

export const NAVIGATION = [
  {
    title: `All movies`,
    countFilms: () => null,
    active: true,
    additional: false,
  }, {
    title: `Watchlist`,
    countFilms: getFavoritesFilmsCount,
    active: false,
    additional: false,
  }, {
    title: `History`,
    countFilms: getWatchedFilmsCount,
    active: false,
    additional: false,
  }, {
    title: `Favorites`,
    countFilms: getWatchlistCount,
    active: false,
    additional: false,
  }, {
    title: `Stats`,
    countFilms: () => null,
    active: false,
    additional: true,
  },
];
