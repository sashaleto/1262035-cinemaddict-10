import AbstractComponent from "./abstract";

const FILTER_HREF_PREFIX = `#`;

const getFilterNameByHash = (hash) => {
  return hash.substring(FILTER_HREF_PREFIX.length);
};

const createSingleNavItemTemplate = (navItem) => {
  const {title, count, active, additional} = navItem;
  const activeClass = active ? `main-navigation__item--active` : ``;
  const additionalClass = additional ? ` main-navigation__item--additional` : ``;
  const formattedTitle = title.charAt(0).toUpperCase() + title.substring(1);

  return `
    <a href="#${title.toLowerCase().split(` `)[0]}" class="main-navigation__item ${activeClass} ${additionalClass}">
        ${formattedTitle}
        ${count ? ` <span class="main-navigation__item-count">${count}</span>` : ``}
    </a>
  `;
};

const createNavigationTemplate = (navItems) => {
  const navigationTemplate = navItems.map((item) => {
    return createSingleNavItemTemplate(item);
  }).join(``);

  return `
    <nav class="main-navigation">
        ${navigationTemplate}
    </nav>
  `;
};

export default class NavigationComponent extends AbstractComponent {
  constructor(navItems) {
    super();
    this._navItems = navItems;
    this._currentNavItem = this.getElement().querySelector(`.main-navigation__item--active`);
  }

  getTemplate() {
    return createNavigationTemplate(this._navItems);
  }

  setFilterChangeHandler(handler) {
    this.getElement().addEventListener(`click`, (evt) => {
      evt.preventDefault();

      if (this._currentNavItem === evt.target) {
        return;
      }

      const filterName = getFilterNameByHash(evt.target.hash);

      this._currentNavItem.classList.remove(`main-navigation__item--active`);
      evt.target.classList.add(`main-navigation__item--active`);
      this._currentNavItem = evt.target;

      handler(filterName);
    });
  }
}
