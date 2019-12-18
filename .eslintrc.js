module.exports = {
    "env": {
        "node": true,
        "es2017": true
    },
    "extends": [
        "eslint:recommended",
        "google"
    ],
    "globals": {
        "Atomics": "readonly",
        "SharedArrayBuffer": "readonly"
    },
    "parserOptions": {
        "ecmaVersion": 2018
    },
    "rules": {
        "indent": ["error", 4],
        "require-jsdoc": ["error", {
            "require": {
                "FunctionDeclaration": false,
                "MethodDefinition": false,
                "ClassDeclaration": true,
                "ArrowFunctionExpression": false,
                "FunctionExpression": false
            }
        }],
        "block-scoped-var": ["error"],
        "class-methods-use-this": ["error"],
        "eqeqeq": "error",
    }
};