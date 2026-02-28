# printful-cli

CLI for ordering custom print-on-demand products (t-shirts, etc.) via the Printful API.

## Prerequisites

- Node.js 18+
- Printful account with API token

## Setup

```bash
cd ~/tools/printful-cli
npm install
cp .env.example .env
# Fill in PRINTFUL_API_TOKEN and shipping address
npm run build
npm link
```

### Getting an API Token

1. Log in at [printful.com](https://www.printful.com)
2. Go to Settings → Developer → API Tokens
3. Create a new token with read/write access
4. Paste into `.env`

## Commands

```bash
# Browse catalog
printful-cli catalog search "bella canvas"         # Search products
printful-cli catalog variants <product_id>          # List variants (sizes/colors)
printful-cli catalog variants <id> --color black --size 2XL  # Filter variants

# Estimate pricing
printful-cli estimate --variant <variant_id> --file design.png

# Place orders
printful-cli order --variant <variant_id> --file design.png
printful-cli order --variant <variant_id> --file design.png --confirm  # Skip confirmation

# Manage orders
printful-cli orders                                 # List recent orders
printful-cli orders status <order_id>               # Check order status
```

## How It Works

Uses the [Printful API v2](https://developers.printful.com/docs/) (REST, Bearer token auth).

1. **Catalog**: Browse products and variants to find the right blank + size + color
2. **File upload**: Design PNGs are uploaded via the File API
3. **Order**: Creates an order with the uploaded file mapped to the product variant
4. **Fulfillment**: Printful prints and ships directly to the shipping address in `.env`

## Output

All commands output JSON to stdout:

```json
{"ok": true, "data": { ... }}
{"ok": false, "error": "message"}
```
