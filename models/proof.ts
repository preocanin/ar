'use strict'

import * as _ from "lodash";
import { And, Or, Iff, Imp, Constant, Not, Atom, Type } from './formula';
import { Theorem } from './theorem';

export class Proof {
    /* --- Proof ---
     * Each proof consists of states. When we apply some deduction rule we
     * change the state of our proof. In order to be able to go back to
     * previous state we must hold all of them.
     */
    private _states: Theorem[][];
    constructor(thm: Theorem) {
        if(thm === undefined)
            throw "Proof: constructor: theorem supplied can't be undefined";
        this._states = [];
        this._states.push([thm]);
    }

    get states() { return this._states; }

    // Return current list of goals
    get currentGoals() { return _.last(this._states); }

    // Return first subgoal(theorem) from current goal list
    get currentThm() { return _.head(this.currentGoals); }

    back(num_steps = 1) {
        _.dropRight(this._states,num_steps);
    }

    assumption() {
        var current_goal = this.currentThm;
        if(current_goal.isAssumption(current_goal.lemma)) {
            this._states.push(_.drop(this.currentGoals));
            return true;
        }
        return false;
    }

    notI() {
        if(this.currentThm.lemma.type == "not") {
            var goal = this.currentThm.clone();

            var new_assumption = this.currentThm.lemma.op;

            goal.lemma = new Constant(false);
            goal.addAssumption(new_assumption);
            
            this._states.push(_.drop(this.currentGoals)); 
            this.currentGoals.push(goal);
            
            return true;
        }
        return false;
    }

    conjI() {
        if(this.currentThm.lemma.type == "and") {
            var goal_1= this.currentThm.clone();
            var goal_2 = this.currentThm.clone();

            goal_1.lemma = this.currentThm.lemma.op1;
            goal_2.lemma = this.currentThm.lemma.op2;

            this._states.push(_.drop(this.currentGoals));
            this.currentGoals.push(goal_1);
            this.currentGoals.push(goal_2);

            return true;
        }
        return false;
    }

    impI() {
        if(this.currentThm.lemma.type == Type) {
            var goal = this.currentThm.clone();

            var op1 = this.currentThm.lemma.op1; 
            var op2 = this.currentThm.lemma.op2;

            goal.lemma = op2;
            goal.addAssumption(op1);

            // New state = Old state - { Head(Old state) };
            this._states.push(_.drop(this.currentGoals)); 
            this.currentGoals.push(goal);

            return true;
        }
        return false;
    }

    disjI1() {
        if(this.currentThm.lemma.type == "or") {
            var goal = this.currentThm.clone();

            var op1 = this.currentThm.lemma.op1;

            goal.lemma = op1;

            this._states.push(_.drop(this.currentGoals));
            this.currentGoals.push(goal);

            return true;
        }
        return false;
    }

    disjI2() {
        if(this.currentThm.lemma.type == Type.Or) {
            var goal = this.currentThm.clone();

            var op2 = this.currentThm.lemma.op2;

            goal.lemma = op2;

            this._states.push(_.drop(this.currentGoals));
            this.currentGoals.push(goal);

            return true;
        }
        return false;

    }

    ccontr() {
        var goal = this.currentThm.clone();

        var new_assumption = new Not(this.currentThm.lemma);

        goal.lemma = new Constant(false);
        goal.addAssumption(new_assumption);

        this._states.push(_.drop(this.currentGoals));
        this.currentGoals.push(goal);

        return true;
    }

    classical() {
        if(this.currentThm.lemma !== undefined) {
            var goal = this.currentThm.clone();
            var new_assumption = new Not(goal.lemma);

            goal.addAssumption(new_assumption);

            this._states.push(_.drop(this.currentGoals));
            this.currentGoals.push(goal);

            return true;
        } 
        return false;
    }

    // [ op1 => op2, assump1, assump2, ... ] |- lemma
    // we get 2 subgoals:
    // 1. [assump1, assump2, ...] |- op1
    // 2. [op2, assump1, assump2, ...] |- lemma
    impE(num = 1) {
        var assumption = this.currentThm.getAssumption("imp",num);
        if(assumption !== undefined) {
            // We must clone theorem because of object sharing
            var goal_1 = this.currentThm.clone();
            var goal_2 = this.currentThm.clone();

            goal_1.removeAssumption(assumption);
            goal_1.lemma = assumption.op1;

            goal_2.removeAssumption(assumption);
            goal_2.addAssumption(assumption.op2);

            this._states.push(_.drop(this.currentGoals)); 
            this.currentGoals.push(goal_1);
            this.currentGoals.push(goal_2);
             
            return true;
        }
        return false;
    }

    mp(num = 1) {
        var imps = this.currentThm.getAllAssumptions("imp");
        if(imps.length > 0) {
            var mp_imp = imps[num-1];
            if(this.currentThm.lemma.equalTo(mp_imp.op2)) {
                var goal = this.currentThm.clone();

                goal.removeAssumption(mp_imp);
                goal.lemma = mp_imp.op2;

                this._states.push(_.drop(this.currentGoals));
                this.currentGoals.push(goal);

                return true;
            } 
        }
        return false;
    }

    notE(num = 1) {
        var assumption = this.currentThm.getAssumption("not",num);
        if(assumption !== undefined) {
            var goal = this.currentThm.clone();

            goal.removeAssumption(assumption);
            goal.lemma = assumption.op;

            this._states.push(_.drop(this.currentGoals)); 
            this.currentGoals.push(goal);

            return true;
        }
        return false;
    }

    conjE(num = 1) {
        var assumption = this.currentThm.getAssumption("and",num);
        if(assumption !== undefined) {
            var goal = this.currentThm.clone();

            goal.removeAssumption(assumption);
            goal.addAssumption(assumption.op1);
            goal.addAssumption(assumption.op2);

            this._states.push(_.drop(this.currentGoals));
            this.currentGoals.push(goal);

            return true;
        }
        return false;
    }

    disjE(num = 1) {
        var assumption = this.currentThm.getAssumption("or",num);
        if(assumption !== undefined) {
            var goal_1 = this.currentThm.clone();
            var goal_2 = this.currentThm.clone();

            goal_1.removeAssumption(assumption);
            goal_1.addAssumption(assumption.op1);

            goal_2.removeAssumption(assumption);
            goal_2.addAssumption(assumption.op2);

            this._states.push(_.drop(this.currentGoals));
            this.currentGoals.push(goal_1);
            this.currentGoals.push(goal_2);

            return true;
        }
        return false;
    }

    toString() {
        var i = 1;
        var out_string = "";
        _.forEach(this.currentGoals, function(goal) {
            out_string += i + ". " + String(goal) + "\n";
            i++;
        });
        return out_string;
    }
}

module.exports = Proof;
