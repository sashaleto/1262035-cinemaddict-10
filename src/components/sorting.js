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
  getTemplate() {
    return createSortingTemplate();
  }
}
