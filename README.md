# business.deal.io

Browser-based starter for an original Deal-style property card game.

## Run locally

```bash
cd "/Users/fanishchandrakar/Repo/business.deal.io"
python3 -m http.server 8080
```

Open `http://localhost:8080`.

## Test

```bash
cd "/Users/fanishchandrakar/Repo/business.deal.io"
npm install
npm run test -- tests/rules.spec.js
```

## Deploy on Vercel

Use Node via `nvm` first, then run build and production deploy:

```bash
export NVM_DIR="$HOME/.nvm"
. "$NVM_DIR/nvm.sh"
cd "/Users/fanishchandrakar/Repo/business.deal.io"
npx vercel build
npx vercel --prod
```

If this is your first deploy in this folder, log in and link/pull project settings before build/deploy:

```bash
npx vercel login
npx vercel link
npx vercel pull --yes --environment preview
```

## Current gameplay loop

- Draw 2 cards per turn
- Play up to 3 cards per turn
- Build color sets in your tableau
- First player to complete 3 full sets wins

This is an original prototype inspired by set-collection card mechanics, not official Monopoly Deal content.

## v1 Prototype Release

- Added deck catalog extraction and reusable game state modules.
- Added bank and debt resolution mechanics with action card pipeline (`Debt Collector`, `Rent`).
- Added CPU play-priority policy module and integration path.
- Added runtime UI status lines for bank, debt, and action state updates.
- Added automated tests for rules, action flow, and AI behavior.
- Added Vercel configuration and production deployment workflow.

## Verification checkpoint

- Automated checks: `npm run test` passed.
- Deployment checks: `npx vercel build` and `npx vercel --prod` completed successfully.
