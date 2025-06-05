import antfu from '@antfu/eslint-config'

export default await antfu(
  {
    unocss: true,
    vue: true,
    markdown: false,
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
