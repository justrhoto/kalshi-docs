---
url: https://docs.kalshi.com/margin/decimal-order-entry
---
> ## Documentation Index
> Fetch the complete documentation index at: https://docs.kalshi.com/llms.txt
> Use this file to discover all available pages before exploring further.

# Perps Decimal Order Entry

> Decimal contract quantities, API precision, and rollout dates by perpetual market ticker.

Decimal quantities can produce dollar amounts that require more than 4 decimal places. For example, 0.01 contracts at \$0.1234 per contract produces \$0.001234 before fees. Affected balances and cash-flow amounts will support up to 6 decimal places in USD. Preserve this precision in calculations and reconciliation.

## Trading, Settlement, and Funding

* **Trading** — On markets with decimal order entry, a whole-contract order can receive a fill with a decimal quantity, such as 0.25 contracts.
* **Settlement** — Combined with sub-cent pricing, decimal quantities can produce settlement amounts with 6 decimal places.
* **Funding** — Funding amounts will also support 6 decimal places.

## API Changes

The Perps REST API already uses fixed-point strings for contract quantities and retains its existing dollar field names. Support up to 6 decimal places for margin balances, PnL, funding, notional, and settlement amounts.

The Clearing Member API adds `_fp` dollar strings alongside selected integer `_centicents` fields.

For example, a Clearing Member response can include both representations of the same amount:

```json theme={null}
{
  "balance_available_centicents": 123456,
  "balance_available_fp": "12.345600"
}
```

The Clearing Member API's legacy integer-centicent fields with `_fp` counterparts will be deprecated soon. Migrate to the `_fp` fields to preserve full precision.

FIX trade quantities are already represented as decimals. On markets with decimal order entry, the existing FIX quantity fields accept decimal order quantities and report decimal fill quantities.

Margin requirements, fees, and notional risk limits are unchanged.

## Rollout Timeline

The schedule covers markets active as of November 25, 2026.

| Category | Date | Tickers |
| - | - | - |
| Initial SSPs Launch | November 23, 2026 | `KXADPPERP`, `KXANTPERP`, `KXAPPPERP`, `KXETNPERP`, `KXMARPERP`, `KXMRVLPERP`, `KXSTXPERP`, `KXUBERPERP`, `KXWDCPERP` |
| Primary Equities Rollout | November 27, 2026 at 10:00 a.m. ET | `KXAAPLPERP`, `KXABBVPERP`, `KXADBEPERP`, `KXAMATPERP`, `KXAMDPERP`, `KXAMGNPERP`, `KXAMZNPERP`, `KXAVGOPERP`, `KXBABAPERP`, `KXBACPERP`, `KXBAPERP`, `KXBKNGPERP`, `KXBRKBPERP`, `KXCATPERP`, `KXCOPPERP`, `KXCOSTPERP`, `KXCRMPERP`, `KXCSCOPERP`, `KXCVXPERP`, `KXDISPERP`, `KXGOOGLPERP`, `KXHDPERP`, `KXIBMPERP`, `KXINTCPERP`, `KXJNJPERP`, `KXJPMPERP`, `KXKOPERP`, `KXLLYPERP`, `KXLMTPERP`, `KXMAPERP`, `KXMCDPERP`, `KXMETAPERP`, `KXMRKPERP`, `KXMSFTPERP`, `KXMUPERP`, `KXNEMPERP`, `KXNFLXPERP`, `KXNVDAPERP`, `KXORCLPERP`, `KXPANWPERP`, `KXPEPPERP`, `KXPFEPERP`, `KXPGPERP`, `KXPLDPERP`, `KXPLTRPERP`, `KXQCOMPERP`, `KXQQQPERP`, `KXSBUXPERP`, `KXSNDKPERP`, `KXSPCXPERP`, `KXSPYPERP`, `KXTSLAPERP`, `KXTXNPERP`, `KXUNHPERP`, `KXVPERP`, `KXVZPERP`, `KXWMTPERP`, `KXXOMPERP` |
| Trailing Equities Rollout | December 10, 2026 | `KXABTPERP`, `KXACNPERP`, `KXADIPERP`, `KXANETPERP`, `KXAPHPERP`, `KXARMPERP`, `KXASMLPERP`, `KXAXPPERP`, `KXBLKPERP`, `KXCPERP`, `KXCRWDPERP`, `KXDEPERP`, `KXDELLPERP`, `KXDHRPERP`, `KXGEPERP`, `KXGEVPERP`, `KXGILDPERP`, `KXGSPERP`, `KXISRGPERP`, `KXKLACPERP`, `KXLINPERP`, `KXLRCXPERP`, `KXMSPERP`, `KXNEEPERP`, `KXPMPERP`, `KXRTXPERP`, `KXSCHWPERP`, `KXSHOPPERP`, `KXSKHYPERP`, `KXTJXPERP`, `KXTMOPERP`, `KXTMUSPERP`, `KXTSMPERP`, `KXUNPPERP`, `KXWELLPERP`, `KXWFCPERP` |
| Metals | December 10, 2026 | `KXALUMINUMPERP`, `KXCOPPERPERP`, `KXGOLDPERP`, `KXPALLADIUMPERP`, `KXPLATINUMPERP`, `KXSILVERPERP` |
| Energy | December 10, 2026 | `KXBRENTFUTURE`, `KXHHGASFUTURE`, `KXWTIFUTURE` |
| Indices | December 10, 2026 | `KXUS2000PERP`, `KXUS500PERP`, `KXUSTECH100PERP` |
| Crypto | December 17, 2026 | `KXAAVEPERP`, `KXADAPERP`, `KXBCHPERP`, `KXBNBPERP`, `KXBTCPERP`, `KXDOGEPERP`, `KXETHPERP`, `KXHYPEPERP`, `KXKSHIBPERP`, `KXLINKPERP`, `KXLTCPERP`, `KXNEARPERP`, `KXSOLPERP`, `KXSUIPERP`, `KXUNIPERP`, `KXVVVPERP`, `KXWLDPERP`, `KXXRPPERP`, `KXZECPERP` |


This documentation is built and hosted on [Mintlify](https://mintlify.com), a developer documentation platform.