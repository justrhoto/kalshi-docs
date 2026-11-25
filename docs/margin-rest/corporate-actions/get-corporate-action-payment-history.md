---
url: https://docs.kalshi.com/margin-rest/corporate-actions/get-corporate-action-payment-history
---
> ## Documentation Index
> Fetch the complete documentation index at: https://docs.kalshi.com/llms.txt
> Use this file to discover all available pages before exploring further.

# Get Corporate Action Payment History

> Endpoint for retrieving the cash the authenticated user received or paid for corporate actions (cash dividends, special dividends and cash spin-offs) for a specific market, or across all markets when ticker is empty, over an inclusive UTC date range. Each entry includes the gross payment, the amount withheld, and the position used to compute the payment. Stock split adjustments are not included.



## OpenAPI

````yaml /perps_openapi.yaml get /margin/corporate_action_payment_history
openapi: 3.0.0
info:
  title: Kalshi Trade API Manual Endpoints
  version: 0.0.1
  description: >-
    Manually defined OpenAPI spec for endpoints being migrated to spec-first
    approach
servers:
  - url: https://external-api.kalshi.com/trade-api/v2
    description: Production perps REST API server
  - url: https://external-api.demo.kalshi.co/trade-api/v2
    description: Demo perps REST API server
security: []
tags:
  - name: account
    description: Account information endpoints
  - name: fcm
    description: FCM member specific endpoints
  - name: exchange
    description: Exchange status and information endpoints
  - name: market
    description: Market data endpoints
  - name: orders
    description: Order management endpoints
  - name: order-groups
    description: Order group management endpoints
  - name: portfolio
    description: Portfolio and balance information endpoints
  - name: risk
    description: Margin risk metrics, parameters, and limits
  - name: funding
    description: Funding rates and payment history
  - name: fees
    description: Margin fee schedule
  - name: exit-triggers
    description: Stop-loss, take-profit, and trailing-stop triggers on margin positions
paths:
  /margin/corporate_action_payment_history:
    get:
      tags:
        - corporate-actions
      summary: Get Corporate Action Payment History
      description: >-
        Endpoint for retrieving the cash the authenticated user received or paid
        for corporate actions (cash dividends, special dividends and cash
        spin-offs) for a specific market, or across all markets when ticker is
        empty, over an inclusive UTC date range. Each entry includes the gross
        payment, the amount withheld, and the position used to compute the
        payment. Stock split adjustments are not included.
      operationId: GetMarginCorporateActionPaymentHistory
      parameters:
        - name: ticker
          in: query
          required: false
          description: >-
            Market ticker for payment history. Leave empty to query across all
            markets.
          schema:
            type: string
            x-go-type-skip-optional-pointer: true
        - name: start_date
          in: query
          required: true
          description: >-
            Inclusive UTC start date for the payment time range (YYYY-MM-DD
            format)
          schema:
            type: string
            format: date
            x-go-type-skip-optional-pointer: true
            x-oapi-codegen-extra-tags:
              validate: required
        - name: end_date
          in: query
          required: true
          description: >-
            Inclusive UTC end date for the payment time range (YYYY-MM-DD
            format)
          schema:
            type: string
            format: date
            x-go-type-skip-optional-pointer: true
            x-oapi-codegen-extra-tags:
              validate: required
        - name: subaccount
          in: query
          required: false
          description: >-
            Subaccount number (0 for primary, 1-63 for subaccounts). If omitted,
            defaults to all subaccounts. Subaccount-restricted API keys must
            omit this or pass their locked subaccount, and read only that
            subaccount's payments.
          schema:
            type: integer
      responses:
        '200':
          description: Corporate action payment history retrieved successfully
          content:
            application/json:
              schema:
                $ref: >-
                  #/components/schemas/GetMarginCorporateActionPaymentHistoryResponse
        '400':
          $ref: '#/components/responses/BadRequestError'
        '401':
          $ref: '#/components/responses/UnauthorizedError'
        '403':
          $ref: '#/components/responses/ForbiddenError'
        '500':
          $ref: '#/components/responses/InternalServerError'
      security:
        - kalshiAccessKey: []
          kalshiAccessSignature: []
          kalshiAccessTimestamp: []
