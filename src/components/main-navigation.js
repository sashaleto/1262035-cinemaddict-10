import AbstractComponent from "./abstract";

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

export default class NavigationComponent extends AbstractComponent {
  constructor(navItems, films) {
    super();
    this._navItems = navItems;
    this._films = films;
  }

  getTemplate() {
    return createNavigationTemplate(this._navItems, this._films);
  }
}
