const theorem = require('../models/theorem');
const formula = require('../models/formula');

describe("Formula", function() {

  describe("Atom", function() {
    describe("toString() method", function() {
      const p = new formula.Atom('P');
      it("Should return correctly parsed string", function() {
        expect(p.toString()).toBe("P");
      });
    });

    describe("equalTo() method", function() {
      const p = new formula.Atom('P');
      const anotherP = new formula.Atom('P');
      const q = new formula.Atom('Q');
      const anotherFormula = new formula.And(p, q);

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
      const p = new formula.Atom('P');
      const q = p.clone();

      it("Should make a new formula which is equalTo cloned formula but points to a different memory location", function() {
        expect(p.equalTo(q)).toBe(true);
        expect(p === q).toBe(false);
      })
    });
  });

  // And tests
  describe("And", function() {
    describe("toString() method", function() {
      const p = new formula.Atom('P');
      const q = new formula.Atom('Q');
      const pANDq = new formula.And(p, q);
      it("Should return correctly parsed string", function() {
        expect(pANDq.toString()).toBe("( P & Q )");
      });
    });

    describe("equalTo() method", function() {
      const p = new formula.Atom('P');
      const q = new formula.Atom('Q');
      const r = new formula.Atom('R');
      const pANDq = new formula.And(p, q);
      const anotherPandQ = new formula.And(p, q);
      const pANDr = new formula.And(p, r);
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
      const p = new formula.Atom('P');
      const q = new formula.Atom('Q');
      const pANDq = new formula.And(p, q);
      const pANDqClone = pANDq.clone();

      it("Should make a new formula which is equalTo cloned formula but points to a different memory location", function() {
        expect(pANDq.equalTo(pANDqClone)).toBe(true);
        expect(pANDq === pANDqClone).toBe(false);
      })
    });
  });

  describe("Or", function() {
    describe("toString() method", function() {
      const p = new formula.Atom('P');
      const q = new formula.Atom('Q');
      const pORq = new formula.Or(p, q);
      it("Should return correctly parsed string", function() {
        expect(pORq.toString()).toBe("( P | Q )");
      });
    });

    describe("equalTo() method", function() {
      const p = new formula.Atom('P');
      const q = new formula.Atom('Q');
      const r = new formula.Atom('R');
      const pORq = new formula.Or(p, q);
      const anotherPORQ = new formula.Or(p, q);
      const pORr = new formula.Or(p, r);
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
      const p = new formula.Atom('P');
      const q = new formula.Atom('Q');
      const pORq = new formula.Or(p, q);
      const pORqClone = pORq.clone();

      it("Should make a new formula which is equalTo cloned formula but points to a different memory location", function() {
        expect(pORq.equalTo(pORqClone)).toBe(true);
        expect(pORq === pORqClone).toBe(false);
      })
    });
  });
});
