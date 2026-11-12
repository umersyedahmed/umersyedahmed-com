# Hosted checkout

The site does not collect card numbers and does not load a payment SDK. In test or live mode, the order-review button sends the visitor to a hosted payment link for the first payment, which is due when the plan is purchased. The remaining 50% is an invoice from the same provider at launch, not a second link on this site.

If `VITE_CHECKOUT_MODE` is missing or `demo`, or either deposit URL is missing or not on an allowed host, the button stays **Complete demo checkout** and nothing is charged.

Allowed hosts (https only): `buy.stripe.com`, `checkout.stripe.com`, `square.link`, `checkout.square.site`.

## Create the two first-payment links

Make the links in the provider’s test or sandbox environment first. Each link is a one-time charge:

- Simpler plan first payment: **$499.50** (50% of $999), due when purchased
- More advanced plan first payment: **$999.50** (50% of $1,999), due when purchased

After payment, send the buyer to `https://<site>/checkout/success?plan=simpler` or `https://<site>/checkout/success?plan=advanced`. If the provider asks for a cancel URL, use `https://<site>/checkout/cancel`. Netlify serves `checkout/success.html` and `checkout/cancel.html` at those paths.

**Stripe.** In the Dashboard, turn on Test mode. Create two Payment Links for the amounts above. Set the Simpler link’s after-payment redirect to `https://<site>/checkout/success?plan=simpler` and the More advanced link’s to `https://<site>/checkout/success?plan=advanced`. If you use a Checkout Session instead, use those as `success_url` and set `cancel_url` to `https://<site>/checkout/cancel`. Test-mode link URLs look like `https://buy.stripe.com/...`. The remaining 50% is a Stripe Invoice when the site is ready to launch.

**Square.** In the Square Dashboard sandbox, create two payment links for the same amounts. Copy the hosted URLs (`https://square.link/...` or `https://checkout.square.site/...`). Point the link’s confirmation or redirect to the success URL when Square offers that setting. The remaining 50% is a Square invoice when the site is ready to launch.

## Netlify environment variables

Set these on each Netlify site (Site configuration → Environment variables), then start a new deploy. Vite reads them at build time. Do not put secret keys in these variables. No publishable key is required.

| Name | Test or sandbox site | Live site |
| --- | --- | --- |
| `VITE_CHECKOUT_MODE` | `test` | `live` |
| `VITE_CHECKOUT_URL_SIMPLER_DEPOSIT` | Simpler test link | Simpler live link |
| `VITE_CHECKOUT_URL_ADVANCED_DEPOSIT` | Advanced test link | Advanced live link |

Leave the mode unset, or set it to `demo`, on any preview that should not open a payment page.

In test mode the page says to use the provider’s test card. That card does not charge a real card.

When the test payment looks right, create the same two links in the provider’s live environment, set `VITE_CHECKOUT_MODE` to `live` with the live URLs, and redeploy.
