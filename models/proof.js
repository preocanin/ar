'use strict'

module.exports = class Proof {
    constructor(thm) {
        this._states = [];
        this._states.push([thm]);
    }

    get states() { return this._states; }
}
