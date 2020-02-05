import AbstractComponent from './abstract';

const createNoFilmsTemplate = () => {
  return `<h2 class="films-list__title">There are no movies in our database</h2>`;
};

export default class NoFilmsComponent extends AbstractComponent {
  getTemplate() {
    return createNoFilmsTemplate();
  }
}
