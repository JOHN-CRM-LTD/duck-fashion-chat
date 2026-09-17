# Duck Fashion

Standalone static website for Duck Fashion. The **Home** view is an editorial fashion storefront (Autumn/Winter 2026 — The Urban Pond). The **Test** view holds the live customer chat and reservation testing workspace for John CRM.

**Website:** https://duck.johncrm.com/

**Organization:** JOHN-CRM-LTD

## Structure

- `index.html` — both views in one page. Hash routing switches them: `#home` (default) and `#test`.
- `styles.css` — editorial design system. Brand palette: white `#FFFFFF`, burgundy `#A21341`, black `#111111`, soft grey `#F5F5F5`.
- `site.js` — view routing, header behaviour, scroll reveals, parallax, toast, copy button, newsletter feedback.
- `images/` — collection photography (`look-01` … `look-06`, 4:5 portrait JPEGs).
- `fonts/` — self-hosted variable fonts (Bodoni Moda + Archivo), so the CSP keeps blocking third-party font CDNs.

## Publish updates

GitHub Pages publishes the root of `main` automatically. Edit, commit and push. No build, application server, package installation or deployment secrets are needed. `.nojekyll` keeps the files unchanged.

Keep the root `CNAME` file containing `duck.johncrm.com` in future deployments. GitHub Pages has this custom domain configured with HTTPS enforced; its DNS CNAME points to `john-crm-ltd.github.io`.

The repository and site are public. Keep customer records, phone numbers, database files, tunnel credentials and API tokens out of this repository. The `wc_...` value in the widget embed is a public site identifier intended for browser use, not a secret. Update it only if Duck Fashion's widget key is rotated in John CRM.

## Swapping photography

Replace the files in `images/` (keep the `look-0N.jpg` names, 4:5 portrait, ~1400px wide) or update the `<img>` tags in `index.html`. Alts and product names (N° 01–06, HK$ prices) live in the collection grid markup.

## How it connects

Both views embed `https://app.johncrm.com/widget/chat.js`. Customer messages go directly to the existing live Duck Fashion workspace. Hosting this page does not copy or replace the CRM, Knowledge Base or inventory database.

The Knowledge Base inventory integration still reads the local stock bridge through its HTTPS tunnel. Keep the inventory PC, Docker, bridge and tunnel running. A restarted temporary tunnel may require updating and retesting the existing KB integration's base URL. The web page's URL is independent of that tunnel.

Inventory is the imported 16 September 2026 snapshot. John CRM stores the reservation ledger; the original POS database remains read-only. The storefront is a visual front; the Test page is the testing companion, not a production retail checkout.

## Test flow

1. Open the site, switch to **Test** and open its chat button.
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

- Update the sample SKU, shop and hours on the Test view when the test inventory changes.
- If Duck Fashion restricts allowed widget origins, include `https://duck.johncrm.com` in the workspace's External Chat settings. Preserve other approved origins.
- The page deliberately has no stock API credentials, database connection or direct manager messaging logic. Those remain managed by the existing workspace.
- Page-level smoke checks should cover desktop/mobile layout of both views, view switching, copy feedback, the help disclosure and widget opening without sending messages.
