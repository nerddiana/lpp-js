const repl = require('repl');
const lpp = require("./modules/repl.js");

repl.start({
    prompt: 'lpp> ',
    eval: lpp.lexer
});
