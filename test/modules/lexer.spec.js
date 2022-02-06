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
