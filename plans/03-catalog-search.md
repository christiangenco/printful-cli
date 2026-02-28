# Plan 03: Catalog Search & Variants

## Goal
Implement `printful-cli catalog search` and `printful-cli catalog variants` commands.

## Context
- Printful API v2 catalog endpoint: `GET /v2/catalog-products` (with search/filter params)
- Variants endpoint: `GET /v2/catalog-products/{id}/catalog-variants`
- Docs: https://developers.printful.com/docs/

## Steps

1. Create `src/commands/catalog.ts`:

2. **`catalog search <query>`**:
   - `GET /v2/catalog-products?search=<query>`
   - Display: product ID, name, type, available colors/sizes count
   - Support `--limit` flag (default 20)

3. **`catalog variants <product_id>`**:
   - `GET /v2/catalog-products/<id>/catalog-variants`
   - Display: variant ID, name, color, size, price
   - Support `--color <color>` filter (case-insensitive substring match)
   - Support `--size <size>` filter (exact or substring match)
   - When both filters provided, AND them together

4. Wire up in `src/cli.ts`:
   - Add `catalog` command group with `search` and `variants` subcommands

5. Verify:
   ```bash
   npx tsx src/cli.ts catalog search "bella canvas"
   npx tsx src/cli.ts catalog variants 586
   npx tsx src/cli.ts catalog variants 586 --color black --size 2XL
   npx tsc --noEmit
   ```

6. `git add -A && git commit -m "catalog: search products and list variants"`

## Files Created/Modified
- `src/commands/catalog.ts` (new)
- `src/cli.ts` (modified)

## Notes
- The Printful v2 API may paginate results — handle `paging` in response
- Product IDs are stable and can be hardcoded once discovered (e.g., Bella Canvas 3001 = product 586)
- Check if v2 endpoints need a store ID header — if so, add `X-PF-Store-Id` from config
