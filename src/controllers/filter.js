import NavigationComponent from "../components/main-navigation";
import {RenderPosition, render} from "../utils/render";
import {FilterType} from "../constants";
import {getFilmsByFilter} from "../utils/filters";

export default class FilterController {
  constructor(container, filmsModel) {
    this._container = container;
    this._filmsModel = filmsModel;
    this._activeFilterType = FilterType.ALL;
  }

  render() {
    const allFilms = this._filmsModel.getFilms();
    const filters = Object.values(FilterType).map((filterType) => {
      return {
        title: filterType,
        count: getFilmsByFilter(allFilms, filterType).length,
        active: filterType === this._activeFilterType,
        additional: filterType === (FilterType.STATS)
      };
    });

    this._filterComponent = new NavigationComponent(filters);
    render(this._container, this._filterComponent, RenderPosition.BEFOREEND);
  }
}