components:
  schemas:
    GetMarginCorporateActionPaymentHistoryResponse:
      type: object
      required:
        - payment_history
      properties:
        payment_history:
          type: array
          items:
            $ref: '#/components/schemas/MarginCorporateActionPaymentHistoryEntry'
          description: Array of corporate action payment entries, newest first
    MarginCorporateActionPaymentHistoryEntry:
      type: object
      required:
        - corporate_action_id
        - type
        - market_ticker
        - payment_time
        - payment_amount
        - quantity
        - subaccount_number
        - subaccount_type
        - withholding_amount
      properties:
        corporate_action_id:
          type: string
          description: >-
            Corporate action id, matching `id` in `GET
            /margin/corporate_actions`.
        type:
          type: string
          enum:
            - cash_dividend
            - special_dividend
            - spin_off
          x-enum-varnames:
            - MarginCorporateActionPaymentHistoryEntryTypeCashDividend
            - MarginCorporateActionPaymentHistoryEntryTypeSpecialDividend
            - MarginCorporateActionPaymentHistoryEntryTypeSpinOff
          description: Corporate action type
        market_ticker:
          type: string
          description: Ticker of the margin market
        payment_time:
          type: string
          format: date-time
          description: >-
            The corporate action's execution time. The payment is computed on
            the position held just before this time; the cash can post to your
            balance after it.
        payment_amount:
          $ref: '#/components/schemas/FixedPointDollars'
          description: >-
            Gross dollar amount before withholding (positive = received,
            negative = paid)
        quantity:
          $ref: '#/components/schemas/FixedPointCount'
          description: >-
            Signed position size the payment was computed on (positive = long,
            negative = short) as a fixed-point count string
        subaccount_number:
          type: integer
          nullable: true
          description: Subaccount number (0 for primary)
        subaccount_type:
          $ref: '#/components/schemas/SubaccountType'
        withholding_amount:
          $ref: '#/components/schemas/FixedPointDollars'
          description: >-
            Amount withheld from the payment in dollars. Subtract this from
            payment_amount for the net cash amount.
    ErrorResponse:
      type: object
      properties:
        code:
          type: string
          description: Error code
        message:
          type: string
          description: Human-readable error message
        details:
          type: string
          description: Additional details about the error, if available
    FixedPointDollars:
      type: string
      description: >-
        Fixed-point US dollar string. Most request fields accept 2-4 decimal
        places (e.g., "0.56", "0.5600"); responses emit up to 6. Valid quote
        intervals for a given market are constrained by that market's price
        level structure.
      example: '0.5600'
    FixedPointCount:
      type: string
      description: >-
        Fixed-point contract count string (2 decimals, e.g., "10.00"; referred
        to as "fp" in field names). Requests accept 0-2 decimal places (e.g.,
        "10", "10.0", "10.00"); responses always emit 2 decimals. A market whose
        `fractional_trading_enabled` is false trades whole contracts only.
        There, an order for a fractional count (e.g., "2.50") is rejected with
        HTTP 400 and error code `invalid_order_size`, and an amend or decrease
        that would leave a fractional count is rejected with HTTP 400 and error
        code `invalid_amend_quantity_for_order`.
      example: '10.00'
    SubaccountType:
      type: string
      enum:
        - cross
        - isolated
        - auto_rebalance
        - managed_isolated
        - swaps
      x-enum-varnames:
        - SubaccountTypeCross
        - SubaccountTypeIsolated
        - SubaccountTypeAutoRebalance
        - SubaccountTypeManagedIsolated
        - SubaccountTypeSwaps
      description: >-
        How the subaccount is margined. `cross` for the primary account and
        numbered subaccounts, `isolated` for a market's isolated subaccount,
        `auto_rebalance` for an auto-rebalanced isolated position, which shares
        its market's isolated subaccount number, `managed_isolated` for a
        managed isolated position, whose subaccount number is the same as the
        market's isolated subaccount number, and `swaps` for a cross-margined
        swaps wallet, whose subaccount number is its swaps code.
  responses:
    BadRequestError:
      description: Bad request - invalid input
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/ErrorResponse'
    UnauthorizedError:
      description: Unauthorized - authentication required
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/ErrorResponse'
    ForbiddenError:
      description: Forbidden - insufficient permissions
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/ErrorResponse'
    InternalServerError:
      description: Internal server error
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/ErrorResponse'
  securitySchemes:
    kalshiAccessKey:
      type: apiKey
      in: header
      name: KALSHI-ACCESS-KEY
      description: Your API key ID
    kalshiAccessSignature:
      type: apiKey
      in: header
      name: KALSHI-ACCESS-SIGNATURE
      description: >-
        Base64 signature of the pre-sign text (timestamp + method + path) made
        with the API key's algorithm - RSA-PSS with SHA-256 for RSA keys,
        Ed25519 for Ed25519 keys
    kalshiAccessTimestamp:
      type: apiKey
      in: header
      name: KALSHI-ACCESS-TIMESTAMP
      description: Request timestamp in milliseconds

````

This documentation is built and hosted on [Mintlify](https://mintlify.com), a developer documentation platform.