'use strict'

const readline = require('readline');

var fs = require('fs');
var jison = require('jison');

var Proof = require('./models/proof');

var bnf = fs.readFileSync('./parsers/theorem.jison', 'utf8');
var theorem_parser= new jison.Parser(bnf);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

mainloop();

function mainloop() {
  rl.question('What\'s your theorem? ', (answer) => {
    const thm = theorem_parser.parse(answer);
    console.log(thm.toString());
    rl.pause();
  commandloop();
  });
  // mainloop();
}

function commandloop() {
  rl.question("apply rule: ", function (command_string) {
    console.log(command_string);
    rl.pause();
    commandloop();
  });
}
// var proof_thm = new Proof(thm);
