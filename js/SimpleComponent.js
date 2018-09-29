export default class Component {

  constructor(element, options) {
    this.element = element;
    this.element['__component__'] = this;
    this.options = {...options, ...parseOptions(this.element)};
  }

  // DOM
  el(s) {
    return el(s, this.element);
  }

  els(s) {
    return els(s, this.element);
  }

  // Lifecycle hooks
  init() {
  }

  destroy() {
  }

}

export const getComponentFromElement = (element) => getEl(element)['__component__'];
export const createInstance = (element, component, options) => new component(element, options);

export const destroyInstance = (element) => {
  const instance = getComponentFromElement(element);
  if (instance) {
    instance.destroy();
    element['__component__'] = null;
  }
};

//--------------------------------------------------------------
//	Components API
//--------------------------------------------------------------

export const loadComponents = (components = {}, context = document.documentElement) => {

  if (!Array.isArray(context['__components__'])) {
    context['__components__'] = [];
  }

  els('[data-component]', context).forEach((element) => {
    const instance = getComponentFromElement(element);

    if (instance) {
      return true;
    }

    const componentName = element.getAttribute('data-component');
    if (typeof components[componentName] === 'function') {
      context['__components__'].push(createInstance(element, components[componentName]));
    }
  });
  context['__components__'].forEach(component => component.init());
};

export const removeComponents = (context = document.documentElement) => {
  els('[data-component]', context).forEach(element => destroyInstance(element));
  Array.isArray(context['__components__']) && (context['__components__'].length = 0);
};

// Utils
export const el = (e, p = document) => p.querySelector(e);
export const els = (e, p = document) => p.querySelectorAll(e);
export const getEl = (e, p = document) => (typeof e === 'string') ? el(e, p) : e;
export const parseOptions = (e) => JSON.parse(e.getAttribute('data-options')) || {};
