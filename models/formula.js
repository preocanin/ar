'use strict'

class Formula {
    constructor(type) {
        this.type = type;
    }
}

module.exports.Atom = class Atom extends Formula {
    constructor(lit) {
        super("atom");
        this.lit = lit;
    }

    clone() {
        return new this.constructor(this.lit);
    }

    toString() {
        return `${this.lit}`;
    }

    equalTo(f) {
        return f.type == this.type &&
               f.lit == this.lit;
    }
}

module.exports.Constant = class Constant extends Formula {
    constructor(val) {
        super("const");
        this.val = val;
    }

    clone() {
        return new this.constructor(this.val);
    }

    toString() {
        return `${this.val}`;
    }

    equalTo(f) {
        return f.type == this.type &&
               f.val == this.val;
    }
}

module.exports.Not = class Not extends Formula {
    constructor(op) {
        super("not");
        this.op = op;
    }

    clone() {
        return new this.constructor(this.op.clone());
    }

    toString() {
        if(this.op.type == "atom")
            return "~" + String(this.op);
        return "(~ " + String(this.op) + " )";
    }

    equalTo(f) {
        return f.type == this.type &&
               this.op.equalTo(f.op);
    }
}

class BinaryConnective extends Formula {
    constructor(type,op1,op2) {
        super(type);
        this.op1 = op1;
        this.op2 = op2;
    }

    equalTo(f) {
        return f.type == this.type &&
               this.op1.equalTo(f.op1)  &&
               this.op2.equalTo(f.op2);
    }
}

module.exports.And = class And extends BinaryConnective {
    constructor(op1,op2) {
        super("and",op1,op2);
    }

    clone() {
        return new this.constructor(this.op1.clone(),this.op2.clone());
    }

    toString() {
        return "( " + String(this.op1) + " & " + String(this.op2) + " )";
    }
}

module.exports.Or = class Or extends BinaryConnective {
    constructor(op1,op2) {
        super("or",op1,op2);
    }

    clone() {
        return new this.constructor(this.op1.clone(),this.op2.clone());
    }

    toString() {
        return "( " + String(this.op1) + " | " + String(this.op2) + " )";
    }
}

module.exports.Imp = class Imp extends BinaryConnective {
    constructor(op1,op2) {
        super("imp",op1,op2);
    }

    clone() {
        return new this.constructor(this.op1.clone(),this.op2.clone());
    }

    toString() {
        return "( " + String(this.op1) + " => " + String(this.op2) + " )";
    }
}

module.exports.Iff = class Iff extends BinaryConnective {
    constructor(op1,op2) {
        super("iff",op1,op2);
    }

    clone() {
        return new this.constructor(this.op1.clone(),this.op2.clone());
    }

    toString() {
        return "( " + String(this.op1) + " <=> " + String(this.op2) + " )";
    }
}

