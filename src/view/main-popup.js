import AbstractSmartViev from './smart-abstract';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import he from 'he';


const createCommentTemplate = (comments, deletingComment, disableDelete, errorComment) => (
  comments.map((comment) => `<li class="film-details__comment ${errorComment === comment.id ? 'shake' : ''}">
      <span class="film-details__comment-emoji">
        <img src="./images/emoji/${comment.emotion}.png" width="55" height="55" alt="emoji-smile">
      </span>
      <div>
        <p class="film-details__comment-text">${he.encode(comment.text)}</p>
        <p class="film-details__comment-info">
          <span class="film-details__comment-author">${he.encode(comment.author)}</span>
          <span class="film-details__comment-day">${dayjs(comment.date).format('DD/MM/YYYY HH:mm')} </span>
          <button class="film-details__comment-delete" data-id="${comment.id}" ${disableDelete ? 'disabled' : ''}>${deletingComment === comment.id ? 'Deleting...' : 'Delete'}</button>
        </p>
      </div>
    </li>`).join(' ')
);


const createGenreTemplate = (genres) => (
  genres.map((genre) => `<span class="film-details__genre">${genre}</span>`).join(', ')
);


const createMainPopupTemplate = (film, comment, currentText, deletingComment, disableDelete, errorComment, disableForm, isError) => {
  dayjs.extend(duration);

  const { poster,title,description,runtime,rating,country,actors,writers,genres,date,isFavorite,isWatchlist,isWatched,
    comments,originalTitle,age,director,newComment} = film;

  const release = dayjs(date).format('DD MMMM YYYY');
  const durationTime = dayjs.duration(runtime, 'minutes').format('H[h] m[m]');
  const watchListButton = isWatchlist
    ? '<button type="button" class="film-details__control-button film-details__control-button--watchlist film-details__control-button--active" id="watchlist" name="watchlist">Already watchlist</button>'
    : '<button type="button" class="film-details__control-button film-details__control-button--watchlist" id="watchlist" name="watchlist">Add to watchlist</button>';

  const historyButton = isWatched
    ? '<button type="button" class="film-details__control-button film-details__control-button--watched film-details__control-button--active" id="watched" name="watched">Already watched</button>'
    : '<button type="button" class="film-details__control-button film-details__control-button--watched" id="watched" name="watched">Add to watch</button>';

  const favoriteButton = isFavorite
    ? '<button type="button" class="film-details__control-button film-details__control-button--favorite film-details__control-button--active" id="favorite" name="favorite">Already favorites</button>'
    : '<button type="button" class="film-details__control-button film-details__control-button--favorite" id="favorite" name="favorite">Add to favorites</button>';


  return `<section class="film-details">
  <form class="film-details__inner ${isError ? 'shake' : ''}" action="" method="get">
    <div class="film-details__top-container">
      <div class="film-details__close">
        <button class="film-details__close-btn" type="button">close</button>
      </div>
      <div class="film-details__info-wrap">
        <div class="film-details__poster">
          <img class="film-details__poster-img" src="${poster}" alt="">

          <p class="film-details__age">${age}</p>
        </div>

        <div class="film-details__info">
          <div class="film-details__info-head">
            <div class="film-details__title-wrap">
              <h3 class="film-details__title">${title}</h3>
              <p class="film-details__title-original">Original: ${originalTitle}</p>
            </div>

            <div class="film-details__rating">
              <p class="film-details__total-rating">${rating}</p>
            </div>
          </div>

          <table class="film-details__table">
            <tbody><tr class="film-details__row">
              <td class="film-details__term">Director</td>
              <td class="film-details__cell">${director}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Writers</td>
              <td class="film-details__cell">${writers.join(', ')}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Actors</td>
              <td class="film-details__cell custom">${actors.join(', ')}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Release Date</td>
              <td class="film-details__cell">${release}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Runtime Episode</td>
              <td class="film-details__cell">${durationTime}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Country</td>
              <td class="film-details__cell">${country}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">${genres.length > 1 ? 'Genres' : 'Genre'}</td>
              <td class="film-details__cell custom">${createGenreTemplate(genres)}</td>    
            </tr>
          </tbody></table>

          <p class="film-details__film-description">
            ${description}
          </p>
        </div>
      </div>

      <section class="film-details__controls">
        ${favoriteButton}
        ${watchListButton}
        ${historyButton}
      </section>
    </div>
    <div class="film-details__bottom-container">
      <section class="film-details__comments-wrap">
        <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${comments.length}</span></h3>

        <ul class="film-details__comments-list">
          ${createCommentTemplate(comment, deletingComment, disableDelete, errorComment)}
        </ul>

        <div class="film-details__new-comment">
        <div class="film-details__add-emoji-label">
          ${newComment.emoji ? `<img src="./images/emoji/${newComment.emoji}.png" width="71" height="71" alt="emoji" data-emoji="smile">` : ''}
        </div>

        <label class="film-details__comment-label">
        ${disableForm ? 'Adding comment...' : `<textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment" data-movie-id="${film.id}">${he.encode(currentText)}</textarea>`}
        </label>

          <div class="film-details__emoji-list">
            <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" value="smile">
            <label class="film-details__emoji-label" for="emoji-smile">
              <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji" data-emoji="smile">
            </label>

            <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="sleeping">
            <label class="film-details__emoji-label" for="emoji-sleeping">
              <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji" data-emoji="sleeping">
            </label>

            <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-puke" value="puke">
            <label class="film-details__emoji-label" for="emoji-puke">
              <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji" data-emoji="puke">
            </label>

            <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-angry" value="angry">
            <label class="film-details__emoji-label" for="emoji-angry">
              <img src="./images/emoji/angry.png" width="30" height="30" alt="emoji" data-emoji="angry">
            </label>
          </div>
        </div>
      </section>
    </div>
  </form>
</section>`;
};


export default class MainPopupView extends AbstractSmartViev {
  #film = null;
  #comments = null;
  #callback;
  #currentEmoji = null;
  disableForm = false;
  #errorComment = null;
  #currentText = '';
  #deletingComment = null;
  #disableDelete = false;
  isError = false;

  constructor(film,comments) {
    super();
    this.#film = film;
    this.#callback = {};
    this.#comments = comments;
  }

  get template(){
    return createMainPopupTemplate(
      this.#film,
      this.#comments,
      this.#currentText,
      this.#deletingComment,
      this.#disableDelete,
      this.#errorComment,
      this.disableForm,
      this.isError,
    );
  }

  set emodji(emodji){
    this.#currentEmoji = emodji;
  }

  get emodji(){
    return this.#currentEmoji;
  }

  updateData = (filmUpdate,commentsUpdate) => {
    if (!filmUpdate && !commentsUpdate) {
      return;
    }
    if (filmUpdate) {
      this.#film = filmUpdate;
    }
    if (commentsUpdate) {
      this.#comments = commentsUpdate;
    }
    this.removeHandlers();
    this.updateElement();
  }

  resetData = () => {
    this.#disableDelete = false;
    this.disableForm = false;
    this.#deletingComment = null;
    this.#errorComment = null;

    if (!this.isError) {
      this.#currentEmoji = null;
      this.#currentText = '';
    }
  }

  #clickHandler = (evt) => {
    evt.preventDefault();
    this.#callback.click();
  }

  setClickHandler(callback) {
    this.#callback.click = callback;
    this.element.querySelector('.film-details__close-btn').addEventListener('click', this.#clickHandler);
  }

  setFavoriteClickHandler = (callback) => {
    this.#callback.favoriteClick = callback;
    this.element.querySelector('.film-details__control-button--favorite').addEventListener('click', this.#favoriteClickHandler);
  }

  setWatchedClickHandler = (callback) => {
    this.#callback.watchedClick = callback;
    this.element.querySelector('.film-details__control-button--watched').addEventListener('click', this.#watchedClickHandler);
  }

  setWatchlistClickHandler = (callback) => {
    this.#callback.watchlistClick = callback;
    this.element.querySelector('.film-details__control-button--watchlist').addEventListener('click', this.#watchlistClickHandler);
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


  setDeleteClickHandler = (callback) => {
    this.#callback.deleteComments = callback;
    this.element.querySelector('.film-details__comments-list').addEventListener('click', this.#deleteCommentClickHandler);
  }

  #deleteCommentClickHandler = (evt) => {
    evt.preventDefault();
    if (evt.target.tagName === 'BUTTON'){
      this.#disableDelete = true;
      this.#errorComment = null;
      this.#deletingComment = evt.target.dataset.id;
      this.updateElement();
      this.resetData();
      this.#callback.deleteComments(evt.target.dataset.id);
    }
    this.#deletingComment = null;
  }

  setAddEmodjiClickHandler = (callback) => {
    this.#callback.addEmodji = callback;
    this.element.querySelector('.film-details__emoji-list').addEventListener('click', this.#addEmodjiClickHandler);
  }

  #addEmodjiClickHandler = (evt) => {
    evt.preventDefault();
    this.#currentText = this.element.querySelector('.film-details__comment-input').value;
    if ( evt.target.tagName !== 'IMG') {return;}
    this.#callback.addEmodji(evt.target.dataset.emoji);
  }

  setAddCommentsHandler = (callback) => {
    this.#callback.addComments = callback;
    this.element.querySelector('.film-details__comment-input').addEventListener('keyup', this.#addCommentsHandler);
  }

  #addCommentsHandler = (evt) => {
    if (evt.ctrlKey && evt.key === 'Enter') {
      this.#currentText = evt.target.value;

      const newComment = {
        movieId : this.#film.id,
        text: this.#currentText,
        emotion: this.emodji || 'smile',
      };
      this.resetData();
      this.updateElement();
      this.#callback.addComments(newComment);
    }
  }

  setErrorComment = (errorComment) => {
    this.#errorComment = errorComment;
  }

  restoreHandlers = () => {
    this.element.querySelector('.film-details__close-btn').addEventListener('click', this.#clickHandler);
    this.element.querySelector('.film-details__control-button--favorite').addEventListener('click', this.#favoriteClickHandler);
    this.element.querySelector('.film-details__control-button--watched').addEventListener('click', this.#watchedClickHandler);
    this.element.querySelector('.film-details__control-button--watchlist').addEventListener('click', this.#watchlistClickHandler);
    this.element.querySelector('.film-details__comments-list').addEventListener('click', this.#deleteCommentClickHandler);
    this.element.querySelector('.film-details__emoji-list').addEventListener('click', this.#addEmodjiClickHandler);
    this.element.querySelector('.film-details__comment-input')?.addEventListener('keydown', this.#addCommentsHandler);
  }

  removeHandlers = () => {
    this.element.querySelector('.film-details__close-btn').removeEventListener('click', this.#clickHandler);
    this.element.querySelector('.film-details__control-button--favorite').removeEventListener('click', this.#favoriteClickHandler);
    this.element.querySelector('.film-details__control-button--watched').removeEventListener('click', this.#watchedClickHandler);
    this.element.querySelector('.film-details__control-button--watchlist').removeEventListener('click', this.#watchlistClickHandler);
    this.element.querySelector('.film-details__comments-list').removeEventListener('click', this.#deleteCommentClickHandler);
    this.element.querySelector('.film-details__emoji-list').removeEventListener('click', this.#addEmodjiClickHandler);
    this.element.querySelector('.film-details__comment-input')?.removeEventListener('keydown', this.#addCommentsHandler);
  }
}
