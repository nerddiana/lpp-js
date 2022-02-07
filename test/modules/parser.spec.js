let test = require("tape");
let { TokenType, Token } = require("../../src/modules/token.js");
let {
    ASTNode,
    Statement,
    LetStatement,
    ReturnStatement,
    Expression,
    Program,
    Identifier,
    ExpressionStatement,
    Infix,
    Integer,
    Prefix
} = require("../../src/modules/ast.js");
let { Lexer } = require("../../src/modules/lexer.js");
let { Parser } = require("../../src/modules/parser.js");

test("[PARSER]: test parse program", function (t) {
    const src = `
        variable x = 5;
    `;

    const lexer = new Lexer(src);
    const parser = new Parser(lexer);

    const program = parser.parseProgram();

    t.isNot(program, null);
    t.equal(program instanceof Program, true);
    t.end();
});

test("[PARSER]: test let statements", function (t) {
    const src = `
        variable x = 5;
        variable y = 10;
        variable foo = 20;
    `;

    const lexer = new Lexer(src);
    const parser = new Parser(lexer);

    const program = parser.parseProgram();

    t.equal(program.statements?.length, 3);

    program.statements?.map((s) => {
        t.equal(s.tokenLiteral(), "variable");
        t.equal(s instanceof LetStatement, true);
    });

    t.end();
});

test("[PARSER]: test names in let statements", function (t) {
    const src = `
        variable x = 5;
        variable y = 10;
        variable foo = 20;
    `;

    const lexer = new Lexer(src);
    const parser = new Parser(lexer);

    const program = parser.parseProgram();

    const expectedLiterals = ["x", "y", "foo"];
    program.statements?.map((s, i) => {
        t.equal(s.name.token.literal, expectedLiterals[i]);
    });

    t.end();
});

test("[PARSER]: test parse errors", function (t) {
    const src = `
        variable x 5;
    `;

    const lexer = new Lexer(src);
    const parser = new Parser(lexer);

    parser.parseProgram();

    t.equal(parser.errors?.length, 1);
    t.end();
});

test("[PARSER]: test return statements", function (t) {
    const src = `
        regresa 5;
        regresa foo;
    `;

    const lexer = new Lexer(src);
    const parser = new Parser(lexer);

    const program = parser.parseProgram();

    t.equal(program.statements?.length, 2);

    program.statements?.map((s) => {
        t.equal(s.tokenLiteral(), "regresa");
        t.equal(s instanceof ReturnStatement, true);
    });

    t.end();
});

test("[PARSER]: Test program AST LetStatement", function (t) {
    const program = new Program([
        new LetStatement(
            new Token(TokenType.LET, "variable"),
            new Identifier(
                new Token(TokenType.IDENT, "mi_var"),
                "mi_var"
            ),
            new Identifier(
                new Token(TokenType.IDENT, "otra_var"),
                "otra_var"
            )
        )
    ]);

    const programStr = program.toString();

    t.deepEqual(programStr, "variable mi_var = otra_var;");
    t.end();
});

test("[PARSER]: Test program AST ReturnStatement", function (t) {
    const program = new Program([
        new ReturnStatement(
            new Token(TokenType.LET, "regresa"),
            new Identifier(
                new Token(TokenType.IDENT, "x"),
                "x"
            )
        )
    ]);

    const programStr = program.toString();

    t.deepEqual(programStr, "regresa x;");
    t.end();
});

const testProgramStatements = function (
    t,
    parser,
    program,
    expression_statement_count = 1) {
    
    if (parser.errors) {
        console.log(parser.errors.join("\n"));
    }

    t.equal(parser.errors?.length, 0);
    console.dir(program.statements, { depth: null });
    console.log(program.statements?.length, expression_statement_count);
    t.equal(program.statements?.length, expression_statement_count);
    t.equal(program.statements[0] instanceof ExpressionStatement, true);
}

const testLiteralExpression = function (
    t,
    expression,
    expected_value
) {
    const value_type = typeof expected_value;

    if (value_type === "string") {
        testIdentifier(t, expression, expected_value);
    } else if (value_type === "number") {
        testInteger(t, expression, expected_value);
    } else {
        t.fail();
    }
}

