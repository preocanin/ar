'use strict'

const readline = require('readline');
const _ = require('lodash');

var fs = require('fs');
var jison = require('jison');

var Proof = require('./models/proof');

var t_bnf = fs.readFileSync('./parsers/theorem.jison', 'utf8');
const theorem_parser = new jison.Parser(t_bnf);

var c_bnf = fs.readFileSync('./parsers/command.jison', 'utf8');
const command_parser = new jison.Parser(c_bnf);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

var proof = undefined;

mainloop();

function mainloop() {
  rl.question('What\'s your theorem? ', (answer) => {
    proof = undefined;
    if(answer == "quit")
        rl.close();
    else if(answer == "help") {
        console.log("Neki help");
        mainloop();
    }
    else {
        if(proof === undefined) {
            var thm = theorem_parser.parse(answer);
            proof = new Proof(thm);
        } 
        
        if(proof !== undefined) {
            proof.impE(1);
            console.log(String(proof));
        }

        rl.pause();
        commandloop();
    }
  });
}

function commandloop() {
  rl.question("enter command> ", function (command_string) {

    var command = command_parser.parse(command_string);
    rl.pause();

    if(command.type == "quit")
          return;
    if(command.type == "help")
          console.log("Neki help");
    if(command.type != "done") {
        commandloop();
    }
    else 
        mainloop();
  });
}
