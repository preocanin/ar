'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var readline = require("readline");
var fs = require("fs");
var proof_1 = require("./models/proof");
var jison = require('jison');
var t_bnf = fs.readFileSync('./parsers/theorem.jison', 'utf8');
var theorem_parser = new jison.Parser(t_bnf);
var c_bnf = fs.readFileSync('./parsers/command.jison', 'utf8');
var command_parser = new jison.Parser(c_bnf);
var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
var proof = undefined;
mainloop();
function mainloop() {
    var parsed = theorem_parser.parse("P & Q |- P");
    console.log(parsed);
    rl.question('What\'s your theorem? ', function (answer) {
        proof = undefined;
        if (answer == "quit")
            rl.close();
        else if (answer == "help") {
            console.log("Neki help");
            mainloop();
        }
        else {
            if (proof === undefined) {
                var thm = theorem_parser.parse(answer);
                proof = new proof_1.Proof(thm);
            }
            if (proof !== undefined) {
                proof.classical();
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
        if (command.type == "quit")
            return;
        if (command.type == "help")
            console.log("Neki help");
        if (command.type != "done") {
            commandloop();
        }
        else
            mainloop();
    });
}
//# sourceMappingURL=app.js.map