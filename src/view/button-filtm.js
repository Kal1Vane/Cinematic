
import Abstract from './abstract';
const createLoadMoreButtonTemplate = () => (
  `<button class="films-list__show-more">
  Show more
  </button>`
);


export default class LoadMoreButtonView extends Abstract{
  #callback;
  constructor () {
    super();
    this.#callback = {};
  }

  get template(){
    return createLoadMoreButtonTemplate();
  }

  #clickHandler = (evt) => {
    evt.preventDefault();
    this.#callback.click();
  }

  setClickHandler(callback) {
    this.#callback.click = callback;
    this.element.addEventListener('click', this.#clickHandler);
  }
}
