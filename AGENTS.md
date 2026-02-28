# printful-cli

Order custom print-on-demand products (t-shirts, posters, etc.) via Printful API.

## Commands

```bash
printful-cli catalog search "bella canvas"                    # Search products
printful-cli catalog variants 586                             # List variants for product
printful-cli catalog variants 586 --color black --size 2XL    # Filter variants
printful-cli estimate --variant 10739 --file design.png       # Price estimate
printful-cli order --variant 10739 --file design.png          # Place order
printful-cli order --variant 10739 --file design.png --confirm  # Skip confirmation
printful-cli orders                                           # List orders
printful-cli orders status 12345                              # Order status
```

## Examples

```bash
# Find Bella Canvas 3001 XXL Black
printful-cli catalog search "bella canvas 3001"
printful-cli catalog variants 586 --color black --size 2XL

# Order a shirt with a design
printful-cli order --variant 10739 --file ~/designs/cool-shirt.png --confirm
```

## Output

JSON envelope: `{"ok": true, "data": {...}}` or `{"ok": false, "error": "..."}`.

Requires `.env` with `PRINTFUL_API_TOKEN`, `PRINTFUL_SHIP_*`. See `.env.example`.
