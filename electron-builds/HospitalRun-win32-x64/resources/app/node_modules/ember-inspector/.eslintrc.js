module.exports = {
  root: true,
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module'
  },
  extends: 'eslint:recommended',
  env: {
    'browser': true
  },
  rules: {
    /* Possible Errors */

    'no-console': 0,

    /* Best Practices */

    'eqeqeq': 2,
    'no-eq-null': 2,
    'no-labels': 2,
    'no-multi-spaces': 2,
    'no-new': 2,
    'no-new-func': 2,
    'no-new-wrappers': 2,
    'no-octal-escape': 2,
    'no-proto': 2,
    'no-return-assign': 2,
    'no-script-url': 2,
    'no-self-compare': 2,
    'no-sequences': 2,
    'no-throw-literal': 2,
    'no-unused-expressions': 2,
    'no-useless-call': 2,
    'no-useless-concat': 2,
    'no-useless-escape': 2,
    'no-void': 2,
    'no-with': 2,
    'yoda': 2,

    /* Variables */

    'no-shadow': 0,
    'no-use-before-define': [2, {
      'classes': false,
      'functions': false,
    }],

    /* Stylistic Issues */

    'array-bracket-spacing': 2,
    'block-spacing': 2,
    'camelcase': [0, {
      'properties': 'always',
    }],
    'comma-spacing': [2, {
      'before': false,
      'after': true,
    }],
    'comma-style': 2,
    'computed-property-spacing': 2,
    'eol-last': 2,
    'indent': [2, 2, {
      'VariableDeclarator': {
        'var': 2,
        'let': 2,
        'const': 3,
      }
    }],
    'key-spacing': [2, {
      'beforeColon': false,
      'afterColon': true,
    }],
    'keyword-spacing': 2,
    'linebreak-style': [2, 'unix'],
    'max-len': [2, 250],
    'max-nested-callbacks': [2, 5],
    'new-cap': [2, {
      'capIsNew': false,
    }],
    'new-parens': 2,
    'no-array-constructor': 2,
    'no-bitwise': 2,
    'no-inline-comments': 0,
    'no-new-object': 2,
    'no-restricted-syntax': [2, 'WithStatement'],
    'no-spaced-func': 2,
    'no-trailing-spaces': 2,
    'no-unneeded-ternary': 2,
    'no-whitespace-before-property': 2,
    'object-curly-spacing': [2, 'always'],
    'operator-assignment': 2,
    'semi': 2,
    'semi-spacing': 2,
    'space-before-blocks': 2,
    'space-in-parens': 2,
    'space-infix-ops': 2,
    'space-unary-ops': 2,
    'wrap-regex': 2,

    /* ECMAScript 6 */

    'arrow-body-style': 2,
    'arrow-spacing': 2,
    'constructor-super': 2,
    'no-confusing-arrow': [2, {
      'allowParens': true
    }],
    'no-const-assign': 2,
    'no-dupe-class-members': 2,
    'no-duplicate-imports': 2,
    'no-new-symbol': 2,
    'no-var': 2,
    'object-shorthand': 2,
    'prefer-spread': 2,
    'prefer-template': 2,
    'require-yield': 2,
    'template-curly-spacing': 2,
  },
};
