'use strict'

import * as _ from "lodash";
import { IFormula, And, Or, Iff, Imp, Constant, Not, Atom, Type } from './formula';

export class Theorem {
    /* --- Theorem ---
     * Each theorem is represented with list of assumptions(left side) and a 
     * lemma (right side) (assumptions |- lemma).
     */
    private assumptionList: IFormula[];
    private assumptionDict: {
            atom: Atom[],
            constant: Constant[],
            not: Not[],
            and: And[],
            or: Or[],
            imp: Imp[],
            iff: Iff[]
    }
    
    constructor() {
        this.assumptionList = [];
        this.assumptionDict = {
            atom: [],
            constant: [],
            not: [],
            and: [],
            or: [],
            imp: [],
            iff: []
        };
        this.lemma = undefined;
    }

    set lemma(lemma) {
        if(lemma !== undefined)
            this.lemma = lemma.clone();
    }

    get lemma(): Theorem { return this.lemma; }

    set assumptions(assumptions) {
        this.assumptionList = [];
        if(assumptions !== undefined)
            for(let i = 0; i < assumptions.length ; i++) {
                var assumption_clone = assumptions[i].clone();
                this.assumptionDict[assumptions[i].type].push(assumption_clone);
                this.assumptionList.push(assumption_clone);
            };
    }

    getAssumption(type, num = 1) {
        return _.nth(this.assumptionDict[type], num-1);
    }

    getAllAssumptions(type) {
        return this.assumptionDict[type];
    }

    addAssumption(assumption) {
        if(assumption !== undefined) {
            this.assumptionList.push(assumption);
            this.assumptionDict[assumption.type].push(assumption);
        }
    }

    isAssumption(assumption) {
       return _.find(this.assumptionList, function(_assump) {
            return _assump.equalTo(assumption) !== undefined;
       });
    }

    removeAssumption(assumption) {
        if(assumption !== undefined) {
           this.assumptionList = 
                _.remove(this.assumptionList, function(f) {
                    return assumption.notEqualTo(f); 
                });

           this.assumptionDict[assumption.type] = 
                _.remove(this.assumptionDict[assumption.type], function(f) {
                    return assumption.notEqualTo(f); 
                });
        }
    }



    clone() {
        var new_thm = new Theorem();
        new_thm.lemma = this.lemma;

        var new_assumptions = [];
        this.assumptionList.forEach(function(assumption) {
            new_assumptions.push(assumption);
        });
        new_thm.assumptions = new_assumptions;
        return new_thm;
    }

    toString() {
        if(this.lemma !== undefined) {
            if(this.assumptionList !== undefined && this.assumptionList.length > 0)
                return "[ " + this.assumptionList.join(", ") + " ] |- " + String(this.lemma); 
            if(this.lemma !== undefined)
                return "|- " + String(this.lemma);
            }
        return "";
    }
}

// module.exports = function() {
//     return new Theorem();
// }
