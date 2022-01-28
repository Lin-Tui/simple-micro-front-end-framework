module.exports = {
    env: {
      browser: true,
      node: true
    },
    parser: '@typescript-eslint/parser', 
    parserOptions: {
      ecmaVersion: 2015,
      sourceType: "module",
      tsconfigRootDir: __dirname,
      project: './tsconfig.json',
      ecmaFeatures: {
        modules: true
      }
    },
    plugins: [
      "@typescript-eslint"
    ],
    extends: [
      'eslint: recommended',
      'plugin:@typescript-eslint/recommended'
    ],
    rules: {},
  };
  
  