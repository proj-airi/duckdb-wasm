import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: {
    'index': './src/index.ts',
    'bundles/default-browser': './src/bundles/default-browser.ts',
    'bundles/default-node': './src/bundles/default-node.ts',
    'bundles/import-url-browser': './src/bundles/import-url-browser.ts',
    'bundles/import-url-node': './src/bundles/import-url-node.ts',
  },
  sourcemap: true,
  unused: true,
  fixedExtension: true,
})
