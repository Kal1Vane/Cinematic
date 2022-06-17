import Abstract from './abstract';

const getLoadingTemplate = () => '<section class="films-list"><h2 class="films-list__title">Loading...</h2></section>';

export class LoadingView extends Abstract {
  get template() {
    return getLoadingTemplate();
  }
}
