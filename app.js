'use strict'

const readline = require('readline');

var fs = require('fs');
var jison = require('jison');

var Proof = require('./models/proof');

var bnf = fs.readFileSync('./parsers/theorem.jison', 'utf8');
var theorem_parser= new jison.Parser(bnf);

var thm = theorem_parser.parse("p, q |- p | q");
console.log(String(thm));

var proof_thm = new Proof(thm);
