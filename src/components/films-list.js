import AbstractComponent from './abstract';

const createFilmListTemplate = (sectionClass, listTitle, isTitleHidden) => {
  return `
    <section class="${sectionClass}">
      <h2 class="films-list__title ${isTitleHidden ? `visually-hidden` : ``}">${listTitle}</h2>
      <div class="films-list__container"></div>
    </section>
  `;
};

export default class FilmListComponent extends AbstractComponent {
  constructor(sectionClass, listTitle, isTitleHidden) {
    super();
    this._class = sectionClass;
    this._title = listTitle;
    this._isTitleHidden = isTitleHidden;
  }

  getTemplate() {
    return createFilmListTemplate(this._class, this._title, this._isTitleHidden);
  }

  getFilmsListContainer() {
    return this.getElement().querySelector(`.films-list__container`);
  }
}
