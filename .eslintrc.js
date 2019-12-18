module.exports = {
    "env": {
        "node": true,
        "es2017": true
    },
    "extends": "eslint:recommended",
    "globals": {
        "Atomics": "readonly",
        "SharedArrayBuffer": "readonly"
    },
    "parserOptions": {
        "ecmaVersion": 2018
    },
    "rules": {
        "max-len": ["error", {"code": 100}],
        "block-scoped-var": ["error"],
        "class-methods-use-this": ["error"],
        "curly": "error",
        "eqeqeq": "error",
        "strict": ["error", "global"]
    }
};