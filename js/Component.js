import * as dom from './dom';
import {parseOptions} from "./utils";

export default class Component {

	constructor(element, options) {
		this.element = element;
		this.element['__component__'] = this;
		this._ref = {};
		this._options = options || {};
		this._state = {};
	}

	//--------------------------------------------------------------
	//	Ref
	//--------------------------------------------------------------
	get ref() {
		return this._ref;
	}
	
	set ref(items) {
		const allRefs = dom.els('[data-ref]', this.element);
		return allRefs;

		// TODO: Da go gledam posle
		if (Object.keys(items).length === 0) {
			allRefs.forEach(element => {
				let refName = element.getAttribute('data-ref');
				if (refName.indexOf(':') !== -1) {
					let refNameArray = refName.split(':');
					if (refNameArray[0] == this._name) {
						if (!this._ref[refNameArray[1]]) {
							this._ref[refNameArray[1]] = allRefs.filter(item => {
								return item.getAttribute('data-ref') === refName;
							});
						}
					} else {
						return;
					}
				} else {
					if (!this._ref[refName]) {
						this._ref[refName] = allRefs.filter(item => {
							return item.getAttribute('data-ref') === refName;
						});
					}
				}
			});
		} else {
			this._ref = Object.keys(items)
				.map(key => {
					const isArray = Array.isArray(items[key]);

					// non-empty refs
					if (items[key] !== null && (isArray && items[key].length > 0)) {
						return {
							name: key,
							value: items[key]
						}
					}

					const name = key;
					const prefixedName = `${this._name}:${name}`;

					let refs = allRefs.filter(element => element.getAttribute('data-ref') === prefixedName);

					if (refs.length === 0) {
						refs = allRefs.filter(element => element.getAttribute('data-ref') === name);
					}

					if (!isArray) {
						refs = refs.length ? refs[0] : null
					}

					return {
						name: key,
						value: refs
					}
				})
				.reduce((acc, ref) => {
					acc[ref.name] = ref.value;
					return acc;
				}, {})
		}
		return this._ref;
	}

	//--------------------------------------------------------------
	//	Options
	//--------------------------------------------------------------

	get options() {
		return this._options;
	}

	set options(defaults) {
		this._options = {
			...this._options,
			...defaults,
			...parseOptions(this.element),
		};
		return this._options;
	}

	//--------------------------------------------------------------
	//	State, maybe add vue-style reactivity?
	//--------------------------------------------------------------
	get state() {
		return this._state;
	}

	set state(state) {
		console.warn('You should not change state manually. Use setState instead.');
		this._state = state;
	}

	//--------------------------------------------------------------
	//	Lifecycle
	//--------------------------------------------------------------

	_load() {
		this.mount();
	}

	mount() {
		console.warn(`Component ${this._name} does not have "mount" method.`);
	}

	unmount() {
		// this is here only to be rewritten
	}

	//--------------------------------------------------------------
	//	Refs
	//--------------------------------------------------------------
	getRef(ref, prefixed = false) {
		return `[data-ref="${prefixed ? `${this._name}:` : ''}${ref}"]`;
	}

	//--------------------------------------------------------------
	//	State
	//--------------------------------------------------------------

	setState(changes) {

		let stateChanges = {};

		Object.keys(changes).forEach(key => {
			if (Array.isArray(changes[key])) {
				if (this._state[key] != null && Array.isArray(this._state[key])) {
					if (this._state[key].length === changes[key].length) {
						changes[key].some((item, index) => {
							if (this._state[key][index] !== item) {
								stateChanges[key] = changes[key];
								this._state[key] = stateChanges[key];
								return true;
							}
							return false;
						});
					} else {
						stateChanges[key] = changes[key];
						this._state[key] = stateChanges[key];
					}
				} else {
					stateChanges[key] = changes[key];
					this._state[key] = stateChanges[key];
				}
			} else if (typeof changes[key] === 'object') {
				if (this._state[key] != null && typeof this._state[key] === 'object') {
					stateChanges[key] = {};
					Object.keys(changes[key]).forEach(subkey => {
						if (this._state[key][subkey] !== changes[key][subkey]) {
							stateChanges[key][subkey] = changes[key][subkey];
						}
					});
				} else {
					stateChanges[key] = changes[key];
				}

				this._state[key] = {
					...this._state[key],
					...stateChanges[key],
				};
			} else {
				if (this._state[key] !== changes[key]) {
					stateChanges[key] = changes[key];

					this._state[key] = changes[key];
				}
			}
		});

		Object.keys(stateChanges).forEach(key => {
			if (Array.isArray(changes[key])) {
				if (stateChanges[key].length === 0) {
					delete stateChanges[key];
				}
			} else if (typeof changes[key] === 'object') {
				if (Object.keys(stateChanges[key]).length === 0) {
					delete stateChanges[key];
				}
			}
		});

		this.stateChange(stateChanges);

	}

	stateChange(stateChanges) {
		// this is here only to be rewritten
	}

}

//--------------------------------------------------------------
//	Component Create/Destroy
//--------------------------------------------------------------

export const getComponentFromElement = (element) => dom.getEl(element)['__component__'];

export const createInstance = (element, componentName, component, options) => {
	// Prototype?
	component.prototype._name = componentName;
	return new component(element, options);
};

export const destroyInstance = (element) => {
	const instance = getComponentFromElement(element);
	if (instance) {
		instance.unmount();
		element['__component__'] = null;
	}
};

//--------------------------------------------------------------
//	Components API
//--------------------------------------------------------------

export const loadComponents = (components = {}, context = dom.html) => {

	if (!components || Object.keys(components).length === 0) {
		console.warn('App has no components');
		return;
	}

	let initialisedComponents = [];

	dom.els('[data-component]', context).forEach((element) => {
		const instance = getComponentFromElement(element);

		if (instance) {
			console.warn('Error: instance exists: \n', instance);
			return true; // continue
		}

		let componentName = element.getAttribute('data-component');

		if (typeof components[componentName] === 'function') {
			initialisedComponents.push(createInstance(element, componentName, components[componentName]));
		} else {
			console.warn(`Constructor for component "${componentName}" not found.`);
		}
	});

	// call _load/require/mount
	initialisedComponents.forEach(component => {
		component._load();
	});
};

export const removeComponents = (context = dom.html) => {
	dom.els('[data-component]', context).forEach(element => destroyInstance(element));
};