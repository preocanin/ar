'use strict';
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Type = (function () {
    function Type() {
    }
    Type.Atom = "atom";
    Type.Not = "not";
    Type.Constant = "constant";
    Type.Iff = "iff";
    Type.Imp = "imp";
    Type.And = "and";
    Type.Or = "or";
    return Type;
}());
exports.Type = Type;
var BaseFormula = (function () {
    function BaseFormula(type) {
        this.type = type;
    }
    BaseFormula.prototype.getType = function () { return this.type; };
    return BaseFormula;
}());
var Atom = (function (_super) {
    __extends(Atom, _super);
    function Atom(lit) {
        var _this = _super.call(this, Type.Atom) || this;
        _this.lit = lit;
        _this.lit = lit;
        return _this;
    }
    Atom.prototype.clone = function () {
        return new Atom(this.lit);
    };
    Atom.prototype.toString = function () {
        return "" + this.lit;
    };
    Atom.prototype.equalTo = function (f) {
        return f.type === this.type &&
            f.lit === this.lit;
    };
    Atom.prototype.notEqualTo = function (f) {
        return !this.equalTo(f);
    };
    return Atom;
}(BaseFormula));
exports.Atom = Atom;
var Constant = (function (_super) {
    __extends(Constant, _super);
    function Constant(val) {
        var _this = _super.call(this, Type.Constant) || this;
        _this.val = val;
        _this.val = val;
        return _this;
    }
    Constant.prototype.clone = function () {
        return new Constant(this.val);
    };
    Constant.prototype.toString = function () {
        return "" + this.val;
    };
    Constant.prototype.equalTo = function (f) {
        return f.type === this.type &&
            f.val === this.val;
    };
    Constant.prototype.notEqualTo = function (f) {
        return !this.equalTo(f);
    };
    return Constant;
}(BaseFormula));
exports.Constant = Constant;
var Not = (function (_super) {
    __extends(Not, _super);
    function Not(op) {
        var _this = _super.call(this, Type.Not) || this;
        _this.op = op;
        _this.op = op;
        return _this;
    }
    Not.prototype.clone = function () {
        return new Not(this.op.clone());
    };
    Not.prototype.toString = function () {
        if (this.op.getType() === Type.Atom)
            return "~" + String(this.op);
        return "(~ " + String(this.op) + " )";
    };
    Not.prototype.equalTo = function (f) {
        return f.getType() === this.type &&
            this.op.equalTo(f.op);
    };
    Not.prototype.notEqualTo = function (f) {
        return !this.equalTo(f);
    };
    return Not;
}(BaseFormula));
exports.Not = Not;
var BinaryConnective = (function (_super) {
    __extends(BinaryConnective, _super);
    function BinaryConnective(type, op1, op2) {
        var _this = _super.call(this, type) || this;
        _this.op1 = op1;
        _this.op2 = op2;
        _this.op1 = op1;
        _this.op2 = op2;
        return _this;
    }
    BinaryConnective.prototype.equalTo = function (f) {
        return (f).getType() === this.getType() &&
            this.op1.equalTo(f.op1) &&
            this.op2.equalTo(f.op2);
    };
    BinaryConnective.prototype.notEqualTo = function (f) {
        return !this.equalTo(f);
    };
    return BinaryConnective;
}(BaseFormula));
exports.BinaryConnective = BinaryConnective;
var And = (function (_super) {
    __extends(And, _super);
    function And(op1, op2) {
        var _this = _super.call(this, Type.And, op1, op2) || this;
        _this.op1 = op1;
        _this.op2 = op2;
        return _this;
    }
    And.prototype.clone = function () {
        return new And(this.op1.clone(), this.op2.clone());
    };
    And.prototype.toString = function () {
        return "( " + String(this.op1) + " & " + String(this.op2) + " )";
    };
    return And;
}(BinaryConnective));
exports.And = And;
var Or = (function (_super) {
    __extends(Or, _super);
    function Or(op1, op2) {
        var _this = _super.call(this, Type.Or, op1, op2) || this;
        _this.op1 = op1;
        _this.op2 = op2;
        return _this;
    }
    Or.prototype.clone = function () {
        return new Or(this.op1.clone(), this.op2.clone());
    };
    Or.prototype.toString = function () {
        return "( " + String(this.op1) + " | " + String(this.op2) + " )";
    };
    return Or;
}(BinaryConnective));
exports.Or = Or;
var Imp = (function (_super) {
    __extends(Imp, _super);
    function Imp(op1, op2) {
        var _this = _super.call(this, Type.Imp, op1, op2) || this;
        _this.op1 = op1;
        _this.op2 = op2;
        return _this;
    }
    Imp.prototype.clone = function () {
        return new Imp(this.op1.clone(), this.op2.clone());
    };
    Imp.prototype.toString = function () {
        return "( " + String(this.op1) + " => " + String(this.op2) + " )";
    };
    return Imp;
}(BinaryConnective));
exports.Imp = Imp;
var Iff = (function (_super) {
    __extends(Iff, _super);
    function Iff(op1, op2) {
        return _super.call(this, Type.Iff, op1, op2) || this;
    }
    Iff.prototype.clone = function () {
        return new Iff(this.op1.clone(), this.op2.clone());
    };
    Iff.prototype.toString = function () {
        return "( " + String(this.op1) + " <=> " + String(this.op2) + " )";
    };
    return Iff;
}(BinaryConnective));
exports.Iff = Iff;
//# sourceMappingURL=formula.js.map