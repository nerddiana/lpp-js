const { Token } = require("./token");

class ASTNode {
    constructor(token) {
        if (token instanceof Token === false) {
            throw new Error(`${JSON.stringify(token)} isn't a valid Token`);
        }
        this.token = token;
    }

    tokenLiteral() {
        return this.token.literal;
    }
}

class Statement extends ASTNode {}

class Expression extends ASTNode {}

module.exports = {
    ASTNode,
    Statement,
    Expression,
};
