const theorem = require('../models/theorem');
const formula = require('../models/formula');

describe("Formula ", function() {
  var a;

  it("And ", function() {
    a = true;
    const p = new formula.Atom('P');
    const q = new formula.Atom('Q');
    f = new formula.And(p, q);
    it("toString() should return correctly parsed string", function() {
      expect(f.toString()).toBe("( P & Q )");
    });
  });
});
