'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require("lodash");
var Theorem = (function () {
    function Theorem() {
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
            this.assumptionList = [];
            if (assumptions !== undefined)
                for (var i = 0; i < assumptions.length; i++) {
                    var assumption_clone = assumptions[i].clone();
                    this.assumptionDict[assumptions[i].getType()].push(assumption_clone);
                    this.assumptionList.push(assumption_clone);
                }
            ;
        },
        enumerable: true,
        configurable: true
    });
    Theorem.prototype.getAssumption = function (type, num) {
        if (num === void 0) { num = 1; }
        return _.nth(this.assumptionDict[type], num - 1);
    };
    Theorem.prototype.getAllAssumptions = function (type) {
        return this.assumptionDict[type];
    };
    Theorem.prototype.addAssumption = function (assumption) {
        if (assumption !== undefined) {
            this.assumptionList.push(assumption);
            this.assumptionDict[assumption.getType()].push(assumption);
        }
    };
    Theorem.prototype.isAssumption = function (assumption) {
        return _.find(this.assumptionList, function (_assump) {
            return _assump.equalTo(assumption) !== undefined;
        });
    };
    Theorem.prototype.removeAssumption = function (assumption) {
        if (assumption !== undefined) {
            this.assumptionList =
                _.remove(this.assumptionList, function (f) {
                    return assumption.notEqualTo(f);
                });
            this.assumptionDict[assumption.getType()] =
                _.remove(this.assumptionDict[assumption.getType()], function (f) {
                    return assumption.notEqualTo(f);
                });
        }
    };
    Theorem.prototype.clone = function () {
        var new_thm = new Theorem();
        new_thm.lemma = this.lemma;
        var new_assumptions = [];
        this.assumptionList.forEach(function (assumption) {
            new_assumptions.push(assumption);
        });
        new_thm.assumptions = new_assumptions;
        return new_thm;
    };
    Theorem.prototype.toString = function () {
        if (this.lemma !== undefined) {
            if (this.assumptionList !== undefined && this.assumptionList.length > 0)
                return "[ " + this.assumptionList.join(", ") + " ] |- " + String(this.lemma);
            if (this.lemma !== undefined)
                return "|- " + String(this.lemma);
        }
        return "";
    };
    return Theorem;
}());
exports.Theorem = Theorem;
exports.TheoremConstructor = function () {
    return new Theorem();
};
//# sourceMappingURL=theorem.js.map