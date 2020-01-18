import {createElement} from "../utils";

const createSingleNavItemTemplate = (navItem, films) => {
  const {title, countFilms, active, additional} = navItem;
  const activeClass = active ? `main-navigation__item--active` : ``;
  const additionalClass = additional ? ` main-navigation__item--additional` : ``;
  const count = countFilms(films);

  return `
    <a href="#${title.toLowerCase().split(` `)[0]}" class="main-navigation__item ${activeClass} ${additionalClass}">
        ${title}
        ${count ? ` <span class="main-navigation__item-count">${count}</span>` : ``}
    </a>
  `;
};

const createNavigationTemplate = (navItems, films) => {
  const navigationTemplate = navItems.map((item) => {
    return createSingleNavItemTemplate(item, films);
  }).join(``);

  return `
    <nav class="main-navigation">
        ${navigationTemplate}
    </nav>
  `;
};

export default class NavigationComponent {
  constructor(navItems, films) {
    this._element = null;
    this._navItems = navItems;
    this._films = films;
  }

  getTemplate() {
    return createNavigationTemplate(this._navItems, this._films);
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
