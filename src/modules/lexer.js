const { Token, TokenType } = require("./token.js");

class Lexer {
    constructor(source) {
        this._source = source;
        this._character = "";
        this._read_position = 0;
        this._position = 0;
        this.#readCharacter();
    }

    nextToken() {
        const match = (str) => new RegExp(str).test(this._character);
        let token = new Token(TokenType.ILLEGAL, this._character);

        if (match(/^=$/)) {
            token = new Token(TokenType.ASSIGN, this._character);
        } else if (match(/^\+$/)) {
            token = new Token(TokenType.PLUS, this._character);
        } else if (match(/^$/)) {
            token = new Token(TokenType.EOF, this._character);
        } else if (match(/^\($/)) {
            token = new Token(TokenType.LPAREN, this._character);
        } else if (match(/^\)$/)) {
            token = new Token(TokenType.RPAREN, this._character);
        } else if (match(/^\{$/)) {
            token = new Token(TokenType.LBRACE, this._character);
        } else if (match(/^\}$/)) {
            token = new Token(TokenType.RBRACE, this._character);
        } else if (match(/^,$/)) {
            token = new Token(TokenType.COMMA, this._character);
        } else if (match(/^;$/)) {
            token = new Token(TokenType.SEMICOLON, this._character);
        }

        this.#readCharacter();
        return token;
    }

    #readCharacter() {
        if (this._read_position >= this._source.length) {
            this._character = "";
        } else {
            this._character = this._source[this._read_position];
        }

        this._position = this._read_position;
        this._read_position++;
    }
}

module.exports = {
    Lexer
}