class TokenType {
    static ASSIGN = new TokenType("ASSIGN")
    static COMMA = new TokenType("COMMA")
    static DIVISION = new TokenType("DIVISION")
    static ELSE = new TokenType("ELSE")
    static EOF = new TokenType("EOF")
    static EQ = new TokenType("EQ")
    static FALSE = new TokenType("FALSE")
    static FUNCTION = new TokenType("FUNCTION")
    static GT = new TokenType("GT")
    static IDENT = new TokenType("IDENT")
    static IF = new TokenType("IF")
    static ILLEGAL = new TokenType("ILLEGAL")
    static INT = new TokenType("INT")
    static LBRACE = new TokenType("LBRACE")
    static LET = new TokenType("LET")
    static LPAREN = new TokenType("LPAREN")
    static LT = new TokenType("LT")
    static MINUS = new TokenType("MINUS")
    static MULTIPLICATION = new TokenType("MULTIPLICATION")
    static NEGATION = new TokenType("NEGATION")
    static NOT_EQ = new TokenType("NOT_EQ")
    static PLUS = new TokenType("PLUS")
    static RBRACE = new TokenType("RBRACE")
    static RETURN = new TokenType("RETURN")
    static RPAREN = new TokenType("RPAREN")
    static SEMICOLON = new TokenType("SEMICOLON")
    static TRUE = new TokenType("TRUE")

    constructor(name) {
        this.name = name;
    }

    toString() {
        return `TokenType ${this.name}}`;
    }
}

class Token {
    constructor(tokenType, literal) {
        this.tokenType = tokenType;
        this.literal = literal;
    }

    toString() {
        return `Token ${JSON.stringify(this)}`;
    }
}

const lookupTokenType = (literal) => {
    const keywords = {
        falso: TokenType.FALSE,
        procedimiento: TokenType.FUNCTION,
        regresa: TokenType.RETURN,
        si: TokenType.IF,
        si_no: TokenType.ELSE,
        variable: TokenType.LET,
        verdadero: TokenType.TRUE,
    };
    const isKeyword = Object.keys(keywords).includes(literal);
    return isKeyword ? keywords[literal] : TokenType.IDENT;
}

module.exports = {
    TokenType,
    Token,
    lookupTokenType,
}
