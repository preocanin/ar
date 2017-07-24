'use strict'

import * as _ from "lodash";
import { IFormula, And, Or, Iff, Imp, Constant, Not, Atom, Type } from './formula';


export class Theorem {
    /* --- Theorem ---
     * Each theorem is represented with list of assumptions(left side) and a 
     * lemma (right side) (assumptions |- lemma).
     */
    private _lemma: IFormula;
    private _assumption_list: IFormula[];
    private _assumption_dict: { [type: string]: IFormula[] }
    
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
        this.lemma = undefined;
    }

    set lemma(lemma) {
        if(lemma !== undefined)
            this._lemma = lemma.clone();
    }

    get lemma() { return this._lemma; }

    set assumptions(assumptions: IFormula[]) {
        this._assumption_list = [];
        if(assumptions !== undefined)
            for(let i = 0; i < assumptions.length ; i++) {
                const assumption_clone = assumptions[i].clone();
                this._assumption_dict[assumptions[i].getType()].push(assumption_clone);
                this._assumption_list.push(assumption_clone);
            };
    }

    getAssumption(type: string, num = 1): IFormula {
        return _.nth(this._assumption_dict[type], num-1);
    }

    getAllAssumptions(type: string): IFormula[] {
        return this._assumption_dict[type];
    }

    addAssumption(assumption: IFormula) {
        if(assumption !== undefined) {
            this._assumption_list.push(assumption);
            this._assumption_dict[assumption.getType()].push(assumption);
        }
    }

    isAssumption(assumption: IFormula) {
       return _.find(this._assumption_list, function(_assump) {
            return _assump.equalTo(assumption) !== undefined;
       });
    }

    removeAssumption(assumption: IFormula) {
        if(assumption !== undefined) {
           this._assumption_list = 
                _.remove(this._assumption_list, function(f) {
                    return assumption.notEqualTo(f); 
                });

           this._assumption_dict[assumption.getType()] = 
                _.remove(this._assumption_dict[assumption.getType()], function(f: IFormula) {
                    return assumption.notEqualTo(f); 
                });
        }
    }



    clone() : Theorem {
        var new_thm = new Theorem();
        new_thm.lemma = this.lemma;

        var new_assumptions: IFormula[] = [];
        this._assumption_list.forEach(function(assumption) {
            new_assumptions.push(assumption);
        });
        new_thm.assumptions = new_assumptions;
        return new_thm;
    }

    toString() : string {
        if(this.lemma !== undefined) {
            if(this._assumption_list !== undefined && this._assumption_list.length > 0)
                return "[ " + this._assumption_list.join(", ") + " ] |- " + String(this.lemma); 
            if(this.lemma !== undefined)
                return "|- " + String(this.lemma);
            }
        return "";
    }
}

module.exports = () => new Theorem()
