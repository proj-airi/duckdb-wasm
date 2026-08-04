import { playwright } from '@vitest/browser-playwright'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  root: import.meta.dirname,
  test: {
    projects: [
      {
        extends: true,
        test: {
          name: 'node',
          environment: 'node',
          include: ['packages/drizzle-duckdb-wasm/**/*.{spec,test}.ts'],
          exclude: ['**/*.browser.{spec,test}.ts', '**/node_modules/**'],
        },
      },
      {
        extends: true,
        test: {
          name: 'browser',
          include: ['packages/drizzle-duckdb-wasm/**/*.browser.{spec,test}.ts'],
          exclude: ['**/node_modules/**'],
          browser: {
            enabled: true,
            provider: playwright(),
            instances: [
              { browser: 'chromium' },
            ],
          },
        },
      },
    ],
  },
})
