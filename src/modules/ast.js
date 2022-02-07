const { Token, TokenType } = require("./token");

class ASTNode {
    tokenLiteral() {
        return this.token.literal;
    }
}

class Statement extends ASTNode {
    constructor(token) {
        super();
        if (token instanceof Token === false) {
            throw new Error(`${JSON.stringify(token)} isn't a valid Token`);
        }
        this.token = token;
    }

    toString() {
        return `${this.token.literal}`;
    }
}

class Expression extends ASTNode {
    constructor(token) {
        super();
        this.token = token;
    }
}

class Program extends ASTNode {
    constructor(statements = []) {
        super();
        if (!Array.isArray(statements)) {
            throw new Error(`Program constructor needs an Array of Statements`);
        }
        const allAreStatements = statements.every(s => {
            return s instanceof Statement;
        });
        if (!allAreStatements) {
            throw new Error(`Program constructor needs an Array of Statements`);
        }
        this.statements = statements;
    }

    tokenLiteral() {
        if (this.statements.length > 0) {
            return this.statements[0].literal;
        }
        return "";
    }

    toString() {
        return this.statements.map(s => s.toString()).join("");
    }
}

class Identifier extends Expression {
    constructor(token, value) {
        super(token);
        this.value = value;
    }
}

class Integer extends Expression {
    constructor(token, value) {
        super(token);
        this.value = value;
    }
}

class LetStatement extends Statement {
    constructor(token, name = null, value = null) {
        super(token);
        this.name = name;
        this.value = value;
    }

    toString() {
        const name = this.name.token.literal;
        const value = this.value.token.literal;
        return `variable ${name} = ${value};`;
    }
}

class ReturnStatement extends Statement {
    constructor(token, return_value = null) {
        super(token);
        this.return_value = return_value;
    }

    toString() {
        let value = this.return_value.token.literal;
        return `regresa ${value};`;
    }
}

class ExpressionStatement extends Expression {
    constructor(token, expression = null) {
        super(token);
        this.expression = expression;
    }

    toString() {
        return this.expression;
    }
}

module.exports = {
    ASTNode,
    Statement,
    Expression,
    ExpressionStatement,
    Program,
    Identifier,
    Integer,
    LetStatement,
    ReturnStatement,
};
