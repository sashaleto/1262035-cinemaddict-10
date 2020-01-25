import AbstractComponent from "./abstract";

const createFilmsBoardTemplate = () => {
  return `<section class="films"></section>`;
};

export default class BoardComponent extends AbstractComponent {
  getTemplate() {
    return createFilmsBoardTemplate();
  }
}
