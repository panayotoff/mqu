import Component, {loadComponents, removeComponents} from './js/SimpleComponent';

import Dom from './js/dom';

class App extends Component {
  constructor(element) {
    super(element);
  }

  init() {
    console.log('inited', this.element);

    this.counter = 0;
    
    this.el('strong').addEventListener('click', () => {
      this.counter++;
      console.log('kor', this.counter);

      if (this.counter >= 3) {
        removeComponents();
      }

    })

    // this.refs['strong'].addEventListener('click', () => console.log('booooom'));
    // this.refs['li'].addEventListener('click', () => console.log('booooom'));
  }

  destroy() {
    console.log('destroyyeddd');
  }

}

document.addEventListener('DOMContentLoaded', () => {
  loadComponents({
    'app': App
  });
});
