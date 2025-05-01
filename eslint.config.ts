import antfu from '@antfu/eslint-config'

export default await antfu(
  {
    unocss: true,
    vue: true,
    ignores: [
      '**/drizzle/**',
    ],
    rules: {
      'import/order': [
        'error',
        {
          'groups': [
            ['type'],
            ['builtin', 'external'],
            ['parent', 'sibling', 'index'],
          ],
          'newlines-between': 'always',
        },
      ],
    },
  },
)
