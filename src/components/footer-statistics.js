import AbstractComponent from "./abstract";

const createFooterStatisticsTemplate = (number) => {
  return `
      <section class="footer__statistics">
          <p>${number} movies inside</p>
      </section>
    `;
};

export default class FooterStatistics extends AbstractComponent {
  constructor(films) {
    super();
    this._filmsCount = films.length;
  }

  getTemplate() {
    return createFooterStatisticsTemplate(this._filmsCount);
  }
}
