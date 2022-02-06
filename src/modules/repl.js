const { Lexer } = require("./lexer.js");
const { TokenType } = require("./token.js");

module.exports = {
    lexer(uInput, context, filename, callback) {
        const lexer = new Lexer(uInput);
        let tokens = [];
        while (true) {
            const token = lexer.nextToken();
            if (token.tokenType === TokenType.EOF) break;
            tokens.push(token);
        }
        callback(tokens);
    },
};
