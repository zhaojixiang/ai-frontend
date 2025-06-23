import eslint from '@eslint/js';
import eslintPluginImport from 'eslint-plugin-import';
import pluginPrettier from 'eslint-plugin-prettier/recommended';
import pluginReact from 'eslint-plugin-react';
import pluginReactHooks from 'eslint-plugin-react-hooks';
import pluginReactRefresh from 'eslint-plugin-react-refresh';
import globals from 'globals';
import tsEslint from 'typescript-eslint';

export default [
  // 0. 基础配置
  {
    ignores: ['dist', 'node_modules', '*.d.ts']
  },

  // 1. 核心规则
  eslint.configs.recommended,
  ...tsEslint.configs.recommended,

  // 2. 全局规则
  {
    languageOptions: {
      globals: {
        ...globals.browser, // 确保所有 JS 文件都能识别 window
        ...globals.node
      }
    },
    rules: {
      'no-unsafe-optional-chaining': 'error',
      'no-prototype-builtins': 'error',
      'import/no-default-export': 'off' // 根据项目需要调整
    }
  },
  // 3. React 配置
  {
    files: ['**/*.{jsx,tsx}'],
    plugins: {
      react: pluginReact,
      'react-hooks': pluginReactHooks,
      'react-refresh': pluginReactRefresh
    },
    rules: {
      'react/react-in-jsx-scope': 'off',
      'react/jsx-uses-react': 'off',
      'react-refresh/only-export-components': 'warn',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'react/jsx-no-target-blank': 'error' // 新增安全规则
    }
  },

  // 4. TypeScript 增强
  {
    files: ['**/*.ts', '**/*.tsx'],
    rules: {
      '@typescript-eslint/no-unused-vars': 'error', // 升级为error
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/ban-ts-comment': 'warn',
      // '@typescript-eslint/consistent-type-definitions': ['error'],
      '@typescript-eslint/consistent-type-imports': [
        'error',
        {
          prefer: 'type-imports',
          fixStyle: 'inline-type-imports',
          disallowTypeAnnotations: false
        }
      ]
    }
  },

  // 5. Vite 环境支持
  {
    files: ['**/*.ts'],
    languageOptions: {
      parserOptions: {
        extraFileExtensions: ['.ts'],
        ecmaVersion: 'latest'
      }
    },
    rules: {
      'no-restricted-globals': [
        'error',
        {
          name: 'import.meta',
          message: 'Always use explicit `import.meta.env`'
        }
      ]
    }
  },

  // 6. 导入规范
  {
    plugins: { import: eslintPluginImport },
    rules: {
      'import/first': 'error',
      'import/newline-after-import': 'warn',
      'import/no-duplicates': 'error',
      'import/no-useless-path-segments': 'warn'
    }
  },

  // 7. Prettier 集成（保持最后）
  pluginPrettier
];
