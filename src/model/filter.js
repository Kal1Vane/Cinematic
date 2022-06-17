import {FilterType} from '../const';
import AbstractObservable from './abstract-observable';

export default class FilterModel extends AbstractObservable {
  #currentFilter = FilterType.All;

  get currentFilter() {
    return this.#currentFilter;
  }

  set currentFilter(currentFilter) {
    this.#currentFilter = currentFilter;
  }

  updateFilter = (updateType,currentFilter) => {
    if (this.#currentFilter === currentFilter) {return;}

    this.#currentFilter = currentFilter;

    this._notify(updateType,currentFilter);
  }

}
