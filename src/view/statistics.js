import Abstract from './abstract';

const createFooterStatisticsTemplate = (number) => `<p>${number} movies inside</p>`;

export class StatisticsView extends Abstract {
  #filmsNumber = null;

  get template() {
    return createFooterStatisticsTemplate(this.#filmsNumber);
  }

  setNumber = (number) => {
    this.#filmsNumber = number;
  }
}
