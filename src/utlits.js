import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import { SortType,FilterStats,TimeUnits,MINUTES_IN_HOUR } from './const';

dayjs.extend(isBetween);

export const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};
function byFild(field) {
  return (a,b) => a[field] < b[field] ? 1 : -1;
}

export const sortByRating = (films) => films.sort(byFild(SortType.RATING));
export const sortByDate = (films) => films.sort(byFild(SortType.DATE));

export const filterWatchingMovies = (films) => films.filter((film) => film.isWatchlist);
export const filterWatchedMovies = (films) => films.filter((film) => film.isWatched);
export const filterFavoriteMovies = (films) => films.filter((film) => film.isFavorite);

const filterMoviesByDate = (films, timeUnit) => films.filter(({watchingDate}) => dayjs(watchingDate).isBetween(dayjs().subtract(1, timeUnit), dayjs()));
export const normalizeArray = (list, callback) => list.map(callback);

export const filterStats = (films,filter) => {
  switch(filter) {
    case FilterStats.TODAY:
      return filterMoviesByDate(films, TimeUnits.DAY);
    case FilterStats.WEEK:
      return filterMoviesByDate(films,TimeUnits.WEEK);
    case FilterStats.MONTH:
      return filterMoviesByDate(films, TimeUnits.MONTH);
    case FilterStats.YEAR:
      return filterMoviesByDate(films,TimeUnits.YEAR);
    default:
      return films;
  }
};

export const getDuration = (films) => films.reduce(((prevValue, {runtime}) => prevValue + runtime), 0);
export const getDurationHours = (duration) => Math.floor(duration / MINUTES_IN_HOUR);
export const getDurationMinutes = (duration) => duration % MINUTES_IN_HOUR;

export const getStatsInfo = (movies) => {
  const stats = {};

  for (const movie of movies) {
    for (const genre of movie.genres) {
      if (stats[genre]) {
        stats[genre] += 1;
        continue;
      }

      stats[genre] = 1;
    }
  }

  return stats;
};

export const sortChartGenres = (chartData) => {
  const genres = Object.keys(chartData);
  return genres.sort((firstGenre, secondGenre) => chartData[secondGenre] - firstGenre[secondGenre]);
};

export const sortChartValues = (chartData) => {
  const values = Object.values(chartData);
  return values.sort((firstValue, secondValue) => secondValue - firstValue);
};
