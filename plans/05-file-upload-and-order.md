# Plan 05: File Upload & Order Placement

## Goal
Implement file upload and `printful-cli order` to place real orders.

## Context
- File upload: `POST /files` with multipart form data (the design PNG)
- Create order: `POST /orders` with variant, file reference, and shipping address
- Docs: https://developers.printful.com/docs/#tag/File-Library-API
- Docs: https://developers.printful.com/docs/#tag/Orders-API

## Steps

1. Create `src/commands/files.ts`:
   - Export `uploadFile(filePath: string)` function
   - Read file from disk
   - `POST /files` with multipart form data: `file` field = file buffer, `type` = "default"
   - Return the file object (id, url, preview_url, etc.)
   - Printful processes files async — poll `GET /files/<id>` until status is "ok"
   - Timeout after 60s with clear error

2. Create `src/commands/order.ts`:

3. **`order --variant <id> --file <path>`**:
   - Upload the design file via `uploadFile()`
   - Build order body:
     ```json
     {
       "recipient": { ...from config... },
       "items": [{
         "variant_id": <id>,
         "quantity": 1,
         "files": [{
           "type": "default",
           "url": "<uploaded_file_url>"
         }]
       }]
     }
     ```
   - Without `--confirm`: use `POST /orders/estimate` and display pricing, then exit with "Add --confirm to place this order"
   - With `--confirm`: use `POST /orders` to actually place the order
   - Display: order ID, status, items, costs, estimated delivery
   - Support `--quantity <n>` (default 1)

4. Wire up in `src/cli.ts`

5. Verify:
   ```bash
   # Test with a real design PNG
   npx tsx src/cli.ts order --variant 10739 --file ~/designs/test.png
   # Should show estimate without --confirm
   npx tsc --noEmit
   ```

6. `git add -A && git commit -m "order: file upload + order placement"`

## Files Created/Modified
- `src/commands/files.ts` (new)
- `src/commands/order.ts` (new)  
- `src/cli.ts` (modified)

## Notes
- File upload accepts PNG, JPG, SVG — validate extension before uploading
- Design should be at least 150 DPI at print size (warn if dimensions seem too small)
- The `type` field in the files array maps to print placement: "default" = front, "back" = back
- Consider supporting `--placement back` in future
