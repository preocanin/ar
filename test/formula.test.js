'use strinct';

const theorem = require('../models/theorem');
const formula = require('../models/formula');

const Atom = formula.Atom;
const Not = formula.Not;
const And = formula.And;
const Or = formula.Or;
const Imp = formula.Imp;
const Iff = formula.Iff;
const Constant= formula.Constant;

describe("Formula", () => {

  describe("Atom", () => {
    describe("toString() method", () => {
      const p = new Atom('P');
      it("Should return correctly parsed string", () => {
        expect(p.toString()).toBe("P");
      });
    });

    describe("equalTo() method", () => {
      const p = new Atom('P');
      const anotherP = new Atom('P');
      const q = new Atom('Q');
      const anotherFormula = new And(p, q);

      it("Should return true if the type of formulas is the same and literal is also the same", () => {
        expect(p.equalTo(anotherP)).toBe(true);
      });

      it("Should return false if the type of formulas is not the same", () => {
        expect(p.equalTo(anotherFormula)).toBe(false);
        expect(q.equalTo(anotherFormula)).toBe(false);
      });

      it("Should return false if the literal of formulas is not the same", () => {
        expect(p.equalTo(q)).toBe(false);
      });
    });

    describe("clone() method", () => {
      const p = new Atom('P');
      const q = p.clone();

      it("Should make a new formula which is equalTo cloned formula but points to a different memory location", () => {
        expect(p.equalTo(q)).toBe(true);
        expect(p === q).toBe(false);
      })
    });
  });


  describe("Not", () => {
    describe("toString() method", () => {
      const p = new Atom('P');
      const q = new Atom('Q');

      const notPandQ = new Not(new And(p, q));
      const notP = new Not(p);
      it("Should return correctly parsed string", () => {
        expect(notP.toString()).toBe("~P");
        expect(notPandQ.toString()).toBe("(~ ( P & Q ) )");
      });
    });

    describe("equalTo() method", () => {
      const p = new Atom('P');
      const notP = new Not(p);
      const anotherNotP = new Not(new Atom('P'));
      const q = new Atom('Q');
      const notQ = new Not(q);
      const anotherFormula = new Not(new And(p, q));

      it("Should return true if the type of formulas is the same and literal is also the same", () => {
        expect(notP.equalTo(anotherNotP)).toBe(true);
      });

      it("Should return false if the type of formulas is not the same", () => {
        expect(notP.equalTo(anotherFormula)).toBe(false);
        expect(notQ.equalTo(anotherFormula)).toBe(false);
      });

      it("Should return false if the literal of formulas is not the same", () => {
        expect(notP.equalTo(notQ)).toBe(false);
      });
    });

    describe("clone() method", () => {
      const notP = new Not(new Atom('P'));
      const notQ = notP.clone();

      it("Should make a new formula which is equalTo cloned formula but points to a different memory location", () => {
        expect(notP.equalTo(notQ)).toBe(true);
        expect(notP === notQ).toBe(false);
      })
    });
  });

  describe("Constant", () => {
    describe("toString() method", () => {
      const T = new Constant(true);
      const N = new Constant(false);

      it("Should return correctly parsed string", () => {
        expect(T.toString()).toBe("true");
        expect(N.toString()).toBe("false");
      });
    });

    describe("equalTo() method", () => {
      const T = new Constant(true);
      const p = new Atom('P');
      const alsoT = new Constant(true);
      const N = new Constant(false);

      it("Should return true if the type of formulas is the same and literal is also the same", () => {
        expect(T.equalTo(alsoT)).toBe(true);
      });

      it("Should return false if the type of formulas is not the same", () => {
        expect(T.equalTo(p)).toBe(false);
        expect(N.equalTo(p)).toBe(false);
      });

      it("Should return false if the value of constants is not the same", () => {
        expect(N.equalTo(T)).toBe(false);
      });
    });

    describe("clone() method", () => {
      const T = new Constant(true);
      const clonedT = T.clone();

      it("Should make a new formula which is equalTo cloned formula but points to a different memory location", () => {
        expect(T.equalTo(clonedT)).toBe(true);
        expect(T === clonedT).toBe(false);
      })
    });
  });

  describe("And", () => {
    describe("toString() method", () => {
      const p = new Atom('P');
      const q = new Atom('Q');
      const pANDq = new And(p, q);
      it("Should return correctly parsed string", () => {
        expect(pANDq.toString()).toBe("( P & Q )");
      });
    });

    describe("equalTo() method", () => {
      const p = new Atom('P');
      const q = new Atom('Q');
      const r = new Atom('R');
      const pANDq = new And(p, q);
      const anotherPandQ = new And(p, q);
      const pANDr = new And(p, r);
      it("Should return true if the type of formulas is the same and literal is also the same", () => {
        expect(pANDq.equalTo(anotherPandQ)).toBe(true);
      });

      it("Should return false if the type of formulas is not the same", () => {
        expect(pANDq.equalTo(p)).toBe(false);
        expect(pANDq.equalTo(q)).toBe(false);
      });

      it("Should return false if the literals of given formulas are not the same", () => {
        expect(pANDq.equalTo(pANDr)).toBe(false);
      });
    });

    describe("clone() method", () => {
      const p = new Atom('P');
      const q = new Atom('Q');
      const pANDq = new And(p, q);
      const pANDqClone = pANDq.clone();

      it("Should make a new formula which is equalTo cloned formula but points to a different memory location", () => {
        expect(pANDq.equalTo(pANDqClone)).toBe(true);
        expect(pANDq === pANDqClone).toBe(false);
      })
    });
  });

  describe("Or", () => {
    describe("toString() method", () => {
      const p = new Atom('P');
      const q = new Atom('Q');
      const pORq = new Or(p, q);
      it("Should return correctly parsed string", () => {
        expect(pORq.toString()).toBe("( P | Q )");
      });
    });

    describe("equalTo() method", () => {
      const p = new Atom('P');
      const q = new Atom('Q');
      const r = new Atom('R');
      const pORq = new Or(p, q);
      const anotherPORQ = new Or(p, q);
      const pORr = new Or(p, r);
      it("Should return true if the type of formulas is the same and literal is also the same", () => {
        expect(pORq.equalTo(anotherPORQ)).toBe(true);
      });

      it("Should return false if the type of formulas is not the same", () => {
        expect(pORq.equalTo(p)).toBe(false);
        expect(pORq.equalTo(q)).toBe(false);
      });

      it("Should return false if the literals of given formulas are not the same", () => {
        expect(pORq.equalTo(pORr)).toBe(false);
      });
    });

    describe("clone() method", () => {
      const p = new Atom('P');
      const q = new Atom('Q');
      const pORq = new Or(p, q);
      const pORqClone = pORq.clone();

      it("Should make a new formula which is equalTo cloned formula but points to a different memory location", () => {
        expect(pORq.equalTo(pORqClone)).toBe(true);
        expect(pORq === pORqClone).toBe(false);
      })
    });
  });

  describe("Imp", () => {
    describe("toString() method", () => {
      const p = new Atom('P');
      const q = new Atom('Q');
      const pIMPq = new Imp(p, q);
      it("Should return correctly parsed string", () => {
        expect(pIMPq.toString()).toBe("( P => Q )");
      });
    });

    describe("equalTo() method", () => {
      const p = new Atom('P');
      const q = new Atom('Q');
      const r = new Atom('R');
      const pIMPq = new Imp(p, q);
      const anotherPIMPQ = new Imp(p, q);
      const pIMPr = new Imp(p, r);
      it("Should return true if the type of formulas is the same and literal is also the same", () => {
        expect(pIMPq.equalTo(anotherPIMPQ)).toBe(true);
      });

      it("Should return false if the type of formulas is not the same", () => {
        expect(pIMPq.equalTo(p)).toBe(false);
        expect(pIMPq.equalTo(q)).toBe(false);
      });

      it("Should return false if the literals of given formulas are not the same", () => {
        expect(pIMPq.equalTo(pIMPr)).toBe(false);
      });
    });

    describe("clone() method", () => {
      const p = new Atom('P');
      const q = new Atom('Q');
      const pIMPq = new Imp(p, q);
      const pIMPqClone = pIMPq.clone();

      it("Should make a new formula which is equalTo cloned formula but points to a different memIMPy location", () => {
        expect(pIMPq.equalTo(pIMPqClone)).toBe(true);
        expect(pIMPq === pIMPqClone).toBe(false);
      })
    });
  });

  describe("IFF", () => {
    describe("toString() method", () => {
      const p = new Atom('P');
      const q = new Atom('Q');
      const pIFFq = new Iff(p, q);
      it("Should return correctly parsed string", () => {
        expect(pIFFq.toString()).toBe("( P <=> Q )");
      });
    });

    describe("equalTo() method", () => {
      const p = new Atom('P');
      const q = new Atom('Q');
      const r = new Atom('R');
      const pIFFq = new Iff(p, q);
      const anotherPIFFQ = new Iff(p, q);
      const pIFFr = new Iff(p, r);
      it("Should return true if the type of formulas is the same and literal is also the same", () => {
        expect(pIFFq.equalTo(anotherPIFFQ)).toBe(true);
      });

      it("Should return false if the type of formulas is not the same", () => {
        expect(pIFFq.equalTo(p)).toBe(false);
        expect(pIFFq.equalTo(q)).toBe(false);
      });

      it("Should return false if the literals of given formulas are not the same", () => {
        expect(pIFFq.equalTo(pIFFr)).toBe(false);
      });
    });

    describe("clone() method", () => {
      const p = new Atom('P');
      const q = new Atom('Q');
      const pIFFq = new Iff(p, q);
      const pIFFqClone = pIFFq.clone();

      it("Should make a new formula which is equalTo cloned formula but points to a different memory location", () => {
        expect(pIFFq.equalTo(pIFFqClone)).toBe(true);
        expect(pIFFq === pIFFqClone).toBe(false);
      })
    });
  });
});
