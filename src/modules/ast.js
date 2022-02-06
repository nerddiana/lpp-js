const { Token, TokenType } = require("./token");

class ASTNode {
    tokenLiteral() {
        return this.token.literal;
    }

    toString() {
        return `${this.constructor.name} ${JSON.stringify(this)}`;
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
}

class Expression extends ASTNode {
    constructor(token) {
        super();
        if (token instanceof Token === false) {
            throw new Error(`${JSON.stringify(token)} isn't a valid Token`);
        }
        this.token = token;
    }
}

class Program extends ASTNode {
    constructor(statements) {
        super();
        if (!statements) return;
        if (!Array.isArray(statements)) {
            throw new Error(`Program constructor needs an Array of Statements`);
        }
        const allAreStatements = statements.every(s => {
            return s instanceof Statement;
        });
        if (!allAreStatements) {
            throw new Error(`Program constructor needs an Array of Statements 2`);
        }
        this.statements = statements;
    }

    tokenLiteral() {
        if (this.statements.length > 0) {
            return this.statements[0].literal;
        }
        return "";
    }
}

module.exports = {
    ASTNode,
    Statement,
    Expression,
    Program,
};
