const { Token, TokenType, lookupTokenType } = require("./token.js");

class Lexer {
    constructor(source) {
        this._source = source;
        this._character = "";
        this._read_position = 0;
        this._position = 0;
        this.#readCharacter();
    }

    nextToken() {
        this.#skipWhiteSpace();

        const match = (str) => new RegExp(str).test(this._character);
        let token = new Token(TokenType.ILLEGAL, this._character);

        if (match(/^=$/)) {
            if (this.#peekCharacter() === "=") {
                token = this.#makeTwoCharacterToken(TokenType.EQ);
            } else {
                token = new Token(TokenType.ASSIGN, this._character);
            }
        } else if (match(/^\+$/)) {
            token = new Token(TokenType.PLUS, this._character);
        } else if (match(/^-$/)) {
            token = new Token(TokenType.MINUS, this._character);
        } else if (match(/^\*$/)) {
            token = new Token(TokenType.MULTIPLICATION, this._character);
        } else if (match(/^\/$/)) {
            token = new Token(TokenType.DIVISION, this._character);
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
        } else if (match(/^<$/)) {
            token = new Token(TokenType.LT, this._character);
        } else if (match(/^>$/)) {
            token = new Token(TokenType.GT, this._character);
        } else if (match(/^\!$/)) {
            if (this.#peekCharacter() === "=") {
                token = this.#makeTwoCharacterToken(TokenType.NOT_EQ);
            } else {
                token = new Token(TokenType.NEGATION, this._character);
            }        
        } else if (this.#isLetter(this._character)) {
            const literal = this.#readIdentifier();
            const tokenType = lookupTokenType(literal);
            return new Token(tokenType, literal);
        } else if (this.#isNumber(this._character)) {
            const literal = this.#readNumber();
            return new Token(TokenType.INT, literal);
        }

        this.#readCharacter();
        return token;
    }

    #isLetter(character) {
        return new RegExp(/^[a-záéíóúA-ZÁÉÍÓÚñÑ_]$/).test(character);
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

    #isNumber(character) {
        return new RegExp(/^\d$/).test(character);
    }

    #makeTwoCharacterToken(tokenType) {
        const prefix = this._character;
        this.#readCharacter();
        const suffix = this._character;
        return new Token(tokenType, `${prefix}${suffix}`);
    }

    #peekCharacter() {
        if (this._read_position >= this._source.length) {
            return "";
        }
        return this._source[this._read_position];
    }

    #readNumber() {
        const initial_position = this._position;
        while (this.#isNumber(this._character)) {
            this.#readCharacter();
        }
        return this._source.slice(initial_position, this._position);
    }

    #readIdentifier() {
        const initial_position = this._position;
        while (this.#isLetter(this._character)) {
            this.#readCharacter();
        }
        return this._source.slice(initial_position, this._position);
    }

    #skipWhiteSpace() {
        const isWhiteSpace = (str) => new RegExp(/^\s$/).test(str);
        while (isWhiteSpace(this._character)) {
            this.#readCharacter();
        }
    }
}

module.exports = {
    Lexer
}
