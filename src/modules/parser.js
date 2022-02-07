const { Program, LetStatement, ReturnStatement, Identifier } = require("./ast");
const { Token, TokenType } = require("./token");
const { Lexer } = require("./lexer");

class Parser {
    constructor(lexer) {
        if (lexer instanceof Lexer === false) {
            throw new Error(`The provided lexer is not instance of Lexer`);
        }
        this._lexer = lexer;
        this._current_token = null;
        this._peek_token = null;
        this._errors = [];

        this.#advanceTokens();
        this.#advanceTokens();
    }

    get errors() {
        return this._errors;
    }

    parseProgram() {
        const program = new Program();

        if (this._current_token !== null) {
            while (this._current_token.tokenType !== TokenType.EOF) {
                const statement = this.#parseStatement();
                if (statement !== null) {
                    program.statements.push(statement);
                }
                this.#advanceTokens();
            }
        } else {
            throw new Error(`current token is null`);
        }

        return program;
    }

    #advanceTokens() {
        this._current_token = this._peek_token;
        this._peek_token = this._lexer.nextToken();
    }

    #expectedToken(tokenType) {
        const tokenTypes = TokenType.getTokenTypes();
        if (!tokenTypes.includes(tokenType.name)) {
            throw new Error(`Invalid TokenType: ${tokenType}`);
        }

        if (this._peek_token.tokenType === tokenType) {
            this.#advanceTokens();
            return true;
        }

        this.#expectedTokenError(tokenType);
        return false;
    }

    #expectedTokenError(tokenType) {
        if (this._peek_token !== null) {
            const error = `Se esperaba "${tokenType.es_name}", pero se obtuvo "${this._peek_token.literal}"`;
            this._errors.push(error);
        } else {
            throw new Error(`Peek token is null`);
        }
    }

    #parseLetStatement() {
        if (this._current_token !== null) {
            const let_statement = new LetStatement(this._current_token);

            if (!this.#expectedToken(TokenType.IDENT)) {
                return null;
            }

            let_statement.name = new Identifier(this._current_token, this._current_token.literal);

            if (!this.#expectedToken(TokenType.ASSIGN)) {
                return null;
            }

            // TODO: terminar cuándo sepamos parsear experesiones
            while(this._current_token.tokenType !== TokenType.SEMICOLON) {
                this.#advanceTokens();
            }

            return let_statement;
        } else {
            throw new Error(`current token is null`);
        }
    }

    #parseReturnStatement() {
        if (this._current_token !== null) {
            const return_statement = new ReturnStatement(this._current_token);

            this.#advanceTokens();

            // TODO: terminar cuándo sepamos parsear experesiones
            while(this._current_token.tokenType !== TokenType.SEMICOLON) {
                this.#advanceTokens();
            }

            return return_statement;
        } else {
            throw new Error(`current token is null`);
        }
    }

    #parseStatement() {
        if (this._current_token !== null) {
            if (this._current_token.tokenType === TokenType.LET) {
                return this.#parseLetStatement();
            } else if (this._current_token.tokenType === TokenType.RETURN) {
                return this.#parseReturnStatement();
            }
        } else {
            throw new Error(`current token is null`);
        }
        return null;
    }
}

module.exports = {
    Parser,
};
