# Plan 02: Sign Up for Printful & Get API Token

## Goal
Create a Printful account (or log in), generate an API token, and save it to `.env`.

## Steps

1. Open `https://www.printful.com/auth/login` in agent-chrome (Christian may already have an account)

2. If not logged in, check if there's a "Sign up" option and create an account:
   - Use Christian's email (check `cat ~/personal-info.txt` for details)
   - Or sign in with Google if available (easier)

3. Once logged in, navigate to the API token page:
   - Go to `https://www.printful.com/dashboard/developer/api-tokens`
   - Or: Settings → Developer → API Tokens

4. Create a new API token:
   - Name it something like "printful-cli"
   - Grant read + write access (all scopes needed: catalog, orders, files)
   - Copy the token

5. Save to `.env`:
   ```bash
   cp .env.example .env
   # Paste the token into PRINTFUL_API_TOKEN=
   ```

6. Fill in shipping address in `.env` from `cat ~/personal-info.txt`

7. Verify the token works:
   ```bash
   curl -s https://api.printful.com/stores \
     -H "Authorization: Bearer TOKEN" | head
   ```

## Notes
- Printful API tokens don't expire (unlike OAuth tokens)
- The token is scoped to a single "store" — we just need the default one
- If the developer dashboard URL has changed, search for "API" in the Printful dashboard settings
