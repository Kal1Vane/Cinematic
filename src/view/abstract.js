import { createElement } from '../render';

export default class Abstract {
  #element = null;
  constructor() {
    if(new.target === Abstract) {
      throw new Error('Can\'t instantiate Abstract, only concrete one.');
    }
    this.#element = null;
  }

  get template(){
    throw new Error('Abstract method not implemented: getTemplate');
  }

  get element(){
    if(!this.#element){
      this.#element = createElement(this.template);
    }
    return this.#element;
  }

  removeElement(){
    if( this.#element){
      this.#element.remove();
      this.#element = null;
    }
  }

  replaceElement  = () => {
    if(this.element && this.element.parentElement) {
      const prevElement = this.element;
      const parent = prevElement.parentElement;

      this.#element = null;

      const newElement = this.element;

      parent.replaceChild(newElement ,prevElement);
    }
  }
}
