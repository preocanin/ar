'use strict'

export interface IFormula {
    clone: () => IFormula,
    toString: () => string,
    equalTo: (f: IFormula) => boolean,
    notEqualTo: (f: IFormula) => boolean,
    getType: () => Type
}

export enum Type {
    Atom,
    Not,
    Constant,
    Iff,
    Imp,
    And,
    Or
}

class BaseFormula {
    protected type: Type;
    constructor(type){
        this.type = type;
    }

    getType() { return this.type}
}

export class Atom extends BaseFormula implements IFormula {
    constructor(public lit: string) {
        super(Type.Atom);
        this.lit = lit;
    }

    clone() {
        return new Atom(this.lit);
    }

    toString(): string {
        return `${this.lit}`;
    }

    equalTo(f: Atom) {
        return f.type == this.type &&
               f.lit == this.lit;
    }
    
    notEqualTo(f: Atom) {
        return !this.equalTo(f);
    }

}

export class Constant extends BaseFormula implements IFormula{
    constructor(public val: boolean) {
        super(Type.Constant);
        this.val = val;
    }

    clone() {
        return new Constant(this.val);
    }

    toString() {
        return `${this.val}`;
    }

    equalTo(f: Constant) {
        return f.type == this.type &&
               f.val == this.val;
    }
    
    notEqualTo(f: Constant) {
        return !this.equalTo(f);
    }
}

export class Not extends BaseFormula implements IFormula{
    constructor(public op: IFormula) {
        super(Type.Not);
        this.op = op;
    }

    clone() {
        return new Not(this.op.clone());
    }

    toString() {
        if(this.op.getType() == Type.Atom)
            return "~" + String(this.op);
        return "(~ " + String(this.op) + " )";
    }

    equalTo(f: IFormula) {
        return (<Not>f).type == this.type &&
               this.op.equalTo((<Not>f).op);
    }
    
    notEqualTo(f: IFormula) {
        return !this.equalTo(f);
    }
}

export class BinaryConnective extends BaseFormula {
    constructor(type: Type, protected op1: IFormula, protected op2: IFormula) {
        super(type);
        this.op1 = op1;
        this.op2 = op2;
    }

    equalTo(f) {
        return f.type == this.getType() &&
               this.op1.equalTo(f.op1)  &&
               this.op2.equalTo(f.op2);
    }
    
    notEqualTo(f) {
        return !this.equalTo(f);
    }
}

export class And extends BinaryConnective implements IFormula {
    constructor(op1: IFormula, op2: IFormula) {
        super(Type.And, op1, op2);
    }

    clone() {
        return new And(this.op1.clone(),this.op2.clone());
    }

    toString() {
        return "( " + String(this.op1) + " & " + String(this.op2) + " )";
    }
}

export class Or extends BinaryConnective implements IFormula{
    constructor(op1: IFormula, op2: IFormula) {
        super(Type.Or, op1, op2);
    }

    clone() {
        return new Or(this.op1.clone(),this.op2.clone());
    }

    toString() {
        return "( " + String(this.op1) + " | " + String(this.op2) + " )";
    }
}

export class Imp extends BinaryConnective {
    constructor(op1: IFormula, op2: IFormula) {
        super(Type.Imp, op1, op2);
    }

    clone() {
        return new Imp(this.op1.clone(),this.op2.clone());
    }

    toString() {
        return "( " + String(this.op1) + " => " + String(this.op2) + " )";
    }
}

export class Iff extends BinaryConnective {
    constructor(op1: IFormula, op2: IFormula) {
        super(Type.Iff, op1, op2);
    }

    clone() {
        return new Iff(this.op1.clone(),this.op2.clone());
    }

    toString() {
        return "( " + String(this.op1) + " <=> " + String(this.op2) + " )";
    }
}
