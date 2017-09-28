'use strict'

import * as _ from "lodash";
import { And, Or, Iff, Imp, Constant, Not, Atom, Type } from './formula';
import { Theorem } from './theorem';

const clc = require('cli-color');

const del = clc.xterm(38);
const num = clc.xterm(44); 
const error = clc.xterm(1);

export class Proof {
    /* --- Proof ---
     * Each proof consists of states. When we apply some deduction rule we
     * change the state of our proof. In order to be able to go back to
     * previous state we must hold all of them.
     */

    /* --- State ---
     * Is a list of theorems (i.e. subgoals)
     * When one of the theorems are proven we delete 
     * create new state that contains all theorems accept that one.
     */
    private _states: Theorem[][];
    constructor(thm: Theorem) {
        if(thm === undefined)
            throw "Proof: constructor: theorem supplied can't be undefined";
        this._states = [];
        this._states.push([thm]);
    }

    // Drop top subgoal and add new subgoal/s instead 
    private _dropAndAdd = (subs: Theorem[]) => {
        // From top state we drop first theorem in list 
        this._states.push(_.drop(this.currentGoal));
        // and add new theorems
        this.currentGoal = _.concat(subs, this.currentGoal);
    }

    get states() { return this._states; }

    // Return current top state 
    get currentGoal() { return _.last(this._states); }

    // Change top state
    set currentGoal(goal) { 
        this._states[this._states.length - 1] = goal;
    }

    // Return first subgoal(theorem) from current goal list
    get currentSubgoal() { return _.head(this.currentGoal); }

    back(num_steps = 1) {
        var head = _.head(this._states);
        this._states = _.concat([head],
                                _.dropRight(_.tail(this._states),num_steps));
    }

    assumption() {
        var current_goal = this.currentSubgoal;
        if((current_goal.lemma.getType() == "constant" && (<Constant>current_goal.lemma).val)
            || current_goal.isAssumption(current_goal.lemma)) {
            this._dropAndAdd([]);
        }
    }

    notI() {
        if(this.currentSubgoal.lemma.getType() === Type.Not) {
            var goal = this.currentSubgoal.clone();

            var new_assumption = (<Not>this.currentSubgoal.lemma).op;

            goal.lemma = new Constant(false);
            goal.addAssumption(new_assumption);
            
            this._dropAndAdd([goal]);
            
        }
        else
            console.log(error("Cannot apply rule notI because top operator is not Not"));
    }

    conjI() {
        if(this.currentSubgoal.lemma.getType() === Type.And) {
            var goal_1= this.currentSubgoal.clone();
            var goal_2 = this.currentSubgoal.clone();

            goal_1.lemma = (<And>this.currentSubgoal.lemma).op1;
            goal_2.lemma = (<And>this.currentSubgoal.lemma).op2;

            this._dropAndAdd([goal_1,goal_2]);
        }
        else
            console.log(error("Cannot apply rule conjI because top operator is not Conj"));
    }

    impI() {
        if(this.currentSubgoal.lemma.getType() === Type.Imp) {
            var goal = this.currentSubgoal.clone();

            var op1 = (<Imp>this.currentSubgoal.lemma).op1; 
            var op2 = (<Imp>this.currentSubgoal.lemma).op2;

            goal.lemma = op2;
            goal.addAssumption(op1);

            this._dropAndAdd([goal]);
        }
        else 
            console.log(error("Cannot apply rule impI because top operator is not Imp"));
    }

    disjI1() {
        if(this.currentSubgoal.lemma.getType() === Type.Or) {
            var goal = this.currentSubgoal.clone();

            var op1 = (<Or>this.currentSubgoal.lemma).op1;

            goal.lemma = op1;

            this._dropAndAdd([goal]);
        }
        else 
            console.log(error("Cannot apply rule disjI1 because top operator is not Disj"));
    }

    disjI2() {
        if(this.currentSubgoal.lemma.getType() === Type.Or) {
            var goal = this.currentSubgoal.clone();

            var op2 = (<Or>this.currentSubgoal.lemma).op2;

            goal.lemma = op2;

            this._dropAndAdd([goal]);
        }
        else
            console.log(error("Cannot apply rule disjI2 because top operator is not Disj"));
    }

    iffI() {
        if(this.currentSubgoal.lemma.getType() === Type.Iff) {
            var goal_1 = this.currentSubgoal.clone();
            var goal_2 = this.currentSubgoal.clone();

            goal_1.lemma = new Imp((<Iff>goal_1.lemma).op1,
                                   (<Iff>goal_1.lemma).op2);

            goal_2.lemma = new Imp((<Iff>goal_2.lemma).op2,
                                   (<Iff>goal_2.lemma).op1);

            this._dropAndAdd([goal_1,goal_2]);
        }
        else
            console.log(error("Cannot apply rule iffI because top operator is not Iff"));
    }

