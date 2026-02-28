# printful-cli

Order custom print-on-demand products (t-shirts, posters, etc.) via Printful API.

## Commands

```bash
printful-cli catalog search "bella canvas"                    # Search products
printful-cli catalog variants 71                              # List variants for product (71 = Bella Canvas 3001)
printful-cli catalog variants 71 --color black --size 2XL     # Filter variants
printful-cli estimate --variant 10739 --file design.png       # Price estimate
printful-cli estimate --variant 10739 --file design.png --quantity 5  # Bulk estimate
printful-cli order --variant 10739 --file design.png          # Show estimate (no order placed)
printful-cli order --variant 10739 --file design.png --confirm  # Actually place order
printful-cli orders list                                      # List orders
printful-cli orders list --status pending                     # Filter by status
printful-cli orders status 12345                              # Order status + tracking
```

## Examples

```bash
# Find Bella Canvas 3001 XXL Black
printful-cli catalog search "bella canvas 3001"
printful-cli catalog variants 71 --color black --size 2XL

# Get price estimate
printful-cli estimate --variant 10739 --file ~/designs/cool-shirt.png

# Order a shirt with a design (without --confirm shows estimate only)
printful-cli order --variant 10739 --file ~/designs/cool-shirt.png --confirm
```

## Output

JSON envelope: `{"ok": true, "data": {...}}` or `{"ok": false, "error": "..."}`.

Requires `.env` with `PRINTFUL_API_TOKEN`, `PRINTFUL_STORE_ID`, `PRINTFUL_SHIP_*`. See `.env.example`.
