import {FilterType} from '../constants';
import {getFilmsByFilter} from '../utils/filters';

export default class Movies {
  constructor() {
    this._films = [];
    this._filterChangeHandlers = [];
    this._dataChangeHandlers = [];
    this._activeFilterType = FilterType.ALL;
  }

  getFilms() {
    return getFilmsByFilter(this._films, this._activeFilterType);
  }

  getAllFilms() {
    return this._films;
  }

  setFilms(films) {
    this._films = Array.from(films);
  }

  updateFilm(id, film) {
    const index = this._films.findIndex((it) => it.id === id);

    if (index === -1) {
      return false;
    }

    this._films = [].concat(this._films.slice(0, index), film, this._films.slice(index + 1));

    this._callHandlers(this._dataChangeHandlers);

    return true;
  }

  setFilter(filterType) {
    this._activeFilterType = filterType;
    this._callHandlers(this._filterChangeHandlers);
  }

  setFilterChangeHandler(handler) {
    this._filterChangeHandlers.push(handler);
  }

  setDataChangeHandler(handler) {
    this._dataChangeHandlers.push(handler);
  }

  _callHandlers(handlers) {
    handlers.forEach((handler) => handler());
  }
}
