// Dom elements / Manipulation, Fastdom


export const html = document.documentElement;
export const body = document.body;

export const parent = p => p ? p : document;
export const el = (e, p) => p.querySelector(e);
export const els = (e, p) => p.querySelectorAll(e);
export const getEl = (e) => (typeof e === 'string') ? el(e) : e;

export const addClass = (el, className) => Array.from(el).forEach(e => e.className.add(className));
export const removeClass = (el, className) => Array.from(el).forEach(e => e.className.remove(className));

export const raf = window.requestAnimationFrame || window.webkitRequestAnimationFrame || ((cb) => setTimeout(cb, 16));