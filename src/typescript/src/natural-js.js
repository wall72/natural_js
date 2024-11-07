/*!
 * Natural-JS v1.0.0
 *
 * Released under the LGPL v2.1 license
 * Date: 2014-09-26T11:11Z
 *
 * Copyright 2014 Goldman Kim(bbalganjjm@gmail.com)
 */

import { jQuery } from "../lib/jquery-3.7.1.min";
import { NC } from "./natural.core";
import { NA } from "./natural.architecture";
import { ND } from "./natural.data";
import { NU } from "./natural.ui";

class NaturalJS extends jQuery { // NC, NA, ND, NU

    /**
     * Initializes and returns a new N object based on jQuery objects with the provided selector and context argument values.
     */
    constructor(selector, context) {
        super(selector, context);
        this.selector = NC.toSelector(selector);
    };

    static VERSION = Object.freeze({
        "Natural-JS" : "1.0.0",
        "Natural-CORE" : "1.0.0",
        "Natural-ARCHITECTURE" : "1.0.0",
        "Natural-DATA" : "1.0.0",
        "Natural-UI" : "1.0.0"
    });

    static get version() {
        return this.VERSION;
    };

}

// TODO N. 확장

export function N(selector, context) {
    return new NaturalJS(selector, context);
}
// Object.assign(N, NC, NA, ND, NU);

window.jQuery.N = window.N = N;