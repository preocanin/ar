'use strinct';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var formula_1 = require("../models/formula");
describe("Formula", function () {
    describe("Atom", function () {
        describe("toString() method", function () {
            var p = new formula_1.Atom('P');
            it("Should return correctly parsed string", function () {
                expect(p.toString()).toBe("P");
            });
        });
        describe("equalTo() method", function () {
            var p = new formula_1.Atom('P');
            var anotherP = new formula_1.Atom('P');
            var q = new formula_1.Atom('Q');
            var anotherFormula = new formula_1.And(p, q);
            it("Should return true if the type of formulas is the same and literal is also the same", function () {
                expect(p.equalTo(anotherP)).toBe(true);
            });
            it("Should return false if the type of formulas is not the same", function () {
                expect(p.equalTo(anotherFormula)).toBe(false);
                expect(q.equalTo(anotherFormula)).toBe(false);
            });
            it("Should return false if the literal of formulas is not the same", function () {
                expect(p.equalTo(q)).toBe(false);
            });
        });
        describe("clone() method", function () {
            var p = new formula_1.Atom('P');
            var q = p.clone();
            it("Should make a new formula which is equalTo cloned formula but points to a different memory location", function () {
                expect(p.equalTo(q)).toBe(true);
                expect(p === q).toBe(false);
            });
        });
    });
    describe("Not", function () {
        describe("toString() method", function () {
            var p = new formula_1.Atom('P');
            var q = new formula_1.Atom('Q');
            var notPandQ = new formula_1.Not(new formula_1.And(p, q));
            var notP = new formula_1.Not(p);
            it("Should return correctly parsed string", function () {
                expect(notP.toString()).toBe("~P");
                expect(notPandQ.toString()).toBe("(~ ( P & Q ) )");
            });
        });
        describe("equalTo() method", function () {
            var p = new formula_1.Atom('P');
            var notP = new formula_1.Not(p);
            var anotherNotP = new formula_1.Not(new formula_1.Atom('P'));
            var q = new formula_1.Atom('Q');
            var notQ = new formula_1.Not(q);
            var anotherFormula = new formula_1.Not(new formula_1.And(p, q));
            it("Should return true if the type of formulas is the same and literal is also the same", function () {
                expect(notP.equalTo(anotherNotP)).toBe(true);
            });
            it("Should return false if the type of formulas is not the same", function () {
                expect(notP.equalTo(anotherFormula)).toBe(false);
                expect(notQ.equalTo(anotherFormula)).toBe(false);
            });
            it("Should return false if the literal of formulas is not the same", function () {
                expect(notP.equalTo(notQ)).toBe(false);
            });
        });
        describe("clone() method", function () {
            var notP = new formula_1.Not(new formula_1.Atom('P'));
            var notQ = notP.clone();
            it("Should make a new formula which is equalTo cloned formula but points to a different memory location", function () {
                expect(notP.equalTo(notQ)).toBe(true);
                expect(notP === notQ).toBe(false);
            });
        });
    });
    describe("Constant", function () {
        describe("toString() method", function () {
            var T = new formula_1.Constant(true);
            var N = new formula_1.Constant(false);
            it("Should return correctly parsed string", function () {
                expect(T.toString()).toBe("true");
                expect(N.toString()).toBe("false");
            });
        });
        describe("equalTo() method", function () {
            var T = new formula_1.Constant(true);
            var p = new formula_1.Atom('P');
            var alsoT = new formula_1.Constant(true);
            var N = new formula_1.Constant(false);
            it("Should return true if the type of formulas is the same and literal is also the same", function () {
                expect(T.equalTo(alsoT)).toBe(true);
            });
            it("Should return false if the type of formulas is not the same", function () {
                expect(T.equalTo(p)).toBe(false);
                expect(N.equalTo(p)).toBe(false);
            });
            it("Should return false if the value of constants is not the same", function () {
                expect(N.equalTo(T)).toBe(false);
            });
        });
        describe("clone() method", function () {
            var T = new formula_1.Constant(true);
            var clonedT = T.clone();
            it("Should make a new formula which is equalTo cloned formula but points to a different memory location", function () {
                expect(T.equalTo(clonedT)).toBe(true);
                expect(T === clonedT).toBe(false);
            });
        });
    });
    describe("And", function () {
        describe("toString() method", function () {
            var p = new formula_1.Atom('P');
            var q = new formula_1.Atom('Q');
            var pANDq = new formula_1.And(p, q);
            it("Should return correctly parsed string", function () {
                expect(pANDq.toString()).toBe("( P & Q )");
            });
        });
        describe("equalTo() method", function () {
            var p = new formula_1.Atom('P');
            var q = new formula_1.Atom('Q');
            var r = new formula_1.Atom('R');
            var pANDq = new formula_1.And(p, q);
            var anotherPandQ = new formula_1.And(p, q);
            var pANDr = new formula_1.And(p, r);
            it("Should return true if the type of formulas is the same and literal is also the same", function () {
                expect(pANDq.equalTo(anotherPandQ)).toBe(true);
            });
            it("Should return false if the type of formulas is not the same", function () {
                expect(pANDq.equalTo(p)).toBe(false);
                expect(pANDq.equalTo(q)).toBe(false);
            });
            it("Should return false if the literals of given formulas are not the same", function () {
                expect(pANDq.equalTo(pANDr)).toBe(false);
            });
        });
        describe("clone() method", function () {
            var p = new formula_1.Atom('P');
            var q = new formula_1.Atom('Q');
            var pANDq = new formula_1.And(p, q);
            var pANDqClone = pANDq.clone();
            it("Should make a new formula which is equalTo cloned formula but points to a different memory location", function () {
                expect(pANDq.equalTo(pANDqClone)).toBe(true);
                expect(pANDq === pANDqClone).toBe(false);
            });
        });
    });
    describe("Or", function () {
        describe("toString() method", function () {
            var p = new formula_1.Atom('P');
            var q = new formula_1.Atom('Q');
            var pORq = new formula_1.Or(p, q);
            it("Should return correctly parsed string", function () {
                expect(pORq.toString()).toBe("( P | Q )");
            });
        });
        describe("equalTo() method", function () {
            var p = new formula_1.Atom('P');
            var q = new formula_1.Atom('Q');
            var r = new formula_1.Atom('R');
            var pORq = new formula_1.Or(p, q);
            var anotherPORQ = new formula_1.Or(p, q);
            var pORr = new formula_1.Or(p, r);
            it("Should return true if the type of formulas is the same and literal is also the same", function () {
                expect(pORq.equalTo(anotherPORQ)).toBe(true);
            });
            it("Should return false if the type of formulas is not the same", function () {
                expect(pORq.equalTo(p)).toBe(false);
                expect(pORq.equalTo(q)).toBe(false);
            });
            it("Should return false if the literals of given formulas are not the same", function () {
                expect(pORq.equalTo(pORr)).toBe(false);
            });
        });
        describe("clone() method", function () {
            var p = new formula_1.Atom('P');
            var q = new formula_1.Atom('Q');
            var pORq = new formula_1.Or(p, q);
            var pORqClone = pORq.clone();
            it("Should make a new formula which is equalTo cloned formula but points to a different memory location", function () {
                expect(pORq.equalTo(pORqClone)).toBe(true);
                expect(pORq === pORqClone).toBe(false);
            });
        });
    });
    describe("Imp", function () {
        describe("toString() method", function () {
            var p = new formula_1.Atom('P');
            var q = new formula_1.Atom('Q');
            var pIMPq = new formula_1.Imp(p, q);
            it("Should return correctly parsed string", function () {
                expect(pIMPq.toString()).toBe("( P => Q )");
            });
        });
        describe("equalTo() method", function () {
            var p = new formula_1.Atom('P');
            var q = new formula_1.Atom('Q');
            var r = new formula_1.Atom('R');
            var pIMPq = new formula_1.Imp(p, q);
            var anotherPIMPQ = new formula_1.Imp(p, q);
            var pIMPr = new formula_1.Imp(p, r);
            it("Should return true if the type of formulas is the same and literal is also the same", function () {
                expect(pIMPq.equalTo(anotherPIMPQ)).toBe(true);
            });
            it("Should return false if the type of formulas is not the same", function () {
                expect(pIMPq.equalTo(p)).toBe(false);
                expect(pIMPq.equalTo(q)).toBe(false);
            });
            it("Should return false if the literals of given formulas are not the same", function () {
                expect(pIMPq.equalTo(pIMPr)).toBe(false);
            });
        });
        describe("clone() method", function () {
            var p = new formula_1.Atom('P');
            var q = new formula_1.Atom('Q');
            var pIMPq = new formula_1.Imp(p, q);
            var pIMPqClone = pIMPq.clone();
            it("Should make a new formula which is equalTo cloned formula but points to a different memIMPy location", function () {
                expect(pIMPq.equalTo(pIMPqClone)).toBe(true);
                expect(pIMPq === pIMPqClone).toBe(false);
            });
        });
    });
    describe("IFF", function () {
        describe("toString() method", function () {
            var p = new formula_1.Atom('P');
            var q = new formula_1.Atom('Q');
            var pIFFq = new formula_1.Iff(p, q);
            it("Should return correctly parsed string", function () {
                expect(pIFFq.toString()).toBe("( P <=> Q )");
            });
        });
        describe("equalTo() method", function () {
            var p = new formula_1.Atom('P');
            var q = new formula_1.Atom('Q');
            var r = new formula_1.Atom('R');
            var pIFFq = new formula_1.Iff(p, q);
            var anotherPIFFQ = new formula_1.Iff(p, q);
            var pIFFr = new formula_1.Iff(p, r);
            it("Should return true if the type of formulas is the same and literal is also the same", function () {
                expect(pIFFq.equalTo(anotherPIFFQ)).toBe(true);
            });
            it("Should return false if the type of formulas is not the same", function () {
                expect(pIFFq.equalTo(p)).toBe(false);
                expect(pIFFq.equalTo(q)).toBe(false);
            });
            it("Should return false if the literals of given formulas are not the same", function () {
                expect(pIFFq.equalTo(pIFFr)).toBe(false);
            });
        });
        describe("clone() method", function () {
            var p = new formula_1.Atom('P');
            var q = new formula_1.Atom('Q');
            var pIFFq = new formula_1.Iff(p, q);
            var pIFFqClone = pIFFq.clone();
            it("Should make a new formula which is equalTo cloned formula but points to a different memory location", function () {
                expect(pIFFq.equalTo(pIFFqClone)).toBe(true);
                expect(pIFFq === pIFFqClone).toBe(false);
            });
        });
    });
});
//# sourceMappingURL=formula.test.js.map