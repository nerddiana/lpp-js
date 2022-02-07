class TokenType {
    static ASSIGN = new TokenType("ASSIGN", "=")
    static COMMA = new TokenType("COMMA", ",")
    static DIVISION = new TokenType("DIVISION", "/")
    static ELSE = new TokenType("ELSE", "si_no")
    static EOF = new TokenType("EOF", "EOF")
    static EQ = new TokenType("EQ", "==")
    static FALSE = new TokenType("FALSE", "falso")
    static FUNCTION = new TokenType("FUNCTION", "procedimiento")
    static GT = new TokenType("GT", ">")
    static IDENT = new TokenType("IDENT", "identificador")
    static IF = new TokenType("IF", "si")
    static ILLEGAL = new TokenType("ILLEGAL", "ilegal")
    static INT = new TokenType("INT", "entero")
    static LBRACE = new TokenType("LBRACE", "{")
    static LET = new TokenType("LET", "variable")
    static LPAREN = new TokenType("LPAREN", "(")
    static LT = new TokenType("LT", "<")
    static MINUS = new TokenType("MINUS", "-")
    static MULTIPLICATION = new TokenType("MULTIPLICATION", "*")
    static NEGATION = new TokenType("NEGATION", "!")
    static NOT_EQ = new TokenType("NOT_EQ", "!=")
    static PLUS = new TokenType("PLUS", "+")
    static RBRACE = new TokenType("RBRACE", "}")
    static RETURN = new TokenType("RETURN", "regresa")
    static RPAREN = new TokenType("RPAREN", ")")
    static SEMICOLON = new TokenType("SEMICOLON", ";")
    static TRUE = new TokenType("TRUE", "verdadero")

    constructor(name, es_name = null) {
        this.name = name;
        this.es_name = es_name;
    }

    static getTokenTypes() {
        return Object.keys(this);
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
