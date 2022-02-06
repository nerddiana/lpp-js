let test = require("tape");
let { TokenType, Token } = require("../../src/modules/token.js");
let { ASTNode, Statement, Expression } = require("../../src/modules/ast.js");

test("[AST]: Statement is instance of ASTNode", function (t) {
    const token = new Token(TokenType.ASSIGN, "=");
    const statement = new Statement(token);
    t.equal(statement instanceof ASTNode, true);
    t.end();
});

test("[AST]: Expression is instance of ASTNode", function (t) {
    const token = new Token(TokenType.ASSIGN, "=");
    const expression = new Expression(token);
    t.equal(expression instanceof ASTNode, true);
    t.end();
});

test("[AST]: ASTNode instances get token literals", function (t) {
    const token = new Token(TokenType.ASSIGN, "=");
    const statement = new Statement(token);
    t.equal(statement.tokenLiteral(), token.literal);
    t.end();
});
