const { Lexer } = require("./lexer.js");

module.exports = {
    lexer(uInput, context, filename, callback) {
        console.log(context);
        const lexer = new Lexer(uInput);
        const tokens = uInput
            .split("")
            .map(() => lexer.nextToken());
        callback(tokens);
    },
};
