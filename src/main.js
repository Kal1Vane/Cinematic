import MoviePresenter from './presenter/movie';

import FilterModel from './model/filter';
import MovieModel from './model/movie';
import CommentsModel from './model/comment';

import ApiService from './api-service.js';

import { AUTHORIZATION, END_POINT} from './const';

const apiService = new ApiService(END_POINT,AUTHORIZATION);

const siteMainElement = document.querySelector('.main');

const filterModel = new FilterModel();
const moviesModel = new MovieModel(apiService);
const commentsModel = new CommentsModel(apiService);

new MoviePresenter(siteMainElement,moviesModel,filterModel,commentsModel);
moviesModel.init();

