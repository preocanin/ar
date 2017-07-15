'use strict';
var _ = require('lodash');
var Formula = require('./formula');
var Proof = (function () {
    /* --- Proof ---
     * Each proof consists of states. When we apply some deduction rule we
     * change the state of our proof. In order to be able to go back to
     * previous state we must hold all of them.
     */
    function Proof(thm) {
        if (thm === undefined)
            throw "Proof: constructor: theorem supplied can't be undefined";
        this._states = [];
        this._states.push([thm]);
    }
    Object.defineProperty(Proof.prototype, "states", {
        get: function () { return this._states; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Proof.prototype, "currentGoals", {
        // Return current list of goals
        get: function () { return _.last(this._states); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Proof.prototype, "currentThm", {
        // Return first subgoal(theorem) from current goal list
        get: function () { return _.head(this.currentGoals); },
        enumerable: true,
        configurable: true
    });
    Proof.prototype.back = function (num_steps) {
        if (num_steps === void 0) { num_steps = 1; }
        _.dropRight(this._states, num_steps);
    };
    Proof.prototype.assumption = function () {
        var current_goal = this.currentThm;
        if (current_goal.isAssumption(current_goal.lemma)) {
            this._states.push(_.drop(this.currentGoals));
            return true;
        }
        return false;
    };
    Proof.prototype.notI = function () {
        if (this.currentThm.lemma.type == "not") {
            var goal = this.currentThm.clone();
            var new_assumption = this.currentThm.lemma.op;
            goal.lemma = new Formula.Constant(false);
            goal.addAssumption(new_assumption);
            this._states.push(_.drop(this.currentGoals));
            this.currentGoals.push(goal);
            return true;
        }
        return false;
    };
    Proof.prototype.conjI = function () {
        if (this.currentThm.lemma.type == "and") {
            var goal_1 = this.currentThm.clone();
            var goal_2 = this.currentThm.clone();
            goal_1.lemma = this.currentThm.lemma.op1;
            goal_2.lemma = this.currentThm.lemma.op2;
            this._states.push(_.drop(this.currentGoals));
            this.currentGoals.push(goal_1);
            this.currentGoals.push(goal_2);
            return true;
        }
        return false;
    };
    Proof.prototype.impI = function () {
        if (this.currentThm.lemma.type == "imp") {
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
    };
    Proof.prototype.disjI1 = function () {
        if (this.currentThm.lemma.type == "or") {
            var goal = this.currentThm.clone();
            var op1 = this.currentThm.lemma.op1;
            goal.lemma = op1;
            this._states.push(_.drop(this.currentGoals));
            this.currentGoals.push(goal);
            return true;
        }
        return false;
    };
    Proof.prototype.disjI2 = function () {
        if (this.currentThm.lemma.type == "or") {
            var goal = this.currentThm.clone();
            var op2 = this.currentThm.lemma.op2;
            goal.lemma = op2;
            this._states.push(_.drop(this.currentGoals));
            this.currentGoals.push(goal);
            return true;
        }
        return false;
    };
    Proof.prototype.ccontr = function () {
        var goal = this.currentThm.clone();
        var new_assumption = new Formula.Not(this.currentThm.lemma);
        goal.lemma = new Formula.Constant(false);
        goal.addAssumption(new_assumption);
        this._states.push(_.drop(this.currentGoals));
        this.currentGoals.push(goal);
        return true;
    };
    Proof.prototype.classical = function () {
        if (this.currentThm.lemma !== undefined) {
            var goal = this.currentThm.clone();
            var new_assumption = new Formula.Not(goal.lemma);
            goal.addAssumption(new_assumption);
            this._states.push(_.drop(this.currentGoals));
            this.currentGoals.push(goal);
            return true;
        }
        return false;
    };
    // [ op1 => op2, assump1, assump2, ... ] |- lemma
    // we get 2 subgoals:
    // 1. [assump1, assump2, ...] |- op1
    // 2. [op2, assump1, assump2, ...] |- lemma
    Proof.prototype.impE = function (num) {
        if (num === void 0) { num = 1; }
        var assumption = this.currentThm.getAssumption("imp", num);
        if (assumption !== undefined) {
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
    };
    Proof.prototype.mp = function (num) {
        if (num === void 0) { num = 1; }
        var imps = this.currentThm.getAllAssumptions("imp");
        if (imps.length > 0) {
            var mp_imp = imps[num - 1];
            if (this.currentThm.lemma.equalTo(mp_imp.op2)) {
                var goal = this.currentThm.clone();
                goal.removeAssumption(mp_imp);
                goal.lemma = mp_imp.op2;
                this._states.push(_.drop(this.currentGoals));
                this.currentGoals.push(goal);
                return true;
            }
        }
        return false;
    };
    Proof.prototype.notE = function (num) {
        if (num === void 0) { num = 1; }
        var assumption = this.currentThm.getAssumption("not", num);
        if (assumption !== undefined) {
            var goal = this.currentThm.clone();
            goal.removeAssumption(assumption);
            goal.lemma = assumption.op;
            this._states.push(_.drop(this.currentGoals));
            this.currentGoals.push(goal);
            return true;
        }
        return false;
    };
    Proof.prototype.conjE = function (num) {
        if (num === void 0) { num = 1; }
        var assumption = this.currentThm.getAssumption("and", num);
        if (assumption !== undefined) {
            var goal = this.currentThm.clone();
            goal.removeAssumption(assumption);
            goal.addAssumption(assumption.op1);
            goal.addAssumption(assumption.op2);
            this._states.push(_.drop(this.currentGoals));
            this.currentGoals.push(goal);
            return true;
        }
        return false;
    };
    Proof.prototype.disjE = function (num) {
        if (num === void 0) { num = 1; }
        var assumption = this.currentThm.getAssumption("or", num);
        if (assumption !== undefined) {
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
    };
    Proof.prototype.toString = function () {
        var i = 1;
        var out_string = "";
        _.forEach(this.currentGoals, function (goal) {
            out_string += i + ". " + String(goal) + "\n";
            i++;
        });
        return out_string;
    };
    return Proof;
}());
module.exports = Proof;
