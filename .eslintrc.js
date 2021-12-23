module.exports = {
  //继承 eslint-config-react-app这个里面包含create react app的eslint配置
  "extends": "react-app",
  rules: {
    // jsx使用 react
    'react/jsx-uses-react': [2],
    // 提示要在 JSX 文件里手动引入 React
    'react/react-in-jsx-scope': [2],
    'no-console': [0]
  },
  //覆盖之前的配置（检测ts代码）
  overrides: [{
    files: ['*.ts', '*.tsx'],
    parserOptions: {
      project: './tsconfig.json',
    },
    extends: ['airbnb-typescript'],
    rules: {
      'react/no-array-index-key': 'off',
      '@typescript-eslint/object-curly-spacing': 'off',
      '@typescript-eslint/semi': 'off',
      'import/prefer-default-export': 'off',
      'no-console': 'off',
      'import/extensions': 'off',
      indent: ['error', 2, { "SwitchCase": 1 }],
      quotes: ['error', 'single'],
      semi: ['error', 'never'],
      'no-plusplus': 'off',
      'linebreak-style': ['error', 'unix'],
      'no-multiple-empty-lines': ['error', { max: 2 }],
      'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
      'func-names': 'off',
      'no-use-before-define': 'off',
      'no-unused-vars': 'warn',
      'jsx-a11y/no-static-element-interactions': 'off',
      'jsx-a11y/click-events-have-key-events': 'off',
      'jsx-a11y/no-noninteractive-element-interactions': 'off',
      'import/no-unresolved': [2, { ignore: ['^@'] }],
    }
  }]
}