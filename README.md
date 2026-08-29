# Sam's Pokémon Restock Radar

Personal background monitor for Pokémon products at Pokémon Center, Target, Walmart, Best Buy, and GameStop. GitHub Actions checks every five minutes and sends an iPhone push notification through ntfy when likely availability appears.

The repository also includes Sam's mobile-friendly Little Pokédex. It shows the Top 5 chase pulls for every tracked booster expansion, including card art, card number, rarity, and an approximate raw market value. It reads the monitor's latest `state.json` and displays each store's most recent status and check time.

## What it watches

- Pitch Black
- Chaos Rising
- Ascended Heroes
- Phantasmal Flames
- Perfect Order
- Poké Pad
- Surging Sparks
- Prismatic Evolutions
- Pokémon Center exclusive ETBs and new arrivals

## Setup

1. Install ntfy on the iPhone and subscribe to the private topic configured in this repository's `NTFY_TOPIC` Actions secret.
2. Open **Actions**, select **Pokémon restock alerts**, and choose **Run workflow** to establish the first baseline.
3. Add exact product pages to `monitors.json` whenever possible. Search-result monitors are broader and can produce occasional false positives.

## Honest limitations

Retailers can change their pages or block automated requests. This monitor does not bypass store protections and never auto-purchases. An alert means “check now,” not guaranteed inventory. Exact product pages are more reliable than search pages.
