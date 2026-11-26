---
url: https://docs.kalshi.com/margin/price-banding
---
> ## Documentation Index
> Fetch the complete documentation index at: https://docs.kalshi.com/llms.txt
> Use this file to discover all available pages before exploring further.

# Price Banding

> How price banding works for Kalshi margin markets

For perpetual markets, prices move in ticks of the market's `tick_size`, `0.0001` dollars unless the market says otherwise. Price banding limits how far from the market an order may be priced, and an order must satisfy every band in force.

Band widths are set per market and per asset class. The widths on this page are the defaults; the exchange can widen or narrow them for a market without notice.

**Book band**

Anchored on the opposite side's best price. A bid must be at most the higher of twice the best ask or 1,000 ticks above the best ask. An ask must be at least the lower of half the best bid or 1,000 ticks below the best bid. When the opposite side is empty, the band anchors on the underlying's recent reference price instead, scaled by contract size and underlying multiplier, and imposes no limit without one.

**Fair-value band**

Applies to US equities. Anchored on an external reference price for the underlying, such as the national best bid and offer (NBBO) and Pyth. Starting ten minutes, by default, after the market first shows a bid and an offer within 10% of each other alongside the reference price, and whenever it has both a bid and an offer, the anchor is the middle of three prices: a price from the market's own book, the reference price, and the reference price plus a moving average of the gap between the book's midpoint and the reference price. If the book has only one side, or has had no trade and no order placed, changed or canceled for five minutes, the reference price alone is the anchor. Around either anchor the band is 5% wide. When no recent reference price is available, the band anchors on a 30-second moving average of the market's own book price instead. Around that anchor the band is 8% wide, or 25% for the first ten minutes, by default, after the book first shows a price. The book price is the middle of the last trade, the best bid and the best offer, or of whichever of them exist. After a stock split or a mark adjustment, a positive adjusted mark counts as the last trade; a split whose adjusted mark rounds to zero clears the previous price instead. A market with no trade, no adjusted mark and neither a bid nor an offer has no book price, and with no recent reference price it has no fair-value band. When a price returns to such a market, from a quote or from an adjusted mark, its moving average starts over, so the 25% width applies again for the first ten minutes, by default. An immediate-or-cancel or fill-or-kill order may cross the market 2.4 times as far: up to 12% from the reference-based anchor, 19.2% from the book-based anchor, or 60% in those first ten minutes.

**Overnight settlement band**

For US equities during the overnight session (8 PM to 4 AM ET, on nights before a trading day), every order must be priced within 20% of the market's 4 PM ET settlement price from the day the session opened, whichever side it is on and whether or not it would trade. A market without that day's settlement price has no overnight band until the price arrives, and a stock split rebases the settlement price onto post-split prices. While the band applies, the fair-value band never limits a bid below the band's floor or an ask above its cap, so the market can always trade at the band's limits. When the band takes effect or moves, resting orders priced outside it are canceled.

**Notes**

* Unless the opposite side is empty, the book band limits only orders that cross the market. The fair-value band limits how high a bid and how low an ask may be; it never rejects a bid below it or an ask above it.
* Resting orders are not canceled when the book or fair-value bands move. The overnight settlement band cancels resting orders outside it when it takes effect or moves.
* Order amends outside any band are not allowed.
* Orders and amends outside any band are rejected with HTTP `400` and error code `invalid_price` (message `invalid price`). A price that is zero or not on the market's tick returns the same code, so check the price against `tick_size` before assuming a band rejected it.
* An amend is checked at the resting-order width; the wider immediate-or-cancel and fill-or-kill allowance applies to new orders only. An amend that only raises the quantity is checked too, at the order's current price.
* Liquidations and fired exit triggers are placed by the exchange and must be able to cross a thin book, so they are not subject to the book band. They remain subject to the fair-value and overnight settlement bands.


This documentation is built and hosted on [Mintlify](https://mintlify.com), a developer documentation platform.