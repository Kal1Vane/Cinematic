import Abstract from './abstract';
import { FilterType } from '../const';

const createNavigationTemplate = (watchListCount, historyCount, favoriteCount, currentFilter) =>
  (`<nav class="main-navigation">
<div class="main-navigation__items">
  <a href="#" data-filter-type="${FilterType.All}" class="main-navigation__item ${currentFilter === FilterType.All ? 'main-navigation__item--active' : ''}">All movies</a>
  <a href="#" data-filter-type="${FilterType.WATCHLIST}" class="main-navigation__item ${currentFilter === FilterType.WATCHLIST ? 'main-navigation__item--active' : ''} ">Watchlist <span class="main-navigation__item-count">${watchListCount}</span></a>
  <a href="#" data-filter-type="${FilterType.HISTORY}" class="main-navigation__item ${currentFilter === FilterType.HISTORY ? 'main-navigation__item--active' : ''} ">History <span class="main-navigation__item-count">${historyCount}</span></a>
  <a href="#" data-filter-type="${FilterType.FAVORITES}" class="main-navigation__item ${currentFilter === FilterType.FAVORITES ? 'main-navigation__item--active' : ''} ">Favorites <span class="main-navigation__item-count">${favoriteCount}</span></a>
</div>
<a href="#" data-filter-type="${FilterType.STATS}" class="main-navigation__additional ${currentFilter === FilterType.STATS ? 'main-navigation__item--active' : ''}">Stats</a>
</nav>`);

export default class NavigationView extends Abstract {
  #callback = {};
  #watchListCount = 0;
  #historyCount = 0;
  #favoriteCount = 0;
  #filterModel = null;

  constructor(filterModel) {
    super();
    this.#filterModel = filterModel;
  }

  get template(){
    return createNavigationTemplate(this.#watchListCount,this.#historyCount,this.#favoriteCount,this.#filterModel.currentFilter);
  }

  get watchListCount(){
    return this.#watchListCount;
  }

  get historyCount(){
    return this.#historyCount;
  }

  get favoritesCount(){
    return this.#favoriteCount;
  }

  set watchListCount(count){
    this.#watchListCount = count;
  }

  set historyCount(count){
    this.#historyCount = count;
  }

  set favoritesCount(count){
    this.#favoriteCount = count;
  }

  setNavigationTypeChangeHandler = (callback) => {
    this.#callback.navigationTypeChange = callback;
    this.element.addEventListener('click', this.#navigationTypeChangeHandler);
  }

  #navigationTypeChangeHandler = (evt) => {
    if (evt.target.tagName !== 'A'){
      return;
    }

    if (!this.#filterModel.currentFilter === !FilterType.STATS) {
      this.element.querySelector('.main-navigation__additional').classList.remove('main-navigation__item--active');
    }

    evt.preventDefault();
    this.#callback.navigationTypeChange(evt.target.dataset.filterType);
    if(evt.target.classList.contains('main-navigation__item--active')) {return;}

    this.element.querySelectorAll('.main-navigation__item').forEach((item) => item.classList.remove('main-navigation__item--active'));
    evt.target.classList.add('main-navigation__item--active');
  }

}
