import Abstract from './abstract';
import { FilterType } from '../const';

const createNoCardTemplate = (filterText) => (
  `<section class="films">
  <section class="films-list">
    <h2 class="films-list__title">${filterText}</h2>
  </section>
</section>`
);


export default class NoCardView extends Abstract {
  #filterType = '';
  #filterText = '';

  get template() {
    return createNoCardTemplate(this.#filterText);
  }

  filterTypeEmpty = (type) => {
    this.#filterType = type;

    switch ( this.#filterType) {
      case FilterType.WATCHLIST :
        this.#filterText = 'There are no movies in your watchlist';
        break;
      case FilterType.HISTORY :
        this.#filterText = 'There are no movies in your history';
        break;
      case FilterType.FAVORITES :
        this.#filterText = 'There are no movies in your favourites';
        break;
      default:
        this.#filterText = 'There are no movies in our database';
        break;
    }
  }

}
