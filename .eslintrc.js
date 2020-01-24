module.exports = {
  extends: ['standard-with-typescript', 'standard-react'],
  parserOptions: {
    project: [
      './packages/wiki/tsconfig.json',
      './packages/backend/tsconfig.json'
    ]
  },
  env: {
    node: true,
    jest: true
  },
  rules: {
    '@typescript-eslint/strict-boolean-expressions': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    'react/prop-types': 'off'
  }
}
