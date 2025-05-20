module.exports = {
  root: true,
  extends: [
    require.resolve('@woulsl/fabric/eslint-config-mfe/eslintrc.react.js'),
    require.resolve('@woulsl/fabric/eslint-config-mfe/eslintrc.typescript-react.js')
  ]
  // parser: '@typescript-eslint/parser',
  // parserOptions: {
  //   project: ['./tsconfig.eslint.json'],
  //   tsconfigRootDir: __dirname,
  //   ecmaVersion: 'latest',
  //   sourceType: 'module'
  // },
  // plugins: ['@typescript-eslint', 'react', 'react-hooks', 'jsx-a11y', 'import', 'unused-imports'],
  // extends: [
  //   'eslint:recommended', // ESLint 官方推荐规则
  //   'plugin:@typescript-eslint/recommended', // TypeScript 推荐规则
  //   'plugin:react/recommended', // React 推荐规则
  //   'plugin:react-hooks/recommended', // React Hooks 推荐规则
  //   // 'plugin:jsx-a11y/recommended', // JSX 可访问性推荐规则
  //   'plugin:import/recommended', // 导入/导出推荐规则
  //   'plugin:import/typescript', // TypeScript 导入/导出规则
  //   'prettier' // 与 Prettier 格式化工具兼容的规则
  // ],
  // settings: {
  //   react: {
  //     version: 'detect' // 自动检测 React 版本
  //   },
  //   'import/resolver': {
  //     alias: {
  //       map: [['@', './src']],
  //       extensions: ['.ts', '.tsx', '.js', '.jsx', '.json']
  //     }
  //   }
  // },
  // ignorePatterns: ['**/*.d.ts'], // 忽略所有 .d.ts 文件
  // rules: {
  //   'react/react-in-jsx-scope': 'off', // React 17+ 不需要引入 React
  //   'unused-imports/no-unused-imports': 'warn', // 未使用的导入会发出警告
  //   '@typescript-eslint/consistent-indexed-object-style': 'off', // 关闭索引对象风格一致性检查
  //   '@typescript-eslint/no-explicit-any': 'off', // 允许使用 any 类型
  //   // 'jsx-a11y/click-events-have-key-events': 'off',
  //   '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }], // 未使用的变量会发出警告，忽略以 _ 开头的参数
  //   'no-console': ['warn', { allow: ['warn', 'error'] }] // 禁止使用 console，但允许 console.warn 和 console.error
  // }
};
