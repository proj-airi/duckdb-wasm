<h1 align="center">DuckDB WASM</h1>

<p align="center">
Easy to use wrapper and Drizzle ORM driver for DuckDB WASM
</p>

<div align="center">

[Playground](https://drizzle-orm-duckdb-wasm.netlify.app/)

</div>

## Usage notes (as of Apr 12, 2025)

While using `@proj-airi/duckdb-wasm` directly or indirectly with Vite, you may encounter the following error:

```
Cannot read file: .../node_modules/.pnpm/@duckdb+duckdb-wasm@1.29.1-dev68.0/node_modules/@duckdb/duckdb-wasm/dist/duckdb-browser-mvp.worker.js?url

    node_modules/.pnpm/@proj-airi+duckdb-wasm@0.4.21/node_modules/@proj-airi/duckdb-wasm/dist/bundles/import-url-browser.mjs:3:26:
      3 │ import mvpMainWorker from '@duckdb/duckdb-wasm/dist/duckdb-browser-mvp.worker.js?url';
        ╵                           ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
```

This is due to an open issue with Vite, as a workaround, you can try excluding `@proj-airi/duckdb-wasm` in `optimizeDeps` in your `vite.config.ts`:

```ts
export default defineConfig({
  // ...
  optimizeDeps: {
    exclude: ['@proj-airi/duckdb-wasm']
  }
})
```

See also: https://github.com/vitejs/vite/issues/10838

## Development

```shell
pnpm i
```

Start the Drizzle DuckDB WASM playground locally:

```shell
pnpm -F @proj-airi/drizzle-duckdb-wasm play:dev
```

> [!NOTE]
>
> For [@antfu/ni](https://github.com/antfu-collective/ni) users, you can
>
> ```shell
> nr -F @proj-airi/drizzle-duckdb-wasm play:dev
> ```

## Sub-projects born from this project

- [`@proj-airi/drizzle-duckdb-wasm`](https://github.com/proj-airi/duckdb-wasm/tree/main/packages/drizzle-duckdb-wasm/README.md): Drizzle ORM driver for DuckDB WASM
- [`@proj-airi/duckdb-wasm`](https://github.com/proj-airi/duckdb-wasm/tree/main/packages/duckdb-wasm/README.md): Easy to use wrapper for `@duckdb/duckdb-wasm`
