// various utils

import {el} from "./dom";

export const parseOptions = (element) => JSON.parse(element.getAttribute('data-options')) || {};