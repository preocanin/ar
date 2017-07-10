'use strict'

const readline = require('readline');

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

mainloop();

function mainloop() {
  rl.question('What\'s your theorem? ', (answer) => {
    if(answer == "quit")
        rl.close();
    else if(answer == "help") {
        console.log("Neki help");
        mainloop();
    }
    else {
        const thm = theorem_parser.parse(answer);
        console.log(String(thm));
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
    if(command.type != "done")
        commandloop();
    else 
        mainloop();
  });
}