    ccontr() {
        var goal = this.currentSubgoal.clone();

        var new_assumption = new Not(this.currentSubgoal.lemma);

        goal.lemma = new Constant(false);
        goal.addAssumption(new_assumption);

        this._dropAndAdd([goal]);
    }

    classical() {
        if(this.currentSubgoal.lemma) {
            var goal = this.currentSubgoal.clone();
            var new_assumption = new Not(goal.lemma);

            goal.addAssumption(new_assumption);

            this._dropAndAdd([goal]);
        } 
    }

    // [ op1 => op2, assump1, assump2, ... ] |- lemma
    // we get 2 subgoals:
    // 1. [assump1, assump2, ...] |- op1
    // 2. [op2, assump1, assump2, ...] |- lemma
    impE(num = 1) {
        var assumption = this.currentSubgoal.getAssumption(Type.Imp, num);
        if(assumption) {
            // We must clone theorem because of object sharing
            var goal_1 = this.currentSubgoal.clone();
            var goal_2 = this.currentSubgoal.clone();

            goal_1.removeAssumption(assumption);
            goal_1.lemma = (<Imp>assumption).op1;

            goal_2.removeAssumption(assumption);
            goal_2.addAssumption((<Imp>assumption).op2);

            this._dropAndAdd([goal_1,goal_2]);
        }
        else 
            console.log(error("Cannot apply erule impE because there is no assumption with"
                              + " Imp operator"));
    }

    mp(num = 1) {
        var imps = this.currentSubgoal.getAllAssumptions(Type.Imp);
        if(imps.length > 0) {
            var mp_imp = imps[num-1];
            if(this.currentSubgoal.lemma.equalTo((<Imp>mp_imp).op2)) {
                var goal = this.currentSubgoal.clone();

                goal.removeAssumption(mp_imp);
                goal.lemma = (<Imp>mp_imp).op1;

                this._dropAndAdd([goal]);

            } 
        }
        else
            console.log(error("Cannot apply erule mp because there is no assumption with"
                              + " Imp operator"));
    }

    notE(num = 1) {
        var assumption = this.currentSubgoal.getAssumption(Type.Not, num);
        if(assumption) {
            var goal = this.currentSubgoal.clone();

            goal.removeAssumption(assumption);
            goal.lemma = (<Not>assumption).op;

            this._dropAndAdd([goal]);
        }
        else
            console.log(error("Cannot apply erule notE because there is no assumption with"
                              + " Not operator"));
    }

    conjE(num = 1) {
        var assumption = this.currentSubgoal.getAssumption(Type.And, num);
        if(assumption) {
            var goal = this.currentSubgoal.clone();

            goal.removeAssumption(assumption);
            goal.addAssumption((<And>assumption).op1);
            goal.addAssumption((<And>assumption).op2);

            this._dropAndAdd([goal]);
        }
        else
            console.log(error("Cannot apply erule conjE because there is no assumption with"
                              + " Conj operator"));
    }

    disjE(num = 1) {
        var assumption = this.currentSubgoal.getAssumption(Type.Or, num);
        if(assumption) {
            var goal_1 = this.currentSubgoal.clone();
            var goal_2 = this.currentSubgoal.clone();

            goal_1.removeAssumption(assumption);
            goal_1.addAssumption((<Or>assumption).op1);

            goal_2.removeAssumption(assumption);
            goal_2.addAssumption((<Or>assumption).op2);

            this._dropAndAdd([goal_1,goal_2]);
        }
        else
            console.log(error("Cannot apply erule conjE because there is no assumption with"
                              + " Disj operator"));
    }

    iffE(num = 1) {
        var assumption = this.currentSubgoal.getAssumption(Type.Iff, num);
        if(assumption) {
            var goal = this.currentSubgoal.clone();
            var op1 = (<Iff>assumption).op1;
            var op2 = (<Iff>assumption).op2;

            goal.removeAssumption(assumption);
            goal.addAssumption(new Imp(op1,op2));
            goal.addAssumption(new Imp(op2,op1));

            this._dropAndAdd([goal]);
        }
        else
            console.log(error("Cannot apply erule conjE because there is no assumption with"
                              + " Iff operator"));
    }

    toString() {
        var i = 1;
        var max_len = 0;
        var subgoals_string = "";

        if(this.currentGoal.length == 1 && typeof(this.currentGoal[0]) === "boolean")
            return "";

        _.forEach(this.currentGoal, function(goal) {
            var subgoal = String(goal);
            if(max_len < subgoal.length)
                max_len = subgoal.length;
            subgoals_string += num(i + ". ") + subgoal + "\n";
            i++;
        });

        var out_string = "\n" + del(_.repeat("-", max_len + 4)) + "\n";
        out_string += subgoals_string;
        out_string += del(_.repeat("-", max_len + 4)) + "\n";

        return out_string;
    }
}
