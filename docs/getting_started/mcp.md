---
url: https://docs.kalshi.com/getting_started/mcp
---
> ## Documentation Index
> Fetch the complete documentation index at: https://docs.kalshi.com/llms.txt
> Use this file to discover all available pages before exploring further.

# Connect to Kalshi with MCP

> Connect your AI assistant to Kalshi to explore prediction markets and perps, read your portfolio, and manage price alerts.

Kalshi's hosted connector lets your AI assistant find prediction markets and perps, read prices, market rules and orderbooks, and open markets on Kalshi. Connect your account to read your portfolio and manage price alerts.

## Connect your assistant

> [tab] Connect with ChatGPT
>
> **1. Install the Kalshi plugin**
>
> Open the [Kalshi plugin in ChatGPT](https://chatgpt.com/plugins/plugin_asdk_app_6aff19a0b84881918ec0862c8c95df5e) and select **Install plugin** if shown.
>
> **2. Choose your access**
>
> * **Use without an account** to search markets and check prices.
> * **Sign in with Kalshi** to read your portfolio or manage price alerts. Sign in to your primary Kalshi account if prompted. On **Allow access to your Kalshi account?**, check the account and permissions, then select **Authorize** to return to ChatGPT.
>
> To link an account later, open **Settings** on the Kalshi plugin page. Under **Connected accounts**, select **Connect another account**, then **Continue to Kalshi** to review and authorize access.

> [tab] Connect with server URL
>
> **1. Add a remote MCP server**
>
> In your assistant’s MCP settings or configuration file, add **Kalshi** as a remote MCP server.
>
> **2. Enter the server URL**
>
> Use the following server URL. If your assistant asks for a transport, choose **Streamable HTTP**.
>
> ```text theme={null}
> https://api.elections.kalshi.com/mcp
> ```
>
> **3. Choose your access**
>
> Public market data is available without authentication. For portfolio or price-alert tools, use **OAuth**. When prompted, sign in to your primary Kalshi account and review the requested permissions. If your assistant asks for client credentials, see [Connection help](#connection-help).
>
> **4. Save the connection**
>
> Save the configuration and enable the Kalshi tools if your assistant prompts you.

## Available tools

Tools without `perps` in their name are for prediction markets (YES/NO event contracts). Perps tools are listed separately.

### Public prediction-market tools

These tools do not require a connected account.

| Tool | What it does |
| - | - |
| `search_markets` | Finds prediction-market candidates from search terms and dates. Use the returned tickers to inspect a specific event or market. |
| `get_event_odds` | Reads the open outcomes, prices, and rules for an event. Results may cover only part of an event's outcomes. |
| `get_market` | Reads prices, rules, and status for a market ticker. Last-trade prices and bid/ask quotes are distinct. |
| `get_market_orderbook` | Reads up to 10 YES and NO bid levels per side, including contract quantities. |
| `get_market_links` | Returns verified market links or buy links with YES or NO selected. You review and submit any order on Kalshi. |

### Prediction-market portfolio tools

These tools require portfolio read permission for your connected account.

| Tool | What it does |
| - | - |
| `get_balance` | Reads your current cash and portfolio balance fields. |
| `get_positions` | Lists positions, with an optional market filter and a choice of unsettled, settled, or all positions. Defaults to unsettled; archived positions are excluded. |
| `get_orders` | Lists recent orders, optionally filtered to one market. |
| `get_fills` | Lists recent trade fills, optionally filtered to one market. |
| `get_settlements` | Lists recent settlement payouts, optionally filtered by market, event, time range, or subaccount. Archived settlements are excluded, and results are not lifetime profit and loss. |

### Perps tools

Perps tools mirror the prediction-market tools above, plus a risk tool with no prediction-market equivalent. Perps prices are dollar prices per contract, not outcome probabilities, and perps orderbooks have separate bids and asks rather than YES and NO bids.

| Tool | What it does | Permission |
| - | - | - |
| `search_perps_markets` | Finds perps by ticker or title, or browses available perps. | None |
| `get_perps_market` | Reads prices, contract size, trading status, and funding and margin details for a perp. Last-trade, bid/ask, and mark prices are distinct. | None |
| `get_perps_market_orderbook` | Reads up to 10 bid and ask levels, including contract quantities. | None |
| `get_perps_market_links` | Returns verified links to a perp with long or short selected. You choose quantity, price, and leverage and submit any order on Kalshi. | None |
| `get_perps_balance` | Reads your perps settled funds and subaccount balances. | Read portfolio |
| `get_perps_positions` | Lists open perps positions, optionally filtered by market or subaccount. Positive size is long; negative is short. | Read portfolio |
| `get_perps_orders` | Lists recent perps orders, optionally filtered by market, status, or subaccount. | Read portfolio |
| `get_perps_fills` | Lists recent perps fills, optionally filtered by subaccount. | Read portfolio |
| `get_perps_risk` | Reads account leverage and, for each open position, leverage, maintenance margin, and estimated liquidation price. Liquidation prices are estimates at the time of the read, not guarantees. | Read portfolio |

Perps portfolio tools require an eligible perps account.

### Price-alert tools

| Tool | What it does | Permission |
| - | - | - |
| `get_price_alerts` | Lists up to 100 existing price targets on your account. | Read or manage price alerts |
| `create_price_alert` | Creates or replaces a target for an open binary prediction market with a \$1 payout. Specify YES or NO, at-or-above or at-or-below, and a whole-percent threshold from 1 to 99. | Manage price alerts |
| `delete_price_alert` | Deletes an existing target identified by `get_price_alerts`. | Manage price alerts |

Confirm the market, side, and threshold before your assistant creates an alert, and the exact target before it deletes one. Creating a target can replace an existing target for the same market and direction. Alerts use your existing Kalshi notification settings.

## Permissions and disconnecting

Review the permissions on Kalshi's authorization screen before connecting:

| Permission | OAuth scope | Access |
| - | - | - |
| Read portfolio | `read::mcp_portfolio` | Read prediction-market and perps balances, positions, orders, and fills; prediction-market settlements; and perps leverage and estimated liquidation prices. |
| Read price alerts | `read::mcp_alerts` | Read existing price alerts. |
| Manage price alerts | `write::mcp_alerts` | Read, create, replace, and delete price alerts. |

The connector does not place or cancel orders, transfer funds, or save trade drafts. Market links let you continue on Kalshi to review and submit an order yourself.

To revoke an app's account access, open [Settings](https://kalshi.com/account/settings), find **Connected apps**, and select **Disconnect** for that app. Public market tools remain available without account access.

## Data and privacy

Your assistant sends Kalshi the arguments for each tool it calls, such as a search term, market ticker, or alert threshold. Account tools return the requested portfolio or alert data to your connected assistant. Kalshi records tool arguments, errors, and usage information, including the caller IP for anonymous requests and account and client identifiers for authenticated requests. Tool-call logs omit the Authorization header and tool results. Keep credentials and personal information out of all tool arguments, including search terms. You can revoke access in Connected apps.

See the [Kalshi Privacy Policy](https://kalshi.com/docs/kalshi-privacy-policy.pdf) for Kalshi’s general data practices, the [Member Agreement](https://kalshi.com/regulatory/agreement) for terms, and [Kalshi Support](https://help.kalshi.com/en/) for help.

### Data retention

How long Kalshi retains personal information depends on the type of record, the purpose it serves, and applicable legal and regulatory requirements.

For connector logs, Kalshi considers how long the information is needed to troubleshoot tool calls, investigate security incidents, and meet audit or recordkeeping obligations. An investigation or a legal obligation to preserve records may extend retention.

Disconnecting the assistant revokes its access to your account. Kalshi retains certain account records after deactivation for identity verification, security, and regulatory recordkeeping. See [Deleting your account](https://help.kalshi.com/en/articles/13823774-deactivating-reactivating) for details.

## Connection help

**I can search markets, but cannot read my account.** Complete the OAuth connection and approve the permission needed by the tool. If you previously disconnected the app, connect it again.

**My app asks for a client ID or client secret, or reports a client-registration error.** Account access requires an app that supports OAuth Client ID Metadata Documents (CIMD), or an OAuth client already registered with Kalshi. Automatic dynamic client registration is not advertised. Use your integration's registered credentials if provided; your Kalshi API key is not an OAuth client secret.

**Kalshi says my account cannot connect.** Sign in with your primary account and complete account setup, then restart the connection from your app.

**An alert cannot be created.** Check that the market is open, binary, and has a \$1 payout, and that the threshold is a whole percentage from 1 to 99. If you have reached the account's 100-target limit, remove an existing target before adding another.


This documentation is built and hosted on [Mintlify](https://mintlify.com), a developer documentation platform.