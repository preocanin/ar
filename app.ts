'use strict'

import * as readline from 'readline';
import * as readlineSync from 'readline-sync';
import * as _ from "lodash";
import * as fs from 'fs';
import { Proof } from './models/proof';
// import { Theorem } from './models/theorem';

const jison = require('jison');
const clc = require('cli-color');

const error = clc.xterm(255).bgXterm(160);
const success = clc.xterm(155);

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

rl.question('What\'s your theorem, girl?', (answer) => {
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
            if(thm === true)
                thm = undefined;
            if(thm !== undefined)
                proof = new Proof(thm);
        }

        rl.pause();
        if(proof !== undefined) {
            console.log(String(proof));
            commandloop(proof);
        } else 
            mainloop();
    }
  });
}

function commandloop(proof: Proof, prevCommand = "nothing") {
    var commands = ["print", "invalid", "nothing", "help"];
    if( !_.includes(commands, prevCommand) && 
        proof !== undefined)
        console.log(String(proof));

    rl.question("enter command> ", function (command_string) {

    var command = command_parser.parse(command_string);
    rl.pause();

    switch(command.type) {
        case "impI":
        case "notI":
        case "conjI":
        case "disjI1":
        case "disjI2":
        case "ccontr":
        case "classical":
            eval("proof[command.type]()");
            break;
        case "impE":
        case "notE":
        case "conjE":
        case "disjE":
        case "mp":
            eval("proof[command.type](command.argument)");
            break;
        case "assumption":
            proof.assumption();
            break;
        case "back":
            proof.back(command.argument);
            break;
        case "print":
            console.log(String(proof));
            break;
        case "quit":
            return;
        case "invalid":
            console.log(error("Unknown command"));
            break;
        case "help":
            console.log("Neki help");
            break;
    }
    if(_.isEmpty(proof.currentGoal)) {
        command.type = "done";
        console.log("\n" + success("Theorem proved!") + "\n");
    }
    if(command.type != "done") {
        commandloop(proof, command.type);
    }
    else 
        mainloop();
  });
}
