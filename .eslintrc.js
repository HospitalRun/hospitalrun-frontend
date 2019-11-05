module.exports = {
  env: {
    browser: true,
    es6: true,
    "jest/globals": true
  },
  extends: [
    "airbnb",
    "plugin:@typescript-eslint/recommended",
    "prettier",
    "prettier/@typescript-eslint",
    "plugin:prettier/recommended"
  ],
  globals: {
    Atomics: "readonly",
    SharedArrayBuffer: "readonly"
  },
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "./tsconfig.json",
    tsconfigRootDir: "./",
    // TODO: we need this because of an issue with @typescript-eslint/parser: https://github.com/typescript-eslint/typescript-eslint/issues/864
    createDefaultProgram: true
  },
  settings: {
    "import/resolver": {
      node: {
        extensions: [".js", ".jsx", ".ts", ".tsx"]
      }
    }
  },
  plugins: ["react", "@typescript-eslint", "prettier", "jest"],
  rules: {
    "react/jsx-filename-extension": ["error", { extensions: [".tsx"] }],
    // 'prettier/prettier': 'error',
    "arrow-body-style": ["warn", "as-needed"],
    "react/jsx-one-expression-per-line": "off",
    "react/jsx-wrap-multilines": "off",
    "no-param-reassign": ["error", { props: false }],
    "import/prefer-default-export": "off",
    "@typescript-eslint/member-delimiter-style": "off",
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-unused-vars": "off",
    curly: ["error", "all"],
    "no-console": "off",
    "eol-last": ["error", "always"],
    "no-debugger": "error",
    "@typescript-eslint/unified-signatures": "error",
    "@typescript-eslint/no-inferrable-types": ["error", { ignoreParameters: true }]
  }
};
