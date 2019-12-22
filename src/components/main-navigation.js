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

export const createNavigationTemplate = (navItems, films) => {
  const navigationTemplate = navItems.map((item) => {
    return createSingleNavItemTemplate(item, films);
  }).join(``);

  return `
    <nav class="main-navigation">
        ${navigationTemplate}
    </nav>
  `;
};
