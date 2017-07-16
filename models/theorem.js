'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require("lodash");
var Theorem = (function () {
    function Theorem() {
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
    Object.defineProperty(Theorem.prototype, "lemma", {
        get: function () { return this._lemma; },
        set: function (lemma) {
            if (lemma !== undefined)
                this._lemma = lemma.clone();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Theorem.prototype, "assumptions", {
        set: function (assumptions) {
            this._assumption_list = [];
            if (assumptions !== undefined)
                for (var i = 0; i < assumptions.length; i++) {
                    var assumption_clone = assumptions[i].clone();
                    this._assumption_dict[assumptions[i].getType()].push(assumption_clone);
                    this._assumption_list.push(assumption_clone);
                }
            ;
        },
        enumerable: true,
        configurable: true
    });
    Theorem.prototype.getAssumption = function (type, num) {
        if (num === void 0) { num = 1; }
        return _.nth(this._assumption_dict[type], num - 1);
    };
    Theorem.prototype.getAllAssumptions = function (type) {
        return this._assumption_dict[type];
    };
    Theorem.prototype.addAssumption = function (assumption) {
        if (assumption !== undefined) {
            this._assumption_list.push(assumption);
            this._assumption_dict[assumption.getType()].push(assumption);
        }
    };
    Theorem.prototype.isAssumption = function (assumption) {
        return _.find(this._assumption_list, function (_assump) {
            return _assump.equalTo(assumption) !== undefined;
        });
    };
    Theorem.prototype.removeAssumption = function (assumption) {
        if (assumption !== undefined) {
            this._assumption_list =
                _.remove(this._assumption_list, function (f) {
                    return assumption.notEqualTo(f);
                });
            this._assumption_dict[assumption.getType()] =
                _.remove(this._assumption_dict[assumption.getType()], function (f) {
                    return assumption.notEqualTo(f);
                });
        }
    };
    Theorem.prototype.clone = function () {
        var new_thm = new Theorem();
        new_thm.lemma = this.lemma;
        var new_assumptions = [];
        this._assumption_list.forEach(function (assumption) {
            new_assumptions.push(assumption);
        });
        new_thm.assumptions = new_assumptions;
        return new_thm;
    };
    Theorem.prototype.toString = function () {
        if (this.lemma !== undefined) {
            if (this._assumption_list !== undefined && this._assumption_list.length > 0)
                return "[ " + this._assumption_list.join(", ") + " ] |- " + String(this.lemma);
            if (this.lemma !== undefined)
                return "|- " + String(this.lemma);
        }
        return "";
    };
    return Theorem;
}());
exports.Theorem = Theorem;
module.exports = function () { return new Theorem(); };
//# sourceMappingURL=theorem.js.map