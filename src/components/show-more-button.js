import {createElement} from "../utils";

const createShowMoreBtnTemplate = () => {
  return `<button class="films-list__show-more">Show more</button>`;
};

export default class ShowMoreComponent {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createShowMoreBtnTemplate();
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
