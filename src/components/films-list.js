import {createElement} from "../utils";

const createFilmListTemplate = (sectionClass, listTitle, isTitleHidden) => {
  return `
    <section class="${sectionClass}">
      <h2 class="films-list__title ${isTitleHidden ? `visually-hidden` : ``}">${listTitle}</h2>
      <div class="films-list__container"></div>
    </section>
  `;
};

export default class FilmListComponent {
  constructor(sectionClass, listTitle, isTitleHidden) {
    this._element = null;
    this._class = sectionClass;
    this._title = listTitle;
    this._isTitleHidden = isTitleHidden;
  }

  getTemplate() {
    return createFilmListTemplate(this._class, this._title, this._isTitleHidden);
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
