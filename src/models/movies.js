export default class Movies {
  constructor() {
    this._films = [];
  }

  getFilms() {
    return this._films;
  }

  setFilms(films) {
    this._films = Array.from(films);
  }
}
