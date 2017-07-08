'use strict'

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

    set assumptions(assumptions) {
        this._assumption_list = [];
        if(assumptions !== undefined)
            for(let i = 0; i < assumptions.length ; i++) {
                var assumption_clone = assumptions[i].clone();
                this._assumption_dict[assumptions[i].type].push(assumption_clone);
                this._assumption_list.push(assumption_clone);
            };
    }

    addAssumption(assumption) {
        if(assumption !== undefined) {
            this._assumption_list.push(assumption);
            this._assumption_dict[assumption.type].push(assumption);
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
