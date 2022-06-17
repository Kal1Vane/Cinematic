import SortView from '../view/sort.js';
import { UpdateType } from '../const.js';
import { render,RenderPosition,remove } from '../render.js';
import LoadMoreButtonView from '../view/button-filtm.js';
import ProfileView from '../view/profile.js';
import CardFilmContainerView from '../view/films-container';
import CardView from '../view/card-film';

import { FilterType,SortType } from '../const.js';

import { LoadingView } from '../view/loading.js';
import filmsSectionEmptyView from '../view/films-section-empty.js';
import MainPopupView from '../view/main-popup';
import NavigationView from '../view/navigation';

import {filterFavoriteMovies, filterWatchedMovies, filterWatchingMovies, sortByDate, sortByRating} from '../utlits';


import { StatisticsView } from '../view/statistics.js';
import StatsView from '../view/stats.js';
const TASK_COUNT_PER_STEP = 8;

export default class Movie {
  #movieContainer = null;
  #createdFilms = [];
  #popUpComponent = null;
  #filmsSectionEmpty = new filmsSectionEmptyView();
  #activePopUpComponent = null;

  #footerStatistics = new StatisticsView();

  #movieCards = [];
  #cardPresenter = new Map();
  #renderedTaskCount = TASK_COUNT_PER_STEP;
  #currentSortType = SortType.DEFAULT;

  #sortComponent = new SortView();
  #profileComponent = new ProfileView();
  #navigationComponent = null;
  #loadButton = new LoadMoreButtonView();
  #cardFilmContainer = new CardFilmContainerView();

  #watchMovies = null;
  #watchedMovies = null;
  #favoriteMovies = null;
  #commentsModel = null;
  #currentFilm = null;
  #statsFilm = null;
  #moviesModel = null;
  #filterModel = null;
  #loading = new LoadingView();

  constructor(movieContainer,moviesModel,filterModel,commentsModel){
    this.#movieContainer = movieContainer;

    this.#moviesModel = moviesModel;

    this.#filterModel = filterModel;
    this.#commentsModel = commentsModel;

    this.#navigationComponent = new NavigationView(this.#filterModel);
    this.#loadingFilms();

    this.#moviesModel.addObserver(this.#handleModelEvent);
    this.#commentsModel.addObserver(this.#handleModelEvent);
  }

  get films() {
    let movies = this.#moviesModel.films;

    switch(this.#filterModel.currentFilter) {
      case FilterType.WATCHLIST :
        movies = filterWatchingMovies(movies);
        break;
      case FilterType.HISTORY :
        movies = filterWatchedMovies(movies);
        break;
      case FilterType.FAVORITES :
        movies = filterFavoriteMovies(movies);
        break;
      case FilterType.STATS:
        break;
    }

    switch(this.#currentSortType) {
      case SortType.DEFAULT :
        this.#movieCards = movies;
        return this.#movieCards;
      case SortType.DATE :
        this.#movieCards = sortByDate(movies);
        return this.#movieCards;
      case SortType.RATING :
        this.#movieCards = sortByRating(movies);
        return this.#movieCards;
    }
    return this.#movieCards;
  }

  init = () => {
    this.#movieCards = [...this.films];
    this.#renderProfile();
    this.#renderFooter();
    this.#renderFiltersList();
    this.#renderSort();
    this.#renderMovie();
  }

  #loadingFilms = () => {
    render(this.#cardFilmContainer, this.#loading,RenderPosition.BEFOREEND);
  };

