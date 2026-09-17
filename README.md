# Duck Fashion chat test site

Standalone static website for testing the existing live Duck Fashion customer chat and reservation automation in John CRM.

**Website:** https://john-crm-ltd.github.io/duck-fashion-chat/

**Organization:** JOHN-CRM-LTD

## Publish updates

GitHub Pages publishes the root of `main` automatically. Edit `index.html`, `styles.css` or `site.js`, commit and push. No build, application server, package installation or deployment secrets are needed. `.nojekyll` keeps the files unchanged.

The repository and site are public. Keep customer records, phone numbers, database files, tunnel credentials and API tokens out of this repository. The `wc_...` value in the widget embed is a public site identifier intended for browser use, not a secret. Update it only if Duck Fashion's widget key is rotated in John CRM.

## How it connects

The page embeds `https://app.johncrm.com/widget/chat.js`. Customer messages go directly to the existing live Duck Fashion workspace. Hosting this page does not copy or replace the CRM, Knowledge Base or inventory database.

The Knowledge Base inventory integration still reads the local stock bridge through its HTTPS tunnel. Keep the inventory PC, Docker, bridge and tunnel running. A restarted temporary tunnel may require updating and retesting the existing KB integration's base URL. The web page's URL is independent of that tunnel.

Inventory is the imported 16 September 2026 snapshot. John CRM stores the reservation ledger; the original POS database remains read-only. This is a testing companion, not a production retail storefront.

## Test flow

1. Open the site and its chat button.
2. Copy the sample request, paste it into chat, then send it yourself.
3. Confirm the shop, item variant, quantity and a future pickup time within the configured test hours (Monday–Friday, 09:00–17:30 Hong Kong time).
4. The assigned manager receives a WhatsApp request. Reply `ACCEPT R-XXXXXXXX`, then `NOT SOLD R-XXXXXXXX` or `SOLD R-XXXXXXXX`, using the actual reference.

Loading the page or opening the widget does not send a customer message. Sending a message invokes normal live CRM AI processing and can notify the manager. Agent-run paid AI evaluations require specific user approval; never send test messages as part of an unattended page smoke test.

## Preview locally

With Python installed, run from this folder:

```sh
python -m http.server 4999 --bind 127.0.0.1
```

Open http://127.0.0.1:4999/ . Use HTTPS on the published site so the clipboard button can work. If clipboard access is denied, the page explains how to copy manually.

## Maintenance

- Update the sample SKU, shop and hours when the test inventory changes.
- If Duck Fashion restricts allowed widget origins, include `https://john-crm-ltd.github.io` in the workspace's External Chat settings. Preserve other approved origins.
- The page deliberately has no stock API credentials, database connection or direct manager messaging logic. Those remain managed by the existing workspace.
- Page-level smoke checks should cover desktop/mobile layout, copy feedback, the help disclosure and widget opening without sending messages.
