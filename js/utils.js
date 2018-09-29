// various utils

import {el} from "./dom";

export const parseOptions = (element) => JSON.parse(element.getAttribute('data-options')) || {};

export const isArray = v => v.constructor === Array;
export const isString = v => typeof v === 'string';
export const isObject = v => v === Object(v);

export const isArrayLike = obj => {
  if (obj.length && typeof obj.length === 'number') {

    if (obj.length === 0) {
      return true;
    }
    if (obj.length > 0) {
      return (obj.length - 1) in obj;
    }
  }
  
  return false;
};
