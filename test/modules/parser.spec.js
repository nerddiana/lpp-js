let test = require("tape");
let { TokenType, Token } = require("../../src/modules/token.js");
let { ASTNode, Statement, LetStatement, Expression, Program } = require("../../src/modules/ast.js");
let { Lexer } = require("../../src/modules/lexer.js");
let { Parser } = require("../../src/modules/parser.js");

test("[PARSER]: test parse program", function (t) {
    const src = `
        variable x = 5;
    `;

    const lexer = new Lexer(src);
    const parser = new Parser(lexer);

    const program = parser.parseProgram();

    t.isNot(program, null);
    t.equal(program instanceof Program, true);
    t.end();
});

test("[PARSER]: test let statements", function (t) {
    const src = `
        variable x = 5;
        variable y = 10;
        variable foo = 20;
    `;

    const lexer = new Lexer(src);
    const parser = new Parser(lexer);

    const program = parser.parseProgram();

    t.equal(program.statements?.length, 3);

    program.statements?.map((s) => {
        t.equal(s.tokenLiteral(), "variable");
        t.equal(s instanceof LetStatement, true);
    });

    t.end();
});

test("[PARSER]: test names in let statements", function (t) {
    const src = `
        variable x = 5;
        variable y = 10;
        variable foo = 20;
    `;

    const lexer = new Lexer(src);
    const parser = new Parser(lexer);

    const program = parser.parseProgram();

    const expectedLiterals = ["x", "y", "foo"];
    program.statements?.map((s, i) => {
        t.equal(s.name.token.literal, expectedLiterals[i]);
    });

    t.end();
});
