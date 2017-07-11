'use strict'

const _ = require('lodash');

class Theorem {
    /* --- Theorem ---
     * Each theorem is represented with list of assumptions(left side) and a 
     * lemma (right side) (assumptions |- lemma).
     */
    constructor() {
        this._assumption_list = [];
        this._assumption_dict = {
            atom: [],
            constant: [],
            not: [],
            and: [],
            or: [],
            imp: [],
            iff: []
        };
        this._lemma = undefined;
    }

    set lemma(lemma) {
        if(lemma !== undefined)
            this._lemma = lemma.clone();
    }

    get lemma() { return this._lemma; }

    set assumptions(assumptions) {
        this._assumption_list = [];
        if(assumptions !== undefined)
            for(let i = 0; i < assumptions.length ; i++) {
                var assumption_clone = assumptions[i].clone();
                this._assumption_dict[assumptions[i].type].push(assumption_clone);
                this._assumption_list.push(assumption_clone);
            };
    }

    getAssumption(type, num = 1) {
        return _.nth(this._assumption_dict[type], num-1);
    }

    addAssumption(assumption) {
        if(assumption !== undefined) {
            this._assumption_list.push(assumption);
            this._assumption_dict[assumption.type].push(assumption);
        }
    }

    removeAssumption(assumption) {
        if(assumption !== undefined) {
           this._assumption_list = 
                _.remove(this._assumption_list, function(f) {
                    return assumption.notEqualTo(f); 
                });

           this._assumption_dict[assumption.type] = 
                _.remove(this._assumption_dict[assumption.type], function(f) {
                    return assumption.notEqualTo(f); 
                });
        }
    }

    clone() {
        var new_thm = new this.constructor();
        new_thm.lemma = this._lemma;

        var new_assumptions = [];
        this._assumption_list.forEach(function(assumption) {
            new_assumptions.push(assumption);
        });
        new_thm.assumptions = new_assumptions;
        return new_thm;
    }

    toString() {
        if(this._lemma !== undefined) {
            if(this._assumption_list !== undefined && this._assumption_list.length > 0)
                return "[ " + this._assumption_list.join(", ") + " ] |- " + String(this._lemma); 
            if(this._lemma !== undefined)
                return "|- " + String(this._lemma);
            }
        return "";
    }
}

module.exports = function() {
    return new Theorem();
}
