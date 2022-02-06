const { Program, Statement } = require("./ast");
const { Token, TokenType } = require("./token");

class Parser {
    parseProgram() {
        return new Program();
    }
}

module.exports = {
    Parser,
};
