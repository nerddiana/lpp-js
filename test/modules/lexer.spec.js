let test = require("tape");
let { TokenType, Token } = require("../../src/modules/token.js");
let { Lexer } = require("../../src/modules/lexer.js");

test("Lexer test ilegal", function (t) {
    const src = "¡¿@";
    const lexer = new Lexer(src);
    const tokens = src.split("").map(() => lexer.nextToken());
    const expectedTokens = [
        new Token(TokenType.ILLEGAL, "¡"),
        new Token(TokenType.ILLEGAL, "¿"),
        new Token(TokenType.ILLEGAL, "@"),
    ];

    t.deepEqual(tokens, expectedTokens);
    t.end();
});

test("Lexer one character operator", function (t) {
    const src = "=+";
    const lexer = new Lexer(src);
    const tokens = src.split("").map(() => lexer.nextToken());
    const expectedTokens = [
        new Token(TokenType.ASSIGN, "="),
        new Token(TokenType.PLUS, "+"),
    ];

    t.deepEqual(tokens, expectedTokens);
    t.end();
});

test("Lexer end of file", function (t) {
    const src = "+";
    const lexer = new Lexer(src);
    const tokens = src
        .split("")
        .concat(Array(1).fill())
        .map((el, i) => lexer.nextToken());
    const expectedTokens = [
        new Token(TokenType.PLUS, "+"),
        new Token(TokenType.EOF, ""),
    ];

    t.deepEqual(tokens, expectedTokens);
    t.end();
});

test("Lexer delimiters", function (t) {
    const src = "(){},;";
    const lexer = new Lexer(src);
    const tokens = src.split("").map(() => lexer.nextToken());
    const expectedTokens = [
        new Token(TokenType.LPAREN, "("),
        new Token(TokenType.RPAREN, ")"),
        new Token(TokenType.LBRACE, "{"),
        new Token(TokenType.RBRACE, "}"),
        new Token(TokenType.COMMA, ","),
        new Token(TokenType.SEMICOLON, ";"),
    ];

    t.deepEqual(tokens, expectedTokens);
    t.end();
});

test("Lexer asignment", function (t) {
    const src = "variable cinco = 5;";
    const lexer = new Lexer(src);
    const tokens = Array(5)
        .fill()
        .map(() => lexer.nextToken());
    const expectedTokens = [
        new Token(TokenType.LET, "variable"),
        new Token(TokenType.IDENT, "cinco"),
        new Token(TokenType.ASSIGN, "="),
        new Token(TokenType.INT, "5"),
        new Token(TokenType.SEMICOLON, ";"),
    ];

    t.deepEqual(tokens, expectedTokens);
    t.end();
});

test("Lexer function declaration", function (t) {
    const src = `
        variable suma = procedimiento(x, y) {
            x + y;
        };
    `;
    const lexer = new Lexer(src);
    const expectedTokens = [
        new Token(TokenType.LET, "variable"),
        new Token(TokenType.IDENT, "suma"),
        new Token(TokenType.ASSIGN, "="),
        new Token(TokenType.FUNCTION, "procedimiento"),
        new Token(TokenType.LPAREN, "("),
        new Token(TokenType.IDENT, "x"),
        new Token(TokenType.COMMA, ","),
        new Token(TokenType.IDENT, "y"),
        new Token(TokenType.RPAREN, ")"),
        new Token(TokenType.LBRACE, "{"),
        new Token(TokenType.IDENT, "x"),
        new Token(TokenType.PLUS, "+"),
        new Token(TokenType.IDENT, "y"),
        new Token(TokenType.SEMICOLON, ";"),
        new Token(TokenType.RBRACE, "}"),
        new Token(TokenType.SEMICOLON, ";"),
    ];
    const tokens = expectedTokens.map(() => lexer.nextToken());

    t.deepEqual(tokens, expectedTokens);
    t.end();
});
