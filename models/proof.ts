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
    get currentGoal() { return _.last(this._states); }

    // Return first subgoal(theorem) from current goal list
    get currentSubgoal() { return _.head(this.currentGoal); }

    back(num_steps = 1) {
        var head = _.head(this._states);
        this._states = _.concat([head],
                                _.dropRight(_.tail(this._states),num_steps));
    }

    assumption() {
        var current_goal = this.currentSubgoal;
        if(current_goal.isAssumption(current_goal.lemma)) {
            this._states.push(_.drop(this.currentGoal));
            return true;
        }
        return false;
    }

    notI() {
        if(this.currentSubgoal.lemma.getType() === Type.Not) {
            var goal = this.currentSubgoal.clone();

            var new_assumption = (<Not>this.currentSubgoal.lemma).op;

            goal.lemma = new Constant(false);
            goal.addAssumption(new_assumption);
            
            this._states.push(_.drop(this.currentGoal)); 
            this.currentGoal.push(goal);
            
            return true;
        }
        return false;
    }

    conjI() {
        if(this.currentSubgoal.lemma.getType() === Type.And) {
            var goal_1= this.currentSubgoal.clone();
            var goal_2 = this.currentSubgoal.clone();

            goal_1.lemma = (<And>this.currentSubgoal.lemma).op1;
            goal_2.lemma = (<And>this.currentSubgoal.lemma).op2;

            this._states.push(_.drop(this.currentGoal));
            this.currentGoal.push(goal_1);
            this.currentGoal.push(goal_2);

            return true;
        }
        return false;
    }

    impI() {
        if(this.currentSubgoal.lemma.getType() === Type.Imp) {
            var goal = this.currentSubgoal.clone();

            var op1 = (<Imp>this.currentSubgoal.lemma).op1; 
            var op2 = (<Imp>this.currentSubgoal.lemma).op2;

            goal.lemma = op2;
            goal.addAssumption(op1);

            // New state = Old state - { Head(Old state) };
            this._states.push(_.drop(this.currentGoal)); 
            this.currentGoal.push(goal);

            return true;
        }
        return false;
    }

    disjI1() {
        if(this.currentSubgoal.lemma.getType() === Type.Or) {
            var goal = this.currentSubgoal.clone();

            var op1 = (<Or>this.currentSubgoal.lemma).op1;

            goal.lemma = op1;

            this._states.push(_.drop(this.currentGoal));
            this.currentGoal.push(goal);

            return true;
        }
        return false;
    }

    disjI2() {
        if(this.currentSubgoal.lemma.getType() === Type.Or) {
            var goal = this.currentSubgoal.clone();

            var op2 = (<Or>this.currentSubgoal.lemma).op2;

            goal.lemma = op2;

            this._states.push(_.drop(this.currentGoal));
            this.currentGoal.push(goal);

            return true;
        }
        return false;
    }

    ccontr() {
        var goal = this.currentSubgoal.clone();

        var new_assumption = new Not(this.currentSubgoal.lemma);

        goal.lemma = new Constant(false);
        goal.addAssumption(new_assumption);

        this._states.push(_.drop(this.currentGoal));
        this.currentGoal.push(goal);

        return true;
    }

    classical() {
        if(this.currentSubgoal.lemma !== undefined) {
            var goal = this.currentSubgoal.clone();
            var new_assumption = new Not(goal.lemma);

            goal.addAssumption(new_assumption);

            this._states.push(_.drop(this.currentGoal));
            this.currentGoal.push(goal);

            return true;
        } 
        return false;
    }

    // [ op1 => op2, assump1, assump2, ... ] |- lemma
    // we get 2 subgoals:
    // 1. [assump1, assump2, ...] |- op1
    // 2. [op2, assump1, assump2, ...] |- lemma
    impE(num = 1) {
        var assumption = this.currentSubgoal.getAssumption(Type.Imp, num);
        if(assumption !== undefined) {
            // We must clone theorem because of object sharing
            var goal_1 = this.currentSubgoal.clone();
            var goal_2 = this.currentSubgoal.clone();

            goal_1.removeAssumption(assumption);
            goal_1.lemma = (<Imp>assumption).op1;

            goal_2.removeAssumption(assumption);
            goal_2.addAssumption((<Imp>assumption).op2);

            this._states.push(_.drop(this.currentGoal)); 
            this.currentGoal.push(goal_1);
            this.currentGoal.push(goal_2);
             
            return true;
        }
        return false;
    }

    mp(num = 1) {
        var imps = this.currentSubgoal.getAllAssumptions(Type.Imp);
        if(imps.length > 0) {
            var mp_imp = imps[num-1];
            if(this.currentSubgoal.lemma.equalTo((<Imp>mp_imp).op2)) {
                var goal = this.currentSubgoal.clone();

                goal.removeAssumption(mp_imp);
                goal.lemma = (<Imp>mp_imp).op2;

                this._states.push(_.drop(this.currentGoal));
                this.currentGoal.push(goal);

                return true;
            } 
        }
        return false;
    }

    notE(num = 1) {
        var assumption = this.currentSubgoal.getAssumption(Type.Not, num);
        if(assumption !== undefined) {
            var goal = this.currentSubgoal.clone();

            goal.removeAssumption(assumption);
            goal.lemma = (<Not>assumption).op;

            this._states.push(_.drop(this.currentGoal)); 
            this.currentGoal.push(goal);

            return true;
        }
        return false;
    }

    conjE(num = 1) {
        var assumption = this.currentSubgoal.getAssumption(Type.And, num);
        if(assumption !== undefined) {
            var goal = this.currentSubgoal.clone();

            goal.removeAssumption(assumption);
            goal.addAssumption((<And>assumption).op1);
            goal.addAssumption((<And>assumption).op2);

            this._states.push(_.drop(this.currentGoal));
            this.currentGoal.push(goal);

            return true;
        }
        return false;
    }

    disjE(num = 1) {
        var assumption = this.currentSubgoal.getAssumption(Type.Or, num);
        if(assumption !== undefined) {
            var goal_1 = this.currentSubgoal.clone();
            var goal_2 = this.currentSubgoal.clone();

            goal_1.removeAssumption(assumption);
            goal_1.addAssumption((<Or>assumption).op1);

            goal_2.removeAssumption(assumption);
            goal_2.addAssumption((<Or>assumption).op2);

            this._states.push(_.drop(this.currentGoal));
            this.currentGoal.push(goal_1);
            this.currentGoal.push(goal_2);

            return true;
        }
        return false;
    }

    toString() {
        var i = 1;
        var out_string = "";
        _.forEach(this.currentGoal, function(goal) {
            out_string += i + ". " + String(goal) + "\n";
            i++;
        });
        return out_string;
    }
}