  #updateFilters = () => {
    this.#watchMovies = filterWatchingMovies(this.#moviesModel.films);
    this.#watchedMovies = filterWatchedMovies(this.#moviesModel.films);
    this.#favoriteMovies = filterFavoriteMovies(this.#moviesModel.films);
  }

  #renderFiltersList = () => {
    this.#updateFilters();

    this.#navigationComponent.watchListCount = this.#watchMovies.length;
    this.#navigationComponent.historyCount = this.#watchedMovies.length;
    this.#navigationComponent.favoritesCount = this.#favoriteMovies.length;
    this.#navigationComponent.setNavigationTypeChangeHandler(this.#handlerFilterTypeChange);
    render(this.#movieContainer, this.#navigationComponent, RenderPosition.AFTERBEGIN);
  }

  #reloadFilterList = () => {
    remove(this.#navigationComponent);
    this.#renderFiltersList();
  }

  #renderFooter = () => {
    this.#footerStatistics.setNumber(this.#movieCards.length);
    render(document.querySelector('.footer__statistics'), this.#footerStatistics, RenderPosition.BEFOREEND);
  }

  #renderProfile = () => {
    render(document.querySelector('.header'), this.#profileComponent, RenderPosition.BEFOREEND);
  }

  #reloadProfile = () => {
    remove(this.#profileComponent);
    this.#renderProfile();
  }

  #renderSort = () => {
    if ( this.#moviesModel.films.length === 0) {return;}
    render(this.#movieContainer, this.#sortComponent, RenderPosition.BEFOREEND);
    this.#sortComponent.setSortTypeChangeHandler(this.#handlerSortTypeChange);
  }

  #reloadSort = () => {
    remove(this.#sortComponent);
    this.#renderSort();
  }

  #renderTasks = (from,to) => {
    this.#createdFilms = [...this.#createdFilms,...this.#movieCards.slice(from,to).map((film) => this.#renderTask(film))];
  }

  #renderTask = (task) => {
    const taskComponent = new CardView(task);
    const container = this.#cardFilmContainer.element.querySelector('.films-list__container');


    taskComponent.element.id = task.id;
    this.#cardPresenter.set(task.id, taskComponent);
    taskComponent.setClickHandler(this.#handlerOpenPopUpClick);
    taskComponent.setWatchlistClickHandler(this.#handlerkWatchlistClick);
    taskComponent.setFavoriteClickHandler(this.#handlerkFavoriteClick);
    taskComponent.setWatchedClickHandler(this.#handlerHistoryClick);
    render(container, taskComponent, RenderPosition.BEFOREEND);
    return taskComponent;
  }

  #updatingHandlersTask = (task) => {
    task.setClickHandler(this.#handlerOpenPopUpClick);
    task.setWatchlistClickHandler(this.#handlerkWatchlistClick);
    task.setFavoriteClickHandler(this.#handlerkFavoriteClick);
    task.setWatchedClickHandler(this.#handlerHistoryClick);
  }

  #renderLoadMoreButton = () => {
    render(this.#cardFilmContainer, this.#loadButton, RenderPosition.BEFOREEND);
    this.#loadButton.setClickHandler(this.#handlerLoadMoreButtonClick);
  }

  #clearFilmList = () => {
    this.#createdFilms.forEach((film) => remove(film));
    this.#renderedTaskCount = TASK_COUNT_PER_STEP;
    this.#loadMoreButtonRemove();
    this.#createdFilms = [];
  }

  #handlerkWatchlistClick = (id) => {
    const indexMovie = this.#movieCards.find((item) => item.id === id);
    indexMovie.isWatchlist = !indexMovie.isWatchlist;
    this.#moviesModel.updateFilm(UpdateType.CONTROLS, indexMovie);
  }

  #handlerHistoryClick = (id) => {
    const indexMovie = this.#movieCards.find((item) => item.id === id);
    indexMovie.isWatched = !indexMovie.isWatched;
    this.#moviesModel.updateFilm(UpdateType.CONTROLS, indexMovie);
  }

  #handlerkFavoriteClick = (id) => {
    const indexMovie = this.#movieCards.find((item) => item.id === id);
    indexMovie.isFavorite = !indexMovie.isFavorite;
    this.#moviesModel.updateFilm(UpdateType.CONTROLS, indexMovie);
  }

  #handlerSortTypeChange = (sortType) => {
    if( this.#currentSortType === sortType) {return;}

    this.#currentSortType = sortType;

    this.#clearFilmList();
    this.#renderMovie();
  }

  #handlerFilterTypeChange = (filterType) => {
    if(this.#filterModel.currentFilter === filterType){return;}

    this.#filterModel.currentFilter = filterType;
    this.#currentSortType = SortType.DEFAULT;
    this.#renderedTaskCount = TASK_COUNT_PER_STEP;


    this.#clearFilmList();
    this.#reloadSort();
    this.#renderMovie();
  }

  #handlerKeyCloseClick = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      remove(this.#activePopUpComponent);
      document.body.classList.remove('hide-overflow');
      document.removeEventListener('keydown', this.#handlerKeyCloseClick);
    }
  }

  #handlerOpenPopUpClick = (id) => {
    this.#currentFilm = this.#movieCards.find((item) => item.id === id);
    this.#commentsModel.loadComments(this.#currentFilm.id);

    if (this.#activePopUpComponent) {
      remove(this.#activePopUpComponent);
    }

    document.addEventListener('keydown', this.#handlerKeyCloseClick);
  }

  #createPopUp = (film,commentary) => {
    document.body.classList.add('hide-overflow');

    this.#popUpComponent = new MainPopupView(film,commentary);

    this.#activePopUpComponent = this.#popUpComponent;

    render(document.body, this.#popUpComponent, RenderPosition.BEFOREEND);
    this.#popUpComponent.setClickHandler(this.#handlerClosePopUpClick);
    this.#popUpComponent.setWatchlistClickHandler(this.#handlerkWatchlistClick);
    this.#popUpComponent.setFavoriteClickHandler(this.#handlerkFavoriteClick);
    this.#popUpComponent.setWatchedClickHandler(this.#handlerHistoryClick);
    this.#popUpComponent.setDeleteClickHandler(this.#deleteComment);
    this.#popUpComponent.setAddEmodjiClickHandler(this.#addCommentEmoji);
    this.#popUpComponent.setAddCommentsHandler(this.#addComment);
  }

  #addComment = (comment) => {
    this.#commentsModel.addComment(this.#currentFilm.id, comment, this.#moviesModel.addComment);
    this.#activePopUpComponent.disableForm = true;
    this.#activePopUpComponent.updateData(this.#currentFilm,this.#commentsModel.comments);
  }

  #addCommentEmoji = (emoji) => {
    this.#currentFilm.newComment.emoji = emoji;
    this.#activePopUpComponent.updateData(this.#currentFilm);
  };

  #deleteComment = (id) => {
    const indexComment = this.#commentsModel.comments.find((comment) => comment.id === id);
    this.#commentsModel.deleteComment(indexComment.id);
    this.#moviesModel.deleteComment(indexComment.id);
  }

  #handlerClosePopUpClick = () => {
    document.querySelector('.film-details').remove();
    document.body.classList.remove('hide-overflow');
    document.removeEventListener('keydown', this.#handlerKeyCloseClick);
  }

  #handlerLoadMoreButtonClick = () => {
    this.#renderTasks(this.#renderedTaskCount,this.#renderedTaskCount + TASK_COUNT_PER_STEP);

    this.#renderedTaskCount += TASK_COUNT_PER_STEP;
    if (this.#renderedTaskCount >= this.#movieCards.length) {
      this.#loadMoreButtonRemove();
    }
  }

  #loadMoreButtonRemove = () => {
    remove(this.#loadButton);
  }

  #renderMovie = () => {
    const filmsCount = this.films.length;

    if (filmsCount === 0) {
      if (this.#cardFilmContainer) {
        remove(this.#cardFilmContainer);
      }
      this.#filmsSectionEmpty.filterTypeEmpty(this.#filterModel.currentFilter);
      remove(this.#sortComponent);
      remove(this.#filmsSectionEmpty);

      render(this.#movieContainer,this.#filmsSectionEmpty,RenderPosition.BEFOREEND);
      return;
    }
    if (this.#loading) {
      remove(this.#filmsSectionEmpty);
      remove(this.#loading);
    }

    if (this.#statsFilm) {
      this.#statsFilm.removeElement();
    }

    if (this.#filterModel.currentFilter === FilterType.STATS) {
      remove(this.#filmsSectionEmpty);
      remove(this.#sortComponent);
      this.#statsFilm = new StatsView(this.#movieCards);
      render(this.#cardFilmContainer, this.#statsFilm , RenderPosition.BEFOREEND);
      this.#statsFilm.updateElement();
      return;
    }

    render(this.#movieContainer, this.#cardFilmContainer, RenderPosition.BEFOREEND);
    this.#renderTasks(0,Math.min(filmsCount,TASK_COUNT_PER_STEP)); // renderFilms

    if(this.#moviesModel.films.length > TASK_COUNT_PER_STEP) {
      this.#renderLoadMoreButton();
    }
  }

  #reloadApp = () => {
    this.#clearFilmList();
    this.#reloadFilterList();
    this.#reloadProfile();
    this.#renderMovie();
  }


  #handleModelEvent = (updateType,data) => {
    if (updateType === UpdateType.INIT) {
      remove(this.#loading);
      this.init();
    }

    if (updateType === UpdateType.ERROR_LOAD_FILM) {
      remove(this.#loading);
      this.init();
    }

    if (updateType === UpdateType.LOAD_COMMENTS) {
      this.#createPopUp(this.#currentFilm,data);
    }

    if (updateType === UpdateType.LOAD_COMMENTS_ERROR) {
      this.#createPopUp(this.#currentFilm,data);
    }

    if (updateType === UpdateType.DELETE_COMMENT) {
      this.#activePopUpComponent.updateData(this.#currentFilm,this.#commentsModel.comments);
      this.#reloadApp();
    }

    if (updateType === UpdateType.DELETE_COMMENT_ERROR) {
      this.#activePopUpComponent.setErrorComment(data);
      this.#activePopUpComponent.updateData(this.#currentFilm,this.#commentsModel.comments);
    }

    if (updateType === UpdateType.ERROR_ADD_COMMENT) {
      this.#activePopUpComponent.isError = true;
      this.#currentFilm.disableForm = false;
      this.#activePopUpComponent.updateData(this.#currentFilm,this.#commentsModel.comments);
    }

    if (updateType === UpdateType.ADD_COMMENT) {
      this.#activePopUpComponent.resetData();
      this.#activePopUpComponent.updateData(this.#currentFilm,this.#commentsModel.comments);
      this.#reloadApp();
    }

    if (updateType === UpdateType.CONTROLS) {
      if (this.#activePopUpComponent) {
        this.#activePopUpComponent.updateData(data);
      }
      this.#reloadApp();
    }

    this.#updateFilters();
  };
}
