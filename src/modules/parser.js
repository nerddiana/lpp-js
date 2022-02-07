const {
    Prefix,
    Program,
    ExpressionStatement,
    LetStatement,
    ReturnStatement,
    Identifier,
    Integer,
} = require("./ast");
const { Token, TokenType } = require("./token");
const { Lexer } = require("./lexer");

class Precedence {
    static LOWEST = 0
    static EQUALS = 1
    static LESSGREATER = 2
    static SUM = 3
    static PRODUCT = 4
    static PREFIX = 5
    static CALL = 6

    static getPrecedences(precedence = null) {
        const precedences = Object
            .entries(this)
            .sort((a, b) => a[1] - b[1])
            .map(e => e[0]);
        if (precedence !== null) {
            return precedences[precedence];
        }
        return precedences;
    }
}

class Parser {
    constructor(lexer) {
        if (lexer instanceof Lexer === false) {
            throw new Error(`The provided lexer is not instance of Lexer`);
        }
        this._lexer = lexer;
        this._current_token = null;
        this._peek_token = null;
        this._errors = [];

        this._prefix_parse_fns = this.#registerPrefixFns();
        this._infix_parse_fns = this.#registerInfixFns();

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

    #parseExpression(precedence) {
        if (this._current_token === null) {
            throw new Error(`current token is null`);
        }

        let prefix_parse_fn = null
        let left_expression = null

        try {
            prefix_parse_fn = this._prefix_parse_fns[this._current_token.tokenType.name];
            left_expression = prefix_parse_fn();
        } catch (error) {
            const message = `No se encontró ninguna función para parsear ${this._current_token.literal}.`;
            this._errors.push(message);
            return null;
        }

        return left_expression;
    }

    #parseExpressionStatement() {
        if (this._current_token === null) {
            throw new Error(`current token is null`);
        }

        const expression_statement = new ExpressionStatement(this._current_token);
        expression_statement.expression = this.#parseExpression(Precedence.LOWEST);

        if (this._peek_token === null) {
            throw new Error(`current peek token is null`);
        }

        if (this._peek_token.tokenType === TokenType.SEMICOLON) {
            this.#advanceTokens();
        }

        return expression_statement;
    }

    #parseIdentifier() {
        if (this._current_token === null) {
            throw new Error(`current token is null`);
        }

        return new Identifier(
            this._current_token,
            this._current_token.literal,
        );
    }

    #parseInteger() {
        if (this._current_token === null) {
            throw new Error(`current token is null`);
        }

        const integer = new Integer(
            this._current_token,
            this._current_token.literal,
        );

        try {
            integer.value = parseInt(this._current_token.literal);
        } catch (error) {
            const message = `No se pudo parsear ${this._current_token.literal} cómo un entero.`;
            this._errors.push(message);
            return null;
        }

        return integer;
    }

    #parseLetStatement() {
        if (this._current_token !== null) {
            const let_statement = new LetStatement(this._current_token);

            if (!this.#expectedToken(TokenType.IDENT)) {
                return null;
            }

            let_statement.name = this.#parseIdentifier();

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

    #parsePrefixExpression() {
        if (this._current_token === null) {
            throw new Error(`current token is null`);
        }

        const prefix_expression = new Prefix(this._current_token, this._current_token.literal);

        this.#advanceTokens();

        prefix_expression.right = this.#parseExpression(Precedence.PREFIX);

        return prefix_expression;
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
        return this.#parseExpressionStatement();
    }

    #registerPrefixFns() {
        return {
            [TokenType.IDENT.name]: this.#parseIdentifier.bind(this),
            [TokenType.INT.name]: this.#parseInteger.bind(this),
            [TokenType.MINUS.name]: this.#parsePrefixExpression.bind(this),
            [TokenType.NEGATION.name]: this.#parsePrefixExpression.bind(this),
        };
    }

    #registerInfixFns() {
        return {};
    }
}

module.exports = {
    Parser,
};
