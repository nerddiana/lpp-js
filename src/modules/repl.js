const { Lexer } = require("./lexer.js");
const { Parser } = require("./parser.js");

module.exports = {
    lexer(uInput, context, filename, callback) {
        const lexer = new Lexer(uInput);
        const parser = new Parser(lexer);
        const program = parser.parseProgram();
        console.dir(program, { depth: null });
        console.log(parser.errors.join("\n"));
        callback();
    },
};
