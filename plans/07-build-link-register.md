# Plan 07: Build, Link, and Register

## Goal
Final polish: build, npm link, create GitHub repo, register in sync.sh and ~/tools/AGENTS.md.

## Steps

1. Build and link:
   ```bash
   cd ~/tools/printful-cli
   npm run build
   npm link
   printful-cli --help    # Verify globally callable
   ```

2. Test end-to-end (if API key is set up):
   ```bash
   printful-cli catalog search "bella canvas 3001"
   printful-cli catalog variants <PRODUCT_ID> --color black --size 2XL
   ```

3. Create GitHub repo:
   ```bash
   cd ~/tools/printful-cli
   gh repo create christiangenco/printful-cli --public --source=. --push
   ```

4. Add to `~/tools/sync.sh`:
   - Add to REPOS array: `"printful-cli|https://github.com/christiangenco/printful-cli.git|main"`
   - Add to CRED_FILES (has its own .env): `"printful-cli/.env"`
   - Add to npmdir loop in cmd_clone()

5. Add to `~/tools/AGENTS.md`:
   - Add row to tool index: `| [printful-cli](printful-cli/) | Order custom print-on-demand products via Printful API |`

6. Final commit:
   ```bash
   git add -A && git commit -m "polish: README, AGENTS.md, ready for npm link"
   git push
   ```

## Verification
```bash
printful-cli --help                           # Globally callable
git -C ~/tools/printful-cli log --oneline     # Has commits
grep printful-cli ~/tools/sync.sh             # In sync script
grep printful-cli ~/tools/AGENTS.md           # In tool index
```
