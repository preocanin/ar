'use strict'

import * as readline from 'readline';
import * as readlineSync from 'readline-sync';
import * as _ from "lodash";
import * as fs from 'fs';
import { Proof } from './models/proof';

const jison = require('jison');

// Terminal colors
const clc = require('cli-color');

const error = clc.xterm(255).bgXterm(160);
const success = clc.xterm(155);
const fail = clc.xterm(255);

var t_bnf = fs.readFileSync('./parsers/theorem.jison', 'utf8');
const theorem_parser = new jison.Parser(t_bnf);

var c_bnf = fs.readFileSync('./parsers/command.jison', 'utf8');
const command_parser = new jison.Parser(c_bnf);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

var proof;

mainloop();

function mainloop() {
    rl.question('insert theorem> ', (answer) => {
        proof = undefined;
        if(answer == "quit")
            rl.close();
        else if(answer == "help") {
            console.log("Neki help");
            mainloop();
        }
        else {
            const thm = theorem_parser.parse(answer);
            if(typeof thm === "object") // if Thereom object is returned
                proof = new Proof(thm);

            rl.pause();
            if(proof) {
                console.log(String(proof));
                commandloop(proof);
            } else 
                mainloop();
        }
    });
}

function commandloop(proof: Proof, prevCommand = "nothing") {
    const commands = ["print", "invalid", "nothing", "help"];
    const rules = ["impI", "notI", "conjI", "disjI1", "disjI2", "iffI", "ccontr", "classical"];
    const erules = ["impE", "notE", "conjE", "disjE", "iffE", "mp"];

    if(!_.includes(commands, prevCommand) && proof)
        console.log(String(proof));

    rl.question("enter command> ", function (command_string) {
    
    
    var command;
    try{
        command = command_parser.parse(command_string);
    } catch(e) {
        console.log(error(`Command "${command_string}" is not valid in a current context!`));
        commandloop(proof, "invalid");
        return;
    }
    rl.pause();

    if(_.includes(rules, command.type))
        eval("proof[command.type]()");
    else if(_.includes(erules, command.type))
        eval("proof[command.type](command.argument)");
    else if(command.type == "assumption")
        proof.assumption();
    else if(command.type == "back")
        proof.back(command.argument)
    else if(command.type == "print")
        console.log(String(proof));
    else if(command.type == "quit")
        return;
    else if(command.type == "invalid")
        console.log(error("Unknown command"));
    else if(command.type == "help")
        console.log("Neki help");

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
