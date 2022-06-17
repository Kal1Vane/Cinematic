import Abstract from './abstract';

export default class Smart extends Abstract {
  _data = {};

  updateData(update,justDataUpdating){
    if(!update) {return;}

    this._data = {...this._data, ...update};

    if(justDataUpdating) {return;}

    this.updateElement();
  }

  updateElement = () => {
    const scrollPosition = this.element.scrollTop;
    this.replaceElement();
    this.element.scrollTop = scrollPosition;
    this.restoreHandlers();
  }

  restoreHandlers() {

    throw new Error('Abstract method not implemented: restoreHandlers');
  }
}
