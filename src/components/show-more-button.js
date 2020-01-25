import AbstractComponent from "./abstract";

const createShowMoreBtnTemplate = () => {
  return `<button class="films-list__show-more">Show more</button>`;
};

export default class ShowMoreComponent extends AbstractComponent {
  getTemplate() {
    return createShowMoreBtnTemplate();
  }

  setClickHandler(handler) {
    this.getElement().addEventListener(`click`, handler);
  }
}
