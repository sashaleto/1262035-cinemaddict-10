import AbstractSmartComponent from "./abstract-smart";
import moment from "moment";
import {RangeType} from "../constants";

const STATS_PERIOD_FOR_PREFIX = `statistic-`;
const NAV_ITEMS = Object.keys(RangeType);

const getPeriodByForAttribute = (attribute) => {
  return attribute.substring(STATS_PERIOD_FOR_PREFIX.length);
};

const convertRangeToTitle = (rangeType) => {
  if (rangeType === RangeType.ALL) {
    return `All time`;
  } else {
    return rangeType.charAt(0).toUpperCase() + rangeType.slice(1);
  }
};

const watchedFilmsDurationFormat = (time) => {
  const duration = moment.duration(time, `minutes`);
  return {
    hours: duration.asHours().toFixed(0),
    minutes: duration.minutes(),
  };
};

const makeTotalDurationTemplate = (duration) => {
  const time = watchedFilmsDurationFormat(duration);
  return `<p class="statistic__item-text">${time.hours} <span class="statistic__item-description">h</span> ${time.minutes} <span class="statistic__item-description">m</span></p>`;
};

const makePeriodFilterTemplate = (activeItem) => {
  return NAV_ITEMS.map((item) => RangeType[item]).map((item) => {
    const title = convertRangeToTitle(item);
    const isChecked = (item === activeItem) ? `checked` : ``;
    return `
        <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-${item}" value="${item}" ${isChecked}>
        <label for="statistic-${item}" class="statistic__filters-label">${title}</label>
  `;
  }).join(``);
};

const createStatisticsTemplate = (stats, activeFilterItem) => {
  const watchedMoviesCount = stats.watchedMoviesCount;
  const totalMoviesDuration = stats.totalDuration;
  const topGenreName = (typeof stats.topGenre !== undefined) ? stats.topGenre : `-`;
  const totalDurationTemplate = totalMoviesDuration ? makeTotalDurationTemplate(totalMoviesDuration) : `-`;
  const periodTemplate = makePeriodFilterTemplate(activeFilterItem);

  return `
    <section class="statistic">
    <p class="statistic__rank">
      Your rank
      <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
      <span class="statistic__rank-label">Sci-Fighter</span>
    </p>

    <form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
      <p class="statistic__filters-description">Show stats:</p>
       ${periodTemplate}
    </form>

    <ul class="statistic__text-list">
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">You watched</h4>
        <p class="statistic__item-text">${watchedMoviesCount} <span class="statistic__item-description">movies</span></p>
      </li>
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">Total duration</h4>
        <p class="statistic__item-text">${totalDurationTemplate}</p>
      </li>
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">Top genre</h4>
        <p class="statistic__item-text">${topGenreName}</p>
      </li>
    </ul>

    <div class="statistic__chart-wrap">
      <canvas class="statistic__chart" width="1000"></canvas>
    </div>

  </section>
  `;
};

export default class StatisticsComponent extends AbstractSmartComponent {
  constructor(stats) {
    super();
    this._stats = stats;
    this._changePeriodClickHandler = null;
    this._activeNavItem = RangeType.ALL;
  }

  getTemplate() {
    return createStatisticsTemplate(this._stats, this._activeNavItem);
  }

  setStats(stats) {
    this._stats = stats;
  }

  recoveryListeners() {
    this.setChangePeriodClickHandler(this._changePeriodClickHandler);
  }

  setChangePeriodClickHandler(handler) {
    this._changePeriodClickHandler = handler;
    this.getElement().querySelector(`.statistic__filters`).addEventListener(`click`, (evt) => {
      evt.preventDefault();

      if (evt.target.tagName !== `LABEL`) {
        return;
      }
      const period = getPeriodByForAttribute(evt.target.getAttribute(`for`));
      this._activeNavItem = period;
      handler(period);
    });
  }
}
