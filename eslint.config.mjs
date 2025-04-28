import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  eslint.configs.recommended,
  tseslint.configs.recommended,
  {files: ['**/*.ts', '**/*.tsx']},
  {ignores: ['**/*.js', '**/*.mjs']},
  {rules: { '@typescript-eslint/no-misused-promises': 'off' }},
  {rules: { '@typescript-eslint/no-unused-vars': 'off' }},
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    }
  },
);