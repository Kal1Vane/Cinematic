import Smart from './smart-abstract';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
const checkDescription = (description) => description.length > 140 ? `${description.slice(0, 140)}...` : description;


const createCardFilmTemplate = (film) => {
  dayjs.extend(duration);
  const {poster,title,description,releaseDate, runtime, rating, genres,isFavorite,isWatchlist,isWatched,comments} = film;
  const date = dayjs(releaseDate).format('YYYY');
  const durateishon = dayjs.duration(runtime, 'minutes').format('H[h] m[m]');

  const favoriteClassName = isFavorite
    ? 'film-card__controls-item--favorite film-card__controls-item--active'
    : 'film-card__controls-item--favorite';

  const watchListClassName = isWatchlist
    ? 'film-card__controls-item--add-to-watchlist film-card__controls-item--active'
    : 'film-card__controls-item--add-to-watchlist';

  const historyClassName = isWatched
    ? 'film-card__controls-item--mark-as-watched film-card__controls-item--active'
    : 'film-card__controls-item--mark-as-watched';

  return `<article class="film-card">
  <h3 class="film-card__title">${title}</h3>
  <p class="film-card__rating">${rating}</p>
  <p class="film-card__info">
    <span class="film-card__year">${date}</span>
    <span class="film-card__duration">${durateishon}</span>
    <span class="film-card__genre">${genres[0]}</span> 
  </p>
  <img src="${poster}" alt="${title}" class="film-card__poster">
  <p class="film-card__description">${checkDescription(description)}</p>
  <a class="film-card__comments">${comments.length} comments</a>
  <div class="film-card__controls">
    <button class="film-card__controls-item ${watchListClassName}" type="button">Add to watchlist</button>
    <button class="film-card__controls-item ${historyClassName}" type="button">Mark as watched</button>
    <button class="film-card__controls-item ${favoriteClassName}" type="button">Mark as favorite</button>
  </div>
</article>`;
};

export default class CardView extends Smart{
  #film = null;
  #callback;
  constructor (film) {
    super();
    this.#film = film;
    this.#callback = {};
  }

  get template(){
    return createCardFilmTemplate(this.#film);
  }

  get id(){
    return this.#film.id;
  }

  #clickHandler = (evt) => {
    evt.preventDefault();
    this.#callback.click(this.#film.id);
  }

  setClickHandler(callback) {
    this.#callback.click = callback;
    this.element.querySelector('.film-card__comments').addEventListener('click', this.#clickHandler);
  }

  setFavoriteClickHandler = (callback) => {
    this.#callback.favoriteClick = callback;
    this.element.querySelector('.film-card__controls-item--favorite').addEventListener('click', this.#favoriteClickHandler);
  }

  setWatchedClickHandler = (callback) => {
    this.#callback.watchedClick = callback;
    this.element.querySelector('.film-card__controls-item--mark-as-watched').addEventListener('click', this.#watchedClickHandler);
  }

  setWatchlistClickHandler = (callback) => {
    this.#callback.watchlistClick = callback;
    this.element.querySelector('.film-card__controls-item--add-to-watchlist').addEventListener('click', this.#watchlistClickHandler);
  }

  #favoriteClickHandler = (evt) => {
    evt.preventDefault();
    this.#callback.favoriteClick(this.#film.id);
  }

  #watchlistClickHandler = (evt) => {
    evt.preventDefault();
    this.#callback.watchlistClick(this.#film.id);
  }

  #watchedClickHandler = (evt) => {
    evt.preventDefault();
    this.#callback.watchedClick(this.#film.id);
  }
}