const testIdentifier = function (
    t,
    expression,
    expected_value
) {
    t.equal(expression instanceof Identifier, true);

    const identifier = expression;

    t.equal(identifier.value, expected_value);
    t.equal(identifier.token.literal, expected_value);
    t.end();
}

test("[PARSER]: test identifier expression", function (t) {
    const src = `
        foobar;
    `;

    const lexer = new Lexer(src);
    const parser = new Parser(lexer);

    const program = parser.parseProgram();

    console.dir(program, { depth: null });

    testProgramStatements(t, parser, program);

    expression_statement = program.statements[0];

    if (expression_statement === null) {
        throw new Error(`expression_statement is null`);
    }

    testLiteralExpression(t, expression_statement.expression, "foobar");
});

const testInteger = function (
    t,
    expression,
    expected_value
) {
    t.equal(typeof expected_value === "number", true)

    const integer = expression;

    t.equal(integer.value, expected_value);
    t.equal(integer.token.literal, `${expected_value}`);
    t.end();
}

test("[PARSER]: test integer expression", function (t) {
    const src = `
        5;
    `;

    const lexer = new Lexer(src);
    const parser = new Parser(lexer);

    const program = parser.parseProgram();

    testProgramStatements(t, parser, program);

    const statement = program.statements[0];

    if (statement === null) {
        throw new Error(`statement is null`);
    }

    testLiteralExpression(t, statement.expression, 5);
});

test("[PARSER]: test integer expression as AST", function (t) {
    const program = new Program([
        new ReturnStatement(
            new Token(TokenType.LET, "regresa"),
            new Integer(
                new Token(TokenType.IDENT, "5"),
                5
            )
        )
    ]);

    const programStr = program.toString();

    t.deepEqual(programStr, "regresa 5;");
    t.end();
});

test("[PARSER]: test prefix expressions", function (t) {
    const src = `
        !5; -15;
    `;

    const lexer = new Lexer(src);
    const parser = new Parser(lexer);

    const program = parser.parseProgram();

    testProgramStatements(t, parser, program, 2);

    const expectedStatements = [
        ["!", 5],
        ["-", 15]
    ];
    program.statements.map((statement, s) => {
        const [operator, value] = expectedStatements[s];
        t.equal(statement.expression instanceof Prefix, true);
        const prefix = statement.expression;
        t.equal(prefix.operator, operator);
        
        if (prefix.right === null) {
            throw new Error(`prefix.right is null`);
        }

        t.equal(prefix.right.value, value);
    })

    t.end();
});

const testInfixExpression = function (
    t,
    statement,
    left,
    operator,
    right
) {
    t.equal(statement.expression instanceof Infix, true);
    const infix = statement.expression;
    t.equal(infix.operator, operator);

    if (infix.left === null) {
        throw new Error(`prefix.left is null`);
    }
    
    t.equal(infix.left.value, left);

    if (infix.right === null) {
        throw new Error(`prefix.right is null`);
    }

    t.equal(infix.right.value, right);
}

test("[PARSER]: test infix expressions", function (t) {
    const src = `
        5 + 5;
        5 - 5;
        5 * 5;
        5 / 5;
        5 > 5;
        5 < 5;
        5 == 5;
        5 != 5;
    `;

    const lexer = new Lexer(src);
    const parser = new Parser(lexer);

    const program = parser.parseProgram();

    testProgramStatements(t, parser, program, 8);
    const expectedStatements = [
        [5, "+", 5],
        [5, "-", 5],
        [5, "*", 5],
        [5, "/", 5],
        [5, ">", 5],
        [5, "<", 5],
        [5, "==", 5],
        [5, "!=", 5],
    ];

    program.statements.map((statement, s) => {
        console.log(s);
        const [left, operator, right] = expectedStatements[s];
        testInfixExpression(t, statement, left, operator, right);
    })

    t.end();
});

test("[PARSER]: test precedences", function (t) {

    t.pass();
    t.end();
});
