'use strict'
const _ = require('lodash');

class Proof {
    /* --- Proof ---
     * Each proof consists of states. When we apply some deduction rule we
     * change the state of our proof. In order to be able to go back to
     * previous state we must hold all of them.
     */
    constructor(thm) {
        if(thm === undefined)
            throw "Proof: constructor: theorem supplied can't be undefined";
        this._states = [];
        this._states.push([thm]);
    }

    get states() { return this._states; }

    get currentGoals() { return _.last(this._states); }

    back(num_steps = 1) {
        for(let i = 0; i < num_steps && this._states.length > 0; i++)
                this._states.pop();
    }
}

module.exports = Proof;
