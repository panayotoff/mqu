import {isArrayLike} from "./utils";

// Dom elements / Manipulation, Fastdom


export const html = document.documentElement;
export const body = document.body;

export const parent = p => p ? p : document;
export const el = (e, p = document) => p.querySelector(e);
export const els = (e, p = document) => p.querySelectorAll(e);
export const getEl = (e, p = document) => (typeof e === 'string') ? el(e, p) : e;

export const addClass = (el, className) => Array.from(el).forEach(e => e.className.add(className));
export const removeClass = (el, className) => Array.from(el).forEach(e => e.className.remove(className));

export const raf = window.requestAnimationFrame || window.webkitRequestAnimationFrame || ((cb) => setTimeout(cb, 16));

//--------------------------------------------------------------
//
//--------------------------------------------------------------

//
// class Dom {
//   constructor(expression) {
//     let elements = Array.isArray(expression) ? expression : Array.from(els(expression));
//     Array.prototype.push.apply(this, elements);
//   }
// }
//
// export default Dom;
