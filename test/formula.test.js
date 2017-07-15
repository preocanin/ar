'use strinct';

const theorem = require('../models/theorem');
const formula = require('../models/formula');

const Atom = formula.Atom;
const Not = formula.Not;
const And = formula.And;
const Or = formula.Or;
const Imp = formula.Imp;
const Iff = formula.Iff;

describe("Formula", function() {

  describe("Atom", function() {
    describe("toString() method", function() {
      const p = new Atom('P');
      it("Should return correctly parsed string", function() {
        expect(p.toString()).toBe("P");
      });
    });

    describe("equalTo() method", function() {
      const p = new Atom('P');
      const anotherP = new Atom('P');
      const q = new Atom('Q');
      const anotherFormula = new And(p, q);

      it("Should return true if the type of formulas is the same and literal is also the same", function() {
        expect(p.equalTo(anotherP)).toBe(true);
      });

      it("Should return false if the type of formulas is not the same", function() {
        expect(p.equalTo(anotherFormula)).toBe(false);
        expect(q.equalTo(anotherFormula)).toBe(false);
      });

      it("Should return false if the literal of formulas is not the same", function() {
        expect(p.equalTo(q)).toBe(false);
      });
    });

    describe("clone() method", function() {
      const p = new Atom('P');
      const q = p.clone();

      it("Should make a new formula which is equalTo cloned formula but points to a different memory location", function() {
        expect(p.equalTo(q)).toBe(true);
        expect(p === q).toBe(false);
      })
    });
  });

  describe("And", function() {
    describe("toString() method", function() {
      const p = new Atom('P');
      const q = new Atom('Q');
      const pANDq = new And(p, q);
      it("Should return correctly parsed string", function() {
        expect(pANDq.toString()).toBe("( P & Q )");
      });
    });

    describe("equalTo() method", function() {
      const p = new Atom('P');
      const q = new Atom('Q');
      const r = new Atom('R');
      const pANDq = new And(p, q);
      const anotherPandQ = new And(p, q);
      const pANDr = new And(p, r);
      it("Should return true if the type of formulas is the same and literal is also the same", function() {
        expect(pANDq.equalTo(anotherPandQ)).toBe(true);
      });

      it("Should return false if the type of formulas is not the same", function() {
        expect(pANDq.equalTo(p)).toBe(false);
        expect(pANDq.equalTo(q)).toBe(false);
      });

      it("Should return false if the literals of given formulas are not the same", function() {
        expect(pANDq.equalTo(pANDr)).toBe(false);
      });
    });

    describe("clone() method", function() {
      const p = new Atom('P');
      const q = new Atom('Q');
      const pANDq = new And(p, q);
      const pANDqClone = pANDq.clone();

      it("Should make a new formula which is equalTo cloned formula but points to a different memory location", function() {
        expect(pANDq.equalTo(pANDqClone)).toBe(true);
        expect(pANDq === pANDqClone).toBe(false);
      })
    });
  });

  describe("Or", function() {
    describe("toString() method", function() {
      const p = new Atom('P');
      const q = new Atom('Q');
      const pORq = new Or(p, q);
      it("Should return correctly parsed string", function() {
        expect(pORq.toString()).toBe("( P | Q )");
      });
    });

    describe("equalTo() method", function() {
      const p = new Atom('P');
      const q = new Atom('Q');
      const r = new Atom('R');
      const pORq = new Or(p, q);
      const anotherPORQ = new Or(p, q);
      const pORr = new Or(p, r);
      it("Should return true if the type of formulas is the same and literal is also the same", function() {
        expect(pORq.equalTo(anotherPORQ)).toBe(true);
      });

      it("Should return false if the type of formulas is not the same", function() {
        expect(pORq.equalTo(p)).toBe(false);
        expect(pORq.equalTo(q)).toBe(false);
      });

      it("Should return false if the literals of given formulas are not the same", function() {
        expect(pORq.equalTo(pORr)).toBe(false);
      });
    });

    describe("clone() method", function() {
      const p = new Atom('P');
      const q = new Atom('Q');
      const pORq = new Or(p, q);
      const pORqClone = pORq.clone();

      it("Should make a new formula which is equalTo cloned formula but points to a different memory location", function() {
        expect(pORq.equalTo(pORqClone)).toBe(true);
        expect(pORq === pORqClone).toBe(false);
      })
    });
  });

  describe("Imp", function() {
    describe("toString() method", function() {
      const p = new Atom('P');
      const q = new Atom('Q');
      const pIMPq = new Imp(p, q);
      it("Should return correctly parsed string", function() {
        expect(pIMPq.toString()).toBe("( P => Q )");
      });
    });

    describe("equalTo() method", function() {
      const p = new Atom('P');
      const q = new Atom('Q');
      const r = new Atom('R');
      const pIMPq = new Imp(p, q);
      const anotherPIMPQ = new Imp(p, q);
      const pIMPr = new Imp(p, r);
      it("Should return true if the type of formulas is the same and literal is also the same", function() {
        expect(pIMPq.equalTo(anotherPIMPQ)).toBe(true);
      });

      it("Should return false if the type of formulas is not the same", function() {
        expect(pIMPq.equalTo(p)).toBe(false);
        expect(pIMPq.equalTo(q)).toBe(false);
      });

      it("Should return false if the literals of given formulas are not the same", function() {
        expect(pIMPq.equalTo(pIMPr)).toBe(false);
      });
    });

    describe("clone() method", function() {
      const p = new Atom('P');
      const q = new Atom('Q');
      const pIMPq = new Imp(p, q);
      const pIMPqClone = pIMPq.clone();

      it("Should make a new formula which is equalTo cloned formula but points to a different memIMPy location", function() {
        expect(pIMPq.equalTo(pIMPqClone)).toBe(true);
        expect(pIMPq === pIMPqClone).toBe(false);
      })
    });
  });

  describe("IFF", function() {
    describe("toString() method", function() {
      const p = new Atom('P');
      const q = new Atom('Q');
      const pIFFq = new Iff(p, q);
      it("Should return correctly parsed string", function() {
        expect(pIFFq.toString()).toBe("( P <=> Q )");
      });
    });

    describe("equalTo() method", function() {
      const p = new Atom('P');
      const q = new Atom('Q');
      const r = new Atom('R');
      const pIFFq = new Iff(p, q);
      const anotherPIFFQ = new Iff(p, q);
      const pIFFr = new Iff(p, r);
      it("Should return true if the type of formulas is the same and literal is also the same", function() {
        expect(pIFFq.equalTo(anotherPIFFQ)).toBe(true);
      });

      it("Should return false if the type of formulas is not the same", function() {
        expect(pIFFq.equalTo(p)).toBe(false);
        expect(pIFFq.equalTo(q)).toBe(false);
      });

      it("Should return false if the literals of given formulas are not the same", function() {
        expect(pIFFq.equalTo(pIFFr)).toBe(false);
      });
    });

    describe("clone() method", function() {
      const p = new Atom('P');
      const q = new Atom('Q');
      const pIFFq = new Iff(p, q);
      const pIFFqClone = pIFFq.clone();

      it("Should make a new formula which is equalTo cloned formula but points to a different memory location", function() {
        expect(pIFFq.equalTo(pIFFqClone)).toBe(true);
        expect(pIFFq === pIFFqClone).toBe(false);
      })
    });
  });
});
