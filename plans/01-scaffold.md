# Plan 01: Project Scaffold

## Goal
Set up the project skeleton and verify it compiles and runs.

## Steps

1. `cd ~/tools/printful-cli && npm install`

2. Create `src/config.ts`:
   - Load dotenv
   - Export `getConfig()` that reads and validates `PRINTFUL_API_TOKEN`
   - Export `getShippingAddress()` that reads `PRINTFUL_SHIP_*` vars and returns an address object
   - Throw clear errors if required vars are missing

3. Create `src/api.ts`:
   - Export `printfulFetch(method, path, body?)` helper
   - Base URL: `https://api.printful.com`
   - Auth: `Authorization: Bearer <token>`
   - Returns parsed JSON
   - Throws on non-2xx with error message from response body

4. Create `src/output.ts`:
   - Export `ok(data)` → `console.log(JSON.stringify({ok: true, data}))`
   - Export `fail(error, code?)` → `console.error(JSON.stringify({ok: false, error, code})); process.exit(1)`

5. Create `src/cli.ts`:
   - Import Commander, set name("printful-cli"), description, version("0.1.0")
   - No subcommands yet — just the shell
   - `program.parse()`

6. Make bin executable: `chmod +x bin/printful-cli.js`

7. Verify:
   ```bash
   npx tsx src/cli.ts --help        # exits 0, prints help
   npx tsc --noEmit                 # exits 0
   ```

8. `git init && git add -A && git commit -m "scaffold: package.json, tsconfig, CLI shell, config, api helper"`

## Files Created
- `src/cli.ts`
- `src/config.ts`
- `src/api.ts`
- `src/output.ts`
