import NavigationComponent from "../components/main-navigation";
import {NAVIGATION} from "../moks/main-navigation";
import {RenderPosition, render} from "../utils/render";

export default class FilterController {
  constructor(container, filmsModel) {
    this._container = container;
    this._filmsModel = filmsModel;
  }

  render() {
    this._filterComponent = new NavigationComponent(NAVIGATION, this._filmsModel.getFilms());
    render(this._container, this._filterComponent, RenderPosition.BEFOREEND);
  }
}
