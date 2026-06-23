export default [
  {
    ignores: ['dist', '.netlify', 'node_modules', 'build'],
  },
  {
    rules: {
      'no-unused-vars': 'warn',
      'no-console': 'off',
    },
  },
];
