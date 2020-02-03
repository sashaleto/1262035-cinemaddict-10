import AbstractComponent from "./abstract";

const createSingleNavItemTemplate = (navItem) => {
  const {title, count, active, additional} = navItem;
  const activeClass = active ? `main-navigation__item--active` : ``;
  const additionalClass = additional ? ` main-navigation__item--additional` : ``;

  return `
    <a href="#${title.toLowerCase().split(` `)[0]}" class="main-navigation__item ${activeClass} ${additionalClass}">
        ${title}
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
  }

  getTemplate() {
    return createNavigationTemplate(this._navItems);
  }
}
