# Plan 04: Price Estimates

## Goal
Implement `printful-cli estimate` to get shipping + product cost before ordering.

## Context
- Printful shipping rates endpoint: `POST /shipping/rates`
- Or use the order estimate endpoint: `POST /orders/estimate`
- Needs: variant ID, file URL (or mock), and shipping address

## Steps

1. Create `src/commands/estimate.ts`:

2. **`estimate --variant <id> --file <path>`**:
   - Upload the design file first (reuse file upload logic from plan 05, or stub it)
   - Actually: use `POST /orders/estimate` which accepts the same body as creating an order but just returns pricing
   - Request body:
     ```json
     {
       "recipient": { ...shipping address from config... },
       "items": [{
         "variant_id": <id>,
         "quantity": 1,
         "files": [{ "url": "<uploaded_file_url>" }]
       }]
     }
     ```
   - Display: item cost, shipping cost, tax, total
   - Support `--quantity <n>` (default 1)

3. To avoid requiring file upload just for estimates, also support `--variant-only` mode:
   - Just show the catalog variant price without shipping
   - Useful for quick price checks

4. Wire up in `src/cli.ts`

5. Verify:
   ```bash
   npx tsx src/cli.ts estimate --variant 10739 --file test-design.png
   npx tsc --noEmit
   ```

6. `git add -A && git commit -m "estimate: price + shipping estimates"`

## Files Created/Modified
- `src/commands/estimate.ts` (new)
- `src/cli.ts` (modified)

## Dependencies
- Needs file upload working (plan 05) — implement that first, or implement together
