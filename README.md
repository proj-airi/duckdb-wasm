<h1 align="center">DuckDB WASM</h1>

<p align="center">
Easy to use wrapper and <a href="https://orm.drizzle.team/">Drizzle ORM</a> driver for DuckDB WASM
</p>

<div align="center">

Web browser based [Playground](https://drizzle-orm-duckdb-wasm.netlify.app/), try it!

</div>

> [!NOTE]
>
> **Usage notes (as of Apr 12, 2025)**
>
> While using `@proj-airi/duckdb-wasm` directly or indirectly with Vite, you may encounter the following error:
> 
> ```
> Cannot read file: .../node_modules/.pnpm/@duckdb+duckdb-wasm@1.29.1-dev68.0/node_modules/@duckdb/duckdb-wasm/dist/duckdb-browser-mvp.worker.js?url
> 
>     node_modules/.pnpm/@proj-airi+duckdb-wasm@0.4.21/node_modules/@proj-airi/duckdb-wasm/dist/bundles/import-url-browser.mjs:3:26:
>       3 │ import mvpMainWorker from '@duckdb/duckdb-wasm/dist/duckdb-browser-mvp.worker.js?url';
>         ╵                           ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
> ```
> 
> This is due to an open issue with Vite, as a workaround, you can try excluding `@proj-airi/duckdb-wasm` in `optimizeDeps` in your > `vite.config.ts`:
> 
> ```ts
> export default defineConfig({
>   // ...
>   optimizeDeps: {
>     exclude: ['@proj-airi/duckdb-wasm']
>   }
> })
> ```
> 
> See also: https://github.com/vitejs/vite/issues/10838

## Usage

```shell
ni @proj-airi/drizzle-duckdb-wasm -D # from @antfu/ni, can be installed via `npm i -g @antfu/ni`
pnpm i @proj-airi/drizzle-duckdb-wasm -D
yarn i @proj-airi/drizzle-duckdb-wasm -D
npm i @proj-airi/drizzle-duckdb-wasm -D
```

```
import { drizzle } from '@proj-airi/drizzle-duckdb-wasm'

const db = drizzle('duckdb-wasm://?bundles=import-url', { schema })
const results = await db.execute('SELECT count(*)::INTEGER as v FROM generate_series(0, 100) t(v)')
console.log(results) // Output [{ v: 101 }]

// Remember to close / dispose the resources.
await db.$client.close()
```

## Packages

- [`@proj-airi/drizzle-duckdb-wasm`](https://github.com/proj-airi/duckdb-wasm/tree/main/packages/drizzle-duckdb-wasm/README.md): [Drizzle ORM](https://orm.drizzle.team/) driver for [DuckDB WASM](https://github.com/duckdb/duckdb-wasm)
- [`@proj-airi/duckdb-wasm`](https://github.com/proj-airi/duckdb-wasm/tree/main/packages/duckdb-wasm/README.md): Easy to use wrapper for [`@duckdb/duckdb-wasm`](https://github.com/duckdb/duckdb-wasm)

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
