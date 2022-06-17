import Abstract from './abstract';
import { SortType } from '../const';

const createSortTemplate = () => (
  `<ul class="sort">
    <li><a href="#" data-sort-type="${SortType.DEFAULT}" class="sort__button sort__button--active">Sort by default</a></li>
    <li><a href="#" data-sort-type="${SortType.DATE}" class="sort__button">Sort by date</a></li>
    <li><a href="#" data-sort-type="${SortType.RATING}" class="sort__button">Sort by rating</a></li>
  </ul>`
);

export default class SortView extends Abstract {
  #callback = {};

  get template(){
    return createSortTemplate();
  }

  setSortTypeChangeHandler = (callback) => {
    this.#callback.sortTypeChange = callback;
    this.element.addEventListener('click', this.#sortTypeChangeHandler);
  }

  #sortTypeChangeHandler = (evt) => {
    if (evt.target.tagName !== 'A'){
      return;
    }

    evt.preventDefault();
    this.#callback.sortTypeChange(evt.target.dataset.sortType);

    if (evt.target.classList.contains('sort__button--active')) {
      return;
    }
    this.element.querySelectorAll('.sort__button').forEach((item) => item.classList.remove('sort__button--active'));
    evt.target.classList.add('sort__button--active');
  }
}
