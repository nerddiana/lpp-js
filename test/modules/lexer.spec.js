let test = require("tape");
let { TokenType, Token } = require("../../src/modules/token.js");
let { Lexer } = require("../../src/modules/lexer.js");

test("[LEXER]: test ilegal", function (t) {
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

test("[LEXER]: one character operator", function (t) {
    const src = "=+-/*<>!";
    const lexer = new Lexer(src);
    const tokens = src.split("").map(() => lexer.nextToken());
    const expectedTokens = [
        new Token(TokenType.ASSIGN, "="),
        new Token(TokenType.PLUS, "+"),
        new Token(TokenType.MINUS, "-"),
        new Token(TokenType.DIVISION, "/"),
        new Token(TokenType.MULTIPLICATION, "*"),
        new Token(TokenType.LT, "<"),
        new Token(TokenType.GT, ">"),
        new Token(TokenType.NEGATION, "!"),
    ];

    t.deepEqual(tokens, expectedTokens);
    t.end();
});

test("[LEXER]: end of file", function (t) {
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

test("[LEXER]: delimiters", function (t) {
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

test("[LEXER]: asignment", function (t) {
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

test("[LEXER]: function declaration", function (t) {
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

test("[LEXER]: function call", function (t) {
    const src = `
        variable resultado = suma(dos, tres);
    `;

    const lexer = new Lexer(src);
    const expectedTokens = [
        new Token(TokenType.LET, "variable"),
        new Token(TokenType.IDENT, "resultado"),
        new Token(TokenType.ASSIGN, "="),
        new Token(TokenType.IDENT, "suma"),
        new Token(TokenType.LPAREN, "("),
        new Token(TokenType.IDENT, "dos"),
        new Token(TokenType.COMMA, ","),
        new Token(TokenType.IDENT, "tres"),
        new Token(TokenType.RPAREN, ")"),
        new Token(TokenType.SEMICOLON, ";"),
    ];
    const tokens = expectedTokens.map(() => lexer.nextToken());

    t.deepEqual(tokens, expectedTokens);
    t.end();
});

test("[LEXER]: control statement", function (t) {
    const src = `
        si (5 < 10) {
            regresa verdadero;
        } si_no {
            regresa falso;
        }
    `;

    const lexer = new Lexer(src);
    const expectedTokens = [
        new Token(TokenType.IF, "si"),
        new Token(TokenType.LPAREN, "("),
        new Token(TokenType.INT, "5"),
        new Token(TokenType.LT, "<"),
        new Token(TokenType.INT, "10"),
        new Token(TokenType.RPAREN, ")"),
        new Token(TokenType.LBRACE, "{"),
        new Token(TokenType.RETURN, "regresa"),
        new Token(TokenType.TRUE, "verdadero"),
        new Token(TokenType.SEMICOLON, ";"),
        new Token(TokenType.RBRACE, "}"),
        new Token(TokenType.ELSE, "si_no"),
        new Token(TokenType.LBRACE, "{"),
        new Token(TokenType.RETURN, "regresa"),
        new Token(TokenType.FALSE, "falso"),
        new Token(TokenType.SEMICOLON, ";"),
        new Token(TokenType.RBRACE, "}"),
    ];
    const tokens = expectedTokens.map(() => lexer.nextToken());

    t.deepEqual(tokens, expectedTokens);
    t.end();
});

test("[LEXER]: two character operators", function (t) {
    const src = `
        10 == 10;
        10 != 9;
    `;

    const lexer = new Lexer(src);
    const expectedTokens = [
        new Token(TokenType.INT, "10"),
        new Token(TokenType.EQ, "=="),
        new Token(TokenType.INT, "10"),
        new Token(TokenType.SEMICOLON, ";"),
        new Token(TokenType.INT, "10"),
        new Token(TokenType.NOT_EQ, "!="),
        new Token(TokenType.INT, "9"),
        new Token(TokenType.SEMICOLON, ";"),
    ];
    const tokens = expectedTokens.map(() => lexer.nextToken());

    t.deepEqual(tokens, expectedTokens);
    t.end();
});

test("[LEXER]: fix identifiers with numbers", function (t) {
    const src = `
        variable edad_1 = 24;
    `;

    const lexer = new Lexer(src);
    const expectedTokens = [
        new Token(TokenType.LET, "variable"),
        new Token(TokenType.IDENT, "edad_1"),
        new Token(TokenType.ASSIGN, "="),
        new Token(TokenType.INT, "24"),
        new Token(TokenType.SEMICOLON, ";"),
    ];
    const tokens = expectedTokens.map(() => lexer.nextToken());

    t.deepEqual(tokens, expectedTokens);
    t.end();
});
