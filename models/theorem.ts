'use strict'

import * as _ from "lodash";
import { IFormula, And, Or, Iff, Imp, Constant, Not, Atom, Type } from './formula';


export class Theorem {
    /* --- Theorem ---
     * Each theorem is represented with list of assumptions(left side) and a 
     * lemma (right side) (assumptions |- lemma).
     */
    private _lemma: IFormula;
    private assumptionList: IFormula[];
    private assumptionDict: { [type: string]: IFormula[] }
    
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
            this._lemma = lemma.clone();
    }

    get lemma() { return this._lemma; }

    set assumptions(assumptions: IFormula[]) {
        this.assumptionList = [];
        if(assumptions !== undefined)
            for(let i = 0; i < assumptions.length ; i++) {
                var assumption_clone = assumptions[i].clone();
                this.assumptionDict[assumptions[i].getType()].push(assumption_clone);
                this.assumptionList.push(assumption_clone);
            };
    }

    getAssumption(type: Type, num = 1): IFormula {
        return _.nth(this.assumptionDict[type], num-1);
    }

    getAllAssumptions(type: Type): IFormula[] {
        return this.assumptionDict[type];
    }

    addAssumption(assumption: IFormula) {
        if(assumption !== undefined) {
            this.assumptionList.push(assumption);
            this.assumptionDict[assumption.getType()].push(assumption);
        }
    }

    isAssumption(assumption: IFormula) {
       return _.find(this.assumptionList, function(_assump) {
            return _assump.equalTo(assumption) !== undefined;
       });
    }

    removeAssumption(assumption: IFormula) {
        if(assumption !== undefined) {
           this.assumptionList = 
                _.remove(this.assumptionList, function(f) {
                    return assumption.notEqualTo(f); 
                });

           this.assumptionDict[assumption.getType()] = 
                _.remove(this.assumptionDict[assumption.getType()], function(f: IFormula) {
                    return assumption.notEqualTo(f); 
                });
        }
    }



    clone() {
        var new_thm = new Theorem();
        new_thm.lemma = this.lemma;

        var new_assumptions: IFormula[] = [];
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

export const TheoremConstructor = function() {
    return new Theorem();
}

// export () => {
//     return new Theorem();
// }