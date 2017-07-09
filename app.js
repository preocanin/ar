'use strict'

const readline = require('readline');

var fs = require('fs');
var jison = require('jison');

var Proof = require('./models/proof');

var bnf = fs.readFileSync('./parsers/theorem.jison', 'utf8');
var theorem_parser= new jison.Parser(bnf);

var thm = theorem_parser.parse("p, q |- p | q");
console.log(String(thm));



//// IO example
// const rl = readline.createInterface({
//   input: process.stdin,
//   output: process.stdout
// });

// rl.question('What do you think of Node.js? ', (answer) => {
//   // TODO: Log the answer in a database
//   console.log(`Thank you for your valuable feedback: ${answer}`);

//   rl.close();
// });

var proof_thm = new Proof(thm);
