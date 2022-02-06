class TokenType {
    static ASSIGN = new TokenType("ASSIGN")
    static COMMA = new TokenType("COMMA")
    static EOF = new TokenType("EOF")
    static FUNCTION = new TokenType("FUNCTION")
    static IDENT = new TokenType("IDENT")
    static ILLEGAL = new TokenType("ILLEGAL")
    static INT = new TokenType("INT")
    static LBRACE = new TokenType("LBRACE")
    static LET = new TokenType("LET")
    static LPAREN = new TokenType("LPAREN")
    static PLUS = new TokenType("PLUS")
    static RBRACE = new TokenType("RBRACE")
    static RPAREN = new TokenType("RPAREN")
    static SEMICOLON = new TokenType("SEMICOLON")

    constructor(name) {
        this.name = name;
    }
}

class Token {
    constructor(tokenType, literal) {
        this.tokenType = tokenType;
        this.literal = literal;
    }
}

const lookupTokenType = (literal) => {
    const keywords = {
        variable: TokenType.LET,
    };
    const isKeyword = Object.keys(keywords).includes(literal);
    return isKeyword ? keywords[literal] : TokenType.IDENT;
}

module.exports = {
    TokenType,
    Token,
    lookupTokenType,
}
