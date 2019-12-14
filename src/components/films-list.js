export const createFilmListTemplate = (sectionClass, listTitle, isTitleHidden) => {
  return `
    <section class="${sectionClass}">
      <h2 class="films-list__title ${isTitleHidden ? `visually-hidden` : ``}">${listTitle}</h2>
      <div class="films-list__container"></div>
    </section>
  `;
};
