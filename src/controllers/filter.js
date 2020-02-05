import {RenderPosition, render, replace} from '../utils/render';
import {FilterType} from '../constants';
import {getFilmsByFilter} from '../utils/filters';
import NavigationComponent from '../components/main-navigation';

export default class FilterController {
  constructor(container, filmsModel, pageController) {
    this._container = container;
    this._filmsModel = filmsModel;
    this._pageController = pageController;
    this._activeFilterType = `all`;

    this._onFilterChange = this._onFilterChange.bind(this);
    this._onDataChange = this._onDataChange.bind(this);

    this._filmsModel.setDataChangeHandler(this._onDataChange);
  }

  render() {
    const allFilms = this._filmsModel.getAllFilms();
    const filters = Object.keys(FilterType).map((filterKey) => {
      const filterType = FilterType[filterKey];
      return {
        title: filterType,
        count: (filterType !== FilterType.ALL) ? getFilmsByFilter(allFilms, filterType).length : null,
        active: filterKey.toLowerCase() === this._activeFilterType,
        additional: filterType === FilterType.STATS,
      };
    });

    const oldFilterComponent = this._filterComponent;

    this._filterComponent = new NavigationComponent(filters);
    this._filterComponent.setFilterChangeHandler(this._onFilterChange);
    this._filterComponent.setStatisticsClickHandler(() => this._pageController.showStatistics());
    if (oldFilterComponent) {
      replace(oldFilterComponent, this._filterComponent);
    } else {
      render(this._container, this._filterComponent, RenderPosition.BEFOREEND);
    }
  }

  _onFilterChange(filterType) {
    this._filmsModel.setFilter(filterType);
    this._activeFilterType = filterType;
    this._pageController.showBoard();
  }

  _onDataChange() {
    this.render();
  }
}
