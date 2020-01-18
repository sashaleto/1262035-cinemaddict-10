import {createElement} from "../utils";

const createFilmsBoardTemplate = () => {
  return `<section class="films"></section>`;
};

export default class BoardComponent {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createFilmsBoardTemplate();
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
