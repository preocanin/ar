'use strict'

const readline = require('readline');

var fs = require('fs');
var jison = require('jison');

var bnf = fs.readFileSync('./parsers/theorem.jison', 'utf8');
var parser = new jison.Parser(bnf);

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.write('Enter a lemma You want to proof:\n>');

rl.on('line', (line) => {
    console.log(line.substring(1));
    rl.pause();
});

