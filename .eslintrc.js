// module.exports = {
//   root: true,
//   env: {
//     node: true
//   },
//   extends: ['plugin:vue/vue3-essential', 'eslint:recommended', '@vue/prettier'],
//   parserOptions: {
//     parser: 'babel-eslint'
//   },
//   rules: {
//     'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
//     'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off'
//   }
// }


module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: ['plugin:vue/vue3-essential', 'eslint:recommended', '@vue/prettier'],
  parserOptions: {
    parser: 'babel-eslint',
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
  },
  overrides: [
    {
      files: ['*.js', '*.jsx', '*.ts', '*.tsx', '*.vue', '*.html', '*.md'],
      options: {
        // Set the endOfLine option for Prettier
        endOfLine: 'auto',
      },
    },
  ],
};