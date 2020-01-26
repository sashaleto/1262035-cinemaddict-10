import AbstractComponent from "./abstract";

export const SortType = {
  DATE_DOWN: `date-down`,
  RATING_DOWN: `rating-down`,
  DEFAULT: `default`,
};

const createSortingTemplate = () => {
  return `
    <ul class="sort">
      <li><a href="#" data-sort-type="${SortType.DEFAULT}" class="sort__button sort__button--active">Sort by default</a></li>
      <li><a href="#" data-sort-type="${SortType.DATE_DOWN}" class="sort__button">Sort by date</a></li>
      <li><a href="#" data-sort-type="${SortType.RATING_DOWN}" class="sort__button">Sort by rating</a></li>
    </ul>
  `;
};

export default class SortingComponent extends AbstractComponent {
  constructor() {
    super();
    this._currentSortType = SortType.DEFAULT;
    this._currentSortButton = null;
  }

  getTemplate() {
    return createSortingTemplate();
  }

  getCurrentSortButton() {
    if (!this._currentSortButton) {
      this._currentSortButton = this.getElement().querySelector(`.sort__button--active`);
    }

    return this._currentSortButton;
  }

  setSortTypeChangeHandler(handler) {
    this.getElement().addEventListener(`click`, (evt) => {
      evt.preventDefault();

      if (evt.target.tagName !== `A`) {
        return;
      }

      const sortType = evt.target.dataset.sortType;

      if (this._currentSortType === sortType) {
        return;
      }

      this.getCurrentSortButton().classList.remove(`sort__button--active`);
      evt.target.classList.add(`sort__button--active`);

      this._currentSortButton = evt.target;
      this._currentSortType = sortType;

      handler(this._currentSortType);
    });
  }
}
