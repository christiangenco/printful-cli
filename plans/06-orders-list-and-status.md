# Plan 06: Orders List & Status

## Goal
Implement `printful-cli orders` and `printful-cli orders status <id>` to manage existing orders.

## Context
- List orders: `GET /orders`
- Get order: `GET /orders/<id>`

## Steps

1. Create `src/commands/orders.ts`:

2. **`orders`** (list):
   - `GET /orders` with `?limit=20`
   - Display: order ID, status, items summary, total cost, created date
   - Support `--limit <n>` and `--offset <n>`

3. **`orders status <order_id>`**:
   - `GET /orders/<id>`
   - Display: full order details — status, items (variant, quantity, file), shipping info, tracking (if shipped), costs breakdown, dates

4. Wire up in `src/cli.ts`

5. Verify:
   ```bash
   npx tsx src/cli.ts orders
   npx tsx src/cli.ts orders status 12345  # Will 404 if no orders yet, that's fine
   npx tsc --noEmit
   ```

6. `git add -A && git commit -m "orders: list and status commands"`

## Files Created/Modified
- `src/commands/orders.ts` (new)
- `src/cli.ts` (modified)
